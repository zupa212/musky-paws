import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Επικοινωνία | Musky Paws Περαία',
    description: 'Επικοινωνήστε με το Musky Paws Dog Grooming στην Περαία Θεσσαλονίκης. Βρείτε πληροφορίες πρόσβασης, ωράριο, και κλείστε το ραντεβού σας.',
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactPage() {
    return (
        <>
            <section className="bg-brand-950 text-brand-50 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Επικοινωνία</h1>
                    <p className="text-xl max-w-2xl mx-auto text-brand-300">
                        Είμαστε εδώ για εσάς και τον μικρό σας φίλο. Μη διστάσετε να επικοινωνήσετε μαζί μας για οποιαδήποτε απορία ή για να κλείσετε ραντεβού.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-background text-foreground">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Contact Details Card */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-8">Στοιχεία Επικοινωνίας</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center shrink-0">
                                            <MapPin className="w-6 h-6 text-brand-800 dark:text-brand-200" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-1">Διεύθυνση</h3>
                                            <p className="text-brand-600 dark:text-brand-400">
                                                Σόλωνος 28Β<br />
                                                Περαία 57019, Θεσσαλονίκη
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center shrink-0">
                                            <Phone className="w-6 h-6 text-brand-800 dark:text-brand-200" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-1">Τηλέφωνο</h3>
                                            <a href="tel:+306948965371" className="text-brand-600 dark:text-brand-400 hover:text-accent-500 transition-colors">
                                                +30 694 896 5371
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center shrink-0">
                                            <Clock className="w-6 h-6 text-brand-800 dark:text-brand-200" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-1">Ωράριο</h3>
                                            <p className="text-brand-600 dark:text-brand-400">
                                                Δευ-Παρ: 09:00 - 18:00<br />
                                                Σάββατο: 10:00 - 15:00<br />
                                                Κυριακή: Κλειστά
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center shrink-0">
                                            <Mail className="w-6 h-6 text-brand-800 dark:text-brand-200" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-1">Email</h3>
                                            <a href="mailto:info@muskypaws.gr" className="text-brand-600 dark:text-brand-400 hover:text-accent-500 transition-colors">
                                                info@muskypaws.gr
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-xl mb-4">Ακολουθήστε μας</h3>
                                <div className="flex gap-4">
                                    <a href="https://www.facebook.com/p/Musky-Paws-61558785775782/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2]/20 transition-colors">
                                        <Facebook className="w-6 h-6" />
                                    </a>
                                    <a href="https://instagram.com/muskypaws_dog_grooming" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#E4405F]/10 text-[#E4405F] flex items-center justify-center hover:bg-[#E4405F]/20 transition-colors">
                                        <Instagram className="w-6 h-6" />
                                    </a>
                                </div>
                            </div>

                            <div className="bg-brand-50 dark:bg-brand-900/40 p-6 rounded-2xl border border-brand-200 dark:border-brand-800">
                                <h3 className="font-bold text-lg mb-2">Κλείστε Ραντεβού Online</h3>
                                <p className="text-brand-600 dark:text-brand-400 mb-4 text-sm">Πλέον μπορείτε να υποβάλετε αίτημα για ραντεβού ηλεκτρονικά, γρήγορα και απλά.</p>
                                <a href="/booking" className="inline-flex w-full items-center justify-center rounded-full bg-foreground text-background px-6 py-3 font-medium transition-transform hover:scale-105">
                                    Φόρμα Ραντεβού
                                </a>
                            </div>
                        </div>

                        {/* Map Area */}
                        <div className="bg-brand-50 dark:bg-brand-950 p-4 rounded-3xl border border-brand-200 dark:border-brand-800 h-[600px] flex flex-col">
                            <h2 className="text-2xl font-bold tracking-tight mb-4 px-2">Πώς θα μας βρείτε</h2>
                            <div className="flex-grow w-full rounded-2xl overflow-hidden relative">
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
                            <div className="pt-6 pb-2 px-2 flex justify-between items-center gap-4">
                                <p className="text-sm font-medium text-brand-600 dark:text-brand-400">Εύκολο πάρκινγκ στους γύρω δρόμους.</p>
                                <a href="https://maps.google.com/?q=Solonos+28B,+Peraia,+Greece+57019" target="_blank" rel="noopener noreferrer" className="text-accent-600 dark:text-accent-400 font-bold hover:underline text-sm uppercase tracking-wide">
                                    Ανοιγμα στo Google Maps
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
