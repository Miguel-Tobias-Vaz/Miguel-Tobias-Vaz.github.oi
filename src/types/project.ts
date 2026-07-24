export interface ProjectTag {
  className: string;
  icon: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  tags: ProjectTag[];
  link: string;
  linkLabel: string;
  order: number;
  featured?: boolean;
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
