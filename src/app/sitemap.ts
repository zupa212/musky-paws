import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

const BASE_URL = 'https://muskypaws.gr';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = ['', '/about', '/contact', '/gallery', '/pricing', '/services', '/booking', '/areas', '/blog'].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    const services = ['full-grooming', 'bath-brush', 'deshedding', 'nails-ears', 'puppy-grooming'].map((slug) => ({
        url: `${BASE_URL}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    const areas = ['peraea', 'neoi-epivates', 'agia-triada', 'kalamaria', 'thessaloniki', 'trilofos', 'epanomi', 'nea-michaniona', 'thermi', 'plagiari'].map((slug) => ({
        url: `${BASE_URL}/areas/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const posts = getAllPosts().map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...routes, ...services, ...areas, ...posts];
}
