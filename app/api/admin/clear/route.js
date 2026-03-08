import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'app', 'admin', 'data.json');

export async function POST() {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify({
            events: [], announcements: [], gallery: [], execom: [],
            chapters: [], awards: [], recognitions: [], newsletters: [], magazines: []
        }, null, 2));
        return NextResponse.json({ success: true, message: 'Data cleared' });
    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
