import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();
  
  // Simple check for testing
  if (email === 'admin@ieee.org' && password === 'admin123') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', 'test-token', {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      path: '/',
    });
    return response;
  }
  
  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}