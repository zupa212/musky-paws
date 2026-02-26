import { MetadataRoute } from 'next';

const BASE_URL = 'https://muskypaws.gr';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = ['', '/about', '/contact', '/gallery', '/pricing', '/services', '/booking', '/areas'].map((route) => ({
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

    const areas = ['peraea', 'neoi-epivates', 'agia-triada', 'kalamaria', 'thessaloniki'].map((slug) => ({
        url: `${BASE_URL}/areas/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...services, ...areas];
}
