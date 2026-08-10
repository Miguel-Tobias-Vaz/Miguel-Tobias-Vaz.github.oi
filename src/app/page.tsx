import { PortfolioContent } from "@/components/portfolio/portfolio-content";
import { getSiteContent } from "@/lib/content";
import { getFeaturedProjects } from "@/lib/projects";

export default async function HomePage() {
  const [projects, content] = await Promise.all([
    getFeaturedProjects(),
    getSiteContent(),
  ]);

  return <PortfolioContent projects={projects} content={content} />;
}
