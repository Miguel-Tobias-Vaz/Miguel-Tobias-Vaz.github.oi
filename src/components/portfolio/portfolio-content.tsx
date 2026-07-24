import Link from "next/link";
import type { Project } from "@/types/project";
import { HeroStarfield } from "./hero-starfield";
import { PortfolioChrome } from "./portfolio-chrome";
import { PortfolioHeader } from "./portfolio-header";
import { ProjectCard } from "./project-card";

interface PortfolioContentProps {
  projects: Project[];
}

const navItems = [
  { href: "#home", label: "Home" },
  { href: "/projetos", label: "Projetos" },
  { href: "#tecnologias", label: "Tecnologias" },
  { href: "#contato", label: "Contato" },
  { href: "#sobre", label: "Sobre mim" },
];

const techCategories = [
  {
    highlight: true,
    title: "Frontend & framework",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  },
  {
    title: "Animação & motion",
    items: ["Motion (Framer Motion)", "GSAP"],
  },
  {
    title: "3D, canvas & WebGL",
    items: [
      "Three.js / React Three Fiber",
      "Canvas API",
      "WebGL",
      "Shaders (GLSL)",
    ],
  },
  {
    title: "Visual & estilo",
    items: ["SVG", "CSS"],
  },
];

export function PortfolioContent({ projects }: PortfolioContentProps) {
  return (
    <>
      <PortfolioChrome />
      <PortfolioHeader navItems={navItems} activeHref="#home" />

      <main>
        <section id="home" className="hero-cinematic">
          <div className="hero-pin">
            <HeroStarfield />

            <svg
              className="hero-paths"
              viewBox="0 0 1440 900"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <path
                className="hero-path hero-path-1"
                d="M-40,420 C280,180 520,640 760,420 S1240,120 1480,420"
              />
              <path
                className="hero-path hero-path-2"
                d="M-40,560 C320,320 580,720 820,520 S1280,280 1480,560"
              />
              <path
                className="hero-path hero-path-3"
                d="M-40,300 C240,480 640,80 900,300 S1320,520 1480,300"
              />
            </svg>

            <div className="hero-stage">
              <p className="hero-brand">MIGUEL TOBIAS</p>

              <div className="hero-body">
                <div className="container hero">
                  <div className="hero-text">
                    <p className="hero-eyebrow">Portfólio · 2026</p>
                    <h1>Miguel Tobias Vaz Furtado</h1>
                    <h2 className="hero-role">
                      Developer &amp; Designer
                      <span className="hero-cursor" aria-hidden="true" />
                    </h2>
                    <p>
                      Estudante de Análise e Desenvolvimento de Sistemas, focado em
                      desenvolvimento web e em construir interfaces claras e código
                      organizado. Busco oportunidades para aprender em projetos reais e
                      crescer em time.
                    </p>
                    <div className="hero-buttons">
                      <Link href="#contato" className="btn btn-primary">
                        Contato
                      </Link>
                      <Link href="#projetos" className="btn btn-outline">
                        Projetos
                      </Link>
                    </div>
                  </div>

                  <div className="tech-preview-card tilt-card">
                    <div className="tech-badges">
                      <span className="badge react">
                        <i className="devicon-react-original" /> React
                      </span>
                      <span className="badge next">
                        <i className="devicon-nextjs-original" /> Next.js
                      </span>
                      <span className="badge ts">
                        <i className="devicon-typescript-plain" /> TypeScript
                      </span>
                      <span className="badge tailwind">
                        <i className="devicon-tailwindcss-plain" /> Tailwind
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="#projetos" className="scroll-hint" aria-label="Rolar para projetos">
              <span className="scroll-hint-line" />
              <span className="scroll-hint-text">Explorar</span>
            </Link>
          </div>
          <div className="hero-spacer" aria-hidden="true" />
        </section>

        <section id="projetos" className="section projects-section">
          <div className="container motion-block">
            <h2 className="section-title motion-in">
              Projetos <span className="section-title-dot">•</span>
            </h2>
            <div className="projects-grid motion-stagger">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div className="projects-section-actions motion-in">
              <Link href="/projetos" className="btn btn-primary">
                Ver todos os projetos
              </Link>
            </div>
          </div>
        </section>

        <section id="tecnologias" className="section tech-section">
          <div className="container motion-block">
            <h2 className="section-title motion-in">
              Tecnologias <span className="section-title-dot">•</span>
            </h2>
            <p className="tech-intro motion-in">
              Stack focada em interfaces modernas: <strong>React</strong> e{" "}
              <strong>Next.js</strong> com <strong>TypeScript</strong> e{" "}
              <strong>Tailwind CSS</strong>, componentes com <strong>shadcn/ui</strong>,
              motion com <strong>GSAP</strong> e <strong>Framer Motion</strong>, e
              experiências visuais com <strong>Three.js</strong>, <strong>WebGL</strong> e{" "}
              <strong>GLSL</strong>.
            </p>

            <div className="tech-stats motion-in">
              <article className="stat-card tilt-card">
                <span className="stat-value">
                  <span className="counter" data-target="4">
                    0
                  </span>
                  +
                </span>
                <span className="stat-label">Projetos</span>
              </article>
              <article className="stat-card tilt-card">
                <span className="stat-value">
                  <span className="counter" data-target="13">
                    0
                  </span>
                </span>
                <span className="stat-label">Tecnologias</span>
              </article>
              <article className="stat-card tilt-card">
                <span className="stat-value">
                  <span className="counter" data-target="2">
                    0
                  </span>
                </span>
                <span className="stat-label">Motion libs</span>
              </article>
              <article className="stat-card tilt-card">
                <span className="stat-value">
                  <span className="counter" data-target="4">
                    0
                  </span>
                </span>
                <span className="stat-label">WebGL &amp; 3D</span>
              </article>
            </div>

            <div className="tech-categories motion-in motion-stagger">
              {techCategories.map((cat) => (
                <div
                  key={cat.title}
                  className={`tech-category tilt-card${cat.highlight ? " tech-category-highlight" : ""}`}
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
                Stack em camadas <span className="tech-trail-title-dot">•</span>
              </h3>
              <ol className="tech-timeline">
                <li className="is-done">CSS</li>
                <li className="is-done">SVG</li>
                <li className="is-done">GSAP</li>
                <li className="is-current">Motion · Canvas · WebGL</li>
                <li>Three.js · R3F · GLSL</li>
                <li>React · TypeScript</li>
                <li>Tailwind · shadcn/ui</li>
                <li>Next.js</li>
              </ol>
            </div>
          </div>
        </section>

        <section id="contato" className="section contact-section">
          <div className="container contact-content motion-block">
            <h2 className="section-title motion-in">
              Contato <span className="section-title-dot">•</span>
            </h2>
            <div className="contact-box tilt-card motion-in">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:tobiasmiguel007@gmail.com">tobiasmiguel007@gmail.com</a>
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/miguel-tobias-vaz/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/miguel-tobias-vaz
                </a>
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <a
                  href="https://github.com/Miguel-Tobias-Vaz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/Miguel-Tobias-Vaz
                </a>
              </p>
              <p>
                <strong>WhatsApp:</strong>{" "}
                <a
                  href="https://wa.me/5591984713305"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  (91) 98471-3305
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="sobre" className="section about-section">
          <div className="container about-content motion-block">
            <h2 className="section-title motion-in">
              Sobre <span className="section-title-dot">•</span>
            </h2>
            <div className="about-box tilt-card motion-in">
              <p>
                Desenvolvedor em formação com foco em lógica de programação e
                desenvolvimento de sistemas. Possui base teórica em algoritmos,
                estrutura de dados e desenvolvimento web, com estudos em andamento em
                Python, Java, SQL, HTML, CSS e JavaScript.
              </p>
              <p>
                Atualmente desenvolvendo projetos próprios para consolidar o aprendizado
                prático. Busca oportunidade como Desenvolvedor Júnior.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          Portfólio — Miguel Tobias · 2026 ·{" "}
          <Link href="/admin/projetos" className="site-footer-admin">
            Gerenciar projetos
          </Link>
        </p>
      </footer>

      <a
        href="https://wa.me/5591984713305"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
