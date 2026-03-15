"use client";

import Link from 'next/link';
import { Phone, PawPrint } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/language';
import { LanguageToggle } from './LanguageToggle';

const navLinkKeys = [
    { key: 'nav.home', href: '/' },
    { key: 'nav.services', href: '/services' },
    { key: 'nav.blog', href: '/blog' },
    { key: 'nav.contact', href: '/contact' },
];

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { t } = useLanguage();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    return (
        <header className="fixed top-0 left-0 w-full z-50 px-4 pt-4 pb-2 transition-all duration-300">
            {/* The Floating Pill */}
            <div className={`
                container mx-auto 
                bg-white 
                rounded-full 
                flex items-center justify-between 
                px-4 md:px-8 py-3 
                transition-all duration-500
                ${scrolled ? 'shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2' : 'shadow-sm'}
            `}>

                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center shrink-0">
                        <PawPrint className="w-6 h-6 text-brand-950 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-brand-950">
                        Musky Paws
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinkKeys.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-[15px] font-medium transition-colors hover:text-brand-accent-pink ${isActive ? 'text-navy-900 font-bold' : 'text-navy-800/70'
                                    }`}
                            >
                                {t(link.key)}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side Toggle & Desktop-Only Language Toggle */}
                <div className="flex items-center gap-4">
                    {/* Desktop language toggle - only visible when menu is closed for cleaner look */}
                    <div className="hidden lg:block">
                        <LanguageToggle />
                    </div>

                    {/* Hamburger Button with smooth animation - Now universal */}
                    <button
                        className="w-11 h-11 bg-navy-900 rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-navy-800 hover:scale-105 active:scale-95 relative z-[60]"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <div className="w-5 h-4 flex flex-col justify-between">
                            <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 ease-out origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px] w-6' : ''}`} />
                            <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-200 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
                            <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 ease-out origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px] w-6' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Slide-down Menu (Universal) */}
            <div
                ref={menuRef}
                className={`container mx-auto mt-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${
                    isMobileMenuOpen
                        ? 'max-h-[600px] opacity-100 translate-y-0'
                        : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <nav className="flex flex-col gap-3">
                            {navLinkKeys.map((link, idx) => {
                                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-2xl font-bold transition-all duration-400 hover:text-brand-accent-pink hover:translate-x-2 ${
                                            isActive ? 'text-brand-accent-pink' : 'text-navy-900'
                                        }`}
                                        style={{ transitionDelay: `${idx * 40}ms` }}
                                    >
                                        {t(link.key)}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="flex flex-col gap-6">
                            <Link
                                href="/booking"
                                className="btn-pill bg-navy-900 text-white px-8 py-5 text-xl font-bold w-full shadow-2xl text-center hover:bg-navy-800 hover:-translate-y-1 transition-all active:translate-y-0"
                            >
                                {t('nav.booking')}
                            </Link>

                            <div className="flex flex-col items-center gap-4">
                                <a href="tel:+306948965371" className="flex items-center gap-3 text-navy-800 text-lg font-bold hover:text-brand-accent-pink transition-colors">
                                    <Phone className="w-5 h-5" /> 694 896 5371
                                </a>
                                
                                {/* Language switcher — inside menu */}
                                <div className="pt-2">
                                    <LanguageToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
