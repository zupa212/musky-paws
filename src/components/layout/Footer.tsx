"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, AtSign, PawPrint, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-brand-50 pt-10 pb-6 px-4 md:px-6 w-full overflow-hidden">
            <div className="container mx-auto max-w-7xl relative bg-[#151515] rounded-[40px] p-10 md:p-16 overflow-hidden flex flex-col md:flex-row justify-between gap-16 md:gap-12">

                {/* Decorative Paw at Bottom Right — smaller to avoid overlap */}
                <div className="absolute -bottom-16 -right-16 pointer-events-none z-0 opacity-30">
                    {/* Main Pad */}
                    <div className="absolute bottom-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-brand-accent-pink rounded-full" />
                    {/* Left Toe */}
                    <div className="absolute bottom-[120px] md:bottom-[155px] right-[125px] md:right-[165px] w-12 h-12 md:w-16 md:h-16 bg-brand-accent-pink rounded-full" />
                    {/* Middle Toe */}
                    <div className="absolute bottom-[155px] md:bottom-[200px] right-[50px] md:right-[70px] w-14 h-14 md:w-[70px] md:h-[70px] bg-brand-accent-pink rounded-full" />
                    {/* Right Toe */}
                    <div className="absolute bottom-[100px] md:bottom-[130px] -right-4 md:-right-6 w-12 h-12 md:w-16 md:h-16 bg-brand-accent-pink rounded-full" />
                </div>

                {/* Left Section: Logo & Copyright */}
                <div className="flex flex-col justify-between z-10 w-full md:w-auto">
                    <Link href="/" className="flex items-center gap-3 group inline-block">
                        <div className="flex items-center justify-center shrink-0">
                            <Image 
                                src="/logo-musky-removebg-preview.png" 
                                alt="Musky Paws Logo" 
                                width={120}
                                height={120}
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                    </Link>

                    <div className="mt-16 md:mt-32 text-sm text-gray-400">
                        © {new Date().getFullYear()} Musky Paws. {t('footer.rights')}
                    </div>
                </div>

                {/* Middle Links Grid */}
                <div className="grid grid-cols-2 gap-8 md:gap-12 z-10 text-[15px] font-medium w-full md:w-1/2">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">{t('nav.home')}</Link>
                        <Link href="/services" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">{t('nav.services')}</Link>
                        <Link href="/pricing" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">{t('nav.pricing')}</Link>
                        <Link href="/gallery" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">Gallery</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Link href="/about" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">{t('footer.about')}</Link>
                        <Link href="/blog" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">{t('nav.blog')}</Link>
                        <Link href="/contact" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">{t('nav.contact')}</Link>
                        <Link href="/terms" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">{t('footer.terms')}</Link>
                    </div>
                </div>

                {/* Right Contact Details */}
                <div className="flex flex-col gap-6 z-10 w-full md:w-[280px]">
                    <a href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x14a8157d8e728873:0xdcebed07995b9773?sa=X&ved=1t:8290&ictx=111" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-brand-accent-pink flex items-center justify-center text-[#151515] group-hover:scale-110 shadow-lg shadow-brand-accent-pink/20 transition-all shrink-0 mt-1">
                            <MapPin className="w-[18px] h-[18px] fill-[#151515]" />
                        </div>
                        <span className="text-gray-300 text-sm font-medium pr-4 leading-relaxed group-hover:text-white transition-colors">
                            Σόλωνος 28Β, Περαία 570 19<br />
                            <span className="text-xs text-gray-500 block mt-1">
                                Δευτέρα – Παρασκευή: 09:00 – 21:00<br />
                                Σάββατο: 10:00 – 15:00
                            </span>
                        </span>
                    </a>

                    <a href="tel:+306948965371" className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-brand-accent-pink flex items-center justify-center text-[#151515] group-hover:scale-110 shadow-lg shadow-brand-accent-pink/20 transition-all shrink-0">
                            <Phone className="w-[18px] h-[18px] fill-[#151515]" />
                        </div>
                        <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                            694 896 5371
                        </span>
                    </a>


                </div>
            </div>
        </footer>
    );
}
