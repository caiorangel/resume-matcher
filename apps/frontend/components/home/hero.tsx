'use client';

import React from 'react';
import BackgroundContainer from '@/components/common/background-container';
import { useLanguage } from '@/components/common/language_context';
import LanguageSelector from '@/components/common/language_selector';
import FileUpload from '@/components/common/file-upload';

export default function Hero() {
	const { t } = useLanguage();
	
	return (
		<BackgroundContainer 
			className=""
			innerClassName="bg-zinc-900/20 backdrop-blur-2xl border border-white/10 shadow-2xl"
		>
			<div className="flex flex-col items-center justify-center w-full max-w-5xl px-4 py-16 text-center">
				<div className="mb-10">
					<div className="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-300 px-5 py-2 rounded-full text-base font-medium mb-8 border border-indigo-500/20">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
							<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
							<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
							<path d="M12 2v2"></path>
							<path d="M12 22v-2"></path>
							<path d="m17 20.66-1-1.73"></path>
							<path d="M11 10.27 7 3.34"></path>
							<path d="m20.66 17-1.73-1"></path>
							<path d="m3.34 7 1.73 1"></path>
							<path d="M14 12h8"></path>
							<path d="M2 12h2"></path>
							<path d="m20.66 7-1.73 1"></path>
							<path d="m3.34 17 1.73-1"></path>
							<path d="m17 3.34-1 1.73"></path>
							<path d="m11 13.73-4 6.93"></path>
						</svg>
						Trusted by 10,000+ professionals
					</div>
				</div>

				<h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300 tracking-tight">
					Resume Matcher
				</h1>
				
				<p className="text-xl md:text-2xl text-gray-300 mb-2 max-w-3xl mx-auto leading-relaxed font-light">
					{t('hero.subtitle')}
				</p>
				
				{/* Workflow Diagram */}
				<div className="w-full max-w-4xl mt-16 mb-12">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Step 1 */}
						<div className="flex flex-col items-center text-center group">
							<div className="relative mb-6">
								<div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
								<div className="relative bg-zinc-800/50 backdrop-blur-xl p-5 rounded-full border border-indigo-500/20">
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
										<polyline points="14 2 14 8 20 8"></polyline>
										<line x1="16" y1="13" x2="8" y2="13"></line>
										<line x1="16" y1="17" x2="8" y2="17"></line>
										<polyline points="10 9 9 9 8 9"></polyline>
									</svg>
								</div>
							</div>
							<h3 className="text-xl font-bold text-white mb-2">Upload Your CV</h3>
							<p className="text-gray-400 text-base max-w-[200px]">Submit your current resume in PDF or DOCX format</p>
						</div>
						
						{/* Step 2 */}
						<div className="flex flex-col items-center text-center group">
							<div className="relative mb-6">
								<div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
								<div className="relative bg-zinc-800/50 backdrop-blur-xl p-5 rounded-full border border-purple-500/20">
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
										<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
										<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
										<path d="M12 2v2"></path>
										<path d="M12 22v-2"></path>
										<path d="m17 20.66-1-1.73"></path>
										<path d="M11 10.27 7 3.34"></path>
										<path d="m20.66 17-1.73-1"></path>
										<path d="m3.34 7 1.73 1"></path>
										<path d="M14 12h8"></path>
										<path d="M2 12h2"></path>
										<path d="m20.66 7-1.73 1"></path>
										<path d="m3.34 17 1.73-1"></path>
										<path d="m17 3.34-1 1.73"></path>
										<path d="m11 13.73-4 6.93"></path>
									</svg>
								</div>
							</div>
							<h3 className="text-xl font-bold text-white mb-2">Input Job Description</h3>
							<p className="text-gray-400 text-base max-w-[200px]">Paste the job description you want to apply for</p>
						</div>
						
						{/* Step 3 */}
						<div className="flex flex-col items-center text-center group">
							<div className="relative mb-6">
								<div className="absolute inset-0 bg-green-500/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
								<div className="relative bg-zinc-800/50 backdrop-blur-xl p-5 rounded-full border border-green-500/20">
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
										<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
										<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
									</svg>
								</div>
							</div>
							<h3 className="text-xl font-bold text-white mb-2">Get Improved Resume</h3>
							<p className="text-gray-400 text-base max-w-[200px]">Receive your optimized resume tailored for that position</p>
						</div>
					</div>
				</div>
				
				{/* Language Selector */}
				<div className="my-10">
					<LanguageSelector />
				</div>
				
				{/* File Upload Component */}
				<div className="w-full max-w-2xl mt-8">
					<FileUpload />
				</div>
			</div>
		</BackgroundContainer>
	);
}
