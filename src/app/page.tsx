import { HomeClient } from "./HomeClient";
import { getAllPosts } from "@/lib/blog";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Musky Paws | Dog Grooming Περαία Θεσσαλονίκη',
  description: 'Full grooming, πλύσιμο σκύλου, deshedding, furminator, puppy grooming και νύχια/αυτιά στην Περαία Θεσσαλονίκης. Εξυπηρετούμε Περαία, Καλαμαριά, Μηχανιώνα, Τρίλοφο, Επανομή και Θέρμη.',
  alternates: {
    canonical: 'https://muskypaws.gr',
  },
};

export default async function Home() {
  // Fetch exactly the 3 most recent blog posts Server-Side for SEO
  const recentPosts = getAllPosts().slice(0, 3);

  return <HomeClient recentPosts={recentPosts} />;
}
