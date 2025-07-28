'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useResumePreview } from '@/components/common/resume_previewer_context';
import { useLanguage } from '@/components/common/language_context';
import BackgroundContainer from '@/components/common/background-container';
import ResumeAnalysis from '@/components/dashboard/resume-analysis';
import Resume from '@/components/dashboard/resume-component';
import { downloadResumePDF } from '@/lib/api/pdf';
import { Button } from '@/components/ui/button';

// Helper function to convert backend data to frontend format
const convertToResumeFormat = (backendData: any) => {
  if (!backendData) return null;
  
  console.log('Converting backend data:', backendData);
  
  // The backend is now returning already formatted data, so we use it directly
  const personalInfo = backendData.personalInfo || {};
  const experience = backendData.experience || [];
  const education = backendData.education || [];
  const skills = backendData.skills || [];
  
  return {
    personalInfo: {
      name: personalInfo.name || 'N/A',
      title: personalInfo.title || (experience.length > 0 ? experience[0].title : 'Professional'),
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      location: personalInfo.location || '',
      linkedin: personalInfo.linkedin || '',
      github: personalInfo.github || '',
      website: personalInfo.website || ''
    },
    summary: backendData.summary || 'Professional with extensive experience in their field.',
    experience: experience.map((exp: any, index: number) => ({
      id: index + 1, // Force unique IDs using array index
      title: exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      years: exp.years || '',
      description: exp.description || []
    })),
    education: education.map((edu: any, index: number) => ({
      id: index + 1, // Force unique IDs using array index
      institution: edu.institution || '',
      degree: edu.degree || '',
      years: edu.years || '',
      description: edu.description || ''
    })),
    skills: Array.isArray(skills) ? skills.filter(Boolean) : []
  };
};

export default function ResultsPage() {
  const router = useRouter();
  const { improvedData } = useResumePreview();
  const { t, language } = useLanguage();
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Redirect to home if there's no data
  useEffect(() => {
    if (!improvedData) {
      router.push('/');
    }
  }, [improvedData, router]);

  // If there's no data, show a loading state while redirecting
  if (!improvedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/90 to-purple-900/90 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const { data } = improvedData;
  const { resume_preview, new_score, original_score } = data;
  
  // Convert backend data to frontend format
  const convertedPreview = convertToResumeFormat(resume_preview);
  
  // If no converted data, show message
  if (!convertedPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/90 to-purple-900/90 flex items-center justify-center">
        <div className="text-white text-xl">No resume data available</div>
      </div>
    );
  }
  
  // Convert scores to percentages (assuming they come as decimals like 0.75)
  const newPct = Math.round((new_score || 0) * 100);
  const originalPct = Math.round((original_score || 0) * 100);

  const handleDownloadPDF = async () => {
    if (!improvedData) return;
    
    setIsDownloadingPDF(true);
    setPdfError(null);
    
    try {
      await downloadResumePDF(
        improvedData.data.resume_id,
        improvedData.data.job_id,
        language
      );
    } catch (error) {
      console.error('PDF download error:', error);
      setPdfError('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  return (
    <BackgroundContainer className="min-h-screen" innerClassName="bg-zinc-950 backdrop-blur-sm overflow-auto">
      <div className="w-full h-full overflow-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Resume Analysis
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text ml-2">
                Results
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Here's how your resume has been optimized for the job
            </p>
          </div>

          {/* Grid: left = analysis, right = resume */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Analysis */}
            <div className="space-y-8">
              <section>
                <ResumeAnalysis
                  score={newPct}
                  originalScore={originalPct}
                  details={data.details ?? 'Your resume has been analyzed and optimized.'}
                  commentary={data.commentary ?? 'Resume analysis completed successfully.'}
                  improvements={data.improvements ?? []}
                />
              </section>
            </div>

            {/* Right column - Resume Preview */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-lg shadow-xl h-full flex flex-col border border-gray-800/50">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Your Optimized Resume</h2>
                      <p className="text-gray-400 text-sm">
                        Review your improved resume below
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleDownloadPDF}
                        disabled={isDownloadingPDF}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        {isDownloadingPDF ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="text-gray-300 border-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                      >
                        Back to Home
                      </Button>
                    </div>
                  </div>
                  {pdfError && (
                    <div className="text-red-400 text-sm mt-2">
                      {pdfError}
                    </div>
                  )}
                </div>
                <div className="flex-grow overflow-auto">
                  <Resume resumeData={convertedPreview} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundContainer>
  );
}