"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@/types/project";
import { isRemoteImage, resolveProjectImageSrc } from "@/lib/image-src";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const cardClass = ["project-card", "motion-in", className]
    .filter(Boolean)
    .join(" ");

  const resolvedSrc = project.image
    ? resolveProjectImageSrc(project.image)
    : undefined;
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(resolvedSrc) && !failed;

  return (
    <article key={project.id} className={cardClass}>
      <div className="project-thumb">
        {showImage && resolvedSrc ? (
          <Image
            className="project-thumb-img"
            src={resolvedSrc}
            alt={project.imageAlt ?? project.title}
            width={336}
            height={336}
            unoptimized={
              isRemoteImage(resolvedSrc) ||
              resolvedSrc.startsWith("/api/drive-image/")
            }
            onError={() => setFailed(true)}
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
