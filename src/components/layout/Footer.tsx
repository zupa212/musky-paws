import Link from 'next/link';
import { MapPin, Phone, Instagram, Facebook, Clock, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-brand-50 dark:bg-brand-950 border-t border-brand-200 dark:border-brand-800 pt-16 pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                {/* Brand & Contact */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
                        Musky Paws
                    </Link>
                    <p className="text-brand-600 dark:text-brand-400 text-sm leading-relaxed mb-2">
                        Premium Dog Grooming & Pet Shop στην Περαία Θεσσαλονίκης. Προσφέρουμε κορυφαία περιποίηση με αγάπη και ασφάλεια.
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-brand-700 dark:text-brand-300">
                        <a href="https://maps.google.com/?q=Solonos+28B,+Peraia,+Greece+57019" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-foreground transition-colors">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>Σόλωνος 28Β, Περαία<br />Θεσσαλονίκη 57019</span>
                        </a>
                        <a href="tel:+306948965371" className="flex items-center gap-2 hover:text-foreground transition-colors">
                            <Phone className="w-4 h-4" />
                            <span>+30 694 896 5371</span>
                        </a>
                    </div>
                </div>

                {/* Services */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-foreground">Υπηρεσίες</h3>
                    <ul className="flex flex-col gap-2 text-sm text-brand-600 dark:text-brand-400">
                        <li><Link href="/services/full-grooming" className="hover:text-foreground transition-colors">Πλήρης Καλλωπισμός</Link></li>
                        <li><Link href="/services/bath-brush" className="hover:text-foreground transition-colors">Μπάνιο & Βούρτσισμα</Link></li>
                        <li><Link href="/services/deshedding" className="hover:text-foreground transition-colors">Απομάκρυνση Νεκρής Τρίχας</Link></li>
                        <li><Link href="/services/nails-ears" className="hover:text-foreground transition-colors">Κόψιμο Νυχιών & Καθαρισμός Αυτιών</Link></li>
                        <li><Link href="/services/puppy-grooming" className="hover:text-foreground transition-colors">Περιποίηση Κουταβιών</Link></li>
                    </ul>
                </div>

                {/* Areas Served */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-foreground">Περιοχές Εξυπηρέτησης</h3>
                    <ul className="flex flex-col gap-2 text-sm text-brand-600 dark:text-brand-400">
                        <li><Link href="/areas/peraea" className="hover:text-foreground transition-colors">Περαία</Link></li>
                        <li><Link href="/areas/neoi-epivates" className="hover:text-foreground transition-colors">Νέοι Επιβάτες</Link></li>
                        <li><Link href="/areas/agia-triada" className="hover:text-foreground transition-colors">Αγία Τριάδα</Link></li>
                        <li><Link href="/areas/kalamaria" className="hover:text-foreground transition-colors">Καλαμαριά</Link></li>
                        <li><Link href="/areas/thessaloniki" className="hover:text-foreground transition-colors">Ανατολική Θεσσαλονίκη</Link></li>
                    </ul>
                </div>

                {/* Opening Hours */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-foreground">Ωράριο Λειτουργίας</h3>
                    <ul className="flex flex-col gap-2 text-sm text-brand-600 dark:text-brand-400">
                        <li className="flex justify-between border-b border-brand-200 dark:border-brand-800 pb-1">
                            <span>Δευτέρα - Παρασκευή</span>
                            <span>09:00 - 18:00</span>
                        </li>
                        <li className="flex justify-between border-b border-brand-200 dark:border-brand-800 pb-1">
                            <span>Σάββατο</span>
                            <span>10:00 - 15:00</span>
                        </li>
                        <li className="flex justify-between pb-1">
                            <span>Κυριακή</span>
                            <span>Κλειστά</span>
                        </li>
                    </ul>
                    <div className="flex items-center gap-4 mt-2">
                        <a href="https://www.facebook.com/p/Musky-Paws-61558785775782/" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-blue-600 transition-colors" aria-label="Facebook">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="https://instagram.com/muskypaws_dog_grooming" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-pink-600 transition-colors" aria-label="Instagram">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-8 border-t border-brand-200 dark:border-brand-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-500">
                <p>© {new Date().getFullYear()} Musky Paws Dog Grooming. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Πολιτική Απορρήτου</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">Όροι Χρήσης</Link>
                </div>
            </div>
        </footer>
    );
}
