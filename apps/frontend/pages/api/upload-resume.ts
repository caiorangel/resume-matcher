import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // For now, return a mock response until we set up proper backend
      const mockResumeId = `resume_${Date.now()}`;
      
      res.status(200).json({
        resume_id: mockResumeId,
        status: 'uploaded',
        message: 'Resume uploaded successfully (mock)'
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      res.status(500).json({ error: 'Failed to upload resume' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}