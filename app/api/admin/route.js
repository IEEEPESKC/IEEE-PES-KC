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
  }
}

export async function GET() {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(data);
    
    console.log('API GET - Data loaded successfully');
    
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

export async function POST(req) {
  try {
    await ensureDataFile();
    const formData = await req.formData();
    const type = formData.get('type');
    
    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }
    
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const db = JSON.parse(data);
    
    const newItem = {
      id: Date.now().toString(),
      ...Object.fromEntries(formData.entries())
    };
    
    delete newItem.type;
    
    if (!db[type]) db[type] = [];
    db[type].unshift(newItem);
    
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
    
    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
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
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}