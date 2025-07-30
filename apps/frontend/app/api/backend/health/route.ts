import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Resume Matcher Backend',
    version: '1.0.0'
  });
}