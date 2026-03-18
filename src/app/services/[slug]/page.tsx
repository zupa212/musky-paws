import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, CheckCircle2, ArrowRight, ChevronDown } from 'lucide-react';

const servicesData = {
    'full-grooming': {
        title: 'Πλήρης Καλλωπισμός',
        h1: 'Κούρεμα Σκύλου (Full Grooming) στην Περαία',
        seoTitle: 'Κούρεμα Σκύλου Περαία | Full Dog Grooming | Musky Paws',
        seoDesc: 'Το απόλυτο full grooming και κούρεμα σκύλου στην Περαία. Ολοκληρωμένη φροντίδα με μπάνιο, κούρεμα και καθαρισμό, σε ένα stress-free περιβάλλον.',
        description: 'Ολοκληρωμένη περιποίηση που περιλαμβάνει μπάνιο, κούρεμα (βάσει φυλής ή προτίμησης), καθαρισμό αυτιών και κόψιμο νυχιών. Η απόλυτη εμπειρία ανανέωσης για τον σκύλο σας.',
        duration: '1.5 - 3 ώρες',
        price: 'Από 30€',
        img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80',
        forWhom: 'Ιδανικό για όλες τις φυλές που χρειάζονται κούρεμα (π.χ. Poodle, Maltipoo, Shih Tzu) ή για σκυλιά που χρειάζονται ένα ριζικό makeover.',
        steps: [
            'Αξιολόγηση τριχώματος και συζήτηση με τον ιδιοκτήτη',
            'Βούρτσισμα και αφαίρεση κόμπων (αν χρειάζεται)',
            'Διπλό λούσιμο καθαρισμού με υποαλλεργικό σαμπουάν',
            'Εφαρμογή μαλακτικής κρέμας/μάσκας',
            'Στέγνωμα στο χέρι (blow dry) παράλληλα με βούρτσισμα',
            'Κούρεμα σώματος και κεφαλής (styling)',
            'Κόψιμο νυχιών και καθαρισμός/αποτρίχωση αυτιών',
            'Άρωμα μακράς διάρκειας'
        ],
        faqs: [
            { q: 'Πόσο συχνά πρέπει να κάνει ο σκύλος μου Πλήρη Καλλωπισμό;', a: 'Για φυλές με τρίχωμα που μακραίνει συνεχώς (π.χ. Poodle, Bichon), προτείνουμε κάθε 4-6 εβδομάδες για να διατηρείται σε άριστη κατάσταση χωρίς κόμπους.' },
            { q: 'Χειρίζεστε σκυλιά με επιθετική συμπεριφορά κατά το grooming;', a: 'Αντιμετωπίζουμε το κάθε ζώο με υπομονή και ηρεμία. Εάν ο σκύλος είναι υπερβολικά στρεσαρισμένος θα κάνουμε ό,τι καλύτερο για την ασφάλειά του, αλλά ενδέχεται να χρειαστούμε περισσότερο χρόνο ή σε ακραίες περιπτώσεις να διακόψουμε τη διαδικασία.' }
        ]
    },
    'bath-brush': {
        title: 'Μπάνιο & Βούρτσισμα',
        h1: 'Πλύσιμο Σκύλου & Μπάνιο στην Περαία',
        seoTitle: 'Πλύσιμο Σκύλου Περαία | Bath and Brush | Musky Paws',
        seoDesc: 'Εξειδικευμένο πλύσιμο και μπάνιο σκύλου στην Περαία. Χρησιμοποιούμε υποαλλεργικά σαμπουάν για λαμπερό τρίχωμα. Κλείστε ραντεβού!',
        description: 'Εξειδικευμένα σαμπουάν, βαθύς καθαρισμός και εντατικό βούρτσισμα για αφαίρεση νεκρής τρίχας και ρύπων.',
        duration: '1 - 2 ώρες',
        price: 'Από 15€',
        img: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80',
        forWhom: 'Κατάλληλο για κοντότριχες φυλές (π.χ. French Bulldog, Beagle) ή για φρεσκάρισμα ανάμεσα στα κουρέματα για μακρύτριχες φυλές.',
        steps: [
            'Προσεκτικό βούρτσισμα πριν το μπάνιο',
            'Διπλό λούσιμο με σαμπουάν βαθύ καθαρισμού',
            'Μαλακτική κρέμα για ενυδάτωση',
            'Στέγνωμα με επαγγελματικό σεσουάρ για απομάκρυνση νεκρής τρίχας',
            'Καθαρισμός αυτιών & Κόψιμο νυχιών',
            'Τελικό χτένισμα και άρωμα'
        ],
        faqs: [
            { q: 'Περιλαμβάνεται καθαρισμός αυτιών και κόψιμο νυχιών;', a: 'Ναι, αυτές οι υπηρεσίες υγιεινής συμπεριλαμβάνονται δωρεάν στο ραντεβού Μπάνιου & Βουρτσίσματος.' },
            { q: 'Τι σαμπουάν χρησιμοποιείτε;', a: 'Χρησιμοποιούμε επαγγελματικά, υποαλλεργικά προϊόντα κορυφαίας ποιότητας, προσαρμοσμένα στις ανάγκες της επιδερμίδας του σκύλου (π.χ. για ευαίσθητο δέρμα, λευκαντικά).' }
        ]
    },
    'deshedding': {
        title: 'Απομάκρυνση Νεκρής Τρίχας (Deshedding)',
        h1: 'Αφαίρεση Νεκρής Τρίχας (Deshedding) Σκύλου στη Θεσσαλονίκη',
        seoTitle: 'Αφαίρεση Νεκρής Τρίχας & Deshedding Σκύλου Θεσσαλονίκη | Musky Paws',
        seoDesc: 'Δώστε λύση στην έντονη τριχόπτωση με την υπηρεσία αφαίρεσης νεκρής τρίχας (deshedding) σκύλου στη Θεσσαλονίκη.',
        description: 'Μία εξειδικευμένη διαδικασία που στοχεύει αποκλειστικά στον διπλό μανδύα των σκύλων, μειώνοντας την τριχόπτωση στο σπίτι σας έως και 80%.',
        duration: '1.5 - 2.5 ώρες',
        price: 'Από 25€',
        img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80',
        forWhom: 'Κυρίως για φυλές με διπλό μανδύα (π.χ. Golden Retriever, Husky, German Shepherd, Corgi) που μαδάνε έντονα κατά την αλλαγή εποχής.',
        steps: [
            'Εντατικό βούρτσισμα και πιστολάκι (blower) σε στεγνό τρίχωμα για αφαίρεση συμπαγούς κάτω μανδύα',
            'Λούσιμο με ειδικό σαμπουάν deshedding',
            'Εφαρμογή μάσκας που ανοίγει τους πόρους και απελευθερώνει τη νεκρή τρίχα',
            'Blower κατά τη διάρκεια του λουσίματος',
            'Πολύ καλό στέγνωμα (το πιο σημαντικό βήμα)',
            'Τελικό βούρτσισμα με ειδικά εργαλεία deshedding (χωρίς να κόβεται το υγιές τρίχωμα)'
        ],
        faqs: [
            { q: 'Θα σταματήσει εντελώς η τριχόπτωση;', a: 'Όχι, η φυσιολογική τριχόπτωση δεν σταματά ποτέ εντελώς, αλλά μειώνεται θεαματικά (μέχρι 80-90%) για αρκετές εβδομάδες.' },
            { q: 'Μπορείτε απλά να τον ξυρίσετε για να μην μαδάει;', a: 'Όχι! Το ξύρισμα σκύλων με διπλό μανδύα είναι επιζήμιο. Καταστρέφει το τρίχωμα, δεν μειώνει την τριχόπτωση, εμποδίζει τη θερμορύθμιση και αυξάνει τον κίνδυνο εγκαύματος από τον ήλιο. Η σωστή λύση είναι το deshedding.' }
        ]
    },
    'nails-ears': {
        title: 'Κόψιμο Νυχιών & Καθαρισμός Αυτιών',
        h1: 'Κόψιμο Νυχιών & Καθαρισμός Αυτιών Σκύλου στην Περαία',
        seoTitle: 'Κόψιμο Νυχιών Σκύλου Περαία | Musky Paws',
        seoDesc: 'Ασφαλές κόψιμο νυχιών και προσεκτικός καθαρισμός αυτιών σκύλου στην Περαία. Η απαραίτητη υγιεινή ρουτίνα για το κατοικίδιό σας.',
        description: 'Μια γρήγορη αλλά απαραίτητη ρουτίνα υγιεινής για τον φίλο σας. Τα μακριά νύχια μπορούν να προκαλέσουν πόνο και αρθριτικά προβλήματα.',
        duration: '15 λεπτά',
        price: '5€',
        img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80',
        forWhom: 'Για όλους τους σκύλους μεταξύ των κύριων ραντεβού grooming ή αν τα νύχια τους μεγαλώνουν γρήγορα και ακούγονται στο δάπεδο.',
        steps: [
            'Οπτικός έλεγχος του νυχιού και τουQuick ("ζωντανού" μέρους)',
            'Προσεκτικό κόψιμο με ειδικό νυχοκόπτη θηλαστικών',
            'Λιμάρισμα για να μην γδέρνουν (προαιρετικά)',
            'Χρήση ειδικού υγρού καθαρισμού αυτιών',
            'Σκούπισμα περιμετρικά του ακουστικού πόρου με βαμβάκι'
        ],
        faqs: [
            { q: 'Χρειάζεται να κλείσω ραντεβού για κόψιμο νυχιών;', a: 'Ναι, παρακαλούμε επικοινωνήστε μαζί μας για να σας βρούμε μια σύντομη διαθέσιμη υποδοχή 10-15 λεπτών μέσα στην ημέρα.' },
            { q: 'Τι γίνεται αν ματώσει το νύχι;', a: 'Σπάνια συμβαίνει, αλλά αν το Quick είναι πολύ μακρύ, μπορεί να υπάρξει σταγόνα αίμα. Διαθέτουμε ειδική αιμοστατική σκόνη που σταματά την αιμορραγία άμεσα και ανώδυνα.' }
        ]
    },
    'puppy-grooming': {
        title: 'Περιποίηση Κουταβιών (Puppy Intro)',
        h1: 'Το Πρώτο Grooming Κουταβιού στη Θεσσαλονίκη',
        seoTitle: 'Πρώτο Grooming Κουταβιού Θεσσαλονίκη | Musky Paws',
        seoDesc: 'Το πρώτο grooming του κουταβιού σας ξεκινάει ήρεμα στο Musky Paws! Εξειδικευμένη φροντίδα για τη σωστή κοινωνικοποίησή του.',
        description: 'Μια ήπια, πρώτη γνωριμία του κουταβιού με το κομμωτήριο. Σκοπός είναι να αποκτήσει θετικές εμπειρίες και να μην φοβάται το νερό, το πιστολάκι και τα ψαλίδια.',
        duration: '1 - 1.5 ώρες',
        price: 'Από 20€',
        img: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80',
        forWhom: 'Για κουτάβια από 3 έως 6 μηνών που έχουν ολοκληρώσει τα βασικά τους εμβόλια.',
        steps: [
            'Ελεύθερος χρόνος για εξερεύνηση του χώρου',
            'Παιχνίδι και χάδια στο τραπέζι του grooming',
            'Απαλό λούσιμο με ζεστό νερό',
            'Εξοικείωση με τον θόρυβο από το πιστολάκι',
            'Καθαρισμός της περιοχής γύρω από τα μάτια και την "πάνα"',
            'Κόψιμο νυχιών (μόνο αν το επιτρέπει το κουτάβι - χωρίς πίεση)'
        ],
        faqs: [
            { q: 'Πότε πρέπει να φέρω το κουτάβι μου για πρώτη φορά;', a: 'Αφού κάνει το 2ο ή 3ο του εμβόλιο (και με τη σύμφωνη γνώμη του κτηνιάτρου), συνήθως γύρω στις 12-16 εβδομάδες. Όσο νωρίτερα έρθει, τόσο πιο εύκολα θα συνηθίσει.' },
            { q: 'Θα το κουρέψετε κανονικά στο πρώτο του ραντεβού;', a: 'Όχι, ο σκοπός της πρώτης επίσκεψης είναι η εξοικείωση. Θα κάνουμε ένα "υγιεινό" τρίμαρισμα σε πατούσες/πρόσωπο/ουρά, αλλά αποφεύγουμε ένα πλήρες κούρεμα εκτός αν είναι απολύτως απαραίτητο (π.χ. πολλοί κόμποι).' }
        ]
    },
    'furminator': {
        title: 'Furminator (Εξειδικευμένο Βούρτσισμα)',
        h1: 'Θεραπεία Furminator Σκύλου στη Θεσσαλονίκη & Περαία',
        seoTitle: 'Furminator Σκύλου Θεσσαλονίκη & Περαία | Musky Paws',
        seoDesc: 'Εξειδικευμένο βούρτσισμα με Furminator σκύλου στη Θεσσαλονίκη. Ιδανικό για την αφαίρεση υποστρώματος.',
        description: 'Επαγγελματική αφαίρεση του εσωτερικού υποστρώματος που προκαλεί τη μεγάλη τριχόπτωση στα έπιπλα, χωρίς να βλάπτεται το εξωτερικό τρίχωμα.',
        duration: '45 - 90 λεπτά',
        price: 'Από 15€',
        img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80',
        forWhom: 'Για σκύλους με κοντότριχο ή μεσαίο τρίχωμα που μαδάνε έντονα, όπως Pug, Jack Russell, French Bulldog, και σχετικές μίξεις.',
        steps: [
            'Αξιολόγηση τριχώματος και δέρματος',
            'Εντατικό βούρτσισμα με το αυθεντικό εργαλείο Furminator',
            'Απομάκρυνση νεκρής τρίχας από το υπόστρωμα',
            '(Προαιρετικό) Λούσιμο για μέγιστα αποτελέσματα',
            'Τελικό πέρασμα με μαλακή βούρτσα'
        ],
        faqs: [
            { q: 'Κάνει κακό το Furminator στο τρίχωμα;', a: 'Όχι, εφόσον χρησιμοποιείται σωστά από επαγγελματία. Δεν κόβει το τρίχωμα, απλώς "πιάνει" και τραβάει την ήδη νεκρή τρίχα του υποστρώματος πριν πέσει στο πάτωμά σας.' },
            { q: 'Κάθε πότε πρέπει να γίνεται;', a: 'Ανάλογα με την εποχή και τη φυλή, συνήθως κάθε 4-8 εβδομάδες κατά τις περιόδους έντονης τριχόπτωσης (Άνοιξη, Φθινόπωρο).' }
        ]
    }
};

type Props = {
    params: Promise<{ slug: string }>;
};

// Generate Static Params for SSG
export async function generateStaticParams() {
    return Object.keys(servicesData).map((slug) => ({
        slug,
    }));
}

// Dynamic Metadata & JSON-LD schema
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const service = servicesData[slug as keyof typeof servicesData];

    if (!service) {
        return { title: 'Υπηρεσία δεν βρέθηκε' };
    }

    return {
        title: service.seoTitle || `${service.title} | Musky Paws Περαία`,
        description: service.seoDesc || service.description,
        alternates: {
            canonical: `https://muskypaws.gr/services/${slug}`,
        }
    };
}

export default async function ServicePage({ params }: Props) {
    const { slug } = await params;
    const service = servicesData[slug as keyof typeof servicesData];

    if (!service) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.seoDesc || service.description,
        provider: {
            '@type': 'LocalBusiness',
            name: 'Musky Paws',
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Solonos 28B',
                addressLocality: 'Peraia',
                addressRegion: 'Thessaloniki',
                postalCode: '57019',
                addressCountry: 'GR',
            },
        },
        areaServed: [
            { '@type': 'City', name: 'Peraia' },
            { '@type': 'City', name: 'Neoi Epivates' },
            { '@type': 'City', name: 'Agia Triada' },
            { '@type': 'City', name: 'Thessaloniki' }
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <section className="bg-brand-950 text-brand-50 pt-16 pb-32 md:pb-48">
                <div className="container mx-auto px-4 text-center">
                    <Link href="/services" className="inline-flex items-center text-brand-300 hover:text-white mb-6 uppercase text-sm font-bold tracking-wide transition-colors">
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                        Ολες οι υπηρεσιες
                    </Link>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 drop-shadow-sm">{service.h1 || service.title}</h1>
                    <p className="text-xl max-w-2xl mx-auto text-brand-200 leading-relaxed font-medium">
                        {service.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                        <div className="flex items-center gap-2 bg-brand-900 border border-brand-800 px-4 py-2 rounded-full shadow-inner">
                            <Clock className="w-5 h-5 text-accent-500" />
                            <span className="font-semibold">{service.duration}</span>
                        </div>
                        <div className="bg-accent-500 text-brand-950 px-4 py-2 rounded-full font-bold shadow-md">
                            {service.price}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="-mt-16 md:-mt-32 pb-20 bg-background text-foreground relative z-10">
                <div className="container mx-auto px-4">

                    <div className="max-w-4xl mx-auto bg-brand-50 dark:bg-brand-900/40 rounded-3xl shadow-2xl p-6 md:p-12 mb-16 border border-brand-200 dark:border-brand-800">
                        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12">
                            <Image src={service.img} alt={service.seoTitle || service.title} fill className="object-cover" />
                        </div>

                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-4">Για ποιους είναι;</h2>
                            <p className="text-lg text-brand-700 dark:text-brand-300 leading-relaxed border-l-4 border-accent-500 pl-4">
                                {service.forWhom}
                            </p>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">Τα βήματα της διαδικασίας</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {service.steps.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-white dark:bg-brand-950 p-4 rounded-xl shadow-sm border border-brand-100 dark:border-brand-800">
                                        <CheckCircle2 className="w-6 h-6 text-accent-500 mt-0.5 shrink-0" />
                                        <span className="font-medium text-brand-800 dark:text-brand-200">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-brand-200 dark:border-brand-800 border-dashed text-center">
                            <h3 className="text-xl font-bold mb-6 text-brand-800 dark:text-brand-200">Κλείστε ραντεβού για {service.title}</h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/booking"
                                    className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-3.5 text-base font-bold transition-transform hover:scale-105"
                                >
                                    Φόρμα Ραντεβού
                                </Link>
                                <a
                                    href="tel:+306948965371"
                                    className="inline-flex items-center justify-center rounded-full bg-white dark:bg-brand-950 text-foreground border border-brand-300 dark:border-brand-700 px-8 py-3.5 text-base font-bold transition-colors hover:bg-brand-50 dark:hover:bg-brand-900"
                                >
                                    Τηλεφωνική Κράτηση
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Service FAQ */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-10">Συχνές Ερωτήσεις</h2>
                        <div className="space-y-4">
                            {service.faqs.map((faq, idx) => (
                                <details key={idx} className="group bg-brand-50 dark:bg-brand-900/40 rounded-lg border border-brand-200 dark:border-brand-800">
                                    <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-lg marker:content-none select-none">
                                        {faq.q}
                                        <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 text-brand-500" />
                                    </summary>
                                    <div className="px-6 pb-6 text-brand-600 dark:text-brand-400 text-base leading-relaxed">
                                        <p>{faq.a}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}
