# Home Project Archive Design

## Goal

Replace the home-page project's single, oversized case-study card with a compact
stack of equal-sized project archive cards. Add a `/projects` index so the
navigation represents a growing project archive instead of only the dormitory
case study.

## Product Boundaries

- The Dormitory Management System remains the only published case study and
  keeps its existing route: `/projects/dormitory-system`.
- Four additional cards are presentation placeholders, not claimed projects:
  they must visibly use `筹备中` or `留白`, must not have detail routes, and
  must not describe completed work, metrics, or technologies as facts.
- Existing user content, screenshots, and the game-audio system are out of
  scope.

## Visual Direction

The reference is interpreted as a physical archive spread, not copied artwork.
The section uses the existing Mossland Warm Light palette and contains:

1. A quiet section header: `精选项目`, an archive index label, and one concise
   sentence.
2. Five cards of identical desktop dimensions, tightly overlapped in a single
   left-to-right stack. The central Dormitory card is visually highest through
   stacking and a small vertical offset, never through a larger size.
3. Each card has its own small rotation angle. Hovering or keyboard focusing a
   card raises only that card; it does not trigger continuous movement.
4. Under the stack, a restrained archive index confirms the order. The mobile
   view becomes a horizontally scrollable card rail with visible adjacent-card
   affordance; it must not scale a desktop layout down with CSS transforms.

The cards retain their shared 350 × 250 visual proportion on desktop. The
active Dormitory card uses its real title, its actual in-progress status, and
one existing sanitized screenshot or neutral system visual. The temporary
cards are:

- `个人作品归档工具` — `筹备中`
- `Linux 运维练习集` — `筹备中`
- `小型服务监控面板` — `筹备中`
- `下一件待记录的事` — `留白`

## Information Architecture

- `/projects` becomes the project archive index with the same five-card stack,
  a short introduction, and an accessible list equivalent for small screens.
- `/projects/dormitory-system` remains the real case-study detail page.
- The floating navigation and command search lead to `/projects` because it is
  the archive entrance. The home-card link for the real item keeps leading to
  `/projects/dormitory-system`.
- Temporary cards are rendered as non-link status cards. Their visible state
  makes the absence of a detail route explicit.

## Components and Data

- Add an index-level project record type in `src/data/projects.ts`, separate
  from `ProjectCaseStudy`, to describe title, state, serial label, and optional
  real detail link.
- Rework `ProjectTeaser` to consume those records and contain only the home
  presentation and interaction logic.
- Add a project-index route that reuses the archive data and visual language;
  it must not duplicate the Dormitory case-study body.
- Keep case-study data, screenshot previews, and their existing accessibility
  behavior unchanged.

## Interaction and Accessibility

- The real project is a normal focusable link with an obvious label.
- Placeholder cards are semantic non-interactive elements, include their
  planned status in text, and never mimic a broken link.
- Hover and focus lifts use a short transform only. `prefers-reduced-motion`
  removes the transition.
- On mobile, horizontal scrolling has no hidden keyboard trap and cards remain
  readable without horizontal page overflow.

## Verification

1. Desktop inspection at 1440px: exactly five equal cards, close overlap, and
   a clearly ordered stack.
2. Mobile inspection at 390px: readable card rail, no viewport overflow, and
   visible continuation affordance.
3. Keyboard inspection: the real card is reachable and opens the Dormitory
   route; placeholders have no false links.
4. Verify `/projects`, `/projects/dormitory-system`, home navigation, mobile
   navigation, and command search.
5. Run `npm run lint`, `npm run build`, and `git diff --check`.
