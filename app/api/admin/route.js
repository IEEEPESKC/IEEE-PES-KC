import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

// Ensure data file exists
async function ensureDataFile() {
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
      magazines: []
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('Created data file');
  }
}

// GET: Fetch all content
export async function GET() {
  try {
    console.log('API GET called');
    await ensureDataFile();
    
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(data);
    
    console.log('Data loaded successfully');
    
    return NextResponse.json({
      success: true,
      data: parsedData
    });
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      data: {
        events: [],
        announcements: [],
        gallery: [],
        execom: [],
        chapters: [],
        awards: [],
        recognitions: [],
        newsletters: [],
        magazines: []
      }
    });
  }
}

// POST: Create new item
export async function POST(req) {
  try {
    console.log('API POST called');
    await ensureDataFile();
    
    const formData = await req.formData();
    const type = formData.get('type');
    
    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }
    
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const db = JSON.parse(data);
    
    // Create new item
    const newItem = {
      id: Date.now().toString(),
    };
    
    // Add all form fields
    for (const [key, value] of formData.entries()) {
      if (key !== 'type' && key !== 'editId') {
        newItem[key] = value;
      }
    }
    
    // Handle image upload temporarily (store in public/uploads)
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const filename = `${Date.now()}-${imageFile.name}`;
      const filepath = path.join(uploadsDir, filename);
      await fs.writeFile(filepath, buffer);
      newItem.imageUrl = `/uploads/${filename}`;
      console.log('Image saved:', filepath);
    }
    
    // Add to database
    if (!db[type]) db[type] = [];
    db[type].unshift(newItem);
    
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
    console.log('Item added to', type);
    
    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove item
export async function DELETE(req) {
  try {
    console.log('API DELETE called');
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (!type || !id) {
      return NextResponse.json({ error: 'Type and ID required' }, { status: 400 });
    }
    
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const db = JSON.parse(data);
    
    if (db[type]) {
      db[type] = db[type].filter(item => item.id !== id);
      await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
      console.log('Item deleted from', type);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}