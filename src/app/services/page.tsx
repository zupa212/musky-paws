import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Υπηρεσίες Καλλωπισμού Σκύλων | Musky Paws',
    description: 'Πλήρης καλλωπισμός, μπάνιο και βούρτσισμα, αφαίρεση νεκρής τρίχας, και περιποίηση κουταβιών στο Musky Paws στην Περαία.',
    alternates: {
        canonical: '/services',
    },
};

const services = [
    {
        title: "Πλήρης Καλλωπισμός",
        slug: "full-grooming",
        desc: "Η απόλυτη εμπειρία περιποίησης. Μπάνιο, κούρεμα φυλής ή δικής σας επιλογής, καθαρισμός αυτιών & κόψιμο νυχιών.",
        duration: "1.5 - 3 ώρες",
        price: "Από 35€",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80"
    },
    {
        title: "Μπάνιο & Βούρτσισμα",
        slug: "bath-brush",
        desc: "Εξειδικευμένα σαμπουάν, βαθύς καθαρισμός και βούρτσισμα για αφαίρεση νεκρής τρίχας. Για λαμπερό και υγιές τρίχωμα.",
        duration: "1 - 2 ώρες",
        price: "Από 20€",
        img: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80"
    },
    {
        title: "Απομάκρυνση Νεκρής Τρίχας (Deshedding)",
        slug: "deshedding",
        desc: "Ειδική θεραπεία για φυλές με διπλό μανδύα που μαδάνε έντονα. Μειώνει την τριχόπτωση στο σπίτι έως και 80%.",
        duration: "1.5 - 2.5 ώρες",
        price: "Από 30€",
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Υπηρεσίες Καλλωπισμού</h1>
                    <p className="text-xl max-w-2xl mx-auto text-brand-300">
                        Προσφέρουμε μια ολοκληρωμένη γκάμα υπηρεσιών σχεδιασμένη για κάθε τύπο τριχώματος και ανάγκη του αγαπημένου σας φίλου.
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
                                        <div className="px-3 py-1 rounded-full bg-accent-100 dark:bg-accent-900/50 text-accent-700 dark:text-accent-400">
                                            {service.price}
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

                    <div className="mt-20 text-center space-y-8 bg-brand-100 dark:bg-brand-900 p-8 rounded-3xl border border-brand-200 dark:border-brand-800">
                        <MapPin className="w-10 h-10 mx-auto text-brand-500" />
                        <h3 className="text-2xl font-bold">Περιοχές Εξυπηρέτησης</h3>
                        <p className="text-lg text-brand-600 dark:text-brand-400 max-w-2xl mx-auto">
                            Το κατάστημά μας βρίσκεται στην Περαία, εξυπηρετώντας καθημερινά πελάτες από τους Νέους Επιβάτες, την Αγία Τριάδα, την Καλαμαριά και όλη την Ανατολική Θεσσαλονίκη.
                        </p>
                        <div className="pt-4">
                            <Link href="/booking" className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-3.5 text-base font-bold shadow-sm transition-transform hover:scale-105">
                                Κλείσε Ραντεβού
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
