const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'app', 'api', 'admin');
const fileDir = path.join(process.cwd(), 'app', 'api', 'admin', 'file');

fs.mkdirSync(fileDir, { recursive: true });

// 1. Create app/api/admin/route.js
const routeJsContent = `import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'app', 'admin', 'data.json');
const UPLOAD_DIR = path.join(process.cwd(), 'app', 'admin', 'data');

async function initData() {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify({
            events: [], announcements: [], gallery: [], execom: [],
            chapters: [], awards: [], recognitions: [], newsletters: [], magazines: []
        }));
    }
}

export async function GET() {
    await initData();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
}

export async function POST(req) {
    await initData();
    const formData = await req.formData();
    const type = formData.get('type');
    
    const dataStr = await fs.readFile(DATA_FILE, 'utf-8');
    const db = JSON.parse(dataStr);
    
    const fileKeys = ['image', 'pdf'];
    const filePaths = {};
    for (const key of fileKeys) {
        const file = formData.get(key);
        if (file && file.size > 0 && typeof file.arrayBuffer === 'function') {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = Date.now() + '-' + file.name.replace(/\\s+/g, '-');
            const destPath = path.join(UPLOAD_DIR, filename);
            await fs.writeFile(destPath, buffer);
            filePaths[key] = '/api/admin/file?name=' + filename;
        }
    }
    
    const newEntry = {};
    for (const [key, value] of formData.entries()) {
        if (typeof value === 'string' && key !== 'type' && key !== 'image' && key !== 'pdf') {
            newEntry[key] = value;
        }
    }
    
    if (filePaths.image) newEntry.imageUrl = filePaths.image;
    if (filePaths.pdf) newEntry.pdfUrl = filePaths.pdf;
    
    // Type-specific field mapping matching frontend UI logic mostly built on client instead
    
    newEntry.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);

    db[type] = [newEntry, ...(db[type] || [])];
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
    
    if (db[type]) {
        db[type] = db[type].filter(item => item.id !== id);
        await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
    }
    
    return NextResponse.json({ success: true });
}
`;
fs.writeFileSync(path.join(apiDir, 'route.js'), routeJsContent);

// 2. Create app/api/admin/file/route.js
const fileRouteJsContent = `import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    if (!name) return new NextResponse('Not found', { status: 404 });
    
    const filePath = path.join(process.cwd(), 'app', 'admin', 'data', name);
    try {
        const fileBuffer = await fs.readFile(filePath);
        let contentType = 'application/octet-stream';
        if (name.endsWith('.png')) contentType = 'image/png';
        if (name.endsWith('.jpg') || name.endsWith('.jpeg')) contentType = 'image/jpeg';
        if (name.endsWith('.pdf')) contentType = 'application/pdf';
        
        return new NextResponse(fileBuffer, {
            headers: { 'Content-Type': contentType },
        });
    } catch {
        return new NextResponse('Not found', { status: 404 });
    }
}
`;
fs.writeFileSync(path.join(fileDir, 'route.js'), fileRouteJsContent);

// 3. Setup patching configuration for frontend files

const pages = [
    { name: 'events', var: 'events' },
    { name: 'announcements', var: 'items' },
    { name: 'gallery', var: 'images' },
    { name: 'execom', var: 'members' },
    { name: 'chapters', var: 'chapters' },
    { name: 'awards', var: 'awards' },
    { name: 'recognitions', var: 'recognitions' },
    { name: 'newsletters', var: 'lists' },
    { name: 'magazines', var: 'lists' }
];

for (const p of pages) {
    const filePath = path.join(process.cwd(), 'app', 'admin', p.name, 'page.js');
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    // Add useEffect to imports if missing
    if (content.includes("import { useState }")) {
        content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
    }

    // Capitalize setter variable correctly
    const capVarResult = 'set' + p.var.charAt(0).toUpperCase() + p.var.slice(1);

    // Strip out the useState([ {...mockdata...} ]) entirely using a simplistic regex
    // Since the previous file has multiline useState block, replace everything up to empty return
    const stateRegex = new RegExp(`const \\\[${p.var}, ${capVarResult}\\\] = useState\\\(\[\\s\\S]*?\\\);`, 'g');

    // But since there's other logic below it, it's safer to just replace from "const [var, setVar]" to ");" inside the top of the component function
    // Actually, looking at the previous output, it's `const [var, setVar] = useState([\n    {...}\n  ]);`

    let replacement = `const [${p.var}, ${capVarResult}] = useState([]);

  useEffect(() => {
    fetch('/api/admin')
        .then(res => res.json())
        .then(data => {
            if (data.${p.name}) {
                ${capVarResult}(data.${p.name});
            }
        })
        .catch(err => console.error(err));
  }, []);`;
    content = content.replace(stateRegex, replacement);

    // Completely replace handleSubmit logic
    const submitRegex = /const handleSubmit = \(e\) => {[\s\S]*?e\.target\.reset\(\);\n\s*};/;
    const newSubmit = `const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('type', '${p.name}');

    try {
        const res = await fetch('/api/admin', {
            method: 'POST',
            body: formData
        });
        if (res.ok) {
            const { item } = await res.json();
            ${capVarResult}([item, ...${p.var}]);
            setIsModalOpen(false);
            e.target.reset();
        }
    } catch (error) {
        console.error("Error submitting:", error);
    }
  };`;
    content = content.replace(submitRegex, newSubmit);

    // Completely replace handleDelete logic
    const deleteRegex = /const handleDelete = \(index\) => {[\s\S]*?};/;
    const newDelete = `const handleDelete = async (index, id) => {
    if (id) {
        await fetch(\`/api/admin?type=${p.name}&id=\${id}\`, { method: 'DELETE' });
    }
    ${capVarResult}(${p.var}.filter((_, i) => i !== index));
  };`;
    content = content.replace(deleteRegex, newDelete);

    // Inside the render method: adjust handleDelete(index) to handleDelete(index, ITEM.id)
    // Map function usually looks like: {events.map((event, index) => (
    const mapRegex = new RegExp(`{${p.var}\\.map\\(\\((.*?)\\s*,\\s*index\\)\\s*=>`, 'g');
    const iterMatch = mapRegex.exec(content);
    if (iterMatch && iterMatch[1]) {
        const itemName = iterMatch[1];
        content = content.replace(/ \(\) => handleDelete\(index\)/g, ` () => handleDelete(index, ${itemName}.id)`);
    }

    fs.writeFileSync(filePath, content);
}
console.log('Scripts patched explicitly!');
