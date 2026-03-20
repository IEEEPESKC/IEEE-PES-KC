import { NextResponse } from 'next/server';

// Simple authentication function
async function authenticate(email, password) {
  // For testing - replace with your actual admin credentials
  const adminEmail = process.env.ADMIN_EMAILS?.split(',')[0] || 'admin@ieee.org';
  const adminPassword = process.env.ADMIN_PASSWORDS?.split(',')[0] || 'admin123';
  
  if (email === adminEmail && password === adminPassword) {
    return { success: true, token: 'admin-token' };
  }
  
  return { success: false, error: 'Invalid credentials' };
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    const result = await authenticate(email, password);
    
    if (result.success) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
        sameSite: 'lax',
      });
      return response;
    }
    
    return NextResponse.json(
      { error: result.error || 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}