import Image from "next/image";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const cardClass = ["project-card", "tilt-card", "motion-in", className]
    .filter(Boolean)
    .join(" ");

  return (
    <article key={project.id} className={cardClass}>
      <div className="project-thumb">
        {project.image ? (
          <Image
            className="project-thumb-img"
            src={project.image}
            alt={project.imageAlt ?? project.title}
            width={120}
            height={120}
          />
        ) : (
          <div
            className="project-thumb-placeholder"
            role="img"
            aria-label={`Prévia do projeto ${project.title}`}
          />
        )}
      </div>
      <div className="project-content">
        <h3>{project.title}</h3>
        <p className="desc-title">Descrição</p>
        <p>{project.description}</p>
        <div className="project-footer">
          <div className="mini-tags">
            {project.tags.map((tag) => (
              <span key={tag.label} className={`mini-badge ${tag.className}`}>
                <i className={tag.icon} /> {tag.label}
              </span>
            ))}
          </div>
          <a
            className="btn-github"
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.linkLabel}
          </a>
        </div>
      </div>
    </article>
  );
}
