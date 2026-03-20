import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { uploadToR2, deleteFromR2, getFolderForType } from '@/lib/r2';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

// Initialize data file
async function initData() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData = {
      events: [],
      announcements: [],
      gallery: [],
      execom: [],
      chapters: [],
      awards: [],
      recognitions: [],
      newsletters: [],
      magazines: [],
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// GET: Fetch all content
export async function GET() {
  await initData();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return NextResponse.json({
    success: true,
    data: JSON.parse(data),
  });
}

// POST: Create new item
export async function POST(req) {
  await initData();
  
  const formData = await req.formData();
  const type = formData.get('type');
  const editId = formData.get('editId');
  
  // Read existing data
  const dataStr = await fs.readFile(DATA_FILE, 'utf-8');
  const db = JSON.parse(dataStr);
  
  // Handle file uploads
  const imageFile = formData.get('image');
  const pdfFile = formData.get('pdf');
  
  let imageUrl = null;
  let pdfUrl = null;
  let imageKey = null;
  let pdfKey = null;
  
  // Upload image if present
  if (imageFile && imageFile.size > 0) {
    const folder = getFolderForType(type, 'image');
    const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
    const uploadResult = await uploadToR2(imageFile, folder, fileName);
    
    if (uploadResult.success) {
      imageUrl = uploadResult.url;
      imageKey = uploadResult.key;
    }
  }
  
  // Upload PDF if present
  if (pdfFile && pdfFile.size > 0) {
    const folder = getFolderForType(type, 'pdf');
    const fileName = `${Date.now()}-${pdfFile.name.replace(/\s/g, '-')}`;
    const uploadResult = await uploadToR2(pdfFile, folder, fileName);
    
    if (uploadResult.success) {
      pdfUrl = uploadResult.url;
      pdfKey = uploadResult.key;
    }
  }
  
  // Build the new item
  const newItem = {
    id: editId || `${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
    ...Object.fromEntries(formData.entries()),
  };
  
  // Remove file fields from the item data
  delete newItem.type;
  delete newItem.image;
  delete newItem.pdf;
  delete newItem.editId;
  
  // Add URLs
  if (imageUrl) newItem.imageUrl = imageUrl;
  if (pdfUrl) newItem.pdfUrl = pdfUrl;
  
  // Store keys for later deletion
  if (imageKey) newItem.imageKey = imageKey;
  if (pdfKey) newItem.pdfKey = pdfKey;
  
  // Handle kept images for edits
  const keptImages = formData.get('keptImages');
  if (keptImages && editId) {
    try {
      const kept = JSON.parse(keptImages);
      newItem.images = kept;
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  // Update the database
  if (editId) {
    // Find and replace the item
    const index = db[type].findIndex(item => item.id === editId);
    if (index !== -1) {
      // Keep the original image/pdfs if not replaced
      if (!imageUrl && db[type][index].imageUrl) {
        newItem.imageUrl = db[type][index].imageUrl;
        newItem.imageKey = db[type][index].imageKey;
      }
      if (!pdfUrl && db[type][index].pdfUrl) {
        newItem.pdfUrl = db[type][index].pdfUrl;
        newItem.pdfKey = db[type][index].pdfKey;
      }
      db[type][index] = newItem;
    }
  } else {
    db[type] = [newItem, ...(db[type] || [])];
  }
  
  // Save to file
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
  
  return NextResponse.json({ success: true, item: newItem });
}

// PUT: Update existing item
export async function PUT(req) {
  return POST(req); // Same logic as POST with editId
}

// DELETE: Remove item
export async function DELETE(req) {
  await initData();
  
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  
  if (!type || !id) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  
  const dataStr = await fs.readFile(DATA_FILE, 'utf-8');
  const db = JSON.parse(dataStr);
  
  if (db[type]) {
    const itemToDelete = db[type].find(item => item.id === id);
    
    // Delete associated files from R2
    if (itemToDelete) {
      if (itemToDelete.imageKey) {
        await deleteFromR2(itemToDelete.imageKey);
      }
      if (itemToDelete.pdfKey) {
        await deleteFromR2(itemToDelete.pdfKey);
      }
      // Handle multiple images
      if (itemToDelete.images && Array.isArray(itemToDelete.images)) {
        for (const img of itemToDelete.images) {
          if (img.startsWith(process.env.R2_PUBLIC_URL)) {
            const key = img.replace(`${process.env.R2_PUBLIC_URL}/`, '');
            await deleteFromR2(key);
          }
        }
      }
    }
    
    db[type] = db[type].filter(item => item.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
  }
  
  return NextResponse.json({ success: true });
}