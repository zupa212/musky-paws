"use client";

import Link from 'next/link';
import { Menu, X, Phone, PawPrint } from 'lucide-react';
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
        <header className="sticky top-0 z-50 w-full px-3 md:px-6 pt-3">
            <div
                className={`
                    transition-all duration-500 ease-out
                    border
                    ${scrolled
                        ? 'bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-white/80 rounded-2xl mx-2 mt-2'
                        : 'bg-white/40 backdrop-blur-lg shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-white/50 rounded-2xl mx-2 mt-2'
                    }
                `}
            >
                <div className="container mx-auto px-5 h-[68px] flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className={`
                            w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                            ${scrolled
                                ? 'bg-navy-900 shadow-md'
                                : 'bg-navy-900/80'
                            }
                        `}>
                            <PawPrint className="w-5 h-5 text-accent-400 group-hover:rotate-12 transition-transform duration-300" />
                        </div>
                        <span className="text-lg font-extrabold tracking-tight text-navy-900">
                            Musky Paws
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[13px] font-semibold text-navy-800/70 hover:text-navy-900 hover:bg-white/50 px-3.5 py-2 rounded-xl transition-all duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="w-px h-6 bg-navy-900/10 mx-2" />
                        <Link
                            href="/booking"
                            className="inline-flex items-center justify-center rounded-xl bg-navy-900 text-white px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:bg-navy-800 hover:shadow-lg hover:shadow-navy-900/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
                        >
                            Κλείσε Ραντεβού
                        </Link>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`
                            lg:hidden p-2.5 rounded-xl transition-all duration-200
                            ${isMobileMenuOpen
                                ? 'bg-navy-900 text-white'
                                : 'text-navy-900 hover:bg-white/50'
                            }
                        `}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Navigation — inside the glass container */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-white/30 px-5 pb-6 pt-4 animate-in slide-in-from-top-1 duration-200">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-base font-semibold text-navy-900 py-3 px-4 rounded-xl hover:bg-white/50 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-4 space-y-3">
                            <Link
                                href="/booking"
                                className="flex items-center justify-center rounded-xl bg-navy-900 text-white px-8 py-3.5 text-base font-bold w-full shadow-lg shadow-navy-900/15 hover:bg-navy-800 transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Κλείσε Ραντεβού
                            </Link>
                            <a href="tel:+306948965371" className="flex items-center justify-center gap-2 text-sm font-medium text-navy-800/60 hover:text-navy-900 py-2 transition-colors">
                                <Phone className="w-4 h-4" /> 694 896 5371
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
