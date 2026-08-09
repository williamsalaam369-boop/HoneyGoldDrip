# HoneyGold Drip™ — PRD

## Original Problem Statement
HoneyGold Drip™ is a premium fashion house rooted in nature, craftsmanship, storytelling, and timeless design.
The site is being built incrementally, one scoped piece at a time.

**Step 1 (requested, not yet built):** Homepage hero as a cinematic short-film opening — black screen, no nav/logo/text → two realistic bumble bees in side profile enter from opposite sides, meet face-to-face at horizontal center, pause, separate → warm golden light flash → reveal an intimate dense forest (largest tree front-right, beehive attached, dripping golden honey, several bees flying, camera gently follows one bee to the hive) → only then the ORIGINAL logo appears with "Premium Fashion Rooted in Nature" and buttons "Enter da HG Archives" / "Explore the Collection".

**Step 2 (built):** Navigation only. Elegant, minimal, premium fashion house feel. Items: Home, Collections, da HG Archives, About, Journal, Contact. Transparent until scrolling begins.

## Architecture
- React frontend (CRA + craco + Tailwind), FastAPI backend (unused so far), MongoDB (unused so far).
- Fonts: Italiana (brand/serif) + Jost (links/UI) via Google Fonts in `public/index.html`.

## User Personas
- Fashion house clientele / brand visitors expecting a luxury, editorial experience.

## Core Requirements (static)
- Cinematic, film-like presentation; no generic ecommerce patterns.
- ORIGINAL logo must be used exactly as provided (logo file still pending from user).

## Implemented
- 2026-08-09: Cinematic hero section on `/` (Step 3, video deferred)
  - Full-screen video layer wired to `/videos/honeygold-intro.mp4` (autoplay, muted, loop, playsInline) — auto-plays the moment the file exists; until then the hero shows a pure black backdrop matching the film's opening frame.
  - Cinematic scrim (vignette + gradient) for text readability over video.
  - Overlay content fades in after 3s: HoneyGold Drip™ wordmark (typographic placeholder pending original logo file), "Premium Fashion Rooted in Nature", gold rule, three-line subtext, and two pill buttons — "Enter da HG Archives" (solid gold → /archives) and "Explore the Collection" (ghost glass → /collections).
  - Navigation and stand-in scroll sections unchanged.
- 2026-08-09: Sora intro video GENERATED and live (credits recharged by user)
  - `sora-2`, 1280x720, 4s, saved to `/app/frontend/public/videos/honeygold-intro.mp4` (2.5 MB) + VP9 WebM transcode `honeygold-intro.webm` (956 KB, first source for codec coverage; MP4 fallback).
  - Frame review: two side-profile bumble bees meet on black → golden flash → dense forest with large right-side foreground tree, beehive with dripping golden honey, bees in flight. Matches brief; no text/logo in video.
  - Verified playing in-browser: autoplay, muted, loops (duration 4s), overlay text readable over scrim.
  - Generation script: `/app/scripts/generate_intro_video.py` (re-run to create v2 after user review).
- 2026-07-02: Navigation component (`/app/frontend/src/components/Navigation.jsx`)
  - Fixed top bar, transparent at page top → dark glass (blur + gold hairline) after 24px scroll, with height shrink.
  - Typographic brand mark "HoneyGold Drip™" (placeholder until original logo asset is supplied).
  - 6 menu links with gold underline draw + letter-spacing hover animation; active-route gold state.
  - Mobile (<900px): hamburger → full-screen dark overlay menu with staggered link reveals.
  - Routes: `/` (stand-in home), catch-all "being crafted" page for the other 5 destinations.
  - Temporary dark stand-in backdrop on `/` (NOT the homepage hero) purely to demo nav scroll behaviour.
  - Styles appended to `src/index.css` under HoneyGold section; page title updated.

## Backlog (prioritized)
- P0: Cinematic homepage hero (bee sequence → golden light → forest/beehive scene → original logo + tagline + 2 buttons). BLOCKED: needs original HoneyGold Drip™ logo file from user; also needs decision on imagery approach (AI-generated photoreal vs stock) and skip-intro preference.
- P1: Collections page.
- P1: da HG Archives page.
- P2: About, Journal, Contact pages.
- P2: Footer.

## Next Tasks
1. User reviews Sora v1; if approved keep, else refine prompt and generate v2 (spend credits only after review per user instruction).
2. Obtain original logo file from user; swap typographic wordmark in nav + hero.
