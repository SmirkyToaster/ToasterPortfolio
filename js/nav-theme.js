// ─── Theme toggle + mobile nav ──────────────────────────────────────────────
// Shared by every page. Runs immediately (not on DOMContentLoaded) so the
// theme is applied before first paint, avoiding a flash of the wrong theme.
(function () {
  const storageKey = "smirky-theme";
  const toggleButton = document.getElementById("theme-toggle");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  // Mirrors --topbar-solid from styles.css — a CSS custom property can't be
  // read from a <meta> tag, so the two hex values are kept in sync by hand.
  const topbarSolid = { dark: "#0f0620", light: "#f3ecf8" };

  const applyTheme = (theme) => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem(storageKey, theme);
    themeColorMeta?.setAttribute("content", topbarSolid[theme]);
  };

  applyTheme(localStorage.getItem(storageKey) === "light" ? "light" : "dark");
  toggleButton?.addEventListener("click", () => {
    applyTheme(document.body.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  const navToggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  const closeMobileNav = () => {
    mobileNav?.classList.remove("is-open");
    mobileNav?.setAttribute("aria-hidden", "true");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.classList.remove("is-open");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    mobileNav.setAttribute("aria-hidden", String(!isOpen));
    navToggle.classList.toggle("is-open", isOpen);
  });

  mobileNav?.querySelectorAll(".mobile-nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileNav();
    });
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 621px)").matches) {
      closeMobileNav();
    }
  });
})();
