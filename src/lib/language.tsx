"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'el' | 'en';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
    el: {
        // Header
        'nav.home': 'Αρχική',
        'nav.services': 'Υπηρεσίες',
        'nav.pricing': 'Τιμοκατάλογος',
        'nav.blog': 'Blog',
        'nav.contact': 'Επικοινωνία',
        'nav.booking': 'Κλείσε Ραντεβού',

        // Hero
        'hero.badge': 'Dog Grooming Περαία',
        'hero.title1': 'Dog Grooming',
        'hero.title2': 'Θεσσαλονίκη',
        'hero.subtitle': 'Premium περιποίηση σκύλων & γατών στην Περαία. Κλείσε ραντεβού online ή κάλεσε τώρα για άμεση επιβεβαίωση.',
        'hero.cta': 'Κλείσε Ραντεβού Online',
        'hero.gallery': 'Before/After Αποτελέσματα',
        'hero.online': 'Online Κράτηση',
        'hero.contact': 'Άμεση Επικοινωνία',
        'hero.premium': 'Premium Παροχές',
        'hero.hygiene': '100% Υγιεινή',

        // About section
        'about.badge': 'Κομμωτήριο Σκύλων Θεσσαλονίκη',
        'about.title1': 'Υγιεινή, Ασφάλεια &',
        'about.title2': 'Φροντίδα',
        'about.desc': 'Full grooming, μπάνιο, deshedding, νύχια και αυτιά. Εύκολη πρόσβαση από Θεσσαλονίκη με premium υπηρεσίες, καθαρό αποτέλεσμα και ήπιο χειρισμό χωρίς στρες για τους μικρούς μας φίλους.',

        // Team section
        'team.badge': 'Pet Grooming Θεσσαλονίκη',
        'team.title1': 'Η έμπειρη',
        'team.title2': 'ομάδα',
        'team.title3': 'μας',
        'team.cta': 'Γνωρίστε μας',
        'team.role': 'Head Groomer',

        // Testimonials
        'testimonials.badge': 'Testimonials',
        'testimonials.title1': 'Τι λένε οι χαρούμενοι',
        'testimonials.title2': 'ιδιοκτήτες',

        // Footer CTA
        'cta.title1': 'Κλείσε',
        'cta.title2': 'ραντεβού',
        'cta.title3': 'σήμερα',
        'cta.desc': 'Online κράτηση σε λιγότερο από 2 λεπτά. Επιλέξτε υπηρεσία, ημέρα και ώρα — εμείς αναλαμβάνουμε τα υπόλοιπα.',
        'cta.button': 'Κλείσε Ραντεβού',
        'cta.call': 'Ή καλέστε μας',

        // Footer
        'footer.desc': 'Premium υπηρεσίες καλλωπισμού σκύλων στην Περαία Θεσσαλονίκης. Με αγάπη, φροντίδα και επαγγελματισμό.',
        'footer.services': 'Υπηρεσίες',
        'footer.company': 'Εταιρεία',
        'footer.about': 'Σχετικά',
        'footer.gallery': 'Gallery',
        'footer.areas': 'Περιοχές',
        'footer.terms': 'Όροι Χρήσης',
        'footer.privacy': 'Πολιτική Απορρήτου',
        'footer.rights': 'Με επιφύλαξη παντός δικαιώματος.',
    },
    en: {
        // Header
        'nav.home': 'Home',
        'nav.services': 'Services',
        'nav.pricing': 'Pricing',
        'nav.blog': 'Blog',
        'nav.contact': 'Contact',
        'nav.booking': 'Book Now',

        // Hero
        'hero.badge': 'Dog Grooming Peraia',
        'hero.title1': 'Dog Grooming',
        'hero.title2': 'Thessaloniki',
        'hero.subtitle': 'Premium dog & cat grooming in Peraia, Thessaloniki. Book online or call now for instant confirmation.',
        'hero.cta': 'Book Appointment Online',
        'hero.gallery': 'Before/After Results',
        'hero.online': 'Online Booking',
        'hero.contact': 'Direct Contact',
        'hero.premium': 'Premium Services',
        'hero.hygiene': '100% Hygiene',

        // About section  
        'about.badge': 'Dog Grooming Thessaloniki',
        'about.title1': 'Hygiene, Safety &',
        'about.title2': 'Care',
        'about.desc': 'Full grooming, bathing, deshedding, nails and ears. Easy access from Thessaloniki with premium services, clean results and gentle handling without stress for our little friends.',

        // Team section
        'team.badge': 'Pet Grooming Thessaloniki',
        'team.title1': 'Our Expert',
        'team.title2': 'Team',
        'team.title3': '',
        'team.cta': 'Meet Us',
        'team.role': 'Head Groomer',

        // Testimonials
        'testimonials.badge': 'Testimonials',
        'testimonials.title1': 'What our happy',
        'testimonials.title2': 'owners say',

        // Footer CTA
        'cta.title1': 'Book your',
        'cta.title2': 'appointment',
        'cta.title3': 'today',
        'cta.desc': 'Online booking in less than 2 minutes. Choose a service, day and time — we take care of the rest.',
        'cta.button': 'Book Appointment',
        'cta.call': 'Or call us',

        // Footer
        'footer.desc': 'Premium dog grooming services in Peraia, Thessaloniki. With love, care and professionalism.',
        'footer.services': 'Services',
        'footer.company': 'Company',
        'footer.about': 'About',
        'footer.gallery': 'Gallery',
        'footer.areas': 'Areas',
        'footer.terms': 'Terms of Use',
        'footer.privacy': 'Privacy Policy',
        'footer.rights': 'All rights reserved.',
    },
};

const LanguageContext = createContext<LanguageContextType>({
    locale: 'el',
    setLocale: () => { },
    t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('el');

    useEffect(() => {
        const saved = localStorage.getItem('musky-locale') as Locale;
        if (saved && (saved === 'el' || saved === 'en')) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('musky-locale', newLocale);
    };

    const t = (key: string): string => {
        return translations[locale][key] || translations['el'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
