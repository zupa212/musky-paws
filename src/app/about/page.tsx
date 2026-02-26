import { Metadata } from 'next';
import Image from 'next/image';
import { Shield, Sparkles, Heart, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Σχετικά με εμάς | Musky Paws Dog Grooming Περαία',
    description: 'Μάθετε περισσότερα για τη φιλοσοφία του Musky Paws, τις σύγχρονες εγκαταστάσεις μας και τα αυστηρά πρότυπα υγιεινής που ακολουθούμε.',
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-brand-950 text-brand-50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Σχετικά με το Musky Paws</h1>
                    <p className="text-xl max-w-2xl mx-auto text-brand-300">
                        Η αγάπη μας για τα σκυλιά έγινε επάγγελμα. Στο Musky Paws πιστεύουμε ότι κάθε σκύλος αξίζει μια εμπειρία grooming χωρίς στρες, με σεβασμό και απόλυτη ασφάλεια.
                    </p>
                </div>
            </section>

            {/* Brand Story */}
            <section className="py-20 bg-background text-foreground">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80"
                                alt="Musky Paws Grooming In Action"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-6">Η Ιστορία μας</h2>
                            <p className="text-lg text-brand-700 dark:text-brand-300 mb-6 leading-relaxed">
                                Το Musky Paws δημιουργήθηκε από την ανάγκη να προσφέρουμε υπηρεσίες καλλωπισμού στην ανατολική Θεσσαλονίκη που ξεφεύγουν από τα συνηθισμένα. Θέλαμε ένα χώρο όπου οι σκύλοι δεν νιώθουν ότι πηγαίνουν "στον γιατρό", αλλά σε ένα spa.
                            </p>
                            <p className="text-lg text-brand-700 dark:text-brand-300 mb-6 leading-relaxed">
                                Με συνεχή εκπαίδευση σε σεμινάρια εντός και εκτός Ελλάδος, ενημερωνόμαστε διαρκώς για τις νέες τάσεις στο Dog Grooming, τις νέες τεχνικές κουρέματος και τα πιο σύγχρονα προϊόντα καλλωπισμού.
                            </p>
                            <ul className="space-y-4 font-medium text-foreground mt-8 text-lg">
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-accent-500" /> Πιστοποιημένοι Groomers</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-accent-500" /> Χωρίς χρήση βίας ή καταστολής</li>
                                <li className="flex items-center gap-3"><CheckCircle2 className="w-6 h-6 text-accent-500" /> Ανοιχτή επικοινωνία με τον ιδιοκτήτη</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Safety & Hygiene */}
            <section className="py-20 bg-brand-50 dark:bg-brand-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold tracking-tight text-center mb-16">Πρότυπα Υγιεινής & Ασφάλειας</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-background p-8 rounded-2xl border border-brand-200 dark:border-brand-800 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Αυστηρή Αποστείρωση</h3>
                            <p className="text-brand-600 dark:text-brand-400 leading-relaxed">
                                Όλα τα εργαλεία (ψαλίδια, χτένες, μηχανές) αποστειρώνονται σε ειδικό κλίβανο UV και υγρό απολύμανσης μετά από ΚΑΘΕ σκύλο. Το τραπέζι και η μπανιέρα καθαρίζονται σχολαστικά.
                            </p>
                        </div>

                        <div className="bg-background p-8 rounded-2xl border border-brand-200 dark:border-brand-800 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Υποαλλεργικά Προϊόντα</h3>
                            <p className="text-brand-600 dark:text-brand-400 leading-relaxed">
                                Χρησιμοποιούμε αποκλειστικά κορυφαίας ποιότητας, επαγγελματικά σαμπουάν και μαλακτικά, προσαρμοσμένα στον τύπο δέρματος και τριχώματος του κάθε ζώου.
                            </p>
                        </div>

                        <div className="bg-background p-8 rounded-2xl border border-brand-200 dark:border-brand-800 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6 text-red-600 dark:text-red-400">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Πρώτες Βοήθειες Ζώων</h3>
                            <p className="text-brand-600 dark:text-brand-400 leading-relaxed">
                                Γνωρίζουμε πώς να χειριστούμε οποιαδήποτε απρόοπτη κατάσταση. Η ασφάλεια του τετράποδου φίλου σας είναι η απόλυτη προτεραιότητά μας σε κάθε στάδιο του grooming.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What to Expect */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Τι να περιμένετε στο ραντεβού σας</h2>
                    <div className="space-y-8">
                        {[
                            { step: 1, title: "Υποδοχή και Σύντομη Συζήτηση", desc: "Μιλάμε για τις ανάγκες του σκύλου σας, τυχόν δερματικά προβλήματα, αλλεργίες, ή ευαισθησίες. Συναποφασίζουμε το στυλ του κουρέματος." },
                            { step: 2, title: "Εξοικείωση", desc: "Αφήνουμε τον σκύλο να μυρίσει τον χώρο και τα εργαλεία για λίγα λεπτά, ώστε να νιώσει πιο άνετα πριν ξεκινήσουμε." },
                            { step: 3, title: "Το Grooming ξεκινά", desc: "Μπάνιο, στέγνωμα, κόψιμο νυχιών, καθαρισμός αυτιών και φυσικά το κούρεμα. Όλα γίνονται σε ήρεμους ρυθμούς." },
                            { step: 4, title: "Ειδοποίηση Παραλαβής", desc: "Σας καλούμε / στέλνουμε SMS περίπου 20-30 λεπτά πριν ολοκληρώσουμε, ώστε να μην περιμένει ο σκύλος σας στο κατάστημα περισσότερο από όσο χρειάζεται." }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-900 text-brand-50 flex items-center justify-center text-xl font-bold">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-brand-600 dark:text-brand-400 text-lg">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
