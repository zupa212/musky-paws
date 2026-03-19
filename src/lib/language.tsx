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
        'nav.pricing': 'Τιμές',
        'nav.blog': 'Blog',
        'nav.contact': 'Επικοινωνία',
        'nav.booking': 'Κλείσε Ραντεβού',

        // Hero
        'hero.badge': 'Κομμωτήριο Σκύλων Περαία',
        'hero.title1': 'Κομμωτήριο Σκύλων',
        'hero.title2': 'στην Περαία',
        'hero.subtitle': 'Το premium dog grooming salon στην Ανατολική Θεσσαλονίκη. Προσφέρουμε εξειδικευμένο κούρεμα, πλύσιμο και καλλωπισμό σκύλων με απόλυτη ασφάλεια και χωρίς άγχος. Εξυπηρετούμε Περαία, Καλαμαριά, Τρίλοφο και Μηχανιώνα.',
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
        'about.desc': 'Full grooming, πλύσιμο σκύλου, deshedding, νύχια και αυτιά. Εξυπηρετούμε όλη την Ανατολική Θεσσαλονίκη (Περαία, Καλαμαριά, Τρίλοφος, Επανομή, Θέρμη) με premium υπηρεσίες, καθαρό αποτέλεσμα και ήπιο χειρισμό χωρίς στρες για τους μικρούς μας φίλους.',

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
        'testimonials.q1': 'Απίστευτη δουλειά. Επαγγελματίες και πιο συγκεκριμένα το σκυλί αισθάνθηκε πολύ οικεία και πέρασε ευχάριστα. Δημήτρης Δολιανίτης.',
        'testimonials.q2': 'Το αποτέλεσμα του καλλωπισμού ήταν φανταστικό! Το κατοικίδιό μου είναι πεντακάθαρο, μυρίζει υπέροχα και έχει το πιο απαλό τρίχωμα. Gladiator T.',
        'testimonials.q3': 'Αν ψάχνετε το καλύτερο dog grooming από Τρίλοφο μέχρι Περαία, είναι εδώ! Η Στέλλα είναι εξαιρετικά φιλική, κάνοντάς μας να αισθανθούμε άνετα. Βάσω Α.',
        'testimonials.q4': 'Υπέροχος χώρος, επαγγελματικό περιβάλλον με όμορφο γούστο, άψογες παροχές. Αντιμετωπίζουν το κατοικίδιο μου με εξαιρετική φροντίδα. Σοφία Β.',
        'testimonials.q5': 'Ειλικρινά δεν έχω λόγια!! Η Στέλλα είναι καταπληκτική στην δουλειά της αλλά και σαν άνθρωπος!! Η φουσκίτσα μου την λατρεύει!!!! R. R.',
        'testimonials.q6': 'Εξαιρετική επαγγελματίας στην Περαία! Αγαπά πραγματικά τα ζώα και το αποτέλεσμα στο κούρεμα του σκύλου μου ήταν άψογο! Σοφία Μ.',

        // Footer CTA
        'cta.title1': 'Γιατί τα κατοικίδιά σας',
        'cta.title2': 'αξίζουν τα',
        'cta.title3': 'καλύτερα, πάντα',
        'cta.button': 'Επικοινωνήστε μαζί μας',

        // Footer
        'footer.desc': 'Premium υπηρεσίες καλλωπισμού - κούρεμα και πλύσιμο σκύλων στην Ανατολική Θεσσαλονίκη (Περαία, Καλαμαριά, Τρίλοφος κ.ά.). Με αγάπη, φροντίδα και επαγγελματισμό.',
        'footer.services': 'Υπηρεσίες',
        'footer.company': 'Εταιρεία',
        'footer.about': 'Σχετικά',
        'footer.gallery': 'Gallery',
        'footer.areas': 'Περιοχές',
        'footer.terms': 'Όροι Χρήσης',
        'footer.privacy': 'Πολιτική Απορρήτου',
        'footer.rights': 'Με επιφύλαξη παντός δικαιώματος.',
        'footer.address': 'Σόλωνος 28Β, Περαία 57019, Θεσσαλονίκη',
        'nav.about': 'Σχετικά',
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
        'hero.subtitle': 'Top dog grooming & dog washing in Eastern Thessaloniki (Peraia, Kalamaria and surrounding areas). Book online or call now for instant confirmation.',
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
        'about.desc': 'Full grooming, dog washing, bathing, deshedding, nails and ears. Serving all of Eastern Thessaloniki (Peraia, Kalamaria, Trilofos, Epanomi, Thermi) with premium services, clean results and gentle handling without stress for our little friends.',

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
        'testimonials.q1': 'Incredible work. Professionals and more specifically the dog felt very familiar and had a pleasant time. Dimitris Dolianitis.',
        'testimonials.q2': 'The result of the grooming was fantastic! My pet is spotless, smells great and has the softest coat. Gladiator T.',
        'testimonials.q3': 'My experience with Stella was excellent from beginning to end! She is extremely friendly and professional, making us feel comfortable. Vaso A.',
        'testimonials.q4': 'Wonderful space, professional environment with beautiful taste, impeccable facilities with Stella treating my pet with extreme care. Sofia V.',
        'testimonials.q5': "Honestly I have no words!! Stella is amazing at her job but also as a person!! My little Fouskitsa loves her!!!! R. R.",
        'testimonials.q6': 'Excellent professional!! Stella is very careful, truly loves animals and the grooming result was flawless!! Sofia M.',

        // Footer CTA
        'cta.title1': 'Because your',
        'cta.title2': 'pets deserve the',
        'cta.title3': 'best, always',
        'cta.button': 'Contact us',

        // Footer
        'footer.desc': 'Premium dog grooming and dog washing services in Eastern Thessaloniki (Peraia, Kalamaria, Trilofos, etc.). With love, care and professionalism.',
        'footer.services': 'Services',
        'footer.company': 'Company',
        'footer.about': 'About',
        'footer.gallery': 'Gallery',
        'footer.areas': 'Areas',
        'footer.terms': 'Terms of Use',
        'footer.privacy': 'Privacy Policy',
        'footer.rights': 'All rights reserved.',
        'footer.address': 'Solonos 28B, Peraia 57019, Thessaloniki',
        'nav.about': 'About',
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
