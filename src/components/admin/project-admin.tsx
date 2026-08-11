"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getProjectGallery, type Project, type ProjectTag } from "@/types/project";
import { TAG_PRESETS } from "@/types/project";
import { AdminNav } from "./admin-nav";

const emptyForm = {
  title: "",
  description: "",
  images: [""] as string[],
  imageAlt: "",
  link: "",
  linkLabel: "Ver Projeto",
  order: "",
  featured: false,
};

interface ProjectAdminProps {
  initialProjects: Project[];
}

export function ProjectAdmin({ initialProjects }: ProjectAdminProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedTags([]);
  }

  function startEdit(project: Project) {
    const gallery = getProjectGallery(project);
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      images: gallery.length > 0 ? gallery : [""],
      imageAlt: project.imageAlt ?? "",
      link: project.link,
      linkLabel: project.linkLabel,
      order: String(project.order),
      featured: project.featured === true,
    });
    setSelectedTags(project.tags);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleTag(tag: ProjectTag) {
    setSelectedTags((prev) => {
      const exists = prev.some((t) => t.label === tag.label);
      return exists ? prev.filter((t) => t.label !== tag.label) : [...prev, tag];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const images = form.images.map((u) => u.trim()).filter(Boolean);

    const payload = {
      title: form.title,
      description: form.description,
      images,
      imageAlt: form.imageAlt || undefined,
      link: form.link,
      linkLabel: form.linkLabel,
      order: form.order ? parseInt(form.order, 10) : undefined,
      tags: selectedTags,
      featured: form.featured,
    };

    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error ?? "Erro ao salvar");
      return;
    }

    setMessage(editingId ? "Projeto atualizado!" : "Projeto cadastrado!");
    resetForm();
    router.refresh();

    const listRes = await fetch("/api/projects");
    if (listRes.ok) {
      setProjects(await listRes.json());
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir o projeto "${title}"?`)) return;

    setLoading(true);
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      setMessage("Erro ao excluir projeto");
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
    setMessage("Projeto excluído");
    router.refresh();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Gerenciar projetos</h1>
          <p>Cadastre, edite ou remova projetos do seu portfólio.</p>
          <AdminNav active="projetos" />
        </div>
        <div className="admin-header-actions">
          <Link href="/" className="admin-btn admin-btn-outline">
            Ver site
          </Link>
          <button type="button" className="admin-btn admin-btn-outline" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <section className="admin-card">
        <h2>{editingId ? "Editar projeto" : "Novo projeto"}</h2>
        <form onSubmit={handleSubmit} className="admin-form admin-form-grid">
          <label className="admin-label">
            Título *
            <input
              className="admin-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label className="admin-label">
            Ordem (opcional)
            <input
              className="admin-input"
              type="number"
              min={0}
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              placeholder="0, 1, 2…"
            />
          </label>

          <label className="admin-label admin-label-full">
            Descrição *
            <textarea
              className="admin-input admin-textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              required
            />
          </label>

          <fieldset className="admin-label admin-label-full admin-gallery">
            <legend>Galeria de fotos</legend>
            <p className="admin-hint">
              Cole um link do Google Drive ou caminho por foto. A primeira é a capa do card.
            </p>
            <div className="admin-repeat-list">
              {form.images.map((url, index) => (
                <div key={index} className="admin-repeat-row admin-gallery-row">
                  <input
                    className="admin-input"
                    value={url}
                    onChange={(e) => {
                      const images = [...form.images];
                      images[index] = e.target.value;
                      setForm({ ...form, images });
                    }}
                    placeholder={
                      index === 0
                        ? "Capa — link do Drive ou /Imagens/arquivo.png"
                        : `Foto ${index + 1}`
                    }
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-small admin-btn-danger"
                    disabled={form.images.length <= 1}
                    onClick={() =>
                      setForm({
                        ...form,
                        images: form.images.filter((_, i) => i !== index),
                      })
                    }
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="admin-btn admin-btn-outline admin-btn-small"
                onClick={() =>
                  setForm({ ...form, images: [...form.images, ""] })
                }
              >
                + Adicionar foto
              </button>
            </div>
          </fieldset>

          <label className="admin-label admin-label-full">
            Texto alternativo das imagens
            <input
              className="admin-input"
              value={form.imageAlt}
              onChange={(e) => setForm({ ...form, imageAlt: e.target.value })}
            />
          </label>

          <label className="admin-label">
            Link *
            <input
              className="admin-input"
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://github.com/..."
              required
            />
          </label>

          <label className="admin-label">
            Texto do botão
            <input
              className="admin-input"
              value={form.linkLabel}
              onChange={(e) => setForm({ ...form, linkLabel: e.target.value })}
            />
          </label>

          <label className="admin-label admin-label-full admin-checkbox">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Exibir na página principal (projeto principal)
          </label>

          <fieldset className="admin-label admin-label-full admin-tags">
            <legend>Tecnologias</legend>
            <div className="admin-tags-grid">
              {TAG_PRESETS.map((tag) => (
                <label key={tag.label} className="admin-tag-option">
                  <input
                    type="checkbox"
                    checked={selectedTags.some((t) => t.label === tag.label)}
                    onChange={() => toggleTag(tag)}
                  />
                  {tag.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="admin-form-actions admin-label-full">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? "Salvando…" : editingId ? "Salvar alterações" : "Cadastrar projeto"}
            </button>
            {editingId && (
              <button type="button" className="admin-btn admin-btn-outline" onClick={resetForm}>
                Cancelar edição
              </button>
            )}
          </div>
        </form>
        {message && <p className="admin-message">{message}</p>}
      </section>

      <section className="admin-card">
        <h2>Projetos cadastrados ({projects.length})</h2>
        {projects.length === 0 ? (
          <p className="admin-empty">Nenhum projeto ainda. Cadastre o primeiro acima.</p>
        ) : (
          <ul className="admin-list">
            {projects.map((project) => (
              <li key={project.id} className="admin-list-item">
                <div>
                  <strong>{project.title}</strong>
                  <span className="admin-list-meta">
                    ordem {project.order}
                    {project.featured ? " · principal" : ""} ·{" "}
                    {getProjectGallery(project).length} foto
                    {getProjectGallery(project).length === 1 ? "" : "s"} ·{" "}
                    {project.tags.map((t) => t.label).join(", ") || "sem tags"}
                  </span>
                </div>
                <div className="admin-list-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn-small"
                    onClick={() => startEdit(project)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-small admin-btn-danger"
                    onClick={() => handleDelete(project.id, project.title)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
