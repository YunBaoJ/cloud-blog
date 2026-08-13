# About Page Editorial Redesign

## Status

- Date: 2026-08-13
- Route: `/about`
- Direction: Option A, editorial self-introduction
- Scope: targeted redesign that preserves the existing site identity

## Goal

Redesign the About page as a calm, truthful introduction to the person behind Cloud's Digital Cottage. The page should help visitors understand what the site contains, what the author is currently making, and how to get in touch without presenting unverified achievements or decorative statistics.

## Constraints

- Preserve the Mossland Warm Light palette, floating navigation, inner-page background, and system font stack.
- Keep Chinese as the primary interface language and keep visible labels short.
- Reuse `/about-desk.jpg`; do not introduce new image assets.
- Do not change routes, navigation labels, site-wide layout, or unrelated pages.
- Preserve the confirmed contact email from `src/lib/site.ts`.
- Do not retain claims that cannot be verified from the repository or confirmed project context.
- Existing uncommitted changes outside the About route remain untouched.

## Design Read

This is an editorial About page for readers exploring a personal blog. The visual language is quiet, natural, and personal, using the incumbent warm-paper and moss-green system.

- Design variance: 6/10
- Motion intensity: 3/10
- Visual density: 3/10
- Surface mode: Read

## Information Architecture

The page contains four sections in this order:

1. **关于我**: a short introduction paired with the existing desk photograph.
2. **这间小屋**: a concise explanation of Notes, Gallery, and Playground with real internal links.
3. **正在做的事**: a restrained description of writing, building, and collecting visual inspiration. It must avoid unsupported career titles, locations, equipment, dates, and accomplishments.
4. **联系我**: the confirmed email address and useful internal destinations.

The current statistics grid, skill-pill cloud, fabricated chronology, location label, generic GitHub link, and unsupported personal claims are removed.

## Layout

### Intro

- Follow the shared inner-page title rhythm at the top.
- On large screens, use an asymmetric editorial composition with text and photograph in adjacent columns.
- Let the photograph occupy more visual area while keeping the introduction within a readable measure.
- On screens below 768px, stack text above the image with no horizontal overflow.

### Site Description

- Present Notes, Gallery, and Playground as one continuous editorial list rather than three equal cards.
- Each destination includes a short plain-language description and a visible text link.
- Use spacing and a single divider system for grouping; avoid card elevation unless required for the contact surface.

### Current Focus

- Use a compact two-column composition on desktop and one column on mobile.
- Keep content factual and maintainable. Prefer current activities over dated milestones.
- Do not add proficiency meters, fake numbers, badges, or decorative status dots.

### Contact

- Use one moss-green elevated surface as the page's visual conclusion.
- Provide the confirmed email as the primary action.
- Do not repeat Notes, Gallery, or Playground links in this section; those destinations belong only in the site-description section.
- All interactive targets must be at least 44px high and have visible keyboard focus.

## Visual System

- Use semantic CSS variables from `src/app/globals.css` instead of local hard-coded colors.
- Moss green remains the only primary interaction accent.
- Do not introduce a page-specific accent beyond moss green; the global apricot token remains available elsewhere in the site.
- Use the existing radius rule: soft 16-24px media and surfaces, pill controls only.
- Use tinted, low-opacity shadows only where elevation communicates hierarchy.
- Preserve equivalent hierarchy and contrast in dark mode.

## Typography

- Use the existing system sans-serif stack.
- Keep the page title aligned with other inner pages and avoid oversized display type.
- Use short Chinese headings with comfortable body line height and a maximum reading width near 65 characters.
- Do not add English subtitles that do not improve understanding.

## Motion and Rendering

- Remove the current GSAP entrance animations from the About page.
- Use only short hover, focus, and press transitions that communicate interaction.
- Respect the global reduced-motion rule.
- Render the page as a Server Component because its content is static and requires no client state.
- Continue using `next/image` with responsive sizing and reserved dimensions for the desk photograph.

## Content Rules

Visible copy may state only facts supported by the site itself:

- The site contains writing, visual work, and small browser experiments.
- The author builds and maintains the site.
- The confirmed contact email may be displayed.

Do not state a location, job title, camera model, article count, photo count, code-line count, coffee count, publication milestone, or open-source contribution unless the user later confirms it.

## Error and Empty-State Handling

The page has no remote data or user-submitted state. The existing local image is a build-time dependency; a missing file should fail verification instead of introducing a decorative runtime fallback. Internal links must resolve to existing routes.

## Accessibility

- Preserve meaningful alternative text for the desk photograph.
- Maintain WCAG AA text contrast in light and dark themes.
- Do not rely on color alone to identify links.
- Ensure visible `:focus-visible` treatment for every link.
- Avoid hover-only information.
- Verify at 375px, 768px, 1024px, and 1440px widths.

## Implementation Boundary

Expected implementation files:

- `src/app/about/page.tsx`
- `src/app/about/AboutContent.tsx`, replacing the client-only `AboutClient.tsx`

No global token changes are planned. Changes to `Hero.tsx`, `NotesClient.tsx`, gallery data, public assets, navigation, and footer are out of scope.

## Verification

1. Run `npm run lint`.
2. Run `npm run build`.
3. Run `git diff --check`.
4. Start the local app and verify `/about` returns HTTP 200.
5. Inspect `/about` at desktop and mobile widths in light and dark themes.
6. Check keyboard focus, link destinations, image layout stability, and reduced-motion behavior.
7. Run the Impeccable mechanical detector once on the changed About targets after implementation.

## Acceptance Criteria

- The About page reads as a personal editorial introduction rather than a résumé dashboard.
- No unsupported statistics, timeline claims, equipment, location, or placeholder external link remains.
- The existing desk image and site visual identity are preserved.
- The page uses semantic theme tokens and remains legible in both themes.
- Mobile layout is deliberately single-column and has no horizontal scrolling.
- The About route ships no page-specific GSAP behavior or unnecessary client boundary.
- Required quality commands and local route verification pass.
