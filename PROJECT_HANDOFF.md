# Project Handoff: Kasumi's Digital Cottage

> Read this file before changing this repository. It is the operational brief for any agent taking over the project.

## What This Project Is

Kasumi's Digital Cottage is a Chinese personal blog built with Next.js. It is a calm, personal home for three kinds of content:

1. **Notes**: personal essays and technical writing.
2. **Gallery**: a growing stream of original illustrations, collected images, and anime-inspired visual references.
3. **Playground**: small browser games and experiments.

It is not a corporate portfolio, a camera-specification archive, or a dashboard. The goal is a coherent, intimate digital space where writing and visual work are more important than interface decoration.

## The User's Confirmed Direction

### Product intent

- The blog will continue to grow; its gallery must accommodate many images without needing a rigid project-count layout.
- Gallery content can include the owner's illustrations and responsibly attributed collected/anime images.
- The gallery is an artwork archive, not a photography or camera-feature page. Do not introduce camera metadata, camera filters, EXIF-led UI, or photography-only language unless explicitly requested.
- Chinese is the primary interface language. Keep visible labels short: prefer Chinese labels of four characters or fewer and remove unnecessary English subtitles.

### Visual intent

- The selected global direction is **Mossland Warm Light (palette 04)**.
- The home page remains visually distinct: a dark, cinematic, photographic Hero.
- Inner pages use a pale green-paper background with a fixed, low-opacity floral image beneath the content.
- Navigation is a centered floating glass pill. It is part of the site identity and should not be replaced by a conventional full-width bar without user direction.
- The aesthetic is quiet, fresh, natural, and editorial; avoid generic SaaS, neon, purple gradients, loud bento cards, and heavy dark overlays on inner pages.
- The home Hero title intentionally uses a looping `TextType` typewriter that cycles through four phrases. This is a deliberate brand expression; do not replace it with a static title without user direction.
- Do not add a page-wide transition that fades or flashes images.

### Gallery rules

- No category chips or category filter. The gallery is one continuous archive.
- Use a staggered, asymmetric multi-column stream on large screens; it must become readable on smaller screens.
- At the top of the gallery, the first viewport should show a small portion of the next row to communicate that more work exists.
- Preserve each image's natural displayed proportion in the listing. Do not force 16:9 crops or add white padding merely to normalize dimensions.
- Opening a work must use a light paper-like detail view, not a black lightbox. The desired behavior is a large image plus a structured information panel, inspired by the local `F:\Agent\Antigravity\spring_blogs` reference.
- The background image layer remains visible beneath a translucent white/green paper veil on inner pages. It should add atmosphere without reducing readability.

## Non-Negotiable Design Tokens

The active light-mode tokens are in `src/app/globals.css`.

| Role | Value |
| --- | --- |
| Hero ink | `#26352A` |
| Paper background | `#F6F4EC` |
| Main text green | `#33483A` |
| Elevated surface | `#FFFEF9` |
| Secondary surface | `#E4E9DD` |
| Moss accent | `#718F6E` |
| Soft moss | `#9DB289` |
| Apricot detail | `#D79B7B` |
| Muted text | `#748176` |

Use moss green as the primary interaction color. Use apricot only as a restrained supporting detail. Do not introduce another saturated accent.

For full visual guidance, read [`design.md`](./design.md). For architecture and maintenance planning, read [`blog-project-plan.md`](./blog-project-plan.md).

## Code and Content Ownership

```text
content/notes/*.md          Article bodies and article metadata source of truth
src/lib/notes.ts            Reads and types note content
src/data/siteContent.ts     Gallery data and other non-article static content
src/lib/site.ts             Site-wide configuration
public/gallery/             Gallery source images referenced by siteContent.ts
src/app/globals.css         Shared theme tokens and global visual rules
src/app/layout.tsx          Ambient wallpaper layer, dual-tone overlay, anti-flash theme bootstrap
src/components/Hero.tsx     Home-only dark Hero
```

Do not duplicate article bodies in components. Do not add gallery records directly to JSX. Do not delete files in `public` based on a simple filename search: first trace direct references, dynamic paths, and data records.

## How to Work on This Repository

1. Read this handoff, `design.md`, and the relevant route/component before editing.
2. State the concrete issue, intended minimal change, and verification criteria.
3. Modify only files necessary for the request. Do not use a requested visual change as a reason to refactor unrelated routes.
4. If a new visual feature is introduced, check desktop, mobile, focus behavior, dark mode, and `prefers-reduced-motion` where applicable.
5. Run the verification commands below. For UI work, also inspect the affected route locally.

## Required Verification

```bash
npm run lint
npm run build
```

A production build alone is not sufficient. For visual or interactive changes, verify the affected local route as well. Before a cleanup change, also run:

```bash
git diff --check
```

## Current Implementation Facts

- Framework: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4.
- The shared layout includes theme handling, floating navigation, reading progress, and metadata-based search.
- The fixed ambient wallpaper and dual-tone overlay live in `src/app/layout.tsx`; `RouteTheme` is retained only as a pass-through wrapper. Do not move the background image into individual pages unless the user asks for a route-specific exception.
- The home route composes `Hero`, statistics, featured notes, gallery teaser, playground teaser, newsletter, and footer.
- Gallery records currently live in `GALLERY_PHOTOS` in `src/data/siteContent.ts`.
- Local development runs at `http://localhost:3000` when started with `npm run dev`.

## Decision Log

| Decision | Status | Why |
| --- | --- | --- |
| Use palette 04, Mossland Warm Light | Confirmed | The user selected it after reviewing four SpringBlog-inspired alternatives. |
| Preserve the default dark home Hero | Confirmed | The user preferred the original Hero structure over a pale replacement. |
| Keep Hero title static | Superseded | Originally static because of flashing; the looping `TextType` typewriter was deliberately re-introduced and is now the confirmed behavior. |
| Remove gallery categories | Confirmed | They added interface noise without helping the growing archive. |
| Use SpringBlog as a gallery reference | Confirmed | Its quiet staggered layout and light detail presentation match the desired direction. |
| Use English project documentation | Confirmed | The user requested English `design.md`, planning documentation, and this handoff. |
| 2026-08-22 accessibility & polish audit fixes | Confirmed | User approved fixing all findings: game-modal Esc/focus trap, keyboard-hijack guard, anti-flash theme bootstrap, ambient-image priority, footer repo link, markdown link rendering, hash-close history semantics, note-card clamp constants. Handoff ownership section updated where implementation had drifted. |

## When to Ask the User

Ask before making a choice that changes any confirmed direction above, changes the information architecture, removes user content/assets, changes the gallery into a categorised system, or replaces the established Hero/navigation style. For small fixes that preserve this brief, proceed with the smallest verifiable implementation.
