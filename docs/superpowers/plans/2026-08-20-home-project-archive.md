# Home Project Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page's single project card with a truthful five-card archive and add `/projects` as its landing page.

**Architecture:** Keep the case-study data model intact. Add a small archive-record model, a reusable server-rendered stack component, and a server-rendered index route. Only the Dormitory record has a detail link.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide React, Node test runner.

## Global Constraints

- `/projects/dormitory-system` remains the only published project detail route.
- Render exactly five equal desktop cards, each using the 350 × 250 proportion, with tight left-to-right overlap.
- The four temporary cards visibly say `筹备中` or `留白`, have no route, and make no unverified claim.
- Preserve Mossland Warm Light, the floating navigation, case-study content, screenshots, gallery behavior, and game audio.
- Only the published project is keyboard focusable; placeholders are semantic non-links.
- Motion is a short hover/focus lift with `motion-reduce:transition-none`.
- Final verification is `npm test`, `npm run lint`, `npm run build`, `git diff --check`, plus 1440px and 390px inspection.

## File Structure

```text
src/data/projects.ts                    ProjectArchiveItem and PROJECT_ARCHIVE_ITEMS
src/data/projects.test.mts              Archive truthfulness test
src/components/ProjectArchiveStack.tsx  Shared archive presentation
src/components/ProjectTeaser.tsx        Home heading and composition
src/app/projects/page.tsx               Archive landing route
src/components/Navbar.tsx               Archive navigation target
src/components/CommandMenu.tsx          Archive search result
```

### Task 1: Define honest project archive records

**Files:**

- Modify: `src/data/projects.ts`
- Modify: `src/data/projects.test.mts`

**Interfaces:**

- Produces `ProjectArchiveItem` and `PROJECT_ARCHIVE_ITEMS`.
- Every record has `id`, `serial`, `title`, `summary`, `status`, `kind`, and optional `href`.

- [ ] **Step 1: Write the failing test**

Import `PROJECT_ARCHIVE_ITEMS` in `src/data/projects.test.mts`, then add:

```ts
test("项目档案只公开宿舍系统案例，其余项目明确为筹备状态", () => {
  assert.equal(PROJECT_ARCHIVE_ITEMS.length, 5);
  const published = PROJECT_ARCHIVE_ITEMS.filter((item) => item.href);
  assert.deepEqual(published.map((item) => item.id), ["dormitory-system"]);
  assert.equal(published[0].href, "/projects/dormitory-system");
  assert.ok(PROJECT_ARCHIVE_ITEMS.slice(1).every((item) => item.href === undefined));
  assert.deepEqual(PROJECT_ARCHIVE_ITEMS.slice(1).map((item) => item.status), ["筹备中", "筹备中", "筹备中", "留白"]);
});
```

- [ ] **Step 2: Verify red**

Run: `node --test src/data/projects.test.mts`.

Expected: the import fails because the archive source does not exist.

- [ ] **Step 3: Implement the data model**

Add this interface:

```ts
export interface ProjectArchiveItem {
  id: string;
  serial: string;
  title: string;
  summary: string;
  status: "开发中" | "筹备中" | "留白";
  kind: "published" | "planning" | "notebook";
  href?: string;
}
```

Add `PROJECT_ARCHIVE_ITEMS` in this order: `dormitory-system`, `portfolio-archive`, `linux-practice`, `service-observability`, `next-record`. The real item is `开发中`, `published`, and has `href: "/projects/dormitory-system"`. The other items use statuses `筹备中`, `筹备中`, `筹备中`, `留白`, have no `href`, and use the exact titles `个人作品归档工具`, `Linux 运维练习集`, `小型服务监控面板`, `下一件待记录的事`. Use these summaries respectively: `用于整理作品与过程记录的下一项计划。`, `围绕命令、排障与复盘建立的学习记录。`, `用于练习服务观察与状态呈现的计划。`, `为下一段真实实践预留的位置。`.

- [ ] **Step 4: Verify green and commit**

Run: `node --test src/data/projects.test.mts`; then `npm test`. Both must exit 0. Commit with `git add src/data/projects.ts src/data/projects.test.mts` and `git commit -m "feat: add project archive records"`.

### Task 2: Build the compact stack and replace the home teaser

**Files:**

- Create: `src/components/ProjectArchiveStack.tsx`
- Modify: `src/components/ProjectTeaser.tsx`

**Interfaces:**

- `ProjectArchiveStack({ items, variant })` receives `readonly ProjectArchiveItem[]` and `variant: "home" | "index"`.
- The real record uses Next `Link`; planned records use `<article>` with visible text status.

- [ ] **Step 1: Create the semantic card branch**

The shared card body contains serial, title, summary, and its final status label. Wrap it as follows:

```tsx
return item.href ? (
  <Link href={item.href} aria-label={`查看项目：${item.title}`}>{cardBody}</Link>
) : (
  <article aria-label={`${item.title}，${item.status}`}>{cardBody}</article>
);
```

Do not add `tabIndex`, click handlers, or false detail affordances to planned items.

- [ ] **Step 2: Implement the desktop stack**

Every card frame uses `w-[350px] min-w-[350px] aspect-[7/5]`. On desktop, use a `relative h-[470px]` wrapper and ordered classes: `left-0 bottom-10 -rotate-[9deg] z-[1]`; `left-[18%] bottom-14 -rotate-[4.5deg] z-[2]`; `left-[36%] bottom-[4.5rem] rotate-0 z-[5]`; `left-[54%] bottom-14 rotate-[4.5deg] z-[3]`; `left-[72%] bottom-10 rotate-[9deg] z-[1]`. Add `hover:-translate-y-6 focus-visible:-translate-y-6 hover:z-20 focus-visible:z-20 transition-transform motion-reduce:transition-none`.

- [ ] **Step 3: Implement the mobile rail**

Below `lg`, use a non-scaled horizontal list with `overflow-x-auto`, `snap-x`, `snap-mandatory`, `gap-4`, and `pr-[24%]`. Preserve card readability and show part of the next card.

- [ ] **Step 4: Replace the old home block**

Remove the existing oversized single-system mockup in `ProjectTeaser`. Render a short archive label, `精选项目`, one sentence, `<Link href="/projects">进入项目档案</Link>`, and `<ProjectArchiveStack items={PROJECT_ARCHIVE_ITEMS} variant="home" />`.

- [ ] **Step 5: Inspect and commit**

At `http://localhost:3000/#projects`, inspect 1440px and 390px. Confirm equal cards, tight overlap, only one link, visible mobile continuation, and no viewport overflow. Commit with `git add src/components/ProjectArchiveStack.tsx src/components/ProjectTeaser.tsx` and `git commit -m "feat: add compact home project archive"`.

### Task 3: Add `/projects` and retarget navigation

**Files:**

- Create: `src/app/projects/page.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/CommandMenu.tsx`

**Interfaces:**

- `/projects` renders `PROJECT_ARCHIVE_ITEMS` through `ProjectArchiveStack`.
- Navigation and command search lead to `/projects`; only the published card leads to the detail route.

- [ ] **Step 1: Add the archive landing page**

Create `src/app/projects/page.tsx` as a server component. Export metadata `{ title: "项目档案", description: "正在完成与准备中的个人实践记录。" }`. Render a `main` with `pt-32`, a small `Layers3` label, the `项目档案` heading, one concise sentence, a divider, and `<ProjectArchiveStack items={PROJECT_ARCHIVE_ITEMS} variant="index" />`. Do not duplicate the Dormitory detail sections or add a route-specific background.

- [ ] **Step 2: Retarget the entries**

In `Navbar.tsx`, change both project `href` values from `/projects/dormitory-system` to `/projects` and retain `isActive("/projects")`. In `CommandMenu.tsx`, use `{ title: "项目档案", path: "/projects", category: "页面导航", icon: Layers3 }`.

- [ ] **Step 3: Verify and commit**

Run: `$archive = Invoke-WebRequest -Uri http://localhost:3000/projects -UseBasicParsing; $detail = Invoke-WebRequest -Uri http://localhost:3000/projects/dormitory-system -UseBasicParsing; "ARCHIVE HTTP $($archive.StatusCode)"; "DETAIL HTTP $($detail.StatusCode)"; npm test; npm run lint; npm run build; git diff --check`.

Expected: both routes return 200 and every command exits 0. Verify desktop/mobile nav and `Ctrl+K` search target `/projects`. Commit with `git add src/app/projects/page.tsx src/components/Navbar.tsx src/components/CommandMenu.tsx` and `git commit -m "feat: add project archive landing page"`.
