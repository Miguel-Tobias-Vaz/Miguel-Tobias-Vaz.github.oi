import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createProject, getProjects } from "@/lib/projects";
import type { ProjectInput } from "@/types/project";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProjectInput;

    if (!body.title?.trim() || !body.description?.trim() || !body.link?.trim()) {
      return NextResponse.json(
        { error: "Título, descrição e link são obrigatórios" },
        { status: 400 }
      );
    }

    const project = await createProject({
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : [],
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar projeto" }, { status: 500 });
  }
}
