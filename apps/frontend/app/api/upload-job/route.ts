import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { job_descriptions, resume_id } = body;
    
    // For now, return a mock response
    const mockJobId = `job_${Date.now()}`;
    
    return NextResponse.json({
      job_id: [mockJobId],
      resume_id,
      status: 'uploaded',
      message: 'Job descriptions uploaded successfully (mock)'
    });
  } catch (error) {
    console.error('Error uploading job descriptions:', error);
    return NextResponse.json(
      { error: 'Failed to upload job descriptions' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}