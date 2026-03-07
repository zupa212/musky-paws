import { HomeClient } from "./HomeClient";
import { getAllPosts } from "@/lib/blog";

export default async function Home() {
  // Fetch exactly the 3 most recent blog posts Server-Side for SEO
  const recentPosts = getAllPosts().slice(0, 3);

  return <HomeClient recentPosts={recentPosts} />;
}
