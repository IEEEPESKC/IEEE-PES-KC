import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';

export async function POST(req) {
  const token = req.cookies.get('admin_token')?.value;
  
  if (token) {
    await logout(token);
  }
  
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}