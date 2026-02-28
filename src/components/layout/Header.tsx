"use client";

import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
    { name: 'Αρχική', href: '/' },
    { name: 'Υπηρεσίες', href: '/services' },
    { name: 'Τιμοκατάλογος', href: '/pricing' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Σχετικά', href: '/about' },
    { name: 'Επικοινωνία', href: '/contact' },
];

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-brand-50/80 backdrop-blur-sm'}`}>
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <span className="text-2xl">🐾</span>
                    <span className="text-xl font-extrabold tracking-tight text-navy-900">
                        Musky Paws
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    <ul className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-sm font-medium text-navy-800/70 hover:text-navy-900 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/booking"
                        className="inline-flex items-center justify-center rounded-full bg-navy-900 text-white px-7 py-2.5 text-sm font-semibold transition-all hover:bg-navy-800 hover:scale-105 active:scale-95 shadow-md"
                    >
                        Κλείσε Ραντεβού
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden p-2 text-navy-900"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-brand-200 shadow-xl flex flex-col items-center py-6 gap-3 animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-lg font-medium text-navy-900 py-2 hover:text-accent-500 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/booking"
                        className="mt-3 inline-flex items-center justify-center rounded-full bg-navy-900 text-white px-8 py-3 text-base font-semibold w-11/12 shadow-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Κλείσε Ραντεβού
                    </Link>
                    <div className="flex items-center gap-4 mt-4 text-brand-600">
                        <a href="tel:+306948965371" className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4" /> 694 896 5371
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
