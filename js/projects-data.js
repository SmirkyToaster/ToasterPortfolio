// ─── Projects data ────────────────────────────────────────────────────────────
// Add an entry for each project.
// featured: true  → appears on homepage (6 on desktop, 4 on tablet, 3 on mobile)
// Create a detail page at  projects/{id}/index.html  for each entry.
// ─────────────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: "streamerbot-viewer-queue",
    title: "Viewer Queue System",
    blurb: "A custom queue system for tracking viewers joining stream games.",
    tags: ["Streamer.bot", "Overlay", "Dock", "Twitch", "YouTube"],
    links: { github: "https://github.com/SmirkyToaster/ViewerQueueSystem" },
    featured: true,
  },
  {
    id: "streamerbot-ban-counter",
    title: "Ban Counter",
    blurb: "A commissioned Streamer.bot tool to track \"bans\" as an inside joke.",
    tags: ["Commission", "Streamer.bot", "Twitch"],
    links: {},
    featured: true,
  },
];
