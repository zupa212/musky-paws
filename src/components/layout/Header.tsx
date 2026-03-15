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
    { key: 'nav.pricing', href: '/pricing' },
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
                                className={`text-[15px] font-medium transition-colors hover:text-vetic-pink ${isActive ? 'text-navy-900 font-bold' : 'text-navy-800/70'
                                    }`}
                            >
                                {t(link.key)}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side CTA & Mobile Toggle */}
                <div className="flex items-center gap-3">
                    {/* Desktop language toggle */}
                    <div className="hidden lg:block">
                        <LanguageToggle />
                    </div>
                    <Link
                        href="/booking"
                        className="hidden md:inline-flex btn-pill bg-navy-900 text-white px-6 py-2.5 text-sm font-semibold hover:bg-navy-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {t('nav.booking')}
                    </Link>

                    {/* Hamburger Button with smooth animation */}
                    <button
                        className="lg:hidden w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 relative"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <div className="w-5 h-4 flex flex-col justify-between">
                            <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 ease-out origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                            <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-200 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
                            <span className={`block h-[2px] w-full bg-white rounded-full transition-all duration-300 ease-out origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Slide-down Menu */}
            <div
                ref={menuRef}
                className={`container mx-auto mt-2 transition-all duration-400 ease-out overflow-hidden ${
                    isMobileMenuOpen
                        ? 'max-h-[500px] opacity-100 translate-y-0'
                        : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
                }`}
            >
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                    <nav className="flex flex-col gap-4">
                        {navLinkKeys.map((link, idx) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-lg font-semibold transition-all duration-300 hover:text-vetic-pink hover:translate-x-1 ${
                                        isActive ? 'text-vetic-pink' : 'text-navy-900'
                                    }`}
                                    style={{ transitionDelay: `${idx * 50}ms` }}
                                >
                                    {t(link.key)}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Separator + Bottom section */}
                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-4">
                        <Link
                            href="/booking"
                            className="btn-pill bg-navy-900 text-white px-8 py-3.5 text-base w-full shadow-lg text-center"
                        >
                            {t('nav.booking')}
                        </Link>
                        <a href="tel:+306948965371" className="flex items-center justify-center gap-2 text-navy-800/70 py-2 font-medium">
                            <Phone className="w-4 h-4" /> 694 896 5371
                        </a>

                        {/* Language switcher — inside mobile menu */}
                        <div className="flex items-center justify-center pt-2 pb-1">
                            <LanguageToggle />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
