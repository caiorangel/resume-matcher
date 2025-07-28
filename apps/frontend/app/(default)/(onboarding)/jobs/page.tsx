'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import JobDescriptionUploadTextArea from '@/components/jd-upload/text-area';
import BackgroundContainer from '@/components/common/background-container';
import { useResumePreview } from '@/components/common/resume_previewer_context';
import { uploadJobDescriptions, improveResume } from '@/lib/api/resume';
import { useLanguage } from '@/components/common/language_context';

const ProvideJobDescriptionsPage = () => {
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const router = useRouter();
	const { setImprovedData } = useResumePreview();
	const { language } = useLanguage();

	const handleAnalyze = async (jobDescription: string, resumeId: string) => {
		setIsAnalyzing(true);
		try {
			console.log('Analyzing job description:', { jobDescription, resumeId });
			
			// Step 1: Upload job description and get job_id
			const jobId = await uploadJobDescriptions([jobDescription], resumeId);
			console.log('Job uploaded with ID:', jobId);
			
			// Step 2: Improve resume using the job_id
			const improvedData = await improveResume(resumeId, jobId, language);
			console.log('Resume improved:', improvedData);
			
			// Save the real data to context
			setImprovedData(improvedData);
			
			// Redirect to results page
			router.push(`/results?resume_id=${resumeId}&job_id=${jobId}`);
		} catch (error) {
			console.error('Analysis failed:', error);
			alert(`Failed to analyze job description. Please try again. Error: ${error.message}`);
		} finally {
			setIsAnalyzing(false);
		}
	};

	return (
		<BackgroundContainer>
			<div className="flex flex-col items-center justify-center max-w-7xl">
				<h1 className="text-6xl font-bold text-center mb-12 text-white">
					Provide Job Descriptions
				</h1>
				<p className="text-center text-gray-300 text-xl mb-8 max-w-xl mx-auto">
					Paste up to three job descriptions below. We&apos;ll use these to compare
					against your resume and find the best matches.
				</p>
				<Suspense fallback={
					<div className="flex items-center justify-center p-8">
						<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
					</div>
				}>
					<JobDescriptionUploadTextArea 
						onAnalyze={handleAnalyze}
						isAnalyzing={isAnalyzing}
					/>
				</Suspense>
			</div>
		</BackgroundContainer>
	);
};

export default ProvideJobDescriptionsPage;
