# Launch Checklist

Use this checklist to take the portfolio from current state to launch-ready.

## Today

- [x] Confirm live config values in `js/main.js` (site config + Twitch channel).
  - Done when: Twitch channel value is correct for production.
  - Done when: no launch-critical TODO comments remain.

- [x] Fix homepage YouTube data fetch path in `js/main.js` for project-subpath hosting.
  - Done when: latest videos load on local preview and deployed URL.
  - Done when: no 404 for `data/videos.json` in network log.

- [x] Verify GitHub secrets are set: `YT_API_KEY` and `YT_CHANNEL_ID`.
  - Done when: manual workflow run succeeds with no missing-secret errors.
  - Done when: workflow logs show successful write/update behavior.

- [x] Run the YouTube workflow manually once.
  - Done when: workflow finishes green.
  - Done when: `data/videos.json` updates or explicitly reports no changes.

- [x] Smoke test all core routes and controls.
  - Done when: Home, Projects, Games, and detail pages load without broken links.
  - Done when: mobile nav toggle and theme toggle work on all pages.

## This Week

- [ ] Expand portfolio entries in `js/projects-data.js` and `js/games-data.js`.
  - Deferred: holding this until additional work is ready to share publicly.
  - Done when: at least 1-3 additional real entries are present.
  - Done when: every entry has title, blurb, tags, and valid links.

- [ ] Flesh out detail pages with richer content.
  - Focus first: `games/yappity-yap/index.html`.
  - Done when: each detail page has meaningful overview, media, and external CTA.

- [ ] Improve fallback/loading copy for videos area in `index.html`.
  - Done when: empty/loading/error states are clear and polished.
  - Done when: states are visually consistent with the current theme.

- [ ] Add deployment automation if not already configured.
  - Done when: push to `main` triggers deploy workflow (or equivalent host pipeline).
  - Done when: published site updates without manual steps.

## Later

- [ ] Refactor repeated inline nav/theme scripts into shared JavaScript modules.
  - Candidate pages: `index.html`, `projects/index.html`, `games/index.html`, and detail pages.
  - Done when: shared behavior is centralized and all pages still pass smoke test.

- [ ] Run accessibility and performance pass before public push.
  - Done when: keyboard navigation works for nav and toggles.
  - Done when: media is optimized/lazy-loaded where appropriate.
  - Done when: Lighthouse (or equivalent) has no critical issues.
