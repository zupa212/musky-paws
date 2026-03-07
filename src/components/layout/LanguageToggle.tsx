"use client";

import { useLanguage, Locale } from '@/lib/language';

export function LanguageToggle() {
    const { locale, setLocale } = useLanguage();

    return (
        <button
            onClick={() => setLocale(locale === 'el' ? 'en' : 'el')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-100 hover:bg-brand-200 transition-colors text-sm font-semibold text-navy-900 border border-brand-200"
            aria-label="Switch Language"
        >
            <span className={locale === 'el' ? 'opacity-100' : 'opacity-40'}>🇬🇷</span>
            <span className="text-brand-400">/</span>
            <span className={locale === 'en' ? 'opacity-100' : 'opacity-40'}>🇬🇧</span>
        </button>
    );
}
