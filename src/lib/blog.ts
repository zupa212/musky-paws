import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostWithContent } from '@/types/blog';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');

export function getPostBySlug(slug: string): BlogPostWithContent | null {
    try {
        const fullPath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug: data.slug || slug,
            title: data.title,
            excerpt: data.excerpt,
            cover_image: data.cover_image,
            author: data.author,
            category: data.category,
            tags: data.tags || [],
            published_at: data.published_at,
            updated_at: data.updated_at || data.published_at,
            reading_time: data.reading_time || 5,
            canonical_url: data.canonical_url,
            noindex: data.noindex || false,
            featured: data.featured || false,
            content,
        };
    } catch (error) {
        console.error(`Error reading post with slug: ${slug}`, error);
        return null;
    }
}

export function getAllPosts(): BlogPost[] {
    try {
        if (!fs.existsSync(BLOG_CONTENT_DIR)) {
            return [];
        }

        const files = fs.readdirSync(BLOG_CONTENT_DIR);
        const posts: BlogPost[] = files
            .filter((file) => file.endsWith('.mdx'))
            .map((file) => {
                const slug = file.replace(/\.mdx$/, '');
                const post = getPostBySlug(slug);
                if (!post) return null;

                // Exclude content for listing to save memory
                const { content, ...meta } = post;
                return meta;
            })
            .filter((post): post is BlogPost => post !== null)
            .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

        return posts;
    } catch (error) {
        console.error('Error reading all posts', error);
        return [];
    }
}

export function getFeaturedPosts(limit: number = 3): BlogPost[] {
    return getAllPosts()
        .filter((post) => post.featured)
        .slice(0, limit);
}

export function getAllCategories(): string[] {
    const posts = getAllPosts();
    const categories = new Set(posts.map((post) => post.category).filter(Boolean));
    return Array.from(categories).sort();
}
