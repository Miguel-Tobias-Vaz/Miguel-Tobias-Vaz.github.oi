import Link from "next/link";

interface AdminNavProps {
  active: "projetos" | "conteudo";
}

export function AdminNav({ active }: AdminNavProps) {
  return (
    <nav className="admin-nav" aria-label="Seções do admin">
      <Link
        href="/admin/projetos"
        className={`admin-nav-link${active === "projetos" ? " is-active" : ""}`}
      >
        Projetos
      </Link>
      <Link
        href="/admin/conteudo"
        className={`admin-nav-link${active === "conteudo" ? " is-active" : ""}`}
      >
        Textos
      </Link>
    </nav>
  );
}
