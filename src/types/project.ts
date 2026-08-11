export interface ProjectTag {
  className: string;
  icon: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  /** Capa (primeira foto). Mantida por compatibilidade. */
  image?: string;
  /** Galeria completa; a primeira é a capa. */
  images?: string[];
  imageAlt?: string;
  tags: ProjectTag[];
  link: string;
  linkLabel: string;
  order: number;
  featured?: boolean;
}

/** Une `image` + `images` sem duplicar. */
export function getProjectGallery(project: Project): string[] {
  const list: string[] = [];
  const push = (url?: string) => {
    const trimmed = url?.trim();
    if (trimmed && !list.includes(trimmed)) list.push(trimmed);
  };
  push(project.image);
  for (const url of project.images ?? []) push(url);
  return list;
}

export function normalizeProjectImages(urls: string[] | undefined): {
  image?: string;
  images?: string[];
} {
  const images = (urls ?? [])
    .map((u) => u.trim())
    .filter(Boolean)
    .filter((url, i, arr) => arr.indexOf(url) === i);

  if (images.length === 0) return {};
  return { image: images[0], images };
}

export type ProjectInput = Omit<Project, "id" | "order"> & {
  id?: string;
  order?: number;
};

export const TAG_PRESETS: ProjectTag[] = [
  { className: "html-mini", icon: "devicon-html5-plain", label: "HTML" },
  { className: "css-mini", icon: "devicon-css3-plain", label: "CSS" },
  { className: "js-mini", icon: "devicon-javascript-plain", label: "JavaScript" },
  { className: "react-mini", icon: "devicon-react-original", label: "React" },
  { className: "node-mini", icon: "devicon-nodejs-plain", label: "Node.js" },
  { className: "pg-mini", icon: "devicon-postgresql-plain", label: "PostgreSQL" },
  { className: "ts-mini", icon: "devicon-typescript-plain", label: "TypeScript" },
];
