import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle2, Sparkles, PawPrint, Tag } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Υπηρεσίες Dog Grooming Περαία | Full Grooming, Bath & Brush, Deshedding | Musky Paws',
    description: 'Υπηρεσίες dog grooming στην Περαία Θεσσαλονίκης για full grooming, bath & brush, deshedding, furminator, puppy grooming και κόψιμο νυχιών.',
    alternates: {
        canonical: 'https://muskypaws.gr/services',
    },
};

const services = [
    {
        title: "Πλήρης Καλλωπισμός",
        slug: "full-grooming",
        desc: "Η απόλυτη εμπειρία περιποίησης. Μπάνιο, κούρεμα φυλής ή δικής σας επιλογής, καθαρισμός αυτιών & κόψιμο νυχιών.",
        duration: "1.5 - 3 ώρες",
        price: "Από 30€",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80"
    },
    {
        title: "Μπάνιο & Βούρτσισμα",
        slug: "bath-brush",
        desc: "Εξειδικευμένα σαμπουάν, βαθύς καθαρισμός και βούρτσισμα για αφαίρεση νεκρής τρίχας. Για λαμπερό και υγιές τρίχωμα.",
        duration: "1 - 2 ώρες",
        price: "Από 15€",
        img: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80"
    },
    {
        title: "Απομάκρυνση Νεκρής Τρίχας (Deshedding)",
        slug: "deshedding",
        desc: "Ειδική θεραπεία για φυλές με διπλό μανδύα που μαδάνε έντονα. Μειώνει την τριχόπτωση στο σπίτι έως και 80%.",
        duration: "1.5 - 2.5 ώρες",
        price: "Από 25€",
        img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80"
    },
    {
        title: "Περιποίηση Κουταβιών",
        slug: "puppy-grooming",
        desc: "Ήπια εισαγωγή στον κόσμο του grooming. Μπάνιο, απαλό χτένισμα, καθαρισμός προσώπου και αυτιών με πολλή θετική ενίσχυση.",
        duration: "1 - 1.5 ώρες",
        price: "Από 20€",
        img: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80"
    },
    {
        title: "Furminator (Εξειδικευμένο Βούρτσισμα)",
        slug: "furminator",
        desc: "Επαγγελματική αφαίρεση του εσωτερικού υποστρώματος που προκαλεί τη μεγάλη τριχόπτωση στα έπιπλα, χωρίς να βλάπτεται το εξωτερικό τρίχωμα.",
        duration: "45 - 90 λεπτά",
        price: "Από 15€",
        img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80"
    },
    {
        title: "Κόψιμο Νυχιών & Καθαρισμός Αυτιών",
        slug: "nails-ears",
        desc: "Απαραίτητη υγιεινή φροντίδα. Περιλαμβάνεται δωρεάν στις κύριες υπηρεσίες μας, αλλά προσφέρεται και μεμονωμένα.",
        duration: "15 λεπτά",
        price: "5€",
        img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80"
    }
];


export default function ServicesPage() {
    return (
        <>
            <section className="bg-brand-950 text-brand-50 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Υπηρεσίες Grooming & Καλλωπισμός Σκύλων στην Περαία</h1>
                    <p className="text-xl max-w-3xl mx-auto text-brand-300">
                        Στο Musky Paws παρέχουμε υψηλού επιπέδου υπηρεσίες dog grooming για την Ανατολική Θεσσαλονίκη. Από το απλό μπάνιο μέχρι το πλήρες κούρεμα σκύλου και την αφαίρεση νεκρής τρίχας, η προσέγγισή μας είναι πάντα stress-free. Επιλέξτε την υπηρεσία που ταιριάζει στον φίλο σας.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-background text-foreground">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="space-y-12">
                        {services.map((service, idx) => (
                            <div key={idx} className="group flex flex-col md:flex-row bg-brand-50 dark:bg-brand-900/30 rounded-3xl overflow-hidden border border-brand-200 dark:border-brand-800 transition-shadow hover:shadow-lg">
                                <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
                                    <Image src={service.img} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                    <h2 className="text-3xl font-bold mb-4 group-hover:text-accent-500 transition-colors">{service.title}</h2>
                                    <p className="text-lg text-brand-600 dark:text-brand-400 mb-6 leading-relaxed bg-brand-50 md:bg-transparent dark:bg-transparent p-4 md:p-0 rounded-lg">{service.desc}</p>

                                    <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-semibold text-brand-700 dark:text-brand-300">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-brand-500" />
                                            <span>{service.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-brand-100 dark:bg-brand-800 px-3 py-1 rounded-full text-brand-900 dark:text-white">
                                            <Tag className="w-4 h-4 text-brand-600" />
                                            <span>{service.price}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-2 font-bold text-foreground hover:text-accent-500 transition-colors">
                                            Δείτε λεπτομέρειες <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 space-y-16">
                        <div className="bg-brand-100 dark:bg-brand-900 border border-brand-200 dark:border-brand-800 rounded-[2.5rem] p-10 md:p-12 shadow-sm">
                            <h3 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-accent-500" /> Σημαντικές Σημειώσεις
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-brand-700 dark:text-brand-300 leading-relaxed font-medium">
                                <li className="flex gap-3 items-start bg-white/50 dark:bg-black/20 p-4 rounded-2xl">
                                    <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                                    <span>Η τιμή εξαρτάται από το <strong>μέγεθος</strong>, τη <strong>φυλή</strong> και την <strong>κατάσταση τριχώματος</strong> του σκύλου.</span>
                                </li>
                                <li className="flex gap-3 items-start bg-white/50 dark:bg-black/20 p-4 rounded-2xl">
                                    <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                                    <span>Για ακριβή εκτίμηση, γίνεται <strong>αξιολόγηση στο κατάστημα</strong> ή μέσω φωτογραφιών.</span>
                                </li>
                                <li className="flex gap-3 items-start bg-white/50 dark:bg-black/20 p-4 rounded-2xl">
                                    <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                                    <span>Η <strong>συμπεριφορά του σκύλου</strong> παίζει ρόλο στην τελική διαμόρφωση της τιμής.</span>
                                </li>
                                <li className="flex gap-3 items-start bg-white/50 dark:bg-black/20 p-4 rounded-2xl">
                                    <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                                    <span>Η αφαίρεση κόμπων (matting) είναι χρονοβόρα και επηρεάζει τον χρόνο περιποίησης.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center space-y-8 bg-navy-900 text-white p-12 rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                                <PawPrint className="w-32 h-32" />
                            </div>
                            <Sparkles className="w-12 h-12 mx-auto text-accent-500" />
                            <h3 className="text-3xl font-extrabold tracking-tight">Χαρίστε στο Σκυλάκι σας την Περιποίηση που του Αξίζει</h3>
                            <p className="text-lg text-brand-200 max-w-2xl mx-auto leading-relaxed">
                                Είτε χρειάζεται ένα απλό μπάνιο είτε ένα ολοκληρωμένο grooming, είμαστε εδώ για να κάνουμε την εμπειρία του όσο πιο ευχάριστη γίνεται, χωρίς καμία απολύτως χρήση ηρέμησης.
                            </p>
                            <div className="pt-4">
                                <Link href="/booking" className="inline-flex items-center justify-center rounded-full bg-accent-500 text-brand-950 px-10 py-4 text-lg font-bold shadow-xl transition-all hover:scale-105 hover:bg-accent-400">
                                    Κλείστε το Ραντεβού σας Online
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
