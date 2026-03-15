import { HomeClient } from "./HomeClient";
import { getAllPosts } from "@/lib/blog";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Musky Paws | Dog Grooming Περαία Θεσσαλονίκη',
  description: 'Κορυφαίος καλλωπισμός σκύλων στην Περαία Θεσσαλονίκης. Κούρεμα, μπάνιο, αφαίρεση νεκρής τρίχας και εξειδικευμένη περιποίηση για τον μικρό σας φίλο.',
  alternates: {
    canonical: 'https://muskypaws.gr',
  },
};

export default async function Home() {
  // Fetch exactly the 3 most recent blog posts Server-Side for SEO
  const recentPosts = getAllPosts().slice(0, 3);

  return <HomeClient recentPosts={recentPosts} />;
}
