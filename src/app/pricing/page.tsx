import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Receipt } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Τιμές Dog Grooming Περαία | Κούρεμα, Μπάνιο, Deshedding | Musky Paws',
    description: 'Αναλυτικές τιμές για dog grooming στην Περαία Θεσσαλονίκης: full grooming, μπάνιο, deshedding, furminator, puppy grooming και μεμονωμένες υπηρεσίες.',
    alternates: {
        canonical: 'https://muskypaws.gr/pricing',
    },
};

const pricingCategories = [
    {
        title: "Βασικές Υπηρεσίες",
        items: [
            { name: "Full Grooming (Μικρόσωμα)", price: "Από 30€", desc: "Πλήρες κούρεμα, μπάνιο, νύχια, αυτιά." },
            { name: "Full Grooming (Μεσαία/Μεγαλόσωμα)", price: "Κατόπιν εκτίμησης", desc: "Προσαρμοσμένο στις ανάγκες της φυλής." },
            { name: "Μπάνιο & Βούρτσισμα (Bath & Brush)", price: "Από 15€", desc: "Για βαθύ καθαρισμό και φρεσκάδα." },
        ]
    },
    {
        title: "Εξειδικευμένες Υπηρεσίες",
        items: [
            { name: "Αφαίρεση Νεκρής Τρίχας (Deshedding)", price: "Από 25€", desc: "Ιδανικό για φυλές με έντονη τριχόπτωση." },
            { name: "Θεραπεία Furminator", price: "Από 15€", desc: "Για εντατική απομάκρυνση υποστρώματος." },
            { name: "Puppy Grooming", price: "Από 20€", desc: "Η πρώτη, stress-free εμπειρία για κουτάβια." },
        ]
    },
    {
        title: "Μεμονωμένες Παροχές (A la Carte)",
        items: [
            { name: "Κόψιμο Νυχιών", price: "5€", desc: "Ασφαλής περιποίηση νυχιών." },
            { name: "Καθαρισμός Αυτιών", price: "5€", desc: "Για υγιεινή και πρόληψη μολύνσεων." },
            { name: "Super Premium Σαμπουάν", price: "+5€", desc: "Αναβάθμιση σε εξειδικευμένα, θεραπευτικά σαμπουάν." },
        ]
    }
];

export default function PricingPage() {
    return (
        <>
            <section className="bg-brand-950 text-brand-50 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <Receipt className="w-16 h-16 mx-auto mb-6 text-accent-500 opacity-90" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Τιμοκατάλογος Υπηρεσιών Dog Grooming</h1>
                    <p className="text-xl max-w-2xl mx-auto text-brand-300">
                        Ξεκάθαρες τιμές grooming σκύλου στην Περαία Θεσσαλονίκης. Επιλέξτε την υπηρεσία που ταιριάζει στις ανάγκες του δικού σας κατοικίδιου.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-background text-foreground">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="space-y-12">
                        {pricingCategories.map((category, idx) => (
                            <div key={idx} className="bg-white dark:bg-brand-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-brand-100 dark:border-brand-800">
                                <h2 className="text-2xl font-bold mb-8 text-brand-900 dark:text-brand-50 border-b border-brand-100 dark:border-brand-800 pb-4">
                                    {category.title}
                                </h2>
                                <div className="space-y-6">
                                    {category.items.map((item, idxi) => (
                                        <div key={idxi} className="flex flex-col md:flex-row md:items-end justify-between gap-4 group">
                                            <div>
                                                <h3 className="font-semibold text-lg text-foreground group-hover:text-accent-600 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <p className="text-brand-600 dark:text-brand-400 text-sm mt-1">
                                                    {item.desc}
                                                </p>
                                            </div>
                                            <div className="whitespace-nowrap font-bold text-xl text-accent-600 dark:text-accent-400">
                                                {item.price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* FAQ & Notes Section */}
                    <div className="mt-16 bg-brand-50 dark:bg-brand-950 rounded-[2rem] p-8 md:p-12 border border-brand-200 dark:border-brand-800">
                        <h2 className="text-2xl font-bold mb-6">Συχνές Ερωτήσεις για τις Τιμές</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <CheckCircle2 className="w-6 h-6 shrink-0 text-brand-500 mt-1" />
                                <div>
                                    <strong className="block text-lg mb-1">Πώς προκύπτει το &quot;Από&quot; στις τιμές;</strong>
                                    <span className="text-brand-700 dark:text-brand-300">Το τελικό κόστος κουρέματος σκύλου εξαρτάται από παράγοντες όπως το μέγεθος (κιλά), η φυλή, η κατάσταση του τριχώματος (π.χ. πολλοί κόμποι) και η συμπεριφορά του ζώου.</span>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <CheckCircle2 className="w-6 h-6 shrink-0 text-brand-500 mt-1" />
                                <div>
                                    <strong className="block text-lg mb-1">Γίνεται κατ&apos; οίκον grooming;</strong>
                                    <span className="text-brand-700 dark:text-brand-300">Όχι, όλες οι υπηρεσίες πραγματοποιούνται αποκλειστικά στον ασφαλή και άρτια εξοπλισμένο χώρο μας (Σόλωνος 28Β, Περαία).</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-16 text-center">
                        <h3 className="text-2xl font-bold mb-6">Θέλετε να ακριβή προσφορά;</h3>
                        <p className="mb-8 text-brand-600 dark:text-brand-400 max-w-lg mx-auto">
                            Κλείστε ραντεβού ηλεκτρονικά ή καλέστε μας για να συζητήσουμε τις ιδιαιτερότητες του σκύλου σας.
                        </p>
                        <Link href="/booking" className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-8 py-4 font-bold shadow-lg transition-transform hover:scale-105 hover:bg-accent-600 hover:text-white">
                            Κράτηση Τώρα <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
