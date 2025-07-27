'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResumePreview } from '@/components/common/resume_previewer_context';

export default function ResultsPage() {
  const router = useRouter();
  const { improvedData } = useResumePreview();

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

  // Extract data from the improvedData structure
  const data = improvedData.data;
  const matchScore = data.new_score || data.original_score;
  const improvements = data.improvements?.map(item => item.suggestion) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/90 to-purple-900/90 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Resume Analysis Results</h1>
          <p className="text-xl text-gray-300">Here's how you can improve your resume</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Match Score */}
          <div className="bg-zinc-800/50 backdrop-blur-2xl p-8 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Match Score</h2>
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg className="w-48 h-48" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-indigo-500"
                    strokeWidth="8"
                    strokeDasharray={`${(matchScore / 100) * 251.2}, 251.2`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dy="7"
                    fontSize="20"
                    fill="white"
                    fontWeight="bold"
                  >
                    {matchScore}%
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-zinc-800/50 backdrop-blur-2xl p-8 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Suggested Improvements</h2>
            <ul className="space-y-4">
              {improvements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-indigo-500/10 p-2 rounded-full mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-gray-300">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improved Resume Preview */}
          <div className="lg:col-span-2 bg-zinc-800/50 backdrop-blur-2xl p-8 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Improved Resume Preview</h2>
            <div className="bg-zinc-900/50 border border-gray-700 rounded-xl p-6">
              <pre className="text-gray-300 whitespace-pre-wrap">
                {data.details || 'No preview available'}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}