import Link from 'next/link';
import { PawPrint, Home, Phone } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
            <div className="text-center max-w-lg">
                {/* Big 404 */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-black text-brand-200 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <PawPrint className="w-20 h-20 text-brand-accent-pink fill-brand-accent-pink/20" />
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
                    Ωχ! Αυτή η σελίδα δε βρέθηκε
                </h2>
                <p className="text-navy-900/60 mb-10 text-lg">
                    Φαίνεται ότι ο σκύλος μας πήρε αυτή τη σελίδα και την έκρυψε! 🐾
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-full font-bold hover:bg-navy-800 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Αρχική Σελίδα
                    </Link>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-white text-navy-900 px-6 py-3 rounded-full font-bold border border-brand-200 hover:bg-brand-100 transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        Επικοινωνία
                    </Link>
                </div>
            </div>
        </main>
    );
}
