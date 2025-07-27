'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/common/language_context';

export default function Footer() {
	const { t } = useLanguage();
	
	return (
		<footer className="bg-zinc-900 border-t border-zinc-800/50 py-20 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-5 gap-16">
					<div className="col-span-1 md:col-span-2">
						<h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 mb-6">
							Resume Matcher
						</h3>
						<p className="text-gray-400 mb-8 max-w-md leading-relaxed text-lg">
							Stop getting auto-rejected by ATS bots. Resume Matcher is the AI-powered platform 
							that reverse-engineers hiring algorithms to show you exactly how to tailor your resume.
						</p>
						<div className="flex space-x-6">
							<Link href="https://github.com/srbhr/Resume-Matcher" className="text-gray-400 hover:text-white transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
									<path d="M9 18c-4.51 2-5-2-7-2"></path>
								</svg>
							</Link>
							<Link href="https://twitter.com/_srbhr_" className="text-gray-400 hover:text-white transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M4 4l11.733 16h4.267l-11.733-16z"></path>
									<path d="M4 20l6.768-6.768m2.46-2.46L20 4"></path>
								</svg>
							</Link>
							<Link href="https://www.linkedin.com/company/resume-matcher/" className="text-gray-400 hover:text-white transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
									<rect width="4" height="12" x="2" y="9"></rect>
									<circle cx="4" cy="4" r="2"></circle>
								</svg>
							</Link>
						</div>
					</div>
					
					<div>
						<h4 className="text-xl font-semibold text-white mb-8">Product</h4>
						<ul className="space-y-5">
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Features</Link></li>
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Solutions</Link></li>
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Pricing</Link></li>
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Changelog</Link></li>
						</ul>
					</div>
					
					<div>
						<h4 className="text-xl font-semibold text-white mb-8">Resources</h4>
						<ul className="space-y-5">
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Documentation</Link></li>
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Tutorials</Link></li>
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Blog</Link></li>
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Support</Link></li>
						</ul>
					</div>
					
					<div>
						<h4 className="text-xl font-semibold text-white mb-8">Company</h4>
						<ul className="space-y-5">
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">About</Link></li>
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Careers</Link></li>
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Contact</Link></li>
							<li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-lg">Privacy Policy</Link></li>
						</ul>
					</div>
				</div>
				
				<div className="border-t border-zinc-800/50 mt-20 pt-10 text-center text-gray-500">
					<p className="text-lg">© {new Date().getFullYear()} Resume Matcher. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}