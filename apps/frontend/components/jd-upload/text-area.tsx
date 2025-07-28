'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextAreaProps {
  onAnalyze: (jobDescription: string, resumeId: string) => void;
  isAnalyzing: boolean;
}

export default function TextAreaComponent({ onAnalyze, isAnalyzing }: TextAreaProps) {
  const [jobDescription, setJobDescription] = useState('');
  const searchParams = useSearchParams();
  const resumeId = searchParams?.get('resume_id') || '';

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;

    }
    if (!resumeId) {
      alert('Resume ID not found. Please upload your resume first.');

return;
    }
    onAnalyze(jobDescription, resumeId);
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="job-description" className="block text-sm font-medium text-gray-300 mb-2">
          Paste Job Description

       </label>

       <Textarea
         id="job-description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the full job description here..."
        className="w-full min-h-[200px] rounded-lg border-gray-600 bg-gray-800 text-white focus:ring-blue-500
 focus:border-blue-500"
  />
      </div>


      <Button
        onClick={handleAnalyze}
       disabled={isAnalyzing || !jobDescription.trim() || !resumeId}
       className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors  duration-200"
      >
        {isAnalyzing ? (
          <>

           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
            Analyzing...
          </>

        ) : (

          'Analyze Job Description'
       )}
      </Button>
    </div>

  );
}
