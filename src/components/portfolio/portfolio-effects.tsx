"use client";

import { useEffect } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function PortfolioEffects() {
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("[data-portfolio-nav-link]");
    const portfolioHeader = document.querySelector("#portfolio-header");
    const scrollProgressBar = document.querySelector(".scroll-progress-bar");
    const motionElements = document.querySelectorAll(".motion-in");
    const body = document.body;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      body.classList.add("reduced-motion");
    }

    let navLockHref = "";
    let navLocked = false;
    let navLockTimer = 0;
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

    function unlockNav() {
      navLocked = false;
      navLockHref = "";
      if (navLockTimer) {
        window.clearTimeout(navLockTimer);
        navLockTimer = 0;
      }
    }

    function lockNav(href: string) {
      navLockHref = href;
      navLocked = true;
      if (navLockTimer) window.clearTimeout(navLockTimer);
      navLockTimer = window.setTimeout(unlockNav, 900);
      applyActiveNavLink(href, true);
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 768px)").matches) {
          document.body.style.overflow = "";
        }
        const href = link.getAttribute("href") ?? "";
        if (!href.includes("#")) return;
        lockNav(href);
      });
    });

    function hrefMatchesSection(href: string, sectionId: string) {
      const normalized = href.replace(/^\//, "");
      return (
        normalized === `#${sectionId}` ||
        (sectionId === "home" && (normalized === "#home" || normalized === ""))
      );
    }

    function updateScrollUi() {
      const currentScroll = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;

      if (scrollProgressBar) {
        (scrollProgressBar as HTMLElement).style.width = `${progress}%`;
      }

      portfolioHeader?.classList.toggle("is-scrolled", currentScroll > 24);

      if (navLocked && navLockHref) {
        applyActiveNavLink(navLockHref);
        return;
      }

      const headerOffset =
        ((portfolioHeader as HTMLElement | null)?.offsetHeight ?? 76) + 24;

      let current = "";
      sections.forEach((section) => {
        const id = section.getAttribute("id");
        if (!id) return;
        const top = (section as HTMLElement).getBoundingClientRect().top;
        if (top <= headerOffset) current = id;
      });

      const activeLink = Array.from(navLinks).find((link) =>
        hrefMatchesSection(link.getAttribute("href") ?? "", current)
      );
      const activeHref = activeLink?.getAttribute("href") ?? "";

      if (activeHref) applyActiveNavLink(activeHref, true);
      else navLinks.forEach((link) => link.classList.remove("active"));
    }

    const anchorHandlers: Array<{ el: Element; fn: (e: Event) => void }> = [];

    document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach((anchor) => {
      const fn = (e: Event) => {
        const rawHref = anchor.getAttribute("href") ?? "";
        const hashIndex = rawHref.indexOf("#");
        if (hashIndex < 0) return;

        const targetId = `#${rawHref.slice(hashIndex + 1)}`;
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        e.stopPropagation();

        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
        window.setTimeout(unlockNav, prefersReducedMotion ? 50 : 700);

        if (history.replaceState) {
          history.replaceState(null, "", targetId);
        }
      };
      anchor.addEventListener("click", fn, { capture: true });
      anchorHandlers.push({ el: anchor, fn });
    });

    let motionObserver: IntersectionObserver | undefined;
    if (prefersReducedMotion) {
      motionElements.forEach((el) => el.classList.add("is-visible"));
      document.querySelectorAll(".counter").forEach((el) => {
        const target = parseInt((el as HTMLElement).dataset.target ?? "", 10);
        if (!Number.isNaN(target)) el.textContent = String(target);
      });
    } else if (motionElements.length) {
      motionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            motionObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
      );
      motionElements.forEach((el) => motionObserver?.observe(el));
    }

    const counters = document.querySelectorAll(".counter");
    const animateCounter = (el: Element) => {
      const target = parseInt((el as HTMLElement).dataset.target ?? "", 10);
      if (Number.isNaN(target)) return;

      if (prefersReducedMotion) {
        el.textContent = String(target);
        return;
      }

      const duration = 900;
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

    const onNativeScroll = () => updateScrollUi();
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    updateScrollUi();

    return () => {
      unlockNav();
      window.removeEventListener("scroll", onNativeScroll);
      anchorHandlers.forEach(({ el, fn }) =>
        el.removeEventListener("click", fn, {
          capture: true,
        } as EventListenerOptions)
      );
      motionObserver?.disconnect();
      counterObserver?.disconnect();
    };
  }, []);

  return null;
}
