import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, AtSign, PawPrint } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-brand-50 pt-10 pb-6 px-4 md:px-6 w-full overflow-hidden">
            <div className="container mx-auto max-w-7xl relative bg-[#151515] rounded-[40px] p-10 md:p-16 overflow-hidden flex flex-col md:flex-row justify-between gap-16 md:gap-12">

                {/* Decorative Paw at Bottom Right */}
                <div className="absolute -bottom-12 -right-12 pointer-events-none z-0">
                    {/* Main Pad */}
                    <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-vetic-pink rounded-full" />
                    {/* Left Toe */}
                    <div className="absolute bottom-[160px] md:bottom-[210px] right-[170px] md:right-[220px] w-16 h-16 md:w-20 md:h-20 bg-vetic-pink rounded-full" />
                    {/* Middle Toe */}
                    <div className="absolute bottom-[210px] md:bottom-[270px] right-[70px] md:right-[100px] w-[75px] h-[75px] md:w-24 md:h-24 bg-vetic-pink rounded-full" />
                    {/* Right Toe */}
                    <div className="absolute bottom-[140px] md:bottom-[180px] -right-4 md:-right-6 w-16 h-16 md:w-20 md:h-20 bg-vetic-pink rounded-full" />
                </div>

                {/* Left Section: Logo & Copyright */}
                <div className="flex flex-col justify-between z-10 w-full md:w-auto">
                    <Link href="/" className="flex items-center gap-3 group inline-block">
                        <div className="w-12 h-12 rounded-2xl bg-vetic-pink flex items-center justify-center shrink-0">
                            <PawPrint className="w-7 h-7 text-navy-900 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-white">
                            Musky Paws
                        </span>
                    </Link>

                    <div className="mt-16 md:mt-32 text-sm text-gray-400">
                        © {new Date().getFullYear()} Musky Paws. All rights reserved.
                    </div>
                </div>

                {/* Middle Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 z-10 text-[15px] font-medium w-full md:w-1/2">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">Αρχική</Link>
                        <Link href="/services" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">Υπηρεσίες</Link>
                        <Link href="/pricing" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">Τιμοκατάλογος</Link>
                        <Link href="/gallery" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">Gallery</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Link href="/about" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">Σχετικά</Link>
                        <Link href="/blog" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">Blog</Link>
                        <Link href="/contact" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">Επικοινωνία</Link>
                        <Link href="/terms" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">Όροι & Privacy</Link>
                    </div>

                    <div className="flex flex-col gap-4 col-span-2 md:col-span-1 border-t border-gray-800 pt-6 md:border-0 md:pt-0">
                        <Link href="/admin/login" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">Σύνδεση</Link>
                        <Link href="/booking" className="text-gray-300 hover:text-vetic-pink font-semibold hover:translate-x-1 transition-all">Δημιουργία Ραντεβού</Link>
                        <Link href="/admin/customers" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all">User Page</Link>
                    </div>
                </div>

                {/* Right Contact Details */}
                <div className="flex flex-col gap-6 z-10 w-full md:w-[280px]">
                    <a href="https://maps.google.com/?q=Solonos+28B,+Peraia,+Greece+57019" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-vetic-pink flex items-center justify-center text-[#151515] group-hover:scale-110 shadow-lg shadow-vetic-pink/20 transition-all shrink-0">
                            <MapPin className="w-[18px] h-[18px] fill-[#151515]" />
                        </div>
                        <span className="text-gray-300 text-sm font-medium pr-4 leading-relaxed group-hover:text-white transition-colors">
                            Σόλωνος 28Β, Περαία 57019
                        </span>
                    </a>

                    <a href="tel:+306948965371" className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-vetic-pink flex items-center justify-center text-[#151515] group-hover:scale-110 shadow-lg shadow-vetic-pink/20 transition-all shrink-0">
                            <Phone className="w-[18px] h-[18px] fill-[#151515]" />
                        </div>
                        <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                            694 896 5371
                        </span>
                    </a>

                    <a href="mailto:muskypaws.thessaloniki@gmail.com" className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-vetic-pink flex items-center justify-center text-[#151515] group-hover:scale-110 shadow-lg shadow-vetic-pink/20 transition-all shrink-0">
                            <AtSign className="w-[18px] h-[18px]" />
                        </div>
                        <span className="text-gray-300 text-sm font-medium truncate pr-4 group-hover:text-white transition-colors">
                            muskypaws@gmail.com
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
