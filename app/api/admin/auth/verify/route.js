import { NextResponse } from 'next/server';

export async function GET() {
  // Simple cookie check for now
  return NextResponse.json({ authenticated: false });
}