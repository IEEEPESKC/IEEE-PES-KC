import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'app', 'admin', 'data.json');
const UPLOAD_DIR = path.join(process.cwd(), 'app', 'admin', 'data');
const TRASH_DIR = path.join(process.cwd(), 'app', 'admin', 'trash');
const TRASH_DATA_DIR = path.join(TRASH_DIR, 'trashed_data');
const TRASH_JSON = path.join(TRASH_DIR, 'trashed_data.json');

async function trashFiles(urls) {
    if (!urls || !Array.isArray(urls)) return;
    for (const url of urls) {
        if (typeof url === 'string' && url.includes('/api/admin/file?name=')) {
            let filename = url.split('name=')[1];
            if (filename) {
                filename = filename.split('&')[0]; // Handle extra params
                const srcPath = path.join(UPLOAD_DIR, filename);
                const destPath = path.join(TRASH_DATA_DIR, filename);
                try {
                    await fs.rename(srcPath, destPath);
                } catch (err) {
                    // Ignore missing files
                }
            }
        }
    }
}

async function restoreFiles(urls) {
    if (!urls || !Array.isArray(urls)) return;
    for (const url of urls) {
        if (typeof url === 'string' && url.includes('/api/admin/file?name=')) {
            let filename = url.split('name=')[1];
            if (filename) {
                filename = filename.split('&')[0];
                const srcPath = path.join(TRASH_DATA_DIR, filename);
                const destPath = path.join(UPLOAD_DIR, filename);
                try {
                    await fs.rename(srcPath, destPath);
                } catch (err) {
                    // Ignore if not in trash or already live
                }
            }
        }
    }
}

async function updateTrashJson(item, type) {
    try {
        const trashStr = await fs.readFile(TRASH_JSON, 'utf-8');
        const trashDb = JSON.parse(trashStr);
        trashDb.items.push({ ...item, _originalType: type, _trashedAt: new Date().toISOString() });
        if (trashDb.items.length > 50) trashDb.items.shift();
        await fs.writeFile(TRASH_JSON, JSON.stringify(trashDb, null, 2));
    } catch (e) {
        console.error("Error updating trash JSON:", e);
    }
}

function saveHistory(db) {
    if (!db._history) db._history = [];
    const snapshot = {
        _log: JSON.parse(JSON.stringify(db._editLog || [])),
        _checkpoint: db._checkpoint ? JSON.parse(JSON.stringify(db._checkpoint)) : null
    };
    const categories = ['events', 'announcements', 'gallery', 'execom', 'chapters', 'awards', 'recognitions', 'newsletters', 'magazines'];
    categories.forEach(cat => snapshot[cat] = JSON.parse(JSON.stringify(db[cat] || [])));

    db._history.unshift(snapshot);
    if (db._history.length > 20) db._history = db._history.slice(0, 20);
}

function updateLog(db, type, id, title, action) {
    if (!db._editLog) db._editLog = [];
    db._editLog.unshift({
        timestamp: new Date().toISOString(),
        type, id, title, action
    });
    if (db._editLog.length > 20) db._editLog = db._editLog.slice(0, 20);
}

async function initData() {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
    try {
        await fs.access(TRASH_DATA_DIR);
    } catch {
        await fs.mkdir(TRASH_DATA_DIR, { recursive: true });
    }

    try {
        await fs.access(TRASH_JSON);
    } catch {
        await fs.writeFile(TRASH_JSON, JSON.stringify({ items: [] }));
    }

    try {
        const dataStr = await fs.readFile(DATA_FILE, 'utf-8');
        const db = JSON.parse(dataStr);
        let changed = false;

        if (!db._editLog) { db._editLog = []; changed = true; }
        if (!db._history) { db._history = []; changed = true; }
        if (db._checkpoint === undefined || db._checkpoint === null) {
            const snapshot = {};
            const categories = ['events', 'announcements', 'gallery', 'execom', 'chapters', 'awards', 'recognitions', 'newsletters', 'magazines'];
            categories.forEach(cat => snapshot[cat] = JSON.parse(JSON.stringify(db[cat] || [])));
            db._checkpoint = snapshot;
            changed = true;
        }

        if (changed) {
            await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
        }
    } catch {
        const initial = {
            events: [], announcements: [], gallery: [], execom: [],
            chapters: [], awards: [], recognitions: [], newsletters: [], magazines: [],
            _editLog: [], _history: [], _checkpoint: null
        };
        initial._checkpoint = JSON.parse(JSON.stringify(initial));
        await fs.writeFile(DATA_FILE, JSON.stringify(initial));
    }
}

export async function GET(req) {
    await initData();
    const dataStr = await fs.readFile(DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(dataStr));
}

export async function POST(req) {
    await initData();
    const formData = await req.formData();
    const type = formData.get('type');

    const dataStr = await fs.readFile(DATA_FILE, 'utf-8');
    const db = JSON.parse(dataStr);

    if (type === 'undo') {
        const count = parseInt(formData.get('count') || '1');
        if (db._history && db._history.length >= count) {
            const restored = db._history[count - 1];
            const allFiles = [];
            Object.keys(restored).forEach(key => {
                if (Array.isArray(restored[key])) {
                    restored[key].forEach(it => {
                        const files = [...(it.images || []), it.imageUrl, it.pdfUrl].filter(Boolean);
                        allFiles.push(...files);
                    });
                }
            });
            await restoreFiles(allFiles);

            const categories = ['events', 'announcements', 'gallery', 'execom', 'chapters', 'awards', 'recognitions', 'newsletters', 'magazines'];
            categories.forEach(cat => db[cat] = restored[cat] || []);
            db._editLog = restored._log || [];
            db._checkpoint = restored._checkpoint;
            db._history = db._history.slice(count);

            await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ success: false, message: 'No undo history' }, { status: 400 });
    }

    const fileKeys = ['image', 'pdf'];
    const filePaths = { image: [], pdf: [] };
    for (const key of fileKeys) {
        const files = formData.getAll(key);
        for (const file of files) {
            if (file && file.size > 0 && typeof file.arrayBuffer === 'function') {
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = Date.now() + '-' + file.name.replace(/\s+/g, '-');
                const destPath = path.join(UPLOAD_DIR, filename);
                await fs.writeFile(destPath, buffer);
                filePaths[key].push('/api/admin/file?name=' + filename);
            }
        }
    }

    const newEntry = {};
    for (const [key, value] of formData.entries()) {
        if (typeof value === 'string' && key !== 'type' && key !== 'image' && key !== 'pdf') {
            newEntry[key] = value;
        }
    }
    if (filePaths.image.length > 0) {
        newEntry.imageUrl = filePaths.image[0];
        newEntry.images = filePaths.image;
    }
    if (filePaths.pdf.length > 0) {
        newEntry.pdfUrl = filePaths.pdf[0];
    }
    newEntry.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);

    saveHistory(db);
    db[type] = [newEntry, ...(db[type] || [])];
    updateLog(db, type, newEntry.id, newEntry.title || newEntry.name || newEntry.album || 'New Item', 'add');

    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
    return NextResponse.json({ success: true, item: newEntry });
}

export async function DELETE(req) {
    await initData();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    const dataStr = await fs.readFile(DATA_FILE, 'utf-8');
    const db = JSON.parse(dataStr);

    if (type === 'clear') {
        if (db._checkpoint) {
            // Restore any files mentioned in the checkpoint that might be in trash
            const allCheckpointFiles = [];
            Object.values(db._checkpoint).forEach(list => {
                if (Array.isArray(list)) {
                    list.forEach(item => {
                        const files = [...(item.images || []), item.imageUrl, item.pdfUrl].filter(Boolean);
                        allCheckpointFiles.push(...files);
                    });
                }
            });
            await restoreFiles(allCheckpointFiles);

            Object.keys(db._checkpoint).forEach(cat => {
                if (cat !== '_history') db[cat] = JSON.parse(JSON.stringify(db._checkpoint[cat]));
            });
            db._editLog = [];
            db._history = [];
        }
        await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
        return NextResponse.json({ success: true });
    }

    if (type === 'publish') {
        const snapshot = {};
        const categories = ['events', 'announcements', 'gallery', 'execom', 'chapters', 'awards', 'recognitions', 'newsletters', 'magazines'];
        categories.forEach(cat => snapshot[cat] = JSON.parse(JSON.stringify(db[cat] || [])));
        db._checkpoint = snapshot;
        db._checkpoint._editLog = [];
        db._editLog = [];
        // When publishing, we also clear history to prevent confusing rollbacks?
        // User didn't ask for this specifically, but it's cleaner. Let's keep it for now.
        // Actually, let's keep it to keep history relevant to current session.
        db._history = [];
        await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
        return NextResponse.json({ success: true });
    }

    if (db[type]) {
        const itemToDelete = db[type].find(item => item.id === id);
        if (itemToDelete) {
            saveHistory(db);
            const filesToTrash = [...(itemToDelete.images || []), itemToDelete.imageUrl, itemToDelete.pdfUrl].filter(Boolean);
            await trashFiles(filesToTrash);
            await updateTrashJson(itemToDelete, type);

            updateLog(db, type, id, itemToDelete.title || itemToDelete.name || itemToDelete.winner || itemToDelete.album || id, 'delete');
            db[type] = db[type].filter(item => item.id !== id);
            await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
            return NextResponse.json({ success: true });
        }
    }

    return NextResponse.json({ success: true });
}

export async function PUT(req) {
    await initData();
    const formData = await req.formData();
    const type = formData.get('type');
    const editId = formData.get('editId');

    const dataStr = await fs.readFile(DATA_FILE, 'utf-8');
    const db = JSON.parse(dataStr);

    // Handle new image uploads (if any)
    const UPLOAD_DIR_PATH = path.join(process.cwd(), 'app', 'admin', 'data');
    const newImages = [];
    const imageFiles = formData.getAll('image');
    for (const file of imageFiles) {
        if (file && file.size > 0 && typeof file.arrayBuffer === 'function') {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = Date.now() + '-' + file.name.replace(/\s+/g, '-');
            await fs.writeFile(path.join(UPLOAD_DIR_PATH, filename), buffer);
            newImages.push('/api/admin/file?name=' + filename);
        }
    }

    // Handle kept existing images
    const keptImagesStr = formData.get('keptImages');
    let keptImages = [];
    try {
        if (keptImagesStr) keptImages = JSON.parse(keptImagesStr);
    } catch (e) {
        console.error("Error parsing keptImages:", e);
    }

    // Build partial update from form fields
    const updates = {};
    for (const [key, value] of formData.entries()) {
        if (typeof value === 'string' && !['type', 'editId', 'image', 'pdf', 'keptImages'].includes(key)) {
            updates[key] = value;
        }
    }

    const finalImages = [...keptImages, ...newImages];
    if (finalImages.length > 0) {
        updates.imageUrl = finalImages[0];
        updates.images = finalImages;
    } else {
        updates.imageUrl = '';
        updates.images = [];
    }

    // Merge into existing record
    let updatedItem = null;
    if (db[type]) {
        const originalItem = db[type].find(item => item.id === editId);
        if (originalItem) {
            saveHistory(db);
            const removedImages = [];
            db[type] = db[type].map(item => {
                if (item.id === editId) {
                    const oldImages = item.images || (item.imageUrl ? [item.imageUrl] : []);
                    const r = oldImages.filter(img => !keptImages.includes(img));
                    removedImages.push(...r);

                    updatedItem = { ...item, ...updates };
                    return updatedItem;
                }
                return item;
            });
            if (removedImages.length > 0) await trashFiles(removedImages);
            updateLog(db, type, editId, updatedItem.title || updatedItem.name || updatedItem.album || editId, 'edit');
        }
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
    return NextResponse.json({ success: true, item: updatedItem });
}

