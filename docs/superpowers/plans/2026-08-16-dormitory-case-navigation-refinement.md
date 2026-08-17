# Dormitory Case Navigation Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Dormitory Management System case easier to scan, add a project destination to navigation, and remove navigation-only ambient music without touching game audio.

**Architecture:** Keep project content in `DORMITORY_SYSTEM_PROJECT`. Recompose only the static project route around that data and preserve the isolated screenshot-preview client component. Extend the existing navbar and command-menu navigation lists, then remove the unreferenced ambient player component.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide React, Node test runner, Playwright.

## Global Constraints

- Keep `/projects/dormitory-system` as the only project route and use only the existing sanitized screenshots.
- Use the Mossland Warm Light tokens and the existing floating navigation style.
- Use the concise Chinese label `项目`.
- Preserve screenshot preview click, close button, background click, and `Esc` behavior.
- Delete only `src/components/AmbientPlayer.tsx` after references are checked.
- Do not modify `src/lib/gameSounds.ts`, `src/components/games/`, game audio assets, or game audio tests.
- Do not add project categories, fabricated metrics, or automatic page animation.
- Final checks: `npm test`, `npm run lint`, `npm run build`, `git diff --check`, plus desktop and mobile inspection.

## File Structure

```text
src/components/Navbar.tsx
  Floating navigation, mobile overflow menu, theme toggle, search trigger.
src/components/AmbientPlayer.tsx
  Navigation-only generated music player; deleted in Task 1.
src/components/CommandMenu.tsx
  Search palette navigation result list.
src/app/projects/dormitory-system/page.tsx
  Server-rendered project-case reading layout.
src/app/projects/dormitory-system/ProjectScreenshotGallery.tsx
  Client-only screenshot preview; retains modal state and keyboard behavior.
```

### Task 1: Add the project destination and remove navigation music

**Files:**

- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/CommandMenu.tsx`
- Delete: `src/components/AmbientPlayer.tsx`
- Verify: `src/lib/gameSounds.ts`, `src/components/games/`

**Interfaces:**

- Consumes: `usePathname`, `Link`, and existing navigation style classes.
- Produces: `/projects/dormitory-system` links in desktop navigation, mobile overflow navigation, and command search.
- Removes: the sole `AmbientPlayer` import and all navigation music UI.

- [ ] **Step 1: Confirm the deletion boundary**

Run:

```powershell
rg -n --glob '!node_modules/**' "AmbientPlayer|gameSounds|new Audio|AudioContext" src
```

Expected: `AmbientPlayer` is imported only by `Navbar`; game audio remains in `src/lib/gameSounds.ts` and game components.

- [ ] **Step 2: Add the navigation item and remove player markup**

In `Navbar.tsx`, replace the player import with `Layers3`. Add this link after the gallery item:

```tsx
<Link
  href="/projects/dormitory-system"
  aria-label="项目"
  className={`hidden min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-all sm:min-h-0 sm:min-w-0 sm:px-3 md:flex ${isActive("/projects") ? "bg-white text-[#2D2B2C] shadow-2xs font-semibold" : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"}`}
>
  <Layers3 className="w-3.5 h-3.5 text-[var(--accent-green)]" />
  <span className="hidden lg:inline">项目</span>
</Link>
```

Add `{ href: "/projects/dormitory-system", label: "项目", icon: Layers3 }` to the mobile overflow array. Remove the divider and the `<AmbientPlayer />` wrapper.

- [ ] **Step 3: Add the command-search result**

In `CommandMenu.tsx`, import `Layers3` and append:

```ts
{ title: "项目案例", path: "/projects/dormitory-system", category: "页面导航", icon: Layers3 },
```

to `NAVIGATION_RESULTS`.

- [ ] **Step 4: Delete the unused component and prove game audio remains**

Delete `src/components/AmbientPlayer.tsx`, then run:

```powershell
rg -n --glob '!node_modules/**' "AmbientPlayer|Cloud Music Player|音乐播放器" src
npm test
```

Expected: no player references remain; all tests pass, including the existing generated game-sound tests.

- [ ] **Step 5: Commit**

```powershell
git add src/components/Navbar.tsx src/components/CommandMenu.tsx src/components/AmbientPlayer.tsx
git commit -m "feat: add project navigation and remove ambient player"
```

### Task 2: Recompose the Dormitory case introduction and reading flow

**Files:**

- Modify: `src/app/projects/dormitory-system/page.tsx`
- Modify: `src/app/projects/dormitory-system/ProjectScreenshotGallery.tsx`

**Interfaces:**

- Consumes: `DORMITORY_SYSTEM_PROJECT`, existing theme tokens, and `ProjectScreenshotGallery`.
- Produces: a desktop split introduction, mobile one-column order, and a calm supporting-content sequence.
- Preserves: `ProjectScreenshotGallery({ screenshots, featured? })` and its click-preview behavior.

- [ ] **Step 1: Record the layout acceptance checks**

```text
Desktop 1440px: title, summary, status, and login screenshot share the introduction row.
Mobile 390px: title, summary, and status appear before the login screenshot in one column.
All viewports: role screenshots, system structure, responsibilities, and workflows stay readable with no horizontal scroll.
Interaction: each screenshot opens the preview; button, backdrop, and Escape close it.
```

- [ ] **Step 2: Add the optional featured render mode**

Change the client component signature to:

```tsx
export default function ProjectScreenshotGallery({
  screenshots,
  featured = true,
}: {
  screenshots: ProjectCaseStudy["screenshots"];
  featured?: boolean;
}) {
  const visibleScreenshots = featured ? screenshots : screenshots.slice(1);
}
```

When `featured` is true, preserve the broad login image plus workbench grid. When false, render only the three workbench images with unchanged preview state and accessible labels.

- [ ] **Step 3: Build the split introduction**

In `page.tsx`, render the login screenshot directly with `next/image` beside the title and summary. Use this desktop grid and one-column mobile fallback:

```tsx
<section className="grid gap-10 border-b border-[var(--border-line-color)] pb-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-end lg:gap-16">
  <div>{/* label, title, summary, status, concise case link */}</div>
  <Image /* project.screenshots[0] */ />
</section>
<ProjectScreenshotGallery screenshots={project.screenshots} featured={false} />
```

Do not overlay labels on the image or restore a dark lightbox.

- [ ] **Step 4: Keep supporting content in one reading sequence**

Render system structure first, then the existing workflow main column and technology/current-progress/responsibility side panel. Keep existing text, dividers, and tokenized surface colors; do not add automatic motion.

- [ ] **Step 5: Verify the preview contract with Playwright**

Run against `http://localhost:3001/projects/dormitory-system`:

```js
await page.getByRole("button", { name: /放大查看/ }).first().click();
await page.waitForSelector('[role="dialog"]');
await page.keyboard.press("Escape");
console.assert((await page.locator('[role="dialog"]').count()) === 0);
```

Repeat once with the close button and once by clicking the backdrop.

- [ ] **Step 6: Inspect desktop and mobile**

Capture or inspect `1440x960` and `390x844`. Confirm all acceptance checks from Step 1 and all screenshot alt text.

- [ ] **Step 7: Commit**

```powershell
git add src/app/projects/dormitory-system/page.tsx src/app/projects/dormitory-system/ProjectScreenshotGallery.tsx
git commit -m "feat: refine dormitory case study layout"
```

### Task 3: Final regression verification

**Files:**

- Verify: `Navbar.tsx`, `CommandMenu.tsx`, project route, screenshot gallery, and `src/lib/gameSounds.ts`.

**Interfaces:**

- Consumes: completed navigation, case route, screenshot preview, and existing game-sound tests.
- Produces: a clean, verified branch.

- [ ] **Step 1: Verify local routes and navigation**

```powershell
$home = Invoke-WebRequest -Uri http://localhost:3001/ -UseBasicParsing
$project = Invoke-WebRequest -Uri http://localhost:3001/projects/dormitory-system -UseBasicParsing
"HOME HTTP $($home.StatusCode)"
"PROJECT HTTP $($project.StatusCode)"
```

Expected: both return `200`; desktop nav, mobile overflow, and command search all include the project route.

- [ ] **Step 2: Run production verification**

```powershell
npm test
npm run lint
npm run build
git diff --check
```

Expected: each command exits with code `0`.

- [ ] **Step 3: Commit any final correction**

```powershell
git status --short
git add src/components/Navbar.tsx src/components/CommandMenu.tsx src/components/AmbientPlayer.tsx src/app/projects/dormitory-system/page.tsx src/app/projects/dormitory-system/ProjectScreenshotGallery.tsx
git commit -m "feat: finish dormitory case navigation refinement"
```

Expected: no uncommitted task changes remain.
