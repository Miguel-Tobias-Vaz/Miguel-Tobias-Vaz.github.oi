import Link from "next/link";
import type { Project } from "@/types/project";
import { PortfolioChrome } from "./portfolio-chrome";
import { PortfolioHeader } from "./portfolio-header";
import { ProjectCard } from "./project-card";

const navItems = [
  { href: "/#home", label: "Home" },
  { href: "/projetos", label: "Projetos" },
  { href: "/#tecnologias", label: "Tecnologias" },
  { href: "/#contato", label: "Contato" },
  { href: "/#sobre", label: "Sobre mim" },
];

interface ProjectsPageContentProps {
  projects: Project[];
}

export function ProjectsPageContent({ projects }: ProjectsPageContentProps) {
  return (
    <>
      <PortfolioChrome />
      <PortfolioHeader navItems={navItems} activeHref="/projetos" />

      <main className="projects-page">
        <section className="section projects-section projects-page-section">
          <div className="container motion-block">
            <p className="projects-page-eyebrow motion-in">Portfólio</p>
            <h1 className="section-title motion-in">
              Projetos <span className="section-title-dot">•</span>
            </h1>
            <p className="projects-page-intro motion-in">
              Uma visão completa do que venho construindo — do frontend à API, com foco
              em código organizado e experiência de uso.
            </p>

            {projects.length === 0 ? (
              <p className="projects-page-empty motion-in">
                Nenhum projeto cadastrado ainda.
              </p>
            ) : (
              <div className="projects-grid motion-stagger">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            <div className="projects-section-actions motion-in">
              <Link href="/#home" className="btn btn-outline">
                Voltar ao início
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Miguel Tobias Vaz Furtado</p>
      </footer>
    </>
  );
}
