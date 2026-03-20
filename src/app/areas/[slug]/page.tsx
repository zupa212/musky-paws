import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { localAreaPages, type LocalAreaSlug } from "@/config/seo";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return Object.keys(localAreaPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const area = localAreaPages[slug as LocalAreaSlug];

    if (!area) {
        return { title: "Περιοχή δεν βρέθηκε" };
    }

    return {
        title: area.title,
        description: area.description,
        alternates: {
            canonical: `https://muskypaws.gr/areas/${slug}`,
        },
    };
}

export default async function AreaPage({ params }: Props) {
    const { slug } = await params;
    const area = localAreaPages[slug as LocalAreaSlug];

    if (!area) {
        notFound();
    }

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: area.title,
            description: area.description,
            url: `https://muskypaws.gr/areas/${slug}`,
            about: {
                "@type": "LocalBusiness",
                name: "Musky Paws Dog Grooming",
                address: {
                    "@type": "PostalAddress",
                    streetAddress: "Σόλωνος 28Β",
                    addressLocality: "Περαία",
                    postalCode: "570 19",
                    addressCountry: "GR",
                },
                areaServed: area.name,
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: area.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.a,
                },
            })),
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Αρχική",
                    item: "https://muskypaws.gr",
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Περιοχές",
                    item: "https://muskypaws.gr/areas",
                },
                {
                    "@type": "ListItem",
                    position: 3,
                    name: area.name,
                    item: `https://muskypaws.gr/areas/${slug}`,
                },
            ],
        },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="pt-28 pb-24 bg-brand-50 min-h-screen">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-12">
                        <Link href="/areas" className="inline-flex items-center gap-2 text-sm font-bold text-navy-900/55 hover:text-brand-accent-pink transition-colors">
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Ολες οι περιοχές
                        </Link>
                    </div>

                    <section className="bg-white rounded-[36px] p-8 md:p-12 lg:p-16 border border-brand-200 shadow-sm mb-12">
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 mb-6 bg-brand-50 px-4 py-1.5 rounded-full border border-brand-200">
                                <MapPin className="w-4 h-4 text-brand-accent-pink" />
                                {area.name}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight leading-[1.08] mb-6">
                                {area.heroTitle}
                            </h1>
                            <p className="text-lg md:text-xl text-navy-900/65 leading-relaxed mb-6">
                                {area.intro}
                            </p>
                            <p className="text-base md:text-lg text-navy-900/65 leading-relaxed">
                                {area.audience}
                            </p>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 mb-12">
                        <section className="bg-white rounded-[32px] p-8 md:p-10 border border-brand-200 shadow-sm">
                            <h2 className="text-3xl font-bold text-navy-900 mb-6">Γιατί ταιριάζει αυτή η επιλογή στην περιοχή</h2>
                            <div className="space-y-4">
                                {area.localFit.map((item) => (
                                    <div key={item} className="flex items-start gap-3 bg-brand-50 rounded-2xl p-4">
                                        <CheckCircle2 className="w-5 h-5 text-brand-accent-green shrink-0 mt-0.5" />
                                        <p className="text-base leading-7 text-navy-900/70">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-navy-900 text-white rounded-[32px] p-8 md:p-10 border border-white/10 shadow-lg">
                            <Sparkles className="w-8 h-8 text-brand-accent-green mb-6" />
                            <h2 className="text-2xl font-bold mb-4">Κλείστε ραντεβού χωρίς περιττή ταλαιπωρία</h2>
                            <p className="text-white/75 leading-7 mb-8">
                                Αν θέλετε σταθερό groomer, σωστή εκτίμηση των αναγκών του σκύλου σας και καθαρή online διαδικασία, μπορείτε να κλείσετε το επόμενο διαθέσιμο slot απευθείας από τη φόρμα booking.
                            </p>
                            <div className="space-y-3">
                                <Link href="/booking" className="inline-flex w-full items-center justify-center rounded-full bg-brand-accent-pink text-navy-900 px-6 py-3.5 font-bold hover:scale-[1.02] transition-transform">
                                    Κλείστε online ραντεβού
                                </Link>
                                <Link href="/contact" className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-bold hover:bg-white/10 transition-colors">
                                    Δείτε στοιχεία επικοινωνίας
                                </Link>
                            </div>
                        </section>
                    </div>

                    <section className="bg-white rounded-[32px] p-8 md:p-10 border border-brand-200 shadow-sm mb-12">
                        <h2 className="text-3xl font-bold text-navy-900 mb-8">Υπηρεσίες που ταιριάζουν περισσότερο</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {area.serviceLinks.map((service) => (
                                <Link
                                    key={service.href}
                                    href={service.href}
                                    className="group rounded-[24px] bg-brand-50 border border-brand-200 p-6 hover:bg-white hover:shadow-md transition-all"
                                >
                                    <h3 className="text-xl font-bold text-navy-900 mb-3">{service.label}</h3>
                                    <p className="text-sm leading-7 text-navy-900/65 mb-6">{service.blurb}</p>
                                    <span className="inline-flex items-center gap-2 font-bold text-navy-900 group-hover:text-brand-accent-pink transition-colors">
                                        Μετάβαση
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white rounded-[32px] p-8 md:p-10 border border-brand-200 shadow-sm mb-12">
                        <h2 className="text-3xl font-bold text-navy-900 mb-8">Σχετικοί οδηγοί και άρθρα</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {area.relatedArticles.map((article) => (
                                <Link
                                    key={article.href}
                                    href={article.href}
                                    className="group rounded-[24px] border border-brand-200 p-6 bg-brand-50 hover:bg-white hover:shadow-md transition-all"
                                >
                                    <div className="text-sm font-black uppercase tracking-[0.16em] text-navy-900/35 mb-3">Guide</div>
                                    <div className="text-lg font-bold text-navy-900 mb-4">{article.label}</div>
                                    <span className="inline-flex items-center gap-2 font-bold text-navy-900 group-hover:text-brand-accent-pink transition-colors">
                                        Διαβάστε περισσότερα
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white rounded-[32px] p-8 md:p-10 border border-brand-200 shadow-sm">
                        <h2 className="text-3xl font-bold text-navy-900 mb-8">Συχνές ερωτήσεις για {area.name}</h2>
                        <div className="space-y-4">
                            {area.faqs.map((faq) => (
                                <details key={faq.q} className="rounded-[20px] border border-brand-200 bg-brand-50 p-6 group">
                                    <summary className="cursor-pointer list-none font-bold text-lg text-navy-900 flex items-center justify-between gap-4">
                                        {faq.q}
                                        <span className="text-navy-900/35 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                                    </summary>
                                    <p className="mt-4 text-base leading-8 text-navy-900/70">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
