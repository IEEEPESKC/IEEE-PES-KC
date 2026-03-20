import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

// Helper to read data
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return {
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
  }
}

// Helper to write data
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET: Fetch all content
export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new item
export async function POST(req) {
  try {
    const formData = await req.formData();
    const type = formData.get('type');
    const editId = formData.get('editId');
    
    if (!type) {
      return NextResponse.json(
        { error: 'Missing type parameter' },
        { status: 400 }
      );
    }
    
    const db = await readData();
    
    // Build the new item
    const newItem = {
      id: editId || `${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
    };
    
    // Add all form fields
    for (const [key, value] of formData.entries()) {
      if (key !== 'type' && key !== 'editId') {
        newItem[key] = value;
      }
    }
    
    // Handle image if uploaded
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0 && typeof imageFile.arrayBuffer === 'function') {
      // For now, store a placeholder URL
      // In production, you'll upload to R2 here
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const filename = `${Date.now()}-${imageFile.name}`;
      const filepath = path.join(uploadsDir, filename);
      await fs.writeFile(filepath, buffer);
      newItem.imageUrl = `/uploads/${filename}`;
    }
    
    // Update database
    if (editId) {
      const index = db[type].findIndex(item => item.id === editId);
      if (index !== -1) {
        db[type][index] = { ...db[type][index], ...newItem };
      }
    } else {
      db[type] = [newItem, ...(db[type] || [])];
    }
    
    await writeData(db);
    
    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove item
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (!type || !id) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      );
    }
    
    const db = await readData();
    
    if (db[type]) {
      db[type] = db[type].filter(item => item.id !== id);
      await writeData(db);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}