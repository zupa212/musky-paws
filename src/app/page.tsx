import { HomeClient } from "./HomeClient";
import { getAllPosts } from "@/lib/blog";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Musky Paws | Κομμωτήριο Σκύλων Θεσσαλονίκη, Περαία, Καλαμαριά',
  description: 'Κομμωτήριο σκύλων για Θεσσαλονίκη, Περαία, Καλαμαριά και Πυλαία με κούρεμα σκύλου, πλύσιμο, deshedding, furminator, puppy grooming και online booking.',
  alternates: {
    canonical: 'https://muskypaws.gr',
  },
};

export default async function Home() {
  // Fetch exactly the 3 most recent blog posts Server-Side for SEO
  const recentPosts = getAllPosts().slice(0, 3);

  return <HomeClient recentPosts={recentPosts} />;
}
