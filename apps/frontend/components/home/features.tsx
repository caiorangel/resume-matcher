'use client';

import React from 'react';
import { useLanguage } from '@/components/common/language_context';

export default function Features() {
	const { t } = useLanguage();
	
	const features = [
		{
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
					<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
				</svg>
			),
			title: 'ATS Compatibility',
			description: 'Get a detailed analysis of your resume\'s compatibility with ATS systems.'
		},
		{
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
			),
			title: 'Keyword Optimizer',
			description: 'Align your resume with job keywords and identify critical content gaps.'
		},
		{
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
				</svg>
			),
			title: 'Privacy Focused',
			description: 'Everything runs locally on your machine. Your data never leaves your computer.'
		},
		{
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
					<path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
				</svg>
			),
			title: 'Instant Match Score',
			description: 'Upload resume & job description for a quick match score and key improvement areas.'
		}
	];
	
	return (
		<section id="features" className="py-28 px-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-24">
					<div className="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400 px-5 py-2 rounded-full text-base font-medium mb-6">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
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
						Features
					</div>
					<h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 mb-6">
						Elevate Your Job Application Success
					</h2>
					<p className="text-gray-400 max-w-3xl mx-auto text-xl leading-relaxed">
						Our comprehensive suite of resume optimization tools helps you stand out in today's competitive job market.
					</p>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<div 
							key={index}
							className="bg-zinc-800/50 backdrop-blur-2xl p-8 rounded-2xl border border-gray-700/50 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center group"
						>
							<div className="bg-indigo-500/10 p-4 rounded-full mb-6 group-hover:bg-indigo-500/20 transition-all duration-300">
								<div className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">
									{feature.icon}
								</div>
							</div>
							<h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
							<p className="text-gray-400 text-base leading-relaxed">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}