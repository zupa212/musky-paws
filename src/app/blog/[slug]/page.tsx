import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/blog/MDXComponents';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { ArrowLeft, CalendarDays, Clock, Tag } from 'lucide-react';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const post = getPostBySlug(resolvedParams.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const { title, excerpt, cover_image, published_at, updated_at, author, tags, canonical_url, noindex } = post;

    return {
        title: `${title} | Musky Paws Περαία`,
        description: excerpt,
        authors: [{ name: author }],
        keywords: tags,
        alternates: {
            canonical: canonical_url || `https://muskypaws.gr/blog/${resolvedParams.slug}`,
        },
        robots: {
            index: !noindex,
            follow: !noindex,
        },
        openGraph: {
            title,
            description: excerpt,
            type: 'article',
            publishedTime: published_at,
            modifiedTime: updated_at,
            authors: [author],
            images: [
                {
                    url: cover_image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: excerpt,
            images: [cover_image],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const resolvedParams = await params;
    const post = getPostBySlug(resolvedParams.slug);

    if (!post) {
        notFound();
    }

    // Schema.org JSON-LD string
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.cover_image,
        datePublished: post.published_at,
        dateModified: post.updated_at,
        author: {
            '@type': 'Person',
            name: post.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Musky Paws Dog Grooming',
            logo: {
                '@type': 'ImageObject',
                url: 'https://muskypaws.gr/logo.png', // Fallback URL
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': post.canonical_url || `https://muskypaws.gr/blog/${resolvedParams.slug}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="pt-24 pb-20 bg-brand-50 min-h-screen">
                <article className="max-w-4xl mx-auto px-4">

                    {/* Back Link */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-navy-900/60 hover:text-vetic-pink font-semibold mb-8 transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Πίσω στο Blog
                    </Link>

                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="bg-white border border-brand-200 text-navy-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                {post.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-navy-900/50 text-sm font-medium">
                                <CalendarDays className="w-4 h-4" />
                                <time dateTime={post.published_at}>
                                    {format(new Date(post.published_at), 'd MMMM yyyy', { locale: el })}
                                </time>
                            </div>
                            <div className="flex items-center gap-1.5 text-navy-900/50 text-sm font-medium">
                                <Clock className="w-4 h-4" />
                                <span>{post.reading_time} min ανάγνωση</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight leading-[1.15] mb-6">
                            {post.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-navy-900/60 leading-relaxed max-w-3xl mb-8">
                            {post.excerpt}
                        </p>

                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-vetic-pink flex items-center justify-center font-bold text-white text-lg">
                                {post.author.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-navy-900">{post.author}</div>
                                <div className="text-sm text-navy-900/50">Αρθρογράφος</div>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-[40px] overflow-hidden mb-16 shadow-lg bg-brand-100">
                        <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>

                    {/* MDX Content */}
                    <div className="prose prose-lg md:prose-xl prose-navy max-w-3xl mx-auto mdx-content">
                        <MDXRemote source={post.content} components={MDXComponents} />
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-brand-200">
                            <h4 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-vetic-pink" />
                                Σχετικά Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="bg-white border border-brand-200 text-navy-900/70 px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-50 transition-colors cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </article>
            </div>
        </>
    );
}
