import { NextResponse } from 'next/server';

// Admin users (store in environment variables)
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
const ADMIN_PASSWORDS = process.env.ADMIN_PASSWORDS?.split(',') || [];

// Simple session store (use Redis/DB in production)
const sessions = new Map();

// Generate session token
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Login function
export async function login(email, password) {
  // Check if email and password match
  const adminIndex = ADMIN_EMAILS.findIndex(e => e === email);
  if (adminIndex === -1 || ADMIN_PASSWORDS[adminIndex] !== password) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  const token = generateToken();
  sessions.set(token, {
    email,
    loginTime: Date.now(),
    ip: 'unknown', // You can store IP in production
  });
  
  return { success: true, token };
}

// Verify session
export async function verifySession(token) {
  const session = sessions.get(token);
  if (!session) return false;
  
  // Session expires after 24 hours
  if (Date.now() - session.loginTime > 24 * 60 * 60 * 1000) {
    sessions.delete(token);
    return false;
  }
  
  return true;
}

// Logout
export async function logout(token) {
  sessions.delete(token);
  return { success: true };
}

// Middleware to protect admin routes
export async function requireAuth(request) {
  const token = request.cookies.get('admin_token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  const isValid = await verifySession(token);
  if (!isValid) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin_token');
    return response;
  }
  
  return null; // Continue
}