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
    const images = [
        {
            id: 1,
            url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80",
            alt: "Pomeranian Grooming Transformation"
        },
        {
            id: 2,
            url: "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?auto=format&fit=crop&q=80",
            alt: "Maltese Summer Cut"
        },
        {
            id: 3,
            url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80",
            alt: "Golden Retriever Deshedding Result"
        },
        {
            id: 4,
            url: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80",
            alt: "Poodle Teddy Bear Cut"
        },
        {
            id: 5,
            url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80",
            alt: "Dog Spa Therapy"
        },
        {
            id: 6,
            url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80",
            alt: "Puppy's First Grooming"
        },
        {
            id: 7,
            url: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&q=80",
            alt: "Nail Trimming and Paw Care"
        },
        {
            id: 8,
            url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80",
            alt: "Smooth Coat Shine"
        }
    ];

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
