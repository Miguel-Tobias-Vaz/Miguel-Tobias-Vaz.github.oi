import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSiteContent, updateSiteContent } from "@/lib/content";
import type { SiteContent } from "@/types/content";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SiteContent;

    if (!body?.hero?.name?.trim() || !body?.about?.title?.trim()) {
      return NextResponse.json(
        { error: "Conteúdo incompleto: hero e sobre são obrigatórios" },
        { status: 400 }
      );
    }

    const saved = await updateSiteContent(body);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Erro ao salvar conteúdo" }, { status: 500 });
  }
}
