import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Περιοχές Εξυπηρέτησης | Musky Paws Dog Grooming',
    description: 'Το Musky Paws εξυπηρετεί όλη την ανατολική Θεσσαλονίκη προσφέροντας premium υπηρεσίες καλλωπισμού σκύλων.',
    alternates: {
        canonical: '/areas',
    },
};

const areas = [
    { name: 'Περαία', slug: 'peraea', desc: 'Η έδρα μας! Εύκολη πρόσβαση για όλους τους κατοίκους της Περαίας.' },
    { name: 'Νέοι Επιβάτες', slug: 'neoi-epivates', desc: 'Μόλις 3 λεπτά οδικώς. Η καλύτερη επιλογή για τους σκύλους των Νέων Επιβατών.' },
    { name: 'Αγία Τριάδα', slug: 'agia-triada', desc: 'Σε μικρή απόσταση, παρέχουμε άψογο grooming στους τετράποδους φίλους της Αγίας Τριάδας.' },
    { name: 'Καλαμαριά', slug: 'kalamaria', desc: 'Πολλοί πελάτες μας έρχονται από Καλαμαριά αναζητώντας ποιοτικό χρόνο και φροντίδα για τον σκύλο τους.' },
    { name: 'Ανατολική Θεσσαλονίκη', slug: 'thessaloniki', desc: 'Αξίζει η σύντομη διαδρομή για τις premium υπηρεσίες υγιεινής και ομορφιάς που προσφέρουμε.' },
];

export default function AreasHubPage() {
    return (
        <>
            <section className="bg-brand-950 text-brand-50 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Περιοχές Εξυπηρέτησης</h1>
                    <p className="text-xl max-w-2xl mx-auto text-brand-300">
                        Το φυσικό μας κατάστημα βρίσκεται στην καρδιά της Περαίας, προσφέροντας εύκολη πρόσβαση από όλες τις γύρω περιοχές.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-background text-foreground">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {areas.map((area) => (
                            <Link
                                key={area.slug}
                                href={`/areas/${area.slug}`}
                                className="group p-8 rounded-3xl border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/30 hover:shadow-xl hover:border-accent-300 transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-brand-200 dark:bg-brand-800 flex items-center justify-center mb-6 group-hover:bg-accent-500 group-hover:text-brand-950 transition-colors">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold mb-3">{area.name}</h2>
                                <p className="text-brand-600 dark:text-brand-400 mb-6 font-medium">
                                    {area.desc}
                                </p>
                                <div className="flex items-center text-accent-600 dark:text-accent-400 font-bold group-hover:translate-x-2 transition-transform">
                                    Περισσότερα <ArrowRight className="w-5 h-5 ml-2" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-20 bg-brand-100 dark:bg-brand-900 rounded-3xl p-8 md:p-12 text-center border border-brand-200 dark:border-brand-800">
                        <h3 className="text-3xl font-bold mb-6">Δεν βλέπετε την περιοχή σας;</h3>
                        <p className="text-lg text-brand-700 dark:text-brand-300 mb-8 max-w-2xl mx-auto">
                            Ανεξάρτητα από το πού μένετε, όλοι οι σκύλοι είναι ευπρόσδεκτοι στο Musky Paws. Διαθέτουμε άνετο πάρκινγκ στην περιοχή για την εύκολη παραλαβή και παράδοση του σκύλου σας.
                        </p>
                        <Link href="/booking" className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-3.5 text-base font-bold shadow-sm transition-transform hover:scale-105">
                            Κλείσε Ραντεβού
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
