# Gallery Paper Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every gallery listing item a restrained paper-sheet surface so the image, title, source, and date read as one complete artwork entry.

**Architecture:** Keep the existing gallery data flow, three-column distribution, button interaction, and detail dialog unchanged. Apply the new presentation directly to the existing `article`, image wrapper, and caption wrapper with Tailwind utilities and current theme variables.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript, Tailwind CSS 4

## Global Constraints

- Modify only the gallery listing presentation in `src/app/gallery/GalleryClient.tsx`.
- Preserve natural image proportions and the existing staggered desktop layout.
- Do not change gallery data, image files, pagination, dialog behavior, or other routes.
- Use existing dependencies and theme variables; add no package or reusable abstraction.
- Keep hover, keyboard focus, image failure, mobile, and reduced-motion behavior working.

---

## File Structure

- Modify `src/app/gallery/GalleryClient.tsx`: add the paper surface and adjust its inner spacing.
- No files are created for runtime code because the change is local to one existing listing component.
- No automated UI test file is added because this repository has no browser-test harness; the acceptance criteria are visual and are covered by route inspection plus lint and production build gates.

### Task 1: Add the gallery artwork paper surface

**Files:**
- Modify: `src/app/gallery/GalleryClient.tsx:136-177`

**Interfaces:**
- Consumes: existing `GalleryPhoto` records, `failedImageIds`, and `setSelectedPhoto` behavior.
- Produces: the same clickable gallery item markup with a new visual container; no new props, state, functions, or exported types.

- [ ] **Step 1: Confirm the framework styling guidance and current baseline**

Read the relevant installed Next.js styling guide under `node_modules/next/dist/docs/` before editing. Start the existing development server and inspect `/gallery` at approximately 1440 px and 390 px widths. Confirm that each current `gallery-artwork` has no outer surface and that image aspect ratios and column offsets are correct before the change.

- [ ] **Step 2: Add the minimal paper surface**

Replace the current article opening:

```tsx
<article key={photo.id} className="gallery-artwork">
```

with:

```tsx
<article
  key={photo.id}
  className="gallery-artwork rounded-2xl bg-[var(--surface)]/85 p-2.5 shadow-[0_12px_30px_rgba(51,72,58,0.10)] ring-1 ring-white/70 backdrop-blur-[6px] sm:p-3 dark:ring-[var(--border-line-color)]"
>
```

Change the image wrapper from:

```tsx
<div className="relative overflow-hidden bg-[var(--surface-2)] shadow-[0_4px_18px_rgba(45,43,44,0.06)] dark:shadow-none">
```

to:

```tsx
<div className="relative overflow-hidden rounded-xl bg-[var(--surface-2)] shadow-[0_4px_18px_rgba(51,72,58,0.08)] dark:shadow-none">
```

Change the caption wrapper from:

```tsx
<div className="pt-4">
```

to:

```tsx
<div className="px-1 pb-1 pt-4">
```

Do not alter any content, handlers, image attributes, hover/focus utilities, or gallery column classes.

- [ ] **Step 3: Run static verification**

Run:

```powershell
npm run lint
npm run build
git diff --check
```

Expected results: ESLint exits with code 0, the Next.js production build completes successfully, and `git diff --check` prints no whitespace errors.

- [ ] **Step 4: Inspect desktop and mobile behavior**

Inspect `/gallery` again at approximately 1440 px and 390 px widths and verify:

- every image and caption belong to one translucent warm paper surface;
- images remain visually dominant and retain natural proportions;
- the three desktop columns keep their current offsets and mobile remains single-column;
- the surface does not read as a thick white photography mat;
- hover and visible keyboard focus still reveal the moss accent;
- clicking an artwork still opens the existing light detail dialog;
- a failed image message, if triggered through browser tooling, remains contained by the same surface.

- [ ] **Step 5: Commit only the gallery implementation**

```powershell
git add -- src/app/gallery/GalleryClient.tsx
git commit -m "style: add paper surface to gallery items"
```

Before committing, confirm `git diff --cached --name-only` lists only `src/app/gallery/GalleryClient.tsx` so unrelated user changes remain untouched.
