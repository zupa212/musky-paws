import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Τιμοκατάλογος Υπηρεσιών | Musky Paws',
    description: 'Δείτε τις τιμές για όλες τις υπηρεσίες καλλωπισμού σκύλων στο Musky Paws. Τιμές προσαρμοσμένες στο μέγεθος του σκύλου.',
    alternates: {
        canonical: '/pricing',
    },
};

export default function PricingPage() {
    return (
        <>
            <section className="bg-brand-950 text-brand-50 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Τιμοκατάλογος</h1>
                    <p className="text-xl max-w-2xl mx-auto text-brand-300">
                        Διαφανείς τιμές με βάση το μέγεθος του σκύλου και τις ανάγκες του. Καμία κρυφή χρέωση.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-background text-foreground">
                <div className="container mx-auto px-4 max-w-5xl">

                    <div className="overflow-x-auto shadow-xl rounded-2xl border border-brand-200 dark:border-brand-800 mb-16">
                        <table className="w-full text-left bg-brand-50 dark:bg-brand-900/20">
                            <thead className="bg-brand-100 dark:bg-brand-900 text-brand-900 dark:text-brand-100 uppercase text-sm font-bold border-b border-brand-200 dark:border-brand-800">
                                <tr>
                                    <th className="p-6 w-1/3">Υπηρεσία</th>
                                    <th className="p-6 text-center">Μικρόσωμα<br /><span className="text-xs font-normal opacity-80">(έως 10kg)</span></th>
                                    <th className="p-6 text-center">Μεσαία<br /><span className="text-xs font-normal opacity-80">(11-25kg)</span></th>
                                    <th className="p-6 text-center">Μεγαλόσωμα<br /><span className="text-xs font-normal opacity-80">(26kg+)</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-200 dark:divide-brand-800">
                                <tr className="hover:bg-brand-100/50 dark:hover:bg-brand-800/50 transition-colors">
                                    <td className="p-6 font-semibold">Πλήρης Καλλωπισμός</td>
                                    <td className="p-6 text-center font-medium">Από 35€</td>
                                    <td className="p-6 text-center font-medium">Από 45€</td>
                                    <td className="p-6 text-center font-medium">Από 55€</td>
                                </tr>
                                <tr className="hover:bg-brand-100/50 dark:hover:bg-brand-800/50 transition-colors">
                                    <td className="p-6 font-semibold">Μπάνιο & Βούρτσισμα</td>
                                    <td className="p-6 text-center font-medium">Από 20€</td>
                                    <td className="p-6 text-center font-medium">Από 25€</td>
                                    <td className="p-6 text-center font-medium">Από 35€</td>
                                </tr>
                                <tr className="hover:bg-brand-100/50 dark:hover:bg-brand-800/50 transition-colors">
                                    <td className="p-6 font-semibold">Deshedding (Αφαίρεση τριχώματος)</td>
                                    <td className="p-6 text-center font-medium">Από 30€</td>
                                    <td className="p-6 text-center font-medium">Από 40€</td>
                                    <td className="p-6 text-center font-medium">Από 50€</td>
                                </tr>
                                <tr className="hover:bg-brand-100/50 dark:hover:bg-brand-800/50 transition-colors">
                                    <td className="p-6 font-semibold">Κόψιμο Νυχιών / Καθαρισμός Αυτιών</td>
                                    <td colSpan={3} className="p-6 text-center font-medium text-brand-600 dark:text-brand-400">Δωρεάν με τις κύριες υπηρεσίες ή 5€ αυτόνομα</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-brand-100 dark:bg-brand-900 border border-brand-200 dark:border-brand-800 rounded-2xl p-8 mb-16">
                        <h3 className="text-2xl font-bold mb-4 text-foreground">Σημαντικές Σημειώσεις:</h3>
                        <ul className="list-disc pl-6 space-y-3 text-brand-700 dark:text-brand-300 leading-relaxed font-medium">
                            <li>Οι παραπάνω τιμές είναι <strong>ενδεικτικές</strong> ("Από"). Η τελική τιμή μπορεί να διαμορφωθεί διαφορετικά.</li>
                            <li>Η τιμή εξαρτάται άμεσα από την <strong>κατάσταση του τριχώματος</strong> (π.χ. έντονοι κόμποι - matting). Η αφαίρεση κόμπων είναι χρονοβόρα και επιβαρύνει την τιμή.</li>
                            <li>Η <strong>συμπεριφορά του σκύλου</strong> παίζει ρόλο. Εάν ο σκύλος είναι υπερβολικά ανήσυχος ή επιθετικός και απαιτείται έξτρα χρόνος / 2ος groomer, υπάρχει αντίστοιχη προσαύξηση.</li>
                            <li>Για ακριβή εκτίμηση της τιμής, γίνεται αξιολόγηση στο κατάστημα πριν το ραντεβού.</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <h3 className="text-3xl font-bold mb-6">Έτοιμοι για το ραντεβού σας;</h3>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/booking"
                                className="inline-flex items-center justify-center rounded-full bg-accent-500 text-brand-950 px-8 py-3.5 text-base font-bold shadow-sm transition-transform hover:scale-105 hover:bg-accent-400"
                            >
                                Κλείσε Ραντεβού Online
                            </Link>
                            <a
                                href="tel:+306948965371"
                                className="inline-flex items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-foreground px-8 py-3.5 text-base font-bold shadow-sm transition-colors hover:bg-brand-200 dark:hover:bg-brand-800 border border-brand-200 dark:border-brand-800"
                            >
                                +30 694 896 5371
                            </a>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}
