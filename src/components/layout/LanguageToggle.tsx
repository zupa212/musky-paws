"use client";

import { useLanguage } from '@/lib/language';

export function LanguageToggle() {
    const { locale, setLocale } = useLanguage();

    return (
        <div className="flex items-center p-1 bg-navy-50/50 backdrop-blur-sm rounded-full border border-navy-100/50">
            <button
                onClick={() => setLocale('el')}
                className={`
                    px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300
                    ${locale === 'el' 
                        ? 'bg-navy-900 text-white shadow-md' 
                        : 'text-navy-900/40 hover:text-navy-900 hover:bg-white/50'}
                `}
            >
                GR
            </button>
            <button
                onClick={() => setLocale('en')}
                className={`
                    px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300
                    ${locale === 'en' 
                        ? 'bg-navy-900 text-white shadow-md' 
                        : 'text-navy-900/40 hover:text-navy-900 hover:bg-white/50'}
                `}
            >
                EN
            </button>
        </div>
    );
}
