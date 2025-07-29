import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume_id, job_id, language = 'en' } = body;
    
    // Mock improved resume data
    const mockImprovedData = {
      data: {
        resume_id,
        job_id,
        original_score: 0.65,
        new_score: 0.85,
        details: 'Your resume has been optimized with better keyword alignment and improved structure.',
        commentary: 'Score improved from 65% to 85% through strategic keyword optimization and content enhancement.',
        improvements: [
          '✅ Added industry-specific keywords',
          '✅ Improved action verbs and quantified achievements',
          '✅ Enhanced professional summary',
          '✅ Optimized skills section alignment'
        ],
        resume_preview: {
          personalInfo: {
            name: 'Professional Candidate',
            title: 'Senior Professional',
            email: 'professional@example.com',
            phone: '+1 (555) 123-4567',
            location: 'City, State',
            linkedin: 'linkedin.com/in/professional',
            github: '',
            website: ''
          },
          summary: 'Experienced professional with demonstrated expertise in delivering high-impact results through strategic leadership and innovative problem-solving. Proven track record of driving organizational growth and operational excellence.',
          experience: [
            {
              id: 1,
              title: 'Senior Professional',
              company: 'Leading Company',
              location: 'City, State',
              years: '2022 - Present',
              description: [
                'Led cross-functional teams to deliver strategic initiatives resulting in 25% efficiency improvement',
                'Implemented innovative solutions that reduced operational costs by $500K annually',
                'Collaborated with stakeholders to develop and execute comprehensive business strategies'
              ]
            },
            {
              id: 2,
              title: 'Professional Specialist',
              company: 'Previous Company',
              location: 'City, State', 
              years: '2020 - 2022',
              description: [
                'Managed key projects with budgets exceeding $1M and delivered 100% on-time completion',
                'Developed and maintained relationships with key clients, achieving 95% retention rate',
                'Analyzed market trends and competitive landscape to inform strategic decisions'
              ]
            }
          ],
          education: [
            {
              id: 1,
              institution: 'University Name',
              degree: 'Bachelor of Science',
              years: '2016 - 2020',
              description: 'Relevant coursework and achievements'
            }
          ],
          skills: [
            'Strategic Planning',
            'Project Management',
            'Data Analysis',
            'Leadership',
            'Problem Solving',
            'Communication',
            'Team Collaboration'
          ]
        }
      }
    };
    
    return NextResponse.json(mockImprovedData);
  } catch (error) {
    console.error('Error improving resume:', error);
    return NextResponse.json(
      { error: 'Failed to improve resume' },
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