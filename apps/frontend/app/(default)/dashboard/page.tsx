// File: apps/frontend/app/dashboard/page.tsx

'use client';

import React, { useState } from 'react';
import BackgroundContainer from '@/components/common/background-container';
import JobListings from '@/components/dashboard/job-listings';
import ResumeAnalysis from '@/components/dashboard/resume-analysis';
import Resume from '@/components/dashboard/resume-component'; // rename import to match default export
import { useResumePreview } from '@/components/common/resume_previewer_context';
import { useLanguage } from '@/components/common/language_context';
import { downloadResumePDF } from '@/lib/api/pdf';
import { Button } from '@/components/ui/button';
// import { analyzeJobDescription } from '@/lib/api/jobs';

interface AnalyzedJobData {
	title: string;
	company: string;
	location: string;
}

const mockResumeData = {
	personalInfo: {
		name: 'Ada Lovelace',
		title: 'Software Engineer & Visionary',
		email: 'ada.lovelace@example.com',
		phone: '+1-234-567-8900',
		location: 'London, UK',
		website: 'analyticalengine.dev',
		linkedin: 'linkedin.com/in/adalovelace',
		github: 'github.com/adalovelace',
	},
	summary:
		'Pioneering computer programmer with a strong foundation in mathematics and analytical thinking. Known for writing the first algorithm intended to be carried out by a machine. Seeking challenging opportunities to apply analytical skills to modern computing problems.',
	experience: [
		{
			id: 1,
			title: 'Collaborator & Algorithm Designer',
			company: "Charles Babbage's Analytical Engine Project",
			location: 'London, UK',
			years: '1842 - 1843',
			description: [
				"Developed the first published algorithm intended for implementation on a computer, Charles Babbage's Analytical Engine.",
				"Translated Luigi Menabrea's memoir on the Analytical Engine, adding extensive notes (Notes G) which included the algorithm.",
				'Foresaw the potential for computers to go beyond mere calculation, envisioning applications in music and art.',
			],
		},
	],
	education: [
		{
			id: 1,
			institution: 'Self-Taught & Private Tutoring',
			degree: 'Mathematics and Science',
			years: 'Early 19th Century',
			description:
				'Studied mathematics and science extensively under tutors like Augustus De Morgan, a prominent mathematician.',
		},
		// Add more education objects here if needed
	],
	skills: [
		'Algorithm Design',
		'Analytical Thinking',
		'Mathematical Modeling',
		'Computational Theory',
		'Technical Writing',
		'French (Translation)',
		'Symbolic Logic',
	],
};

export default function DashboardPage() {
	const { improvedData } = useResumePreview();
	const { t, language } = useLanguage();
	const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
	const [pdfError, setPdfError] = useState<string | null>(null);
	
	console.log('Improved Data:', improvedData);
	if (!improvedData) {
		return (
			<BackgroundContainer className="min-h-screen" innerClassName="bg-zinc-950">
				<div className="flex items-center justify-center h-full p-6 text-gray-400">
					No improved resume found. Please click "Improve" on the Job Upload page first.
				</div>
			</BackgroundContainer>
		);
	}

	const { data } = improvedData;
	const { resume_preview, new_score, original_score } = data;
	const preview = resume_preview ?? mockResumeData;
	const newPct = Math.round(new_score * 100);
	const originalPct = Math.round(original_score * 100);

	const handleJobUpload = async (text: string): Promise<AnalyzedJobData | null> => {
		void text; // Prevent unused variable warning
		alert('Job analysis not implemented yet.');
		return null;
	};

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
			setPdfError(t('dashboard.pdfError'));
		} finally {
			setIsDownloadingPDF(false);
		}
	};


	return (
		<BackgroundContainer className="min-h-screen" innerClassName="bg-zinc-950 backdrop-blur-sm overflow-auto">
			<div className="w-full h-full overflow-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="container mx-auto">
					<div className="mb-10">
						<h1 className="text-3xl font-semibold pb-2 text-white">
							{t('dashboard.title').split(' ').slice(0, 1).join(' ')}{' '}
							<span className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
								Resume Matcher
							</span>{' '}
							{t('dashboard.title').split(' ').slice(-1).join(' ')}
						</h1>
						<p className="text-gray-300 text-lg">
							{t('dashboard.subtitle')}
						</p>
					</div>

					{/* Grid: left = analyzer + analysis, right = resume */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Left column */}
						<div className="space-y-8">
							<section>
								<JobListings onUploadJob={handleJobUpload} />
							</section>
							<section>
								<ResumeAnalysis
									score={newPct}
									originalScore={originalPct}
									details={improvedData.data.details ?? ''}
									commentary={improvedData.data.commentary ?? ''}
									improvements={improvedData.data.improvements ?? []}
								/>
							</section>
						</div>

						{/* Right column */}
						<div className="md:col-span-2">
							<div className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-lg shadow-xl h-full flex flex-col border border-gray-800/50">
								<div className="mb-6">
									<div className="flex justify-between items-start mb-4">
										<div>
											<h2 className="text-2xl font-bold text-white mb-1">{t('dashboard.yourResume')}</h2>
											<p className="text-gray-400 text-sm">
												{t('dashboard.updateResume')}
											</p>
										</div>
										<Button
											onClick={handleDownloadPDF}
											disabled={isDownloadingPDF}
											className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
										>
											{isDownloadingPDF ? (
												<>
													<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
													{t('dashboard.downloadingPDF')}
												</>
											) : (
												<>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
													</svg>
													{t('dashboard.downloadPDF')}
												</>
											)}
										</Button>
									</div>
									{pdfError && (
										<div className="text-red-400 text-sm mt-2">
											{pdfError}
										</div>
									)}
								</div>
								<div className="flex-grow overflow-auto">
									<Resume resumeData={preview} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</BackgroundContainer>
	);
}