import { cookies } from "next/headers";

export const AUTH_COOKIE = "portfolio_admin_session";

const DEFAULT_USER = "admin";
const DEFAULT_PASSWORD = "miguel0907";

export function getAdminUser(): string {
  return process.env.ADMIN_USER?.trim() || DEFAULT_USER;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_PASSWORD;
}

export function verifyCredentials(username: string, password: string): boolean {
  return username === getAdminUser() && password === getAdminPassword();
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value === "authenticated";
}
