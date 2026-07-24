import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { isAuthenticated } from "@/lib/auth";
import "@/styles/admin.css";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin/projetos");
  }

  return (
    <main className="admin-shell">
      <div className="admin-card admin-login-card">
        <h1>Admin do portfólio</h1>
        <p>Entre para cadastrar e gerenciar seus projetos.</p>
        <LoginForm />
        <Link href="/" className="admin-back-link">
          ← Voltar ao site
        </Link>
      </div>
    </main>
  );
}
