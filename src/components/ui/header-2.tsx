"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/components/ui/use-scroll";

export interface Header2Link {
  label: string;
  href: string;
}

export interface Header2Props {
  links: Header2Link[];
  activeHref?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

function isExternal(href: string) {
  return href.startsWith("http");
}

function normalizeHref(href: string) {
  return href.replace(/^\//, "");
}

function hrefMatchesSection(href: string, sectionId: string) {
  const normalized = normalizeHref(href);
  return (
    normalized === `#${sectionId}` ||
    (sectionId === "home" && (normalized === "#home" || normalized === ""))
  );
}

function NavLink({
  href,
  label,
  active,
  className,
  onNavigate,
  onActivate,
  linkRef,
}: {
  href: string;
  label: string;
  active?: boolean;
  className?: string;
  onNavigate?: () => void;
  onActivate?: (href: string, el: HTMLElement) => void;
  linkRef?: (el: HTMLElement | null) => void;
}) {
  const classes = cn(
    buttonVariants({ variant: "ghost", size: "sm" }),
    "relative z-[1] h-9 shrink-0 whitespace-nowrap px-4 text-sm text-foreground/90 hover:text-primary",
    (active || undefined) && "text-primary",
    "[&.active]:text-primary",
    className
  );

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onActivate?.(href, e.currentTarget);
    onNavigate?.();
  };

  const setRef = (el: HTMLAnchorElement | null) => {
    linkRef?.(el);
  };

  if (isExternal(href)) {
    return (
      <a
        ref={setRef}
        href={href}
        className={classes}
        data-portfolio-nav-link
        data-nav-href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      ref={setRef}
      href={href}
      className={classes}
      data-portfolio-nav-link
      data-nav-href={href}
      onClick={handleClick}
    >
      {label}
    </Link>
  );
}

export function Header2({
  links,
  activeHref,
  ctaHref,
  ctaLabel = "Contato",
}: Header2Props) {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);
  const navListRef = React.useRef<HTMLDivElement>(null);
  const linkRefs = React.useRef(new Map<string, HTMLElement>());
  const [activeLinkHref, setActiveLinkHref] = React.useState(
    activeHref ?? links[0]?.href ?? ""
  );
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0, opacity: 0 });

  const moveIndicatorTo = React.useCallback((element: HTMLElement | null) => {
    const nav = navListRef.current;
    if (!nav || !element) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();

    setIndicator({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      opacity: 1,
    });
  }, []);

  const moveIndicatorToHref = React.useCallback(
    (href: string) => {
      const el = linkRefs.current.get(href);
      if (el) {
        moveIndicatorTo(el);
        return;
      }

      const nav = navListRef.current;
      const fallback = nav?.querySelector<HTMLElement>(
        `[data-nav-href="${href}"], [data-nav-href="/${normalizeHref(href)}"]`
      );
      moveIndicatorTo(fallback ?? null);
    },
    [moveIndicatorTo]
  );

  const syncIndicatorFromActive = React.useCallback(() => {
    const nav = navListRef.current;
    if (!nav) return;

    const activeEl = nav.querySelector<HTMLElement>("[data-portfolio-nav-link].active");
    if (activeEl) {
      moveIndicatorTo(activeEl);
      return;
    }

    moveIndicatorToHref(activeLinkHref || activeHref || links[0]?.href || "");
  }, [activeHref, activeLinkHref, links, moveIndicatorToHref]);

  React.useLayoutEffect(() => {
    moveIndicatorToHref(activeLinkHref);
  }, [activeLinkHref, moveIndicatorToHref, links]);

  React.useEffect(() => {
    const nav = navListRef.current;
    if (!nav) return;

    const observer = new MutationObserver(() => {
      requestAnimationFrame(syncIndicatorFromActive);
    });
    observer.observe(nav, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class"],
    });

    const onNavActive = (event: Event) => {
      const href = (event as CustomEvent<{ href: string }>).detail?.href;
      if (!href) return;
      setActiveLinkHref(href);
      moveIndicatorToHref(href);
    };

    window.addEventListener("resize", syncIndicatorFromActive);
    window.addEventListener("portfolio-nav-active", onNavActive);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncIndicatorFromActive);
      window.removeEventListener("portfolio-nav-active", onNavActive);
    };
  }, [moveIndicatorToHref, syncIndicatorFromActive]);

  const handleActivate = (href: string, element: HTMLElement) => {
    const nav = navListRef.current;
    if (!nav) return;

    setActiveLinkHref(href);
    nav.querySelectorAll("[data-portfolio-nav-link]").forEach((link) => {
      link.classList.remove("active");
    });
    element.classList.add("active");
    moveIndicatorTo(element);
  };

  const registerLinkRef = React.useCallback(
    (href: string, el: HTMLElement | null) => {
      if (el) {
        linkRefs.current.set(href, el);
        if (href === activeLinkHref || href === activeHref) {
          requestAnimationFrame(() => moveIndicatorTo(el));
        }
        return;
      }
      linkRefs.current.delete(href);
    },
    [activeHref, activeLinkHref, moveIndicatorTo]
  );

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (activeHref) {
      setActiveLinkHref(activeHref);
    }
  }, [activeHref]);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={cn(
        "w-full border-b border-transparent transition-all ease-out md:rounded-md md:border",
        {
          "border-border/80 bg-background/95 shadow-[0_0_30px_rgba(61,80,144,0.08)] backdrop-blur-lg supports-[backdrop-filter]:bg-background/70 md:shadow-md":
            scrolled && !open,
          "bg-background/95 backdrop-blur-lg": open,
        }
      )}
    >
      <nav
        id="portfolio-nav"
        aria-label="Navegação principal"
        className={cn(
          "flex h-14 w-full items-center justify-between gap-3 px-3 md:h-12 md:px-2 md:transition-all md:ease-out",
          {
            "md:px-2": scrolled,
          }
        )}
      >
        <Link
          href="/#home"
          className="flex shrink-0 items-center"
          aria-label="Início"
          onClick={closeMenu}
        >
          <Image
            src="/Imagens/favicon/logo-header.png"
            alt=""
            width={44}
            height={44}
            className="h-10 w-10 object-contain md:h-9 md:w-9"
            priority
          />
        </Link>

        <div className="hidden shrink-0 items-center md:flex">
          <div ref={navListRef} className="relative flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-md border border-primary/40 bg-primary/10 shadow-[0_0_30px_rgba(61,80,144,0.08)] transition-[left,width,opacity] duration-300 ease-out"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.opacity,
              }}
            />
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={link.href === activeLinkHref}
                linkRef={(el) => registerLinkRef(link.href, el)}
                onActivate={handleActivate}
              />
            ))}
          </div>
          {ctaHref ? (
            <Button
              variant="outline"
              className="relative z-[1] ml-1 h-9 border-primary/40 hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          ) : null}
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="relative z-[1] border-border md:hidden"
          aria-expanded={open}
          aria-controls="portfolio-mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      <div
        id="portfolio-mobile-menu"
        className={cn(
          "border-border bg-background/95 fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] bottom-0 z-50 flex flex-col overflow-hidden border-t backdrop-blur-lg md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex h-full w-full flex-col justify-between gap-y-2 p-4">
          <div className="grid gap-y-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={link.href === activeLinkHref}
                className="justify-start border border-transparent data-[active=true]:border-primary/40 [&.active]:border-primary/40"
                onNavigate={closeMenu}
                onActivate={handleActivate}
              />
            ))}
          </div>
          {ctaHref ? (
            <Button variant="outline" className="w-full border-primary/40" asChild>
              <Link href={ctaHref} onClick={closeMenu}>
                {ctaLabel}
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export { hrefMatchesSection, normalizeHref };
