// ─── Games data ───────────────────────────────────────────────────────────────
// Add an entry for each game.
// featured: true  → appears on homepage (6 on desktop, 4 on tablet, 3 on mobile)
// Create a detail page at  games/{id}/index.html  for each entry.
// ─────────────────────────────────────────────────────────────────────────────

const GAMES = [
  {
    id: "yappity-yap",
    title: "Yappity Yap",
    blurb: "A small game where you take on the role of a VTuber and have to answer crazy chat messages and try not to get cancelled!",
    tags: ["Game Jam", "VTuber", "Godot"],
    links: { itch: "https://smirkytoaster.itch.io/yappityyap" },
    featured: true,
  },
  // {
  //   id: "my-game",
  //   title: "My Game",
  //   blurb: "Short description of the game and what makes it interesting.",
  //   tags: ["platformer", "game jam"],
  //   links: { itch: "https://...", github: "https://..." },
  //   featured: true,
  // },
];
