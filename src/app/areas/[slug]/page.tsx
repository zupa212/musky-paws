import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Car, Clock } from 'lucide-react';

const areaData = {
    'peraea': {
        name: 'Περαία',
        heading: 'Κορυφαίο Dog Grooming στην Καρδιά της Περαίας',
        description: 'Ως τοπική επιχείρηση της Περαίας, το Musky Paws δεσμεύεται να προσφέρει στους τετράποδους φίλους της περιοχής μας την απόλυτη φροντίδα. Χωρίς ταλαιπωρία και περιττές μετακινήσεις, βρισκόμαστε δίπλα σας στην οδό Σόλωνος 28Β.',
        time: '0 λεπτά',
        distance: 'Τοπικά'
    },
    'neoi-epivates': {
        name: 'Νέοι Επιβάτες',
        heading: 'Επαγγελματικός Καλλωπισμός Σκύλων για τους Νέους Επιβάτες',
        description: 'Ανταποκρινόμενοι στις αυξημένες ανάγκες για σωστό και ασφαλές grooming, εξυπηρετούμε καθημερινά πελάτες από τους Νέους Επιβάτες (Μπαξέ). Η μικρή απόσταση κάνει τη διαδρομή παιχνιδάκι για τον σκύλο σας.',
        time: '3 λεπτά με το αυτοκίνητο',
        distance: '1.5 χλμ'
    },
    'agia-triada': {
        name: 'Αγία Τριάδα',
        heading: 'Spa Σκύλων Μια Ανάσα Από Την Αγία Τριάδα',
        description: 'Αναζητάτε εξειδικευμένο κομμωτήριο σκύλων κοντά στην Αγία Τριάδα; Το Musky Paws προσφέρει τις ιδανικές λύσεις καλλωπισμού με έμφαση στη θετική εμπειρία του σκύλου.',
        time: '6 λεπτά με το αυτοκίνητο',
        distance: '3.5 χλμ'
    },
    'kalamaria': {
        name: 'Καλαμαριά',
        heading: 'Premium Dog Grooming Κοντά Στην Καλαμαριά',
        description: 'Πολλοί κηδεμόνες από την Καλαμαριά επιλέγουν το Musky Paws για την προσοχή στη λεπτομέρεια και τις ήπιες μεθόδους που αποκλείουν τη χρήση νάρκωσης ή βίας. Αξίζει την ολιγόλεπτη διαδρομή!',
        time: '15-20 λεπτά με το αυτοκίνητο',
        distance: '14 χλμ'
    },
    'thessaloniki': {
        name: 'Ανατολική Θεσσαλονίκη',
        heading: 'Εξειδικευμένες Υπηρεσίες Grooming για την Ανατολική Θεσσαλονίκη',
        description: 'Για όσους αναζητούν την υψηλότερη ποιότητα περιποίησης για τον σκύλο τους και δεν συμβιβάζονται με τίποτα λιγότερο, το Musky Paws αποτελεί τον ιδανικό προορισμό εκτός του πολύβουου κέντρου.',
        time: '30 λεπτά',
        distance: 'Ανατολικά Προάστια'
    }
};

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return Object.keys(areaData).map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const area = areaData[slug as keyof typeof areaData];

    if (!area) {
        return { title: 'Περιοχή δεν βρέθηκε' };
    }

    return {
        title: `Dog Grooming ${area.name} | Κομμωτήριο Σκύλων Musky Paws`,
        description: area.description,
        alternates: {
            canonical: `/areas/${slug}`,
        }
    };
}

export default async function AreaPage({ params }: Props) {
    const { slug } = await params;
    const area = areaData[slug as keyof typeof areaData];

    if (!area) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Musky Paws Dog Grooming',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Solonos 28B',
            addressLocality: 'Peraia',
            addressRegion: 'Thessaloniki',
            postalCode: '57019',
            addressCountry: 'GR',
        },
        areaServed: {
            '@type': 'City',
            name: area.name
        },
        telephone: '+30 694 896 5371',
        url: `https://muskypaws.gr/areas/${slug}`
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <section className="bg-brand-950 text-brand-50 pt-16 pb-32">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-brand-900 px-4 py-2 rounded-full text-brand-200 mb-8 border border-brand-800 text-sm font-bold tracking-wide">
                        <MapPin className="w-4 h-4 text-accent-500" />
                        ΕΞΥΠΗΡΕΤΟΥΜΕ: {area.name.toUpperCase()}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold mb-6 max-w-4xl mx-auto leading-tight">
                        {area.heading}
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto text-brand-200 leading-relaxed">
                        {area.description}
                    </p>
                </div>
            </section>

            <section className="-mt-16 pb-20 bg-background text-foreground relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                        {/* Left Content */}
                        <div className="bg-brand-50 dark:bg-brand-900/30 p-8 md:p-12 rounded-3xl shadow-xl border border-brand-200 dark:border-brand-800">
                            <h2 className="text-2xl font-bold mb-6">Γιατί να επιλέξετε το Musky Paws;</h2>
                            <ul className="space-y-6 mb-10">
                                <li className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center shrink-0 mt-1">
                                        <span className="font-bold text-accent-700">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Απόλυτη Ασφάλεια</h3>
                                        <p className="text-brand-600 dark:text-brand-400">Δεν χρησιμοποιούμε ποτέ νάρκωση. Η διαδικασία γίνεται με σεβασμό στον ρυθμό του ζώου.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center shrink-0 mt-1">
                                        <span className="font-bold text-accent-700">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Κορυφαία Υγιεινή</h3>
                                        <p className="text-brand-600 dark:text-brand-400">Όλα τα εργαλεία αποστειρώνονται αυστηρά μετά από κάθε μπάνιο και κούρεμα.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center shrink-0 mt-1">
                                        <span className="font-bold text-accent-700">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Επαγγελματικά Προϊόντα</h3>
                                        <p className="text-brand-600 dark:text-brand-400">Χρήση υποαλλεργικών σαμπουάν και μάσκας ειδικά για τις ανάγκες του τριχώματος του σκύλου σας.</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="pt-6 border-t border-brand-200 dark:border-brand-800">
                                <h3 className="font-bold text-xl mb-4 text-center md:text-left">Κλείστε το επόμενο ραντεβού</h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/booking" className="flex-1 flex justify-center items-center rounded-full bg-foreground text-background py-3 font-bold transition-transform hover:scale-105">
                                        Φόρμα Ραντεβού
                                    </Link>
                                    <a href="tel:+306948965371" className="flex-1 flex justify-center items-center gap-2 rounded-full bg-brand-200 dark:bg-brand-800 text-foreground py-3 font-bold transition-colors hover:bg-brand-300 dark:hover:bg-brand-700">
                                        <Phone className="w-4 h-4" /> 694 896 5371
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Map/Directions */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white dark:bg-brand-950 p-6 rounded-3xl shadow-sm border border-brand-200 dark:border-brand-800 flex items-center gap-6">
                                <Car className="w-10 h-10 text-brand-400 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-brand-500 uppercase tracking-wider mb-1">Αποσταση απο {area.name}</p>
                                    <p className="text-xl font-bold">{area.time} <span className="text-brand-400 font-medium text-base">({area.distance})</span></p>
                                </div>
                            </div>

                            <div className="flex-grow rounded-3xl overflow-hidden border border-brand-200 dark:border-brand-800 shadow-xl relative min-h-[400px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.091178!2d22.92345!3d40.50!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDMwJzAwLjAiTiAyMsKwNTUnMjQuNCJF!5e0!3m2!1sen!2sgr!4v1620000000000!5m2!1sen!2sgr"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    title="Google Maps Musky Paws"
                                    className="absolute inset-0"
                                ></iframe>
                            </div>

                            <div className="bg-brand-100 dark:bg-brand-900 p-6 rounded-2xl flex items-center justify-between border border-brand-200 dark:border-brand-800">
                                <div>
                                    <p className="font-bold flex items-center gap-2 mb-1"><Clock className="w-4 h-4" /> Παράδοση & Παραλαβή</p>
                                    <p className="text-sm text-brand-600 dark:text-brand-400">Ενημερώνουμε έγκαιρα για να μην ταλαιπωρείται ο σκύλος στην αναμονή.</p>
                                </div>
                                <a href="https://maps.google.com/?q=Solonos+28B,+Peraia,+Greece+57019" target="_blank" rel="noopener noreferrer" className="shrink-0 bg-white dark:bg-brand-950 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-shadow">
                                    Οδηγίες
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
