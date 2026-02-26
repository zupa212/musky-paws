import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Gallery - Πριν & Μετά | Musky Paws',
    description: 'Δείτε τη δουλειά μας! Φωτογραφίες πριν και μετά από τα κουρέματα και τα μπάνια των σκύλων πελατών μας.',
    alternates: {
        canonical: '/gallery',
    },
};

export default function GalleryPage() {
    const images = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80",
        alt: `Grooming Before and After ${i + 1}`
    }));

    return (
        <section className="py-20 bg-background text-foreground min-h-screen">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Gallery Μεταμορφώσεων</h1>
                <p className="text-xl text-center text-brand-600 dark:text-brand-400 mb-16 max-w-2xl mx-auto">
                    Στο Musky Paws είμαστε περήφανοι για τη δουλειά μας. Δείτε μερικούς από τους χαρούμενους, μοσχομυριστούς και πεντακάθαρους φίλους μας!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {images.map((img) => (
                        <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group border border-brand-200 dark:border-brand-800">
                            <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <span className="text-white font-medium">Πριν & Μετά</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-brand-600 dark:text-brand-400 mb-6 font-medium">Ακολουθήστε μας στο Instagram για καθημερινές ενημερώσεις και νέες φωτογραφίες!</p>
                    <a
                        href="https://instagram.com/muskypaws_dog_grooming"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3.5 text-base font-bold shadow-sm transition-transform hover:scale-105"
                    >
                        @muskypaws_dog_grooming
                    </a>
                </div>
            </div>
        </section>
    );
}
