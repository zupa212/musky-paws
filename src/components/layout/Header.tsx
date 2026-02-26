"use client";

import Link from 'next/link';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

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

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-brand-200 dark:border-brand-800 transition-colors duration-300">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                        Musky Paws
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <ul className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-sm font-medium text-brand-700 hover:text-foreground dark:text-brand-300 dark:hover:text-foreground transition-colors"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/booking"
                        className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-6 py-2.5 text-sm font-medium transition-transform hover:scale-105 active:scale-95"
                    >
                        Κλείσε Ραντεβού
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-brand-200 dark:border-brand-800 shadow-lg flex flex-col items-center py-6 gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-lg font-medium text-foreground py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/booking"
                        className="mt-4 inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-3 text-base font-medium w-11/12"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Κλείσε Ραντεβού
                    </Link>
                    <div className="flex items-center gap-4 mt-6 text-brand-600 dark:text-brand-400">
                        <a href="tel:+306948965371" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" /> 694 896 5371
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
