"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  SiteContent,
  SiteStat,
  SiteTechCategory,
  SiteTrailItem,
  SiteCertification,
} from "@/types/content";
import { AdminNav } from "./admin-nav";

interface ContentAdminProps {
  initialContent: SiteContent;
}

export function ContentAdmin({ initialContent }: ContentAdminProps) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof SiteContent>(
    section: K,
    value: SiteContent[K]
  ) {
    setContent((prev) => ({ ...prev, [section]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Erro ao salvar textos");
      return;
    }

    const saved = (await res.json()) as SiteContent;
    setContent(saved);
    setMessage("Textos salvos! Atualize o site para ver as mudanças.");
    router.refresh();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-page admin-page-wide">
      <header className="admin-header">
        <div>
          <h1>Editar textos do site</h1>
          <p>Altere títulos, bio, contato, sobre e demais textos do portfólio.</p>
          <AdminNav active="conteudo" />
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

      <form onSubmit={handleSubmit} className="admin-content-form">
        <section className="admin-card">
          <h2>SEO / Meta</h2>
          <div className="admin-form admin-form-grid">
            <label className="admin-label">
              Título do site
              <input
                className="admin-input"
                value={content.meta.siteTitle}
                onChange={(e) =>
                  update("meta", { ...content.meta, siteTitle: e.target.value })
                }
                required
              />
            </label>
            <label className="admin-label">
              Título da página Projetos
              <input
                className="admin-input"
                value={content.meta.projectsPageTitle}
                onChange={(e) =>
                  update("meta", {
                    ...content.meta,
                    projectsPageTitle: e.target.value,
                  })
                }
                required
              />
            </label>
            <label className="admin-label admin-label-full">
              Descrição do site
              <textarea
                className="admin-input admin-textarea"
                value={content.meta.siteDescription}
                onChange={(e) =>
                  update("meta", {
                    ...content.meta,
                    siteDescription: e.target.value,
                  })
                }
                required
              />
            </label>
            <label className="admin-label admin-label-full">
              Descrição da página Projetos
              <textarea
                className="admin-input admin-textarea"
                value={content.meta.projectsPageDescription}
                onChange={(e) =>
                  update("meta", {
                    ...content.meta,
                    projectsPageDescription: e.target.value,
                  })
                }
                required
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h2>Menu de navegação</h2>
          <div className="admin-form admin-form-grid">
            {(
              [
                ["home", "Home"],
                ["projects", "Projetos"],
                ["tech", "Tecnologias"],
                ["certifications", "Certificações"],
                ["contact", "Contato"],
                ["about", "Sobre"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="admin-label">
                {label}
                <input
                  className="admin-input"
                  value={content.nav[key]}
                  onChange={(e) =>
                    update("nav", { ...content.nav, [key]: e.target.value })
                  }
                  required
                />
              </label>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <h2>Hero (início)</h2>
          <div className="admin-form admin-form-grid">
            <label className="admin-label">
              Eyebrow
              <input
                className="admin-input"
                value={content.hero.eyebrow}
                onChange={(e) =>
                  update("hero", { ...content.hero, eyebrow: e.target.value })
                }
              />
            </label>
            <label className="admin-label">
              Nome
              <input
                className="admin-input"
                value={content.hero.name}
                onChange={(e) =>
                  update("hero", { ...content.hero, name: e.target.value })
                }
                required
              />
            </label>
            <label className="admin-label">
              Cargo / papel
              <input
                className="admin-input"
                value={content.hero.role}
                onChange={(e) =>
                  update("hero", { ...content.hero, role: e.target.value })
                }
                required
              />
            </label>
            <label className="admin-label">
              Botão principal
              <input
                className="admin-input"
                value={content.hero.primaryCta}
                onChange={(e) =>
                  update("hero", {
                    ...content.hero,
                    primaryCta: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Botão secundário
              <input
                className="admin-input"
                value={content.hero.secondaryCta}
                onChange={(e) =>
                  update("hero", {
                    ...content.hero,
                    secondaryCta: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label admin-label-full">
              Bio
              <textarea
                className="admin-input admin-textarea"
                value={content.hero.bio}
                onChange={(e) =>
                  update("hero", { ...content.hero, bio: e.target.value })
                }
                required
              />
            </label>
            <label className="admin-label admin-label-full">
              Badges (separados por vírgula)
              <input
                className="admin-input"
                value={content.hero.badges.join(", ")}
                onChange={(e) =>
                  update("hero", {
                    ...content.hero,
                    badges: e.target.value
                      .split(",")
                      .map((b) => b.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h2>Seção Projetos (home)</h2>
          <div className="admin-form admin-form-grid">
            <label className="admin-label">
              Título
              <input
                className="admin-input"
                value={content.projectsSection.title}
                onChange={(e) =>
                  update("projectsSection", {
                    ...content.projectsSection,
                    title: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Texto do botão “ver todos”
              <input
                className="admin-input"
                value={content.projectsSection.viewAllLabel}
                onChange={(e) =>
                  update("projectsSection", {
                    ...content.projectsSection,
                    viewAllLabel: e.target.value,
                  })
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h2>Página /projetos</h2>
          <div className="admin-form admin-form-grid">
            <label className="admin-label">
              Eyebrow
              <input
                className="admin-input"
                value={content.projectsPage.eyebrow}
                onChange={(e) =>
                  update("projectsPage", {
                    ...content.projectsPage,
                    eyebrow: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Título
              <input
                className="admin-input"
                value={content.projectsPage.title}
                onChange={(e) =>
                  update("projectsPage", {
                    ...content.projectsPage,
                    title: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label admin-label-full">
              Introdução
              <textarea
                className="admin-input admin-textarea"
                value={content.projectsPage.intro}
                onChange={(e) =>
                  update("projectsPage", {
                    ...content.projectsPage,
                    intro: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Texto vazio
              <input
                className="admin-input"
                value={content.projectsPage.empty}
                onChange={(e) =>
                  update("projectsPage", {
                    ...content.projectsPage,
                    empty: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Botão voltar
              <input
                className="admin-input"
                value={content.projectsPage.backLabel}
                onChange={(e) =>
                  update("projectsPage", {
                    ...content.projectsPage,
                    backLabel: e.target.value,
                  })
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h2>Tecnologias</h2>
          <div className="admin-form admin-form-grid">
            <label className="admin-label">
              Título
              <input
                className="admin-input"
                value={content.tech.title}
                onChange={(e) =>
                  update("tech", { ...content.tech, title: e.target.value })
                }
              />
            </label>
            <label className="admin-label">
              Título da trilha
              <input
                className="admin-input"
                value={content.tech.trailTitle}
                onChange={(e) =>
                  update("tech", {
                    ...content.tech,
                    trailTitle: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label admin-label-full">
              Introdução
              <textarea
                className="admin-input admin-textarea"
                value={content.tech.intro}
                onChange={(e) =>
                  update("tech", { ...content.tech, intro: e.target.value })
                }
              />
            </label>
          </div>

          <h3 className="admin-subheading">Estatísticas</h3>
          <div className="admin-repeat-list">
            {content.tech.stats.map((stat, index) => (
              <div key={index} className="admin-repeat-row">
                <input
                  className="admin-input"
                  placeholder="Rótulo"
                  value={stat.label}
                  onChange={(e) => {
                    const stats = [...content.tech.stats];
                    stats[index] = { ...stat, label: e.target.value };
                    update("tech", { ...content.tech, stats });
                  }}
                />
                <input
                  className="admin-input"
                  type="number"
                  placeholder="Valor"
                  value={stat.value}
                  onChange={(e) => {
                    const stats = [...content.tech.stats];
                    stats[index] = {
                      ...stat,
                      value: Number(e.target.value) || 0,
                    };
                    update("tech", { ...content.tech, stats });
                  }}
                />
                <input
                  className="admin-input"
                  placeholder="Sufixo (+)"
                  value={stat.suffix ?? ""}
                  onChange={(e) => {
                    const stats = [...content.tech.stats];
                    const next: SiteStat = {
                      ...stat,
                      suffix: e.target.value || undefined,
                    };
                    stats[index] = next;
                    update("tech", { ...content.tech, stats });
                  }}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-small admin-btn-danger"
                  onClick={() =>
                    update("tech", {
                      ...content.tech,
                      stats: content.tech.stats.filter((_, i) => i !== index),
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
                update("tech", {
                  ...content.tech,
                  stats: [
                    ...content.tech.stats,
                    { label: "Novo", value: 0 },
                  ],
                })
              }
            >
              + Estatística
            </button>
          </div>

          <h3 className="admin-subheading">Categorias</h3>
          <div className="admin-repeat-list">
            {content.tech.categories.map((cat, index) => (
              <div key={index} className="admin-repeat-block">
                <div className="admin-repeat-row">
                  <input
                    className="admin-input"
                    placeholder="Título da categoria"
                    value={cat.title}
                    onChange={(e) => {
                      const categories = [...content.tech.categories];
                      categories[index] = { ...cat, title: e.target.value };
                      update("tech", { ...content.tech, categories });
                    }}
                  />
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={cat.highlight === true}
                      onChange={(e) => {
                        const categories = [...content.tech.categories];
                        const next: SiteTechCategory = {
                          ...cat,
                          highlight: e.target.checked || undefined,
                        };
                        categories[index] = next;
                        update("tech", { ...content.tech, categories });
                      }}
                    />
                    Destaque
                  </label>
                  <button
                    type="button"
                    className="admin-btn admin-btn-small admin-btn-danger"
                    onClick={() =>
                      update("tech", {
                        ...content.tech,
                        categories: content.tech.categories.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    Remover
                  </button>
                </div>
                <textarea
                  className="admin-input admin-textarea"
                  placeholder="Itens (um por linha)"
                  value={cat.items.join("\n")}
                  onChange={(e) => {
                    const categories = [...content.tech.categories];
                    categories[index] = {
                      ...cat,
                      items: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    };
                    update("tech", { ...content.tech, categories });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn-outline admin-btn-small"
              onClick={() =>
                update("tech", {
                  ...content.tech,
                  categories: [
                    ...content.tech.categories,
                    { title: "Nova categoria", items: [] },
                  ],
                })
              }
            >
              + Categoria
            </button>
          </div>

          <h3 className="admin-subheading">Trilha / stack</h3>
          <div className="admin-repeat-list">
            {content.tech.trail.map((item, index) => (
              <div key={index} className="admin-repeat-row">
                <input
                  className="admin-input"
                  placeholder="Item"
                  value={item.label}
                  onChange={(e) => {
                    const trail = [...content.tech.trail];
                    trail[index] = { ...item, label: e.target.value };
                    update("tech", { ...content.tech, trail });
                  }}
                />
                <select
                  className="admin-input"
                  value={item.status ?? ""}
                  onChange={(e) => {
                    const trail = [...content.tech.trail];
                    const status = e.target.value as SiteTrailItem["status"];
                    trail[index] = { ...item, status };
                    update("tech", { ...content.tech, trail });
                  }}
                >
                  <option value="">Pendente</option>
                  <option value="done">Concluído</option>
                  <option value="current">Atual</option>
                </select>
                <button
                  type="button"
                  className="admin-btn admin-btn-small admin-btn-danger"
                  onClick={() =>
                    update("tech", {
                      ...content.tech,
                      trail: content.tech.trail.filter((_, i) => i !== index),
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
                update("tech", {
                  ...content.tech,
                  trail: [...content.tech.trail, { label: "Novo", status: "" }],
                })
              }
            >
              + Item da trilha
            </button>
          </div>
        </section>

        <section className="admin-card">
          <h2>Certificações</h2>
          <div className="admin-form">
            <label className="admin-label">
              Título da seção
              <input
                className="admin-input"
                value={content.certifications.title}
                onChange={(e) =>
                  update("certifications", {
                    ...content.certifications,
                    title: e.target.value,
                  })
                }
                required
              />
            </label>
            <label className="admin-label">
              Introdução
              <textarea
                className="admin-input admin-textarea"
                value={content.certifications.intro}
                onChange={(e) =>
                  update("certifications", {
                    ...content.certifications,
                    intro: e.target.value,
                  })
                }
                required
              />
            </label>
          </div>

          <h3 className="admin-subheading">Lista de certificações</h3>
          <div className="admin-repeat-list">
            {content.certifications.items.map((cert, index) => (
              <div key={index} className="admin-repeat-block">
                <div className="admin-repeat-row admin-repeat-row-wrap">
                  <input
                    className="admin-input"
                    placeholder="Nome da certificação"
                    value={cert.title}
                    onChange={(e) => {
                      const items = [...content.certifications.items];
                      items[index] = { ...cert, title: e.target.value };
                      update("certifications", {
                        ...content.certifications,
                        items,
                      });
                    }}
                    required
                  />
                  <input
                    className="admin-input"
                    placeholder="Instituição / plataforma"
                    value={cert.issuer}
                    onChange={(e) => {
                      const items = [...content.certifications.items];
                      items[index] = { ...cert, issuer: e.target.value };
                      update("certifications", {
                        ...content.certifications,
                        items,
                      });
                    }}
                    required
                  />
                  <input
                    className="admin-input admin-input-narrow"
                    placeholder="Data (ex.: 2024 ou Mar 2025)"
                    value={cert.date}
                    onChange={(e) => {
                      const items = [...content.certifications.items];
                      items[index] = { ...cert, date: e.target.value };
                      update("certifications", {
                        ...content.certifications,
                        items,
                      });
                    }}
                    required
                  />
                </div>
                <div className="admin-repeat-row admin-repeat-row-wrap">
                  <input
                    className="admin-input"
                    placeholder="URL da credencial (opcional)"
                    value={cert.link ?? ""}
                    onChange={(e) => {
                      const items = [...content.certifications.items];
                      items[index] = {
                        ...cert,
                        link: e.target.value || undefined,
                      };
                      update("certifications", {
                        ...content.certifications,
                        items,
                      });
                    }}
                  />
                  <input
                    className="admin-input admin-input-narrow"
                    placeholder="Texto do link"
                    value={cert.linkLabel ?? ""}
                    onChange={(e) => {
                      const items = [...content.certifications.items];
                      items[index] = {
                        ...cert,
                        linkLabel: e.target.value || undefined,
                      };
                      update("certifications", {
                        ...content.certifications,
                        items,
                      });
                    }}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-small admin-btn-danger"
                    onClick={() =>
                      update("certifications", {
                        ...content.certifications,
                        items: content.certifications.items.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn-outline admin-btn-small"
              onClick={() => {
                const newCert: SiteCertification = {
                  title: "",
                  issuer: "",
                  date: "",
                  linkLabel: "Ver credencial",
                };
                update("certifications", {
                  ...content.certifications,
                  items: [...content.certifications.items, newCert],
                });
              }}
            >
              + Certificação
            </button>
          </div>
        </section>

        <section className="admin-card">
          <h2>Contato</h2>
          <div className="admin-form admin-form-grid">
            <label className="admin-label admin-label-full">
              Título
              <input
                className="admin-input"
                value={content.contact.title}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    title: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Rótulo email
              <input
                className="admin-input"
                value={content.contact.emailLabel}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    emailLabel: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Email
              <input
                className="admin-input"
                type="email"
                value={content.contact.email}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    email: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Rótulo LinkedIn
              <input
                className="admin-input"
                value={content.contact.linkedinLabel}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    linkedinLabel: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Texto LinkedIn
              <input
                className="admin-input"
                value={content.contact.linkedinText}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    linkedinText: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label admin-label-full">
              URL LinkedIn
              <input
                className="admin-input"
                value={content.contact.linkedinUrl}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    linkedinUrl: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Rótulo GitHub
              <input
                className="admin-input"
                value={content.contact.githubLabel}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    githubLabel: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Texto GitHub
              <input
                className="admin-input"
                value={content.contact.githubText}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    githubText: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label admin-label-full">
              URL GitHub
              <input
                className="admin-input"
                value={content.contact.githubUrl}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    githubUrl: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Rótulo WhatsApp
              <input
                className="admin-input"
                value={content.contact.whatsappLabel}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    whatsappLabel: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Texto WhatsApp
              <input
                className="admin-input"
                value={content.contact.whatsappText}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    whatsappText: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label admin-label-full">
              URL WhatsApp
              <input
                className="admin-input"
                value={content.contact.whatsappUrl}
                onChange={(e) =>
                  update("contact", {
                    ...content.contact,
                    whatsappUrl: e.target.value,
                  })
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h2>Sobre mim</h2>
          <div className="admin-form">
            <label className="admin-label">
              Título
              <input
                className="admin-input"
                value={content.about.title}
                onChange={(e) =>
                  update("about", { ...content.about, title: e.target.value })
                }
                required
              />
            </label>
            <label className="admin-label">
              Parágrafos (um por linha vazia = novo parágrafo)
              <textarea
                className="admin-input admin-textarea admin-textarea-tall"
                value={content.about.paragraphs.join("\n\n")}
                onChange={(e) =>
                  update("about", {
                    ...content.about,
                    paragraphs: e.target.value
                      .split(/\n\s*\n/)
                      .map((p) => p.trim())
                      .filter(Boolean),
                  })
                }
                required
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h2>Rodapé</h2>
          <div className="admin-form admin-form-grid">
            <label className="admin-label">
              Texto rodapé (home)
              <input
                className="admin-input"
                value={content.footer.homeText}
                onChange={(e) =>
                  update("footer", {
                    ...content.footer,
                    homeText: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label">
              Link do admin no rodapé
              <input
                className="admin-input"
                value={content.footer.adminLinkLabel}
                onChange={(e) =>
                  update("footer", {
                    ...content.footer,
                    adminLinkLabel: e.target.value,
                  })
                }
              />
            </label>
            <label className="admin-label admin-label-full">
              Texto rodapé (página projetos) — use {"{year}"} para o ano
              <input
                className="admin-input"
                value={content.footer.projectsPageText}
                onChange={(e) =>
                  update("footer", {
                    ...content.footer,
                    projectsPageText: e.target.value,
                  })
                }
              />
            </label>
          </div>
        </section>

        <div className="admin-sticky-save">
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
          >
            {loading ? "Salvando…" : "Salvar textos"}
          </button>
          {message && <p className="admin-message">{message}</p>}
        </div>
      </form>
    </div>
  );
}
