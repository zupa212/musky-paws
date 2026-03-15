import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getFeaturedPosts } from '@/lib/blog';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { ArrowRight, Clock, CalendarDays } from 'lucide-react';

export const metadata = {
    title: 'Blog | Musky Paws Dog Grooming Περαία',
    description: 'Οδηγοί και πληροφορίες για το grooming, την υγεία και την περιποίηση του σκύλου σας στο Musky Paws.',
    alternates: {
        canonical: 'https://muskypaws.gr/blog',
    },
};

export default function BlogIndex() {
    const posts = getAllPosts();
    const featuredPosts = getFeaturedPosts(1);
    const featuredPost = featuredPosts[0];
    const regularPosts = posts.filter(p => p.slug !== featuredPost?.slug);

    return (
        <div className="pt-32 pb-24 min-h-screen bg-brand-50">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 mb-6 bg-white px-4 py-1.5 rounded-full border border-brand-200">
                        <div className="w-2 h-2 rounded-full bg-vetic-pink" />
                        Musky Paws Blog
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight leading-[1.1] mb-6">
                        Οδηγοί για χαρούμενα & <span className="wavy-underline">υγιή κατοικίδια</span>
                    </h1>
                    <p className="text-navy-900/60 text-lg leading-relaxed">
                        Ανακαλύψτε τα πάντα για το grooming, την υγεία του τριχώματος και χρήσιμες πληροφορίες από την ομάδα των ειδικών του Musky Paws.
                    </p>
                </div>

                {/* Featured Post Card */}
                {featuredPost && (
                    <div className="mb-20">
                        <Link href={`/blog/${featuredPost.slug}`} className="group block">
                            <div className="bg-white rounded-[40px] p-4 md:p-6 border border-brand-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                                    <div className="relative aspect-[4/3] w-full rounded-[32px] overflow-hidden bg-brand-100">
                                        <Image
                                            src={featuredPost.cover_image}
                                            alt={featuredPost.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-navy-900 shadow-sm">
                                            {featuredPost.category}
                                        </div>
                                    </div>
                                    <div className="p-4 md:py-8 md:pr-12">
                                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-navy-900/50 mb-6">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="w-4 h-4" />
                                                {format(new Date(featuredPost.published_at), 'd MMMM yyyy', { locale: el })}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {featuredPost.reading_time} λεπτά
                                            </div>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-navy-900 leading-tight mb-6 group-hover:text-vetic-pink transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-navy-900/70 text-lg leading-relaxed mb-8 line-clamp-3">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 font-bold text-navy-900 group-hover:text-vetic-pink transition-colors">
                                            Διαβάστε Περισσότερα <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Recent Posts Grid */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-navy-900 mb-8 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-vetic-blue" />
                        Πρόσφατα Άρθρα
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularPosts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full flex flex-col bg-white rounded-3xl border border-brand-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                                <div className="relative aspect-[3/2] w-full bg-brand-100 overflow-hidden shrink-0">
                                    <Image
                                        src={post.cover_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-navy-900 shadow-sm">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 flex flex-col grow">
                                    <div className="flex items-center gap-4 text-xs font-medium text-navy-900/50 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                            {format(new Date(post.published_at), 'd MMM yyyy', { locale: el })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {post.reading_time} min
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold text-navy-900 leading-snug mb-3 group-hover:text-vetic-pink transition-colors line-clamp-3">
                                        {post.title}
                                    </h4>
                                    <p className="text-navy-900/60 text-sm leading-relaxed line-clamp-3 mb-6">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between border-t border-brand-100 pt-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center font-bold text-navy-900 text-xs">
                                                {post.author.charAt(0)}
                                            </div>
                                            <span className="text-xs font-semibold text-navy-900">{post.author}</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-navy-900/40 group-hover:text-vetic-pink group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {regularPosts.length === 0 && !featuredPost && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-brand-200 text-navy-900/60">
                            Δεν υπάρχουν άρθρα προς το παρόν.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
