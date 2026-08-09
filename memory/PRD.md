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
1. Obtain original logo file from user.
2. Decide hero imagery approach; generate/select assets (forest with hive, bees on black).
3. Build hero sequence (framer-motion timeline), mount nav above it (nav hidden during intro per brief: "no navigation" until reveal).
