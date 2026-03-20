import { NextResponse } from 'next/server';

export async function GET(request) {
  // Get token from cookies
  const token = request.cookies.get('admin_token')?.value;
  
  // Simple check - in production, verify token properly
  if (token === 'test-token' || token === 'admin-token') {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false });
}