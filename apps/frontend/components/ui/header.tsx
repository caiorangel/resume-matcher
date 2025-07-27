'use client';

import React from 'react';
import Link from 'next/link';
import LanguageSelector from '@/components/common/language_selector';

export default function Header() {
  return (
    <header className="sticky top-0 left-0 z-50 w-full bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Resume Matcher
        </Link>

        {/* Navigation and Language Selector */}
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-6">
            <Link href="/resume" className="text-sm text-gray-300 hover:text-white transition-colors">
              Resume Analysis
            </Link>
            <Link href="/jobs" className="text-sm text-gray-300 hover:text-white transition-colors">
              Job Listings
            </Link>
          </nav>
          
          {/* Language Selector */}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}