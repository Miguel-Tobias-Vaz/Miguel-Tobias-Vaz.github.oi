"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types/project";
import type { SiteContent } from "@/types/content";
import { ProjectCard } from "./project-card";

type ViewMode = "grid" | "showcase";

interface ProjectsGalleryProps {
  projects: Project[];
  page: SiteContent["projectsPage"];
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function ProjectsGallery({ projects, page }: ProjectsGalleryProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const allTags = useMemo(() => {
    const labels = new Set<string>();
    for (const project of projects) {
      for (const tag of project.tags) labels.add(tag.label);
    }
    return Array.from(labels).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = normalizeSearch(search);

    return projects.filter((project) => {
      const matchesTag =
        !activeTag || project.tags.some((tag) => tag.label === activeTag);

      if (!query) return matchesTag;

      const haystack = normalizeSearch(
        [project.title, project.description, ...project.tags.map((t) => t.label)].join(" ")
      );

      return matchesTag && haystack.includes(query);
    });
  }, [projects, search, activeTag]);

  const featuredCount = projects.filter((p) => p.featured).length;
  const techCount = allTags.length;

  return (
    <div className="projects-gallery">
      <div className="projects-stats motion-in">
        <article className="projects-stat">
          <span className="projects-stat-value">{projects.length}</span>
          <span className="projects-stat-label">{page.statsTotalLabel}</span>
        </article>
        <article className="projects-stat">
          <span className="projects-stat-value">{featuredCount}</span>
          <span className="projects-stat-label">{page.statsFeaturedLabel}</span>
        </article>
        <article className="projects-stat">
          <span className="projects-stat-value">{techCount}</span>
          <span className="projects-stat-label">{page.statsTechLabel}</span>
        </article>
      </div>

      <div className="projects-toolbar motion-in">
        <label className="projects-search">
          <span className="sr-only">{page.searchLabel}</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={page.searchPlaceholder}
            aria-label={page.searchLabel}
          />
        </label>

        <div className="projects-view-toggle" role="group" aria-label={page.viewToggleLabel}>
          <button
            type="button"
            className={`projects-view-btn${viewMode === "grid" ? " is-active" : ""}`}
            aria-pressed={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
          >
            {page.viewGridLabel}
          </button>
          <button
            type="button"
            className={`projects-view-btn${viewMode === "showcase" ? " is-active" : ""}`}
            aria-pressed={viewMode === "showcase"}
            onClick={() => setViewMode("showcase")}
          >
            {page.viewShowcaseLabel}
          </button>
        </div>
      </div>

      {allTags.length > 0 ? (
        <div
          className="projects-filters motion-in"
          role="group"
          aria-label={page.filtersLabel}
        >
          <button
            type="button"
            className={`projects-filter-chip${activeTag === null ? " is-active" : ""}`}
            aria-pressed={activeTag === null}
            onClick={() => setActiveTag(null)}
          >
            {page.filterAllLabel}
          </button>
          {allTags.map((label) => (
            <button
              key={label}
              type="button"
              className={`projects-filter-chip${activeTag === label ? " is-active" : ""}`}
              aria-pressed={activeTag === label}
              onClick={() => setActiveTag(label)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      <p className="projects-results motion-in" aria-live="polite">
        {filteredProjects.length === 0
          ? page.noResults
          : page.resultsLabel.replace("{count}", String(filteredProjects.length))}
      </p>

      {filteredProjects.length === 0 ? (
        <p className="projects-page-empty motion-in">{page.emptyFiltered}</p>
      ) : (
        <div
          className={`projects-grid motion-stagger is-tile${viewMode === "showcase" ? " is-showcase" : ""}`}
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant="showcase"
              imageSize={viewMode === "showcase" ? "large" : "medium"}
              showFeaturedBadge={Boolean(project.featured)}
              featuredBadgeLabel={page.featuredBadge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
