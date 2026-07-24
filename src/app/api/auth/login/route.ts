import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password ?? "");

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
