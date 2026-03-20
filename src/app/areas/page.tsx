import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { localAreaPages } from "@/config/seo";

export const metadata: Metadata = {
    title: "Περιοχές Εξυπηρέτησης | Musky Paws Dog Grooming",
    description: "Δείτε τις βασικές περιοχές που εξυπηρετεί το Musky Paws, με ξεχωριστές σελίδες για Περαία, Καλαμαριά, Μηχανιώνα και Τρίλοφο.",
    alternates: {
        canonical: "https://muskypaws.gr/areas",
    },
};

export default function AreasIndexPage() {
    const areas = Object.entries(localAreaPages).map(([slug, area]) => ({
        slug,
        ...area,
    }));

    return (
        <div className="pt-32 pb-24 bg-brand-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4">
                <div className="max-w-3xl mb-14">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 mb-6 bg-white px-4 py-1.5 rounded-full border border-brand-200">
                        <MapPin className="w-4 h-4 text-brand-accent-pink" />
                        Περιοχές εξυπηρέτησης
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-navy-900 tracking-tight leading-[1.1] mb-6">
                        Dog grooming για την <span className="wavy-underline">Ανατολική Θεσσαλονίκη</span>
                    </h1>
                    <p className="text-lg text-navy-900/65 leading-relaxed">
                        Συγκεντρώσαμε ξεχωριστές τοπικές σελίδες για τις βασικές περιοχές που εξυπηρετούμε, ώστε να βρείτε πιο εύκολα τη σωστή υπηρεσία και τους αντίστοιχους οδηγούς για το grooming του σκύλου σας.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {areas.map((area) => (
                        <Link
                            key={area.slug}
                            href={`/areas/${area.slug}`}
                            className="group rounded-[28px] bg-white border border-brand-200 p-8 shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <span className="text-sm font-black uppercase tracking-[0.18em] text-navy-900/40">{area.name}</span>
                                <ArrowRight className="w-5 h-5 text-navy-900/30 group-hover:text-brand-accent-pink group-hover:translate-x-1 transition-all" />
                            </div>
                            <h2 className="text-2xl font-bold text-navy-900 mb-4">{area.heroTitle}</h2>
                            <p className="text-base leading-7 text-navy-900/65">{area.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
