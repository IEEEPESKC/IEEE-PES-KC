import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();
  
  const result = await login(email, password);
  
  if (result.success) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });
    return response;
  }
  
  return NextResponse.json({ error: result.error }, { status: 401 });
}