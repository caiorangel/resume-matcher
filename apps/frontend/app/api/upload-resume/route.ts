import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Store basic file info (in real app would parse the PDF/DOCX)
    const resumeId = `resume_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // TODO: Here we would actually parse the PDF/DOCX file
    // For now, just acknowledge the upload
    console.log(`File uploaded: ${file.name}, Size: ${file.size} bytes`);
    
    return NextResponse.json({
      resume_id: resumeId,
      filename: file.name,
      size: file.size,
      status: 'uploaded',
      message: 'Resume uploaded and ready for analysis'
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
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