import { PortfolioContent } from "@/components/portfolio/portfolio-content";
import { getFeaturedProjects } from "@/lib/projects";

export default async function HomePage() {
  const projects = await getFeaturedProjects();
  return <PortfolioContent projects={projects} />;
}
