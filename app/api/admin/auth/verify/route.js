import { NextResponse } from 'next/server';

export async function GET(request) {
  // Get token from cookies
  const token = request.cookies.get('admin_token')?.value;
  
  console.log('Verify auth - token:', token ? 'present' : 'missing');
  
  // Simple check
  if (token === 'admin-token' || token === 'test-token') {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false });
}