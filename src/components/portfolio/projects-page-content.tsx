import Link from "next/link";
import type { Project } from "@/types/project";
import type { SiteContent } from "@/types/content";
import { buildProjectsNav, formatFooterYear } from "@/lib/content";
import { PortfolioChrome } from "./portfolio-chrome";
import { PortfolioHeader } from "./portfolio-header";
import { ProjectsGallery } from "./projects-gallery";

interface ProjectsPageContentProps {
  projects: Project[];
  content: SiteContent;
}

export function ProjectsPageContent({
  projects,
  content,
}: ProjectsPageContentProps) {
  const navItems = buildProjectsNav(content);
  const page = content.projectsPage;

  return (
    <>
      <PortfolioChrome />
      <PortfolioHeader navItems={navItems} activeHref="/projetos" />

      <main className="projects-page">
        <section className="section projects-section projects-page-section">
          <div className="container motion-block">
            <p className="projects-page-eyebrow motion-in">{page.eyebrow}</p>
            <h1 className="section-title motion-in">
              {page.title} <span className="section-title-dot">•</span>
            </h1>
            <p className="projects-page-intro motion-in">{page.intro}</p>

            {projects.length === 0 ? (
              <p className="projects-page-empty motion-in">{page.empty}</p>
            ) : (
              <ProjectsGallery projects={projects} page={page} />
            )}

            <div className="projects-section-actions motion-in">
              <Link href="/#home" className="btn btn-outline">
                {page.backLabel}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>{formatFooterYear(content.footer.projectsPageText)}</p>
      </footer>
    </>
  );
}
