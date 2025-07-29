import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API is working!', method: 'GET' });
}

export async function POST() {
  return NextResponse.json({ message: 'API is working!', method: 'POST' });
}