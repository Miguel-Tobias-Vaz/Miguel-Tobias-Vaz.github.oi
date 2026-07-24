"use client";

import { useEffect } from "react";
import Lenis from "lenis";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function PortfolioEffects() {
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("[data-portfolio-nav-link]");
    const portfolioHeader = document.querySelector("#portfolio-header");
    const scrollProgressBar = document.querySelector(".scroll-progress-bar");
    const atmosphere = document.querySelector(".atmosphere");
    const atmosphereLayer = document.querySelector(".atmosphere-layer");
    const heroCinematic = document.querySelector(".hero-cinematic");
    const tiltCards = document.querySelectorAll(".tilt-card");
    const motionElements = document.querySelectorAll(".motion-in");
    const body = document.body;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canUsePointerFx =
      !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches;

    if (prefersReducedMotion) {
      body.classList.add("reduced-motion");
    }

    let lenis: Lenis | null = null;

    let navLockHref = "";
    let navLockUntil = 0;

    let lastDispatchedHref = "";

    function applyActiveNavLink(href: string, dispatch = false) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        const linkHref = link.getAttribute("href") ?? "";
        if (linkHref === href || linkHref === `/${href.replace(/^\//, "")}`) {
          link.classList.add("active");
        }
      });

      if (dispatch && href !== lastDispatchedHref) {
        lastDispatchedHref = href;
        window.dispatchEvent(
          new CustomEvent("portfolio-nav-active", { detail: { href } })
        );
      }
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 768px)").matches) {
          document.body.style.overflow = "";
        }

        const href = link.getAttribute("href") ?? "";
        if (!href.includes("#")) return;

        navLockHref = href;
        navLockUntil = performance.now() + 1500;
        applyActiveNavLink(href, true);
      });
    });

    function updateHeroProgress(currentScroll: number) {
      if (!heroCinematic || prefersReducedMotion) return;

      const total =
        (heroCinematic as HTMLElement).offsetHeight - window.innerHeight;
      const scrolled =
        currentScroll - (heroCinematic as HTMLElement).offsetTop;
      const progress = total > 0 ? clamp(scrolled / total, 0, 1) : 0;

      const content = clamp((progress - 0.08) / 0.32, 0, 1);
      const exit = clamp((progress - 0.72) / 0.28, 0, 1);
      const brandOpacity =
        clamp(1 - content * 0.92, 0.08, 1) * (1 - exit);

      (heroCinematic as HTMLElement).style.setProperty(
        "--hero-content",
        content.toFixed(3)
      );
      (heroCinematic as HTMLElement).style.setProperty(
        "--hero-exit",
        exit.toFixed(3)
      );
      (heroCinematic as HTMLElement).style.setProperty(
        "--hero-brand-opacity",
        brandOpacity.toFixed(3)
      );
      heroCinematic.classList.toggle("is-interactive", content > 0.4);
    }

    function updateAtmosphere(currentScroll: number) {
      if (!atmosphereLayer || prefersReducedMotion) return;
      (atmosphereLayer as HTMLElement).style.transform = `translate3d(0, ${currentScroll * 0.07}px, 0)`;
    }

    function updateScrollUi(currentScroll: number) {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;

      if (scrollProgressBar) {
        (scrollProgressBar as HTMLElement).style.width = `${progress}%`;
      }

      portfolioHeader?.classList.toggle("is-scrolled", currentScroll > 24);

      updateHeroProgress(currentScroll);
      updateAtmosphere(currentScroll);

      if (navLockUntil && performance.now() < navLockUntil && navLockHref) {
        applyActiveNavLink(navLockHref);
        return;
      }

      navLockUntil = 0;
      navLockHref = "";

      let current = "";
      const headerOffset =
        ((portfolioHeader as HTMLElement | null)?.offsetHeight ?? 76) + 48;
      const scrollMarker = currentScroll + headerOffset;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (scrollMarker >= sectionTop) {
          current = section.getAttribute("id") ?? current;
        }
      });

      const activeLink = Array.from(navLinks).find((link) =>
        hrefMatchesSection(link.getAttribute("href") ?? "", current)
      );
      const activeHref = activeLink?.getAttribute("href") ?? "";

      if (activeHref) {
        applyActiveNavLink(activeHref, true);
      } else {
        navLinks.forEach((link) => link.classList.remove("active"));
      }
    }

    function hrefMatchesSection(href: string, sectionId: string) {
      const normalized = href.replace(/^\//, "");
      return (
        normalized === `#${sectionId}` ||
        (sectionId === "home" &&
          (normalized === "#home" || normalized === ""))
      );
    }

    function onScroll(currentScroll: number) {
      updateScrollUi(currentScroll);
    }

    const anchorHandlers: Array<{ el: Element; fn: (e: Event) => void }> = [];

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      const fn = (e: Event) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const offset = -(
          ((portfolioHeader as HTMLElement | null)?.offsetHeight ?? 72) + 16
        );

        if (lenis) {
          lenis.scrollTo(target as HTMLElement, { offset, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
      anchor.addEventListener("click", fn);
      anchorHandlers.push({ el: anchor, fn });
    });

    let rafId = 0;

    if (prefersReducedMotion) {
      motionElements.forEach((el) => el.classList.add("is-visible"));
      document.querySelectorAll(".counter").forEach((el) => {
        const target = parseInt((el as HTMLElement).dataset.target ?? "", 10);
        if (!Number.isNaN(target)) el.textContent = String(target);
      });

      const onNativeScroll = () => onScroll(window.scrollY);
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      onScroll(window.scrollY);

      return () => {
        window.removeEventListener("scroll", onNativeScroll);
        anchorHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      };
    }

    lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      onScroll(scroll);
    });

    const raf = (time: number) => {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    onScroll(0);

    let motionObserver: IntersectionObserver | undefined;
    if (motionElements.length) {
      motionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            motionObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
      );
      motionElements.forEach((el) => motionObserver?.observe(el));
    }

    const onMouseMoveSpotlight = (e: MouseEvent) => {
      if (!atmosphere) return;
      (atmosphere as HTMLElement).style.setProperty("--spot-x", `${e.clientX}px`);
      (atmosphere as HTMLElement).style.setProperty("--spot-y", `${e.clientY}px`);
    };

    if (canUsePointerFx && atmosphere) {
      (atmosphere as HTMLElement).style.setProperty("--spot-x", "50%");
      (atmosphere as HTMLElement).style.setProperty("--spot-y", "40%");
      window.addEventListener("mousemove", onMouseMoveSpotlight, { passive: true });
    }

    const tiltHandlers: Array<{
      el: Element;
      move: (e: MouseEvent) => void;
      leave: () => void;
    }> = [];

    if (canUsePointerFx) {
      tiltCards.forEach((card) => {
        const move = (e: MouseEvent) => {
          const rect = (card as HTMLElement).getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          card.classList.add("is-tilting");
          (card as HTMLElement).style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 10}deg) translateY(-4px)`;
        };
        const leave = () => {
          card.classList.remove("is-tilting");
          (card as HTMLElement).style.transform = "";
        };
        card.addEventListener("mousemove", move as EventListener);
        card.addEventListener("mouseleave", leave);
        tiltHandlers.push({ el: card, move, leave });
      });
    }

    const counters = document.querySelectorAll(".counter");
    const animateCounter = (el: Element) => {
      const target = parseInt((el as HTMLElement).dataset.target ?? "", 10);
      if (Number.isNaN(target)) return;

      if (prefersReducedMotion) {
        el.textContent = String(target);
        return;
      }

      const duration = 1400;
      const start = performance.now();

      function tick(now: number) {
        const progress = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    };

    let counterObserver: IntersectionObserver | undefined;
    if (counters.length) {
      counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            counterObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((c) => counterObserver?.observe(c));
    }

    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    let cursorRafId = 0;
    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;
    const cursorEnter = () => body.classList.add("cursor-hover");
    const cursorLeave = () => body.classList.remove("cursor-hover");
    const hoverTargets = document.querySelectorAll(
      "a, button, .tilt-card, .project-card, .btn"
    );

    const onCursorMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        (dot as HTMLElement).style.left = `${mouseX}px`;
        (dot as HTMLElement).style.top = `${mouseY}px`;
      }
    };

    const onHeaderEnter = () => body.classList.add("cursor-over-header");
    const onHeaderLeave = () => body.classList.remove("cursor-over-header");

    if (canUsePointerFx && dot && ring) {
      body.classList.add("has-custom-cursor");
      window.addEventListener("mousemove", onCursorMove, { passive: true });
      portfolioHeader?.addEventListener("mouseenter", onHeaderEnter);
      portfolioHeader?.addEventListener("mouseleave", onHeaderLeave);

      const animateRing = () => {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        (ring as HTMLElement).style.left = `${ringX}px`;
        (ring as HTMLElement).style.top = `${ringY}px`;
        cursorRafId = requestAnimationFrame(animateRing);
      };
      cursorRafId = requestAnimationFrame(animateRing);

      hoverTargets.forEach((el) => {
        el.addEventListener("mouseenter", cursorEnter);
        el.addEventListener("mouseleave", cursorLeave);
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(cursorRafId);
      lenis?.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      window.removeEventListener("mousemove", onMouseMoveSpotlight);
      window.removeEventListener("mousemove", onCursorMove);
      anchorHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
      tiltHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move as EventListener);
        el.removeEventListener("mouseleave", leave);
      });
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", cursorEnter);
        el.removeEventListener("mouseleave", cursorLeave);
      });
      portfolioHeader?.removeEventListener("mouseenter", onHeaderEnter);
      portfolioHeader?.removeEventListener("mouseleave", onHeaderLeave);
      body.classList.remove("cursor-over-header");
      motionObserver?.disconnect();
      counterObserver?.disconnect();
    };
  }, []);

  return null;
}
