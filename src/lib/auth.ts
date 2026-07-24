import { cookies } from "next/headers";

export const AUTH_COOKIE = "portfolio_admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

export function verifyPassword(password: string): boolean {
  return password === getAdminPassword();
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value === "authenticated";
}
