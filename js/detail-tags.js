(function () {
  const { esc } = window.RouteLinks;

  function getSlug(pathname) {
    const parts = String(pathname || "")
      .split("/")
      .filter(Boolean);

    return parts[parts.length - 1] || "";
  }

  function getCollection(pathname) {
    if (pathname.includes("/projects/")) return typeof PROJECTS !== "undefined" ? PROJECTS : [];
    if (pathname.includes("/games/")) return typeof GAMES !== "undefined" ? GAMES : [];
    return [];
  }

  function renderDetailTags() {
    const collection = getCollection(window.location.pathname);
    if (!collection.length) return;

    const slug = getSlug(window.location.pathname);
    const item = collection.find((entry) => entry.id === slug);
    if (!item) return;

    const title = item.title || "";
    const blurb = item.blurb || "";

    const titleNode = document.querySelector("[data-detail-title]");
    const subtitleNode = document.querySelector("[data-detail-subtitle]");
    const descriptionNode = document.querySelector('meta[name="description"]');

    if (titleNode) titleNode.textContent = title;
    if (subtitleNode) subtitleNode.textContent = blurb;

    document.title = `${title} - SmirkyToaster`;
    if (descriptionNode && blurb) {
      descriptionNode.setAttribute("content", `${blurb} - SmirkyToaster`);
    }

    document.querySelectorAll("[data-detail-tags]").forEach((container) => {
      container.innerHTML = item.tags?.length
        ? item.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")
        : "";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderDetailTags, { once: true });
  } else {
    renderDetailTags();
  }

  window.addEventListener("load", renderDetailTags, { once: true });
  setTimeout(renderDetailTags, 0);
})();