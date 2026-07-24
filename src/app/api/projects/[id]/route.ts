import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteProject, getProject, updateProject } from "@/lib/projects";
import type { ProjectInput } from "@/types/project";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = (await request.json()) as Partial<ProjectInput>;
    const project = await updateProject(id, body);
    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar projeto" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteProject(id);
  if (!deleted) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
