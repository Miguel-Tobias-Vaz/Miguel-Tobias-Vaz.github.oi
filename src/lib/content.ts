import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "@/types/content";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function updateSiteContent(content: SiteContent): Promise<SiteContent> {
  await fs.writeFile(DATA_PATH, `${JSON.stringify(content, null, 2)}\n`, "utf-8");
  return content;
}

export function buildHomeNav(content: SiteContent) {
  return [
    { href: "#home", label: content.nav.home },
    { href: "/projetos", label: content.nav.projects },
    { href: "#tecnologias", label: content.nav.tech },
    { href: "#certificacoes", label: content.nav.certifications },
    { href: "#contato", label: content.nav.contact },
    { href: "#sobre", label: content.nav.about },
  ];
}

export function buildProjectsNav(content: SiteContent) {
  return [
    { href: "/#home", label: content.nav.home },
    { href: "/projetos", label: content.nav.projects },
    { href: "/#tecnologias", label: content.nav.tech },
    { href: "/#certificacoes", label: content.nav.certifications },
    { href: "/#contato", label: content.nav.contact },
    { href: "/#sobre", label: content.nav.about },
  ];
}

export function formatFooterYear(text: string, year = new Date().getFullYear()) {
  return text.replaceAll("{year}", String(year));
}
