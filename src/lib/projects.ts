import { promises as fs } from "fs";
import path from "path";
import type { Project, ProjectInput } from "@/types/project";

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");

interface ProjectsFile {
  projects: Project[];
}

async function readFile(): Promise<ProjectsFile> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as ProjectsFile;
}

async function writeFile(data: ProjectsFile): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getProjects(): Promise<Project[]> {
  const data = await readFile();
  return [...data.projects].sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured === true);
}

export async function getProject(id: string): Promise<Project | null> {
  const data = await readFile();
  return data.projects.find((p) => p.id === id) ?? null;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const data = await readFile();
  const baseId = input.id?.trim() || slugify(input.title);
  let id = baseId;
  let n = 1;
  while (data.projects.some((p) => p.id === id)) {
    id = `${baseId}-${n++}`;
  }

  const order =
    input.order ??
    (data.projects.length > 0
      ? Math.max(...data.projects.map((p) => p.order)) + 1
      : 0);

  const project: Project = {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    image: input.image?.trim() || undefined,
    imageAlt: input.imageAlt?.trim() || undefined,
    tags: input.tags,
    link: input.link.trim(),
    linkLabel: input.linkLabel.trim() || "Ver Projeto",
    order,
    featured: input.featured === true,
  };

  data.projects.push(project);
  await writeFile(data);
  return project;
}

export async function updateProject(
  id: string,
  input: Partial<ProjectInput>
): Promise<Project | null> {
  const data = await readFile();
  const index = data.projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = data.projects[index];
  const updated: Project = {
    ...current,
    ...input,
    id: current.id,
    title: input.title?.trim() ?? current.title,
    description: input.description?.trim() ?? current.description,
    image: input.image !== undefined ? input.image.trim() || undefined : current.image,
    imageAlt:
      input.imageAlt !== undefined
        ? input.imageAlt.trim() || undefined
        : current.imageAlt,
    link: input.link?.trim() ?? current.link,
    linkLabel: input.linkLabel?.trim() ?? current.linkLabel,
    tags: input.tags ?? current.tags,
    order: input.order ?? current.order,
    featured: input.featured !== undefined ? input.featured === true : current.featured,
  };

  data.projects[index] = updated;
  await writeFile(data);
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const data = await readFile();
  const before = data.projects.length;
  data.projects = data.projects.filter((p) => p.id !== id);
  if (data.projects.length === before) return false;
  await writeFile(data);
  return true;
}
