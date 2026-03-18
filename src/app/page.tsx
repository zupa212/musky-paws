import { HomeClient } from "./HomeClient";
import { getAllPosts } from "@/lib/blog";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Κομμωτήριο Σκύλων Περαία | Dog Grooming & Spa | Musky Paws',
  description: 'Το premium κομμωτήριο σκύλων στην Περαία. Εξειδικευμένο dog grooming, κούρεμα και πλύσιμο σκύλων χωρίς άγχος. Κλείστε το ραντεβού σας!',
  alternates: {
    canonical: 'https://muskypaws.gr',
  },
};

export default async function Home() {
  // Fetch exactly the 3 most recent blog posts Server-Side for SEO
  const recentPosts = getAllPosts().slice(0, 3);

  return <HomeClient recentPosts={recentPosts} />;
}
