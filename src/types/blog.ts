export type BlogPost = {
    slug: string;
    title: string;
    excerpt: string;
    cover_image: string;
    author: string;
    category: string;
    tags: string[];
    published_at: string;
    updated_at: string;
    reading_time: number;
    canonical_url: string;
    noindex?: boolean;
    featured?: boolean;
};

export type BlogPostWithContent = BlogPost & {
    content: string;
};
