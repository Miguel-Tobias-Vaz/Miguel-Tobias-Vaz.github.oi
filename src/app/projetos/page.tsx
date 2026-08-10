import type { Metadata } from "next";
import { ProjectsPageContent } from "@/components/portfolio/projects-page-content";
import { getSiteContent } from "@/lib/content";
import { getProjects } from "@/lib/projects";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.meta.projectsPageTitle,
    description: content.meta.projectsPageDescription,
  };
}

export default async function ProjetosPage() {
  const [projects, content] = await Promise.all([
    getProjects(),
    getSiteContent(),
  ]);

  return <ProjectsPageContent projects={projects} content={content} />;
}
