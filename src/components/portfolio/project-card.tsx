"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProjectGallery, type Project } from "@/types/project";
import { isRemoteImage, resolveProjectImageSrc } from "@/lib/image-src";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const cardClass = ["project-card", "motion-in", className]
    .filter(Boolean)
    .join(" ");

  const gallery = getProjectGallery(project).map(resolveProjectImageSrc);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setIndex(0);
    setFailed({});
  }, [project.id]);

  const safeIndex = gallery.length === 0 ? 0 : Math.min(index, gallery.length - 1);
  const currentSrc = gallery[safeIndex];
  const showImage = Boolean(currentSrc) && !failed[safeIndex];
  const hasGallery = gallery.length > 1;

  function go(delta: number) {
    if (gallery.length < 2) return;
    setIndex((prev) => (prev + delta + gallery.length) % gallery.length);
  }

  return (
    <article key={project.id} className={cardClass}>
      <div className={`project-thumb${hasGallery ? " has-gallery" : ""}`}>
        {showImage && currentSrc ? (
          <Image
            className="project-thumb-img"
            src={currentSrc}
            alt={
              project.imageAlt
                ? `${project.imageAlt}${hasGallery ? ` (${safeIndex + 1}/${gallery.length})` : ""}`
                : project.title
            }
            width={336}
            height={336}
            unoptimized={
              isRemoteImage(currentSrc) ||
              currentSrc.startsWith("/api/drive-image/")
            }
            onError={() =>
              setFailed((prev) => ({ ...prev, [safeIndex]: true }))
            }
          />
        ) : (
          <div
            className="project-thumb-placeholder"
            role="img"
            aria-label={`Prévia do projeto ${project.title}`}
          />
        )}

        {hasGallery ? (
          <>
            <button
              type="button"
              className="project-gallery-nav project-gallery-prev"
              aria-label="Foto anterior"
              onClick={(e) => {
                e.preventDefault();
                go(-1);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              className="project-gallery-nav project-gallery-next"
              aria-label="Próxima foto"
              onClick={(e) => {
                e.preventDefault();
                go(1);
              }}
            >
              ›
            </button>
            <div className="project-gallery-dots" role="tablist" aria-label="Fotos">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === safeIndex}
                  aria-label={`Foto ${i + 1}`}
                  className={`project-gallery-dot${i === safeIndex ? " is-active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIndex(i);
                  }}
                />
              ))}
            </div>
          </>
        ) : null}
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
