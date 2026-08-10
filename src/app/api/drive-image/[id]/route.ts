import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DRIVE_HOSTS = new Set([
  "drive.google.com",
  "lh3.googleusercontent.com",
  "googleusercontent.com",
]);

function isAllowedId(id: string) {
  return /^[a-zA-Z0-9_-]{10,}$/.test(id);
}

async function fetchDriveImage(id: string): Promise<Response> {
  const candidates = [
    `https://lh3.googleusercontent.com/d/${id}=w1200`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w1200`,
    `https://drive.google.com/uc?export=download&id=${id}`,
  ];

  let lastError: unknown;

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
        cache: "force-cache",
      });

      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status} for ${url}`);
        continue;
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.startsWith("image/")) {
        lastError = new Error(`Not an image: ${contentType}`);
        continue;
      }

      return res;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Falha ao obter imagem do Drive");
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!isAllowedId(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const upstream = await fetchDriveImage(id);
    const bytes = await upstream.arrayBuffer();
    const contentType = upstream.headers.get("content-type") ?? "image/png";

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível carregar a imagem do Google Drive" },
      { status: 502 }
    );
  }
}
