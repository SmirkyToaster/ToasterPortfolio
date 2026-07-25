# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is a static site with no build tooling — no `package.json`, no bundler, no test suite, no linter.

- **Local preview**: `python -m http.server 8000` from the project root, then visit `http://localhost:8000`.
- **Fetch latest YouTube videos**: `node scripts/fetch-youtube.js` (requires env vars `YT_API_KEY` and `YT_CHANNEL_ID`; optional `MAX_RESULTS`, default 5). Writes `data/videos.json`. Normally only run by CI (see below) — no need to run manually unless testing that script itself.

## Architecture

### Page types and routing
Plain multi-page HTML, no client-side router:
- `index.html` — homepage (hero, Twitch embed, YouTube feed, featured Projects/Games grids)
- `projects/index.html`, `games/index.html` — full card-grid list pages
- `projects/{id}/index.html`, `games/{id}/index.html` — one hand-authored detail page per entry (e.g. `projects/streamerbot-ban-counter/`, `games/yappity-yap/`)

Detail pages live one directory deeper than list pages, so their asset/script paths use `../../` while list pages use `../`.

### Data-driven cards vs. hand-authored detail content
`js/projects-data.js` and `js/games-data.js` each export a single array (`PROJECTS`, `GAMES`) of `{ id, title, blurb, tags, links, featured }`. This array is the *only* source of truth for:
- The homepage's featured grids (`renderFeaturedGrid` in `js/main.js`, filtered to `featured: true`, capped per breakpoint via `CONFIG.featuredCountByColumns`)
- The full list pages' card grids (rendered by an inline script at the bottom of `projects/index.html` / `games/index.html`)
- Each detail page's title, subtitle, and tag pills — filled in at runtime by `js/detail-tags.js`, which reads the current URL's last path segment as the slug, looks it up in `PROJECTS`/`GAMES` (collection chosen by whether the path contains `/projects/` or `/games/`), and populates any `[data-detail-title]` / `[data-detail-subtitle]` / `[data-detail-tags]` elements plus `document.title` and the meta description.

Everything else on a detail page (Background/Context, Credits, How It Works, screenshots, Setup, etc.) is hand-written HTML unique to that page — adding a new project/game means both adding an entry to the data file *and* writing its detail page from scratch (copy an existing one as a template).

`js/link-helpers.js` exposes `window.RouteLinks.detailRoute(basePath, slug)` / `sectionRoute(basePath)` / `esc(str)` (shared HTML-escaping helper) so card-grid rendering code builds consistent relative URLs and escapes text instead of hand-rolling either per page.

### Per-page script loading
- `index.html` loads `main.js`, which unconditionally calls `initTwitch()`, `loadYouTube()`, and `renderHomeFeaturedSections()` on load — these are homepage-only concerns and no other page includes `main.js`.
- List pages and detail pages do **not** load `main.js`; they load only the data file(s) and helpers they need, plus `detail-tags.js` on detail pages.
- Nav toggle / theme toggle logic lives in a single shared `js/nav-theme.js`, loaded via `<script src>` on every page — not duplicated inline. The header/nav *markup* itself is still duplicated per page (same HTML repeated with different relative paths/active-link classes), which is inherent to this router-less multi-page structure rather than tech debt to fix.

### Theming
CSS custom properties only, defined in `styles.css`:
- Light mode values on `:root`; dark mode overrides on `body[data-theme="dark"]`
- Preference persisted to `localStorage` under key `smirky-theme`; toggle button is `#theme-toggle`
- Key tokens: `--bg`/`--bg-2` (background gradient), `--text`/`--text-soft`, `--accent`/`--accent-2`/`--accent-3`/`--accent-pink`, `--eyebrow`, `--surface`/`--surface-strong` (card backgrounds, often gradients), `--panel-bg`/`--panel-border`
- **`color-mix()` cannot take a gradient-valued custom property as an operand** — several past bugs came from `color-mix(in srgb, var(--surface) 84%, transparent)` where `--surface` is a `linear-gradient(...)` in light mode; the whole declaration silently drops. Use the gradient variable directly instead (e.g. `background: var(--surface);`).
- Vapourwave/CRT aesthetic: scanlines via `body::before`, ambient glow orbs (`.orb-one`, `.orb-two`), circular/pill accents use a blue→pink gradient (`linear-gradient(135deg, var(--accent), var(--accent-pink))`)
- Fonts: `Space Grotesk` for headings/brand, `Inter` for body — loaded via Google Fonts `<link>` in every page's `<head>`

### Twitch embed
`initTwitch()` in `js/main.js` sets `parent: [window.location.hostname]` dynamically rather than a hardcoded domain list, so the embed works unmodified across `localhost`, preview URLs, and production.

### YouTube data pipeline
`data/videos.json` is a prebuilt static file, not fetched from the API at page-load time by the browser — `js/main.js`'s `loadYouTube()` just fetches this JSON file and renders it (with loading/empty/error states). The file itself is regenerated by `.github/workflows/fetch-youtube.yml`, which runs `scripts/fetch-youtube.js` on push to `main`, weekly (Sunday 00:00 UTC), and on manual dispatch, then commits the result back to whichever branch triggered it as `github-actions[bot]`. Requires repo secrets `YT_API_KEY` and `YT_CHANNEL_ID`.

### Known quirks
- `AGENTS.md` is git-ignored and not present in the working tree — this file (`CLAUDE.md`) is the only agent instructions file in this repo.
