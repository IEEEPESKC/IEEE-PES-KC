import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    console.log('Login attempt for:', email);
    
    // Simple hardcoded credentials for testing
    if (email === 'admin@ieee.org' && password === 'admin123') {
      const response = NextResponse.json({ 
        success: true,
        message: 'Login successful'
      });
      
      response.cookies.set('admin_token', 'admin-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60,
        path: '/',
        sameSite: 'lax',
      });
      
      console.log('Login successful for:', email);
      return response;
    }
    
    console.log('Login failed for:', email);
    return NextResponse.json(
      { error: 'Invalid credentials' },
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