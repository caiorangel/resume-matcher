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
      const { job_descriptions, resume_id } = req.body;
      
      // For now, return a mock response
      const mockJobId = `job_${Date.now()}`;
      
      res.status(200).json({
        job_id: [mockJobId],
        resume_id,
        status: 'uploaded',
        message: 'Job descriptions uploaded successfully (mock)'
      });
    } catch (error) {
      console.error('Error uploading job descriptions:', error);
      res.status(500).json({ error: 'Failed to upload job descriptions' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}