function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeBasePath(basePath) {
  const raw = String(basePath || "").trim();
  if (!raw) return "";
  return raw.endsWith("/") ? raw : `${raw}/`;
}

function normalizeSlug(value) {
  return encodeURIComponent(String(value || "").trim().replaceAll("/", ""));
}

function detailRoute(basePath, slug) {
  return `${normalizeBasePath(basePath)}${normalizeSlug(slug)}/`;
}

function sectionRoute(basePath) {
  return normalizeBasePath(basePath);
}

window.RouteLinks = {
  detailRoute,
  sectionRoute,
  esc,
};
