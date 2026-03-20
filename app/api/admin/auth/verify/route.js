import { NextResponse } from 'next/server';

export async function GET(req) {
  // For now, return not authenticated
  // We'll implement proper auth later
  return NextResponse.json({ authenticated: false });
}