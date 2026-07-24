"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Senha incorreta");
      return;
    }

    router.push("/admin/projetos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <label className="admin-label">
        Senha de administrador
        <input
          type="password"
          className="admin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
          required
          autoFocus
        />
      </label>
      {error && <p className="admin-error">{error}</p>}
      <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
