import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function GET(req) {
  const token = req.cookies.get('admin_token')?.value;
  
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }
  
  const isValid = await verifySession(token);
  return NextResponse.json({ authenticated: isValid });
}