'use client';

import React from 'react';
import { useLanguage, Language } from './language_context';

export default function LanguageSelector() {
    const { language, setLanguage, t } = useLanguage();

    const languages: { code: Language; name: string; flag: string }[] = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'pt', name: 'Português', flag: '🇧🇷' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
    ];

    return (
        <div className="flex justify-center gap-4">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        language === lang.code
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                </button>
            ))}
        </div>
    );
}