// ─── Site config ──────────────────────────────────────────────────────────────
const CONFIG = {
  twitchChannel: "smirkytoaster",
  featuredCountByColumns: {
    3: 6,
    2: 4,
    1: 3,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function decodeHtml(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function getFeaturedCount(grid) {
  const gridTemplateColumns = window.getComputedStyle(grid).gridTemplateColumns;
  const columnCount = gridTemplateColumns
    .split(" ")
    .filter(Boolean)
    .length;

  return CONFIG.featuredCountByColumns[columnCount] || CONFIG.featuredCountByColumns[1];
}

// ─── Twitch embed ─────────────────────────────────────────────────────────────
function initTwitch() {
  const container = document.getElementById("twitch-embed");
  if (!container || !CONFIG.twitchChannel) return;

  const script = document.createElement("script");
  script.src = "https://embed.twitch.tv/embed/v1.js";
  script.onload = () => {
    new Twitch.Embed("twitch-embed", {
      width: "100%",
      height: 390,
      channel: CONFIG.twitchChannel,
      layout: "video",
      autoplay: false,
      // parent must include every domain this page is served from
      parent: [window.location.hostname],
    });
  };
  document.head.appendChild(script);
}

// ─── YouTube latest videos (from GitHub Actions prebuilt js/videos.json) ───
async function loadYouTube() {
  const container = document.getElementById("yt-videos");
  if (!container) return;

  container.innerHTML = `<p class="placeholder-note">Loading latest videos…</p>`;

  try {
    const res = await fetch("./data/videos.json");
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

    const { items } = await res.json();
    renderYouTubeItems(container, items || []);
  } catch (err) {
    console.error("Failed to load YouTube videos:", err);
    container.innerHTML = `<p class="placeholder-note">Couldn't load the latest videos right now — check back soon!</p>`;
  }
}

function renderYouTubeItems(container, items) {
  if (!items.length) {
    container.innerHTML = `<p class="placeholder-note">No videos yet — check back soon!</p>`;
    return;
  }

  container.innerHTML = "";
  items.slice(0, 5).forEach((it) => {
    const a    = document.createElement("a");
    a.className = "yt-card";
    a.href      = `https://www.youtube.com/watch?v=${encodeURIComponent(it.videoId)}`;
    a.target    = "_blank";
    a.rel       = "noopener noreferrer";

    const img     = document.createElement("img");
    img.className = "yt-card__thumb";
    img.src       = it.thumbnail || "";
    img.alt       = "";
    img.width     = 100;
    img.height    = 56;
    img.loading   = "lazy";

    const info  = document.createElement("div");
    const title = document.createElement("p");
    title.className = "yt-card__title";
    title.textContent = decodeHtml(it.title || "");

    const meta = document.createElement("p");
    meta.className = "yt-card__meta";
    meta.textContent = it.publishedAt ? formatDate(it.publishedAt) : "";

    info.appendChild(title);
    info.appendChild(meta);
    a.appendChild(img);
    a.appendChild(info);
    container.appendChild(a);
  });
}

// ─── Featured grid rendering ─────────────────────────────────────────────────
function renderFeaturedGrid(gridId, items, basePath) {
  const grid = document.getElementById(gridId);
  if (!grid || !items?.length) return;

  const maxCount    = getFeaturedCount(grid);
  const featured    = items.filter((p) => p.featured).slice(0, maxCount);
  const showViewAll = items.filter((p) => p.featured).length > maxCount
                   || items.length > maxCount;

  grid.innerHTML = featured
    .map(
      (item) => `<a class="carousel-card" href="${RouteLinks.detailRoute(basePath, item.id)}">
        ${item.tags?.length
          ? `<div class="carousel-card__tags">${item.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>`
          : ""}
        <h3 class="carousel-card__title">${esc(item.title)}</h3>
        <p class="carousel-card__blurb">${esc(item.blurb)}</p>
        <span class="carousel-card__cta">Learn more →</span>
      </a>`
    )
    .join("");

  const footerId = gridId.replace("-grid", "-footer");
  const footer   = document.getElementById(footerId);
  if (footer) {
    footer.innerHTML = showViewAll
      ? `<a class="view-all-btn" href="${RouteLinks.sectionRoute(basePath)}">View all</a>`
      : "";
  }
}

function renderHomeFeaturedSections() {
  renderFeaturedGrid("projects-grid", typeof PROJECTS !== "undefined" ? PROJECTS : [], "projects/");
  renderFeaturedGrid("games-grid", typeof GAMES !== "undefined" ? GAMES : [], "games/");
}

// ─── Init ─────────────────────────────────────────────────────────────────────
initTwitch();
loadYouTube();
renderHomeFeaturedSections();

window.addEventListener("resize", renderHomeFeaturedSections);
