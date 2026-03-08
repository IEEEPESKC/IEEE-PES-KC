import { NextResponse } from 'next/server';
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
