import { Metadata } from 'next';
import Image from 'next/image';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import { PawPrint, Camera, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Gallery Μεταμορφώσεων - Πριν & Μετά | Musky Paws',
    description: 'Δείτε τη δουλειά μας! Διαδραστικές φωτογραφίες πριν και μετά από τα κουρέματα και τα μπάνια των σκύλων πελατών μας στην Περαία.',
    alternates: {
        canonical: 'https://muskypaws.gr/gallery',
    },
};

export default function GalleryPage() {
    // Numerical logic: 1 prin, 1 meta, 2 prin, 2 meta...
    // The user has IMG_3262.JPG to IMG_3323.JPG in public/images/before-after/dogs/
    const startNum = 3262;
    const transformations = Array.from({ length: 4 }, (_, i) => {
        const setStart = startNum + (i * 2);
        return {
            id: i + 1,
            title: `Μεταμόρφωση ${i + 1}`,
            before: `/images/before-after/dogs/IMG_${setStart}.JPG`,
            after: `/images/before-after/dogs/IMG_${setStart + 1}.JPG`,
            category: "Dogs"
        };
    });

    // General photos (remaining ones after sets)
    const generalPhotos = [
        { id: 1, url: "/images/before-after/dogs/IMG_3310.JPG", alt: "Happy Client" },
        { id: 2, url: "/images/before-after/dogs/IMG_3311.JPG", alt: "Grooming session" },
        { id: 3, url: "/images/before-after/dogs/IMG_3312.JPG", alt: "Happy pup" },
        { id: 4, url: "/images/before-after/dogs/IMG_3313.JPG", alt: "Clean and fluffy" },
        { id: 5, url: "/images/before-after/dogs/IMG_3314.JPG", alt: "Premium grooming result" },
        { id: 6, url: "/images/before-after/dogs/IMG_3315.JPG", alt: "Musky Paws customer" },
    ];

    return (
        <section className="pt-32 pb-24 bg-brand-50 min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl">
                
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 mb-6 bg-white px-4 py-1.5 rounded-full border border-brand-200">
                        <Camera className="w-4 h-4 text-brand-accent-pink" />
                        Our Portfolio
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight leading-[1.1] mb-6">
                        Gallery <span className="wavy-underline">Μεταμορφώσεων</span>
                    </h1>
                    <p className="text-navy-900/60 text-lg leading-relaxed">
                        Σύρετε τον κέρσορα σε κάθε εικόνα για να δείτε το εντυπωσιακό αποτέλεσμα "Πριν & Μετά" της δουλειάς μας. Κάθε κατοικίδιο αντιμετωπίζεται με αγάπη και φροντίδα.
                    </p>
                </div>

                {/* Before/After Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-24">
                    {transformations.map((item) => (
                        <div key={item.id} className="group">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-navy-900 flex items-center gap-3">
                                    <Star className="w-5 h-5 text-brand-accent-green" />
                                    {item.title}
                                </h3>
                                <div className="text-sm font-bold text-navy-900/40 uppercase tracking-widest">
                                    {item.category}
                                </div>
                            </div>
                            <BeforeAfterSlider 
                                beforeImage={item.before}
                                afterImage={item.after}
                            />
                        </div>
                    ))}
                </div>

                {/* General Gallery Grid */}
                {generalPhotos.length > 0 && (
                    <div className="mb-24">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-1 object-accent-pink bg-brand-accent-pink rounded-full" />
                            <h2 className="text-3xl font-bold text-navy-900">Περισσότερες Στιγμές</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {generalPhotos.map((photo) => (
                                <div key={photo.id} className="relative aspect-square rounded-3xl overflow-hidden group border border-brand-200 shadow-sm hover:shadow-md transition-shadow">
                                    <Image
                                        src={photo.url}
                                        alt={photo.alt}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 scale-75 group-hover:scale-100 transition-transform">
                                            <Camera className="w-6 h-6 text-brand-accent-pink" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Call to Action Section */}
                <div className="bg-navy-900 rounded-[40px] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <PawPrint className="absolute top-10 left-10 w-32 h-32 rotate-12" />
                        <PawPrint className="absolute bottom-10 right-10 w-32 h-32 -rotate-12" />
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">
                        Θέλετε το ίδιο αποτέλεσμα για το <br/> <span className="text-brand-accent-pink">δικό σας κατοικίδιο;</span>
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <a
                            href="/booking"
                            className="bg-brand-accent-pink text-navy-900 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-lg"
                        >
                            Κλείστε Ραντεβού
                        </a>
                        <a
                            href="https://instagram.com/muskypaws_dog_grooming"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            Δείτε μας στο Instagram
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

