const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".menu a");
const menuToggle = document.querySelector(".menu-toggle");
const menuBackdrop = document.querySelector(".menu-backdrop");
const topbar = document.querySelector(".topbar");
const scrollProgressBar = document.querySelector(".scroll-progress-bar");
const atmosphere = document.querySelector(".atmosphere");
const atmosphereLayer = document.querySelector(".atmosphere-layer");
const heroCinematic = document.querySelector(".hero-cinematic");
const tiltCards = document.querySelectorAll(".tilt-card");
const motionElements = document.querySelectorAll(".motion-in");
const body = document.body;

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReducedMotion = reducedMotionQuery.matches;
const canUsePointerFx =
  !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches;

if (prefersReducedMotion) {
  body.classList.add("reduced-motion");
}

let lenis = null;
let scrollY = window.scrollY;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getScrollY() {
  return lenis ? lenis.scroll : window.scrollY;
}

function setMenuOpen(open) {
  if (!menuToggle || !menuBackdrop) return;

  menuToggle.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  menuToggle.setAttribute(
    "aria-label",
    open ? "Fechar menu de navegação" : "Abrir menu de navegação"
  );

  body.classList.toggle("menu-open", open);
  menuBackdrop.classList.toggle("is-visible", open);
  if (open) {
    menuBackdrop.removeAttribute("hidden");
    menuBackdrop.setAttribute("aria-hidden", "false");
  } else {
    menuBackdrop.setAttribute("hidden", "");
    menuBackdrop.setAttribute("aria-hidden", "true");
  }
}

function closeMenu() {
  setMenuOpen(false);
}

if (menuToggle && menuBackdrop) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(!body.classList.contains("menu-open"));
  });

  menuBackdrop.addEventListener("click", closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        closeMenu();
      }
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 768px)").matches) {
      closeMenu();
    }
  });
}

function updateHeroProgress(currentScroll) {
  if (!heroCinematic || prefersReducedMotion) return;

  const rect = heroCinematic.getBoundingClientRect();
  const total = heroCinematic.offsetHeight - window.innerHeight;
  const scrolled = currentScroll - heroCinematic.offsetTop;
  const progress = total > 0 ? clamp(scrolled / total, 0, 1) : 0;

  const content = clamp((progress - 0.08) / 0.32, 0, 1);
  const exit = clamp((progress - 0.72) / 0.28, 0, 1);
  const brandOpacity = clamp(1 - content * 0.92, 0.08, 1) * (1 - exit);

  heroCinematic.style.setProperty("--hero-content", content.toFixed(3));
  heroCinematic.style.setProperty("--hero-exit", exit.toFixed(3));
  heroCinematic.style.setProperty("--hero-brand-opacity", brandOpacity.toFixed(3));
  heroCinematic.classList.toggle("is-interactive", content > 0.4);
}

function updateAtmosphere(currentScroll) {
  if (!atmosphereLayer || prefersReducedMotion) return;
  atmosphereLayer.style.transform = `translate3d(0, ${currentScroll * 0.07}px, 0)`;
}

function updateScrollUi(currentScroll) {
  scrollY = currentScroll;

  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;

  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${progress}%`;
  }

  if (topbar) {
    topbar.classList.toggle("is-scrolled", currentScroll > 24);
  }

  updateHeroProgress(currentScroll);
  updateAtmosphere(currentScroll);

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.clientHeight;

    if (
      currentScroll >= sectionTop &&
      currentScroll < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

function onScroll(currentScroll) {
  updateScrollUi(currentScroll);
}

function initLenis() {
  if (prefersReducedMotion || typeof Lenis === "undefined") {
    window.addEventListener("scroll", () => onScroll(window.scrollY), {
      passive: true,
    });
    onScroll(window.scrollY);
    return;
  }

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.1,
  });

  document.documentElement.classList.add("lenis", "lenis-smooth");

  lenis.on("scroll", ({ scroll }) => {
    onScroll(scroll);
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  onScroll(0);
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const offset = -((topbar?.offsetHeight ?? 82) + 16);

    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

if (!prefersReducedMotion && motionElements.length) {
  const motionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        motionObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
  );

  motionElements.forEach((el) => motionObserver.observe(el));
} else {
  motionElements.forEach((el) => el.classList.add("is-visible"));
}

if (canUsePointerFx && atmosphere) {
  atmosphere.style.setProperty("--spot-x", "50%");
  atmosphere.style.setProperty("--spot-y", "40%");

  window.addEventListener(
    "mousemove",
    (e) => {
      atmosphere.style.setProperty("--spot-x", `${e.clientX}px`);
      atmosphere.style.setProperty("--spot-y", `${e.clientY}px`);
    },
    { passive: true }
  );
}

if (canUsePointerTilt()) {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.classList.add("is-tilting");
      card.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 10}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-tilting");
      card.style.transform = "";
    });
  });
}

function canUsePointerTilt() {
  return canUsePointerFx;
}

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    if (Number.isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function initCustomCursor() {
  if (!canUsePointerFx) return;

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  body.classList.add("has-custom-cursor");

  let ringX = 0;
  let ringY = 0;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    },
    { passive: true }
  );

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }

  animateRing();

  const hoverTargets = document.querySelectorAll(
    "a, button, .tilt-card, .project-card, .btn"
  );

  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => body.classList.remove("cursor-hover"));
  });
}

initCounters();
initCustomCursor();
initLenis();

reducedMotionQuery.addEventListener("change", () => {
  window.location.reload();
});
