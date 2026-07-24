import type { Metadata } from "next";
import { ProjectsPageContent } from "@/components/portfolio/projects-page-content";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projetos — Miguel Tobias",
  description: "Todos os projetos de Miguel Tobias Vaz Furtado — desenvolvimento web e software.",
};

export default async function ProjetosPage() {
  const projects = await getProjects();
  return <ProjectsPageContent projects={projects} />;
}
