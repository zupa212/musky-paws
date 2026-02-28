import Link from 'next/link';
import { MapPin, Phone, Instagram, Facebook } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-navy-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand & Description */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2.5">
                            <span className="text-2xl">🐾</span>
                            <span className="text-xl font-extrabold tracking-tight text-white">Musky Paws</span>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Premium Dog Grooming στην Περαία Θεσσαλονίκης. Φτιαγμένο με αγάπη για τα ζώα.
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            <a href="https://www.facebook.com/p/Musky-Paws-61558785775782/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors" aria-label="Facebook">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="https://instagram.com/muskypaws_dog_grooming" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors" aria-label="Instagram">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-1">Σύνδεσμοι</h3>
                        <Link href="/" className="text-white/50 text-sm hover:text-white transition-colors">Αρχική</Link>
                        <Link href="/services" className="text-white/50 text-sm hover:text-white transition-colors">Υπηρεσίες</Link>
                        <Link href="/pricing" className="text-white/50 text-sm hover:text-white transition-colors">Τιμοκατάλογος</Link>
                        <Link href="/gallery" className="text-white/50 text-sm hover:text-white transition-colors">Gallery</Link>
                        <Link href="/booking" className="text-white/50 text-sm hover:text-white transition-colors">Κράτηση</Link>
                    </div>

                    {/* Areas */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-1">Περιοχές</h3>
                        <Link href="/areas/peraea" className="text-white/50 text-sm hover:text-white transition-colors">Περαία</Link>
                        <Link href="/areas/neoi-epivates" className="text-white/50 text-sm hover:text-white transition-colors">Νέοι Επιβάτες</Link>
                        <Link href="/areas/agia-triada" className="text-white/50 text-sm hover:text-white transition-colors">Αγία Τριάδα</Link>
                        <Link href="/areas/kalamaria" className="text-white/50 text-sm hover:text-white transition-colors">Καλαμαριά</Link>
                        <Link href="/areas/thessaloniki" className="text-white/50 text-sm hover:text-white transition-colors">Θεσσαλονίκη</Link>
                    </div>

                    {/* Contact & Hours */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-1">Επικοινωνία</h3>
                        <a href="https://maps.google.com/?q=Solonos+28B,+Peraia,+Greece+57019" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-white/50 text-sm hover:text-white transition-colors">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>Σόλωνος 28Β, Περαία<br />Θεσσαλονίκη 57019</span>
                        </a>
                        <a href="tel:+306948965371" className="flex items-center gap-2 text-white/50 text-sm hover:text-white transition-colors">
                            <Phone className="w-4 h-4" />
                            <span>+30 694 896 5371</span>
                        </a>
                        <div className="mt-2">
                            <p className="text-white/30 text-xs uppercase tracking-wider mb-2">Ωράριο</p>
                            <div className="space-y-1 text-sm text-white/50">
                                <p className="flex justify-between"><span>Δευ – Παρ</span><span className="text-white/70">09:00 – 18:00</span></p>
                                <p className="flex justify-between"><span>Σάββατο</span><span className="text-white/70">10:00 – 15:00</span></p>
                                <p className="flex justify-between"><span>Κυριακή</span><span className="text-white/70">Κλειστά</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
                    <p>© {new Date().getFullYear()} Musky Paws Dog Grooming. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-white transition-colors">Πολιτική Απορρήτου</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Όροι Χρήσης</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
