import React from 'react';
import Link from 'next/link';
import { Phone, CheckCircle2, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import Image from 'next/image';

interface MDXProps {
    children?: React.ReactNode;
    [key: string]: any;
}

// Custom Key Takeaways Box
const KeyTakeaways = ({ children }: MDXProps) => (
    <div className="bg-brand-50 border border-vetic-pink/30 rounded-2xl p-6 my-8 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900 mb-4 mt-0">
            <CheckCircle2 className="w-5 h-5 text-vetic-pink" />
            Key Takeaways
        </h3>
        <div className="text-navy-800/80 mdx-takeaways">
            {children}
        </div>
    </div>
);

// Myth vs Fact block
const MythVsFact = ({ myth, fact }: { myth: string; fact: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                <X className="w-5 h-5" />
                Μύθος
            </div>
            <p className="text-navy-900/80 text-sm m-0">{myth}</p>
        </div>
        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-green-600 font-bold mb-2">
                <Check className="w-5 h-5" />
                Αλήθεια
            </div>
            <p className="text-navy-900/80 text-sm m-0">{fact}</p>
        </div>
    </div>
);

// FAQ Wrapper
const FAQ = ({ children }: MDXProps) => (
    <div className="space-y-4 my-8">
        {children}
    </div>
);

// FAQ Item (Using minimal details/summary or raw JSX for MDX)
const Question = ({ q, children }: { q: string, children: React.ReactNode }) => {
    return (
        <details className="group border border-brand-200 bg-white rounded-2xl overflow-hidden shadow-sm">
            <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-navy-900 list-none [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown className="w-5 h-5 text-vetic-pink transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 pt-2 text-navy-800/70 text-sm border-t border-brand-100">
                {children}
            </div>
        </details>
    );
};

// Call To Action Block
const CallToAction = ({ primaryText, primaryLink, secondaryText, secondaryLink }: any) => (
    <div className="bg-navy-900 rounded-[32px] p-8 md:p-12 text-center my-12 shadow-xl">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Είστε έτοιμοι για ραντεβού;</h3>
        <p className="text-white/70 mb-8 max-w-lg mx-auto">
            Ο σκύλος σας αξίζει την καλύτερη περιποίηση. Κλείστε το ραντεβού σας ηλεκτρονικά ή καλέστε μας για άμεση εξυπηρέτηση.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={primaryLink || '/booking'} className="w-full sm:w-auto bg-vetic-pink text-navy-900 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center">
                {primaryText || 'Κλείσε Ραντεβού'}
            </Link>
            <a href={secondaryLink || 'tel:+306948965371'} className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                {secondaryText || 'Κάλεσε 694 896 5371'}
            </a>
        </div>
    </div>
);

// Define Base MDX tags
export const MDXComponents = {
    h2: (props: any) => <h2 className="text-3xl font-bold text-navy-900 mt-12 mb-6" {...props} />,
    h3: (props: any) => <h3 className="text-2xl font-bold text-navy-900 mt-8 mb-4" {...props} />,
    p: (props: any) => <p className="text-navy-900/70 leading-relaxed mb-6 text-[17px]" {...props} />,
    ul: (props: any) => <ul className="list-disc list-outside ml-6 text-navy-900/70 mb-6 space-y-2 marker:text-vetic-pink" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-outside ml-6 text-navy-900/70 mb-6 space-y-2 marker:text-vetic-pink" {...props} />,
    li: (props: any) => <li className="pl-2 leading-relaxed" {...props} />,
    a: (props: any) => <a className="text-vetic-pink font-semibold hover:underline underline-offset-4 decoration-2" {...props} />,
    strong: (props: any) => <strong className="font-bold text-navy-900" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-vetic-pink pl-6 py-2 my-8 italic text-navy-900/60 bg-brand-50 rounded-r-xl" {...props} />,
    img: (props: any) => (
        <span className="block my-10 overflow-hidden rounded-3xl border border-brand-200 shadow-sm relative w-full aspect-video bg-gray-100">
            <Image src={props.src} alt={props.alt || 'Musky Paws Blog Image'} fill className="object-cover" />
        </span>
    ),
    KeyTakeaways,
    MythVsFact,
    FAQ,
    Question,
    CallToAction,
};
