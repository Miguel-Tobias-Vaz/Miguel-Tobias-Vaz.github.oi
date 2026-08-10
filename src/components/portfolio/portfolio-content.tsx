import Link from "next/link";
import type { Project } from "@/types/project";
import type { SiteContent } from "@/types/content";
import { buildHomeNav } from "@/lib/content";
import { PortfolioChrome } from "./portfolio-chrome";
import { PortfolioHeader } from "./portfolio-header";
import { ProjectCard } from "./project-card";

interface PortfolioContentProps {
  projects: Project[];
  content: SiteContent;
}

const BADGE_ICONS: Record<string, string> = {
  React: "devicon-react-original",
  "Next.js": "devicon-nextjs-original",
  TypeScript: "devicon-typescript-plain",
  Tailwind: "devicon-tailwindcss-plain",
  HTML: "devicon-html5-plain",
  CSS: "devicon-css3-plain",
  JavaScript: "devicon-javascript-plain",
};

export function PortfolioContent({ projects, content }: PortfolioContentProps) {
  const navItems = buildHomeNav(content);
  const { hero, projectsSection, tech, contact, about, footer } = content;

  return (
    <>
      <PortfolioChrome />
      <PortfolioHeader navItems={navItems} activeHref="#home" />

      <main>
        <section id="home" className="hero-cinematic">
          <div className="hero-pin">
            <div className="hero-stage">
              <div className="hero-body">
                <div className="container hero">
                  <div className="hero-text">
                    <p className="hero-eyebrow">{hero.eyebrow}</p>
                    <h1>{hero.name}</h1>
                    <h2 className="hero-role">
                      {hero.role}
                      <span className="hero-cursor" aria-hidden="true" />
                    </h2>
                    <p>{hero.bio}</p>
                    <div className="hero-buttons">
                      <Link href="#contato" className="btn btn-primary">
                        {hero.primaryCta}
                      </Link>
                      <Link href="#projetos" className="btn btn-outline">
                        {hero.secondaryCta}
                      </Link>
                    </div>
                  </div>

                  <div className="tech-preview-card">
                    <div className="tech-badges">
                      {hero.badges.map((badge) => (
                        <span key={badge} className="badge">
                          {BADGE_ICONS[badge] ? (
                            <i className={BADGE_ICONS[badge]} />
                          ) : null}{" "}
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projetos" className="section projects-section">
          <div className="container motion-block">
            <h2 className="section-title motion-in">
              {projectsSection.title} <span className="section-title-dot">•</span>
            </h2>
            <div className="projects-grid motion-stagger">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div className="projects-section-actions motion-in">
              <Link href="/projetos" className="btn btn-primary">
                {projectsSection.viewAllLabel}
              </Link>
            </div>
          </div>
        </section>

        <section id="tecnologias" className="section tech-section">
          <div className="container motion-block">
            <h2 className="section-title motion-in">
              {tech.title} <span className="section-title-dot">•</span>
            </h2>
            <p className="tech-intro motion-in">{tech.intro}</p>

            <div className="tech-stats motion-in">
              {tech.stats.map((stat) => (
                <article key={stat.label} className="stat-card">
                  <span className="stat-value">
                    <span className="counter" data-target={String(stat.value)}>
                      0
                    </span>
                    {stat.suffix ?? ""}
                  </span>
                  <span className="stat-label">{stat.label}</span>
                </article>
              ))}
            </div>

            <div className="tech-categories motion-in motion-stagger">
              {tech.categories.map((cat) => (
                <div
                  key={cat.title}
                  className={`tech-category${cat.highlight ? " tech-category-highlight" : ""}`}
                >
                  <h3 className="tech-category-title">{cat.title}</h3>
                  <ul className="tech-list">
                    {cat.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="tech-trail motion-in">
              <h3 className="tech-trail-title">
                {tech.trailTitle} <span className="tech-trail-title-dot">•</span>
              </h3>
              <ol className="tech-timeline">
                {tech.trail.map((item) => (
                  <li
                    key={item.label}
                    className={
                      item.status === "done"
                        ? "is-done"
                        : item.status === "current"
                          ? "is-current"
                          : undefined
                    }
                  >
                    {item.label}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="contato" className="section contact-section">
          <div className="container contact-content motion-block">
            <h2 className="section-title motion-in">
              {contact.title} <span className="section-title-dot">•</span>
            </h2>
            <div className="contact-box motion-in">
              <p>
                <strong>{contact.emailLabel}:</strong>{" "}
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
              <p>
                <strong>{contact.linkedinLabel}:</strong>{" "}
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contact.linkedinText}
                </a>
              </p>
              <p>
                <strong>{contact.githubLabel}:</strong>{" "}
                <a
                  href={contact.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contact.githubText}
                </a>
              </p>
              <p>
                <strong>{contact.whatsappLabel}:</strong>{" "}
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contact.whatsappText}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="sobre" className="section about-section">
          <div className="container about-content motion-block">
            <h2 className="section-title motion-in">
              {about.title} <span className="section-title-dot">•</span>
            </h2>
            <div className="about-box motion-in">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          {footer.homeText}{" "}
          <Link href="/admin/conteudo" className="site-footer-admin">
            {footer.adminLinkLabel}
          </Link>
        </p>
      </footer>

      <a
        href={contact.whatsappUrl}
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Conversar no ${contact.whatsappLabel}`}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
