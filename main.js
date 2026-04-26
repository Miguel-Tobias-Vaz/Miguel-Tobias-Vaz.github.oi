const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".menu a");
const menuToggle = document.querySelector(".menu-toggle");
const menuBackdrop = document.querySelector(".menu-backdrop");
const body = document.body;

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
    const open = !body.classList.contains("menu-open");
    setMenuOpen(open);
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

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.clientHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
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
});
