# Dormitory System Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Add a truthful, recruiter-facing case-study page for the ongoing Dormitory Management System and expose it from the existing About page.

**Architecture:** Keep project facts in `src/data/projects.ts`, render the page as a Server Component, and use real screenshots copied into the blog's public assets. The route uses the existing non-home paper frame and does not add a primary navigation item.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, `next/image`, Node test runner, and the Vue 3 and Spring Boot source material in `F:\bishe\Antigravity\Dorm-Sys`.

## Global Constraints

- Keep `F:\bishe\Antigravity\Dorm-Sys` read-only. Never copy database files, credentials, logs, or configuration secrets.
- Use only factual project claims verified from routes, controllers, services, or tests.
- State that the project is in development. Do not claim deployment, user adoption, completion rate, or performance metrics.
- Copy only real local UI screenshots into `public/projects/dormitory-system/`.
- Keep visible labels in concise Chinese and use the existing Mossland Warm Light tokens.
- The desktop screenshot/content grid becomes one column below `md`.
- Do not add a primary-navigation item. Add one About-page entry instead.
- Run `npm run lint`, `npm run build`, `npm test`, and `git diff --check` before completion.

## File Structure

```text
public/projects/dormitory-system/
  login.png
  student-desk.png
  manager-workbench.png
  admin-overview.png
src/data/projects.ts
src/data/projects.test.mts
src/app/projects/dormitory-system/page.tsx
src/app/about/AboutContent.tsx
package.json
```

### Task 1: Capture and sanitize real project screenshots

**Files:**
- Create: `public/projects/dormitory-system/login.png`
- Create: `public/projects/dormitory-system/student-desk.png`
- Create: `public/projects/dormitory-system/manager-workbench.png`
- Create: `public/projects/dormitory-system/admin-overview.png`
- Verify: `F:\bishe\Antigravity\Dorm-Sys\frontend\tests\e2e\roles.spec.js`

**Interfaces:**
- Produces four screenshot paths for the project data module.
- Consumes the existing local role-login flows.

- [ ] Start the existing local project through its own Playwright configuration.

Run from `F:\bishe\Antigravity\Dorm-Sys\frontend`:

```powershell
npx playwright test tests/e2e/roles.spec.js
```

Expected: the existing configuration starts local frontend and backend services, then role-login checks pass. Do not print passwords, connection strings, tokens, or test fixtures.

- [ ] Capture login, student, dorm-manager, and administrator routes after their normal local login flow.

Use authenticated Playwright pages and save viewport captures only. Capture `/login` before authentication and `/student/desk`, `/dormmanager/workbench`, and `/admin/overview` after their role-specific logins. Re-run a capture if it contains a token, password, database configuration, or personal contact information.

- [ ] Copy only the four reviewed PNG files to `public/projects/dormitory-system/`.

Run:

```powershell
Get-ChildItem public\projects\dormitory-system -File | Select-Object Name, Length
```

Expected: exactly four non-empty PNG files. Temporary capture scripts and raw output stay outside the blog repository.

- [ ] Commit the screenshot assets.

```powershell
git add public/projects/dormitory-system
git commit -m "assets: add dormitory system case study captures"
```

### Task 2: Create truthful project-case data and regression test

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/data/projects.test.mts`
- Modify: `package.json`

**Interfaces:**
- Produces `DORMITORY_SYSTEM_PROJECT: ProjectCaseStudy`.
- `ProjectCaseStudy` exposes `slug`, `title`, `status`, `summary`, `stack`, `workflows`, `screenshots`, and `currentFocus`.

- [ ] Write the failing data contract test.

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { DORMITORY_SYSTEM_PROJECT } from "./projects";

test("宿舍系统案例保持可核对的开发中状态与真实截图", () => {
  assert.equal(DORMITORY_SYSTEM_PROJECT.slug, "dormitory-system");
  assert.equal(DORMITORY_SYSTEM_PROJECT.status, "开发中");
  assert.equal(DORMITORY_SYSTEM_PROJECT.screenshots.length, 4);
  assert.deepEqual(
    DORMITORY_SYSTEM_PROJECT.workflows.map((item) => item.title),
    ["角色访问", "学生服务", "宿舍运营", "管理维护"],
  );
  assert.ok(DORMITORY_SYSTEM_PROJECT.stack.includes("Spring Boot 3"));
  assert.ok(DORMITORY_SYSTEM_PROJECT.stack.includes("Vue 3"));
});
```

- [ ] Run `node --test src/data/projects.test.mts` and confirm it fails because `./projects` does not exist.

- [ ] Implement the smallest typed data module.

```ts
export interface ProjectCaseStudy {
  slug: string;
  title: string;
  status: "开发中";
  summary: string;
  stack: readonly string[];
  workflows: readonly { title: string; description: string }[];
  screenshots: readonly { src: string; alt: string; width: number; height: number }[];
  currentFocus: string;
}
```

Set the title to `智慧宿舍管理系统`. Use these factual workflow groups only: `角色访问`, `学生服务`, `宿舍运营`, and `管理维护`. Do not include numeric outcomes, deployment claims, or credentials.

- [ ] Append `src/data/projects.test.mts` to the explicit `node --test` list in `package.json`, run `npm test`, and confirm all existing tests plus the new data test pass.

- [ ] Commit the typed content contract.

```powershell
git add src/data/projects.ts src/data/projects.test.mts package.json
git commit -m "feat: add dormitory system case study data"
```

### Task 3: Render the static project case-study route

**Files:**
- Create: `src/app/projects/dormitory-system/page.tsx`
- Modify: `src/app/about/AboutContent.tsx`
- Verify: `src/data/projects.test.mts`

**Interfaces:**
- Consumes `DORMITORY_SYSTEM_PROJECT` from `@/data/projects`.
- Produces `/projects/dormitory-system` and an internal About-page link.

- [ ] Implement `src/app/projects/dormitory-system/page.tsx` as a Server Component.

Render this order:

```tsx
<main className="min-h-[100dvh] bg-transparent px-5 pb-24 pt-28 text-[var(--foreground)] sm:px-8 lg:px-12 lg:pb-32 lg:pt-32">
  <header><h1>{project.title}</h1><p>{project.summary}</p></header>
  <section aria-label="系统界面">{project.screenshots.map(renderScreenshot)}</section>
  <section aria-label="已实现内容">{project.workflows.map(renderWorkflow)}</section>
  <section aria-label="技术实现">{project.stack.join("、")}</section>
</main>
```

Use `next/image` with width and height from the data module, accurate alt text, and responsive `sizes`. Use one broad login screenshot followed by an asymmetric three-image layout on desktop. Collapse every image layout to one column below `md`. Do not add automatic animation.

- [ ] Add one About-page entry after the personal introduction.

```tsx
<Link href="/projects/dormitory-system">
  查看智慧宿舍管理系统
</Link>
```

Use existing focus-ring and arrow-link styles. Do not change the primary navigation.

- [ ] Run the blog dev server and request `http://localhost:3000/projects/dormitory-system`.

Expected: HTTP 200. At a narrow viewport, screenshots stack vertically, text remains readable, no control overlaps the floating navigation, and every screenshot reserves its aspect ratio before loading.

- [ ] Commit the route and About entry.

```powershell
git add src/app/projects/dormitory-system/page.tsx src/app/about/AboutContent.tsx
git commit -m "feat: add dormitory system case study"
```

### Task 4: Final truth, accessibility, and production verification

**Files:**
- Verify: `src/data/projects.ts`
- Verify: `src/app/projects/dormitory-system/page.tsx`
- Verify: `src/app/about/AboutContent.tsx`
- Verify: `public/projects/dormitory-system/*.png`

**Interfaces:**
- Consumes the finished route, data module, real screenshot assets, and existing project tooling.
- Produces a verified case study ready for review.

- [ ] Re-read all visible case-study copy against the Dorm-Sys source.

Run:

```powershell
rg -n "student|dormmanager|admin|repair|visitor|transfer|fee|notice|operation" F:\bishe\Antigravity\Dorm-Sys\frontend\src\router\index.js F:\bishe\Antigravity\Dorm-Sys\backend\src\main\java\com\dorm\backend\controller
```

Expected: each claim maps to a real route or controller. Remove wording that implies production delivery, deployment, or unverified ownership.

- [ ] Check every screenshot has non-empty accurate alt text, headings proceed from `h1` to `h2`, and the About link has a visible focus state.

- [ ] Run:

```powershell
npm test
npm run lint
npm run build
git diff --check
```

Expected: every command exits with code 0.

- [ ] Verify final routes.

```powershell
$about = Invoke-WebRequest -Uri http://localhost:3000/about -UseBasicParsing
$project = Invoke-WebRequest -Uri http://localhost:3000/projects/dormitory-system -UseBasicParsing
"ABOUT HTTP $($about.StatusCode)"
"PROJECT HTTP $($project.StatusCode)"
```

Expected: both routes return HTTP 200.

- [ ] Commit the final verification-ready changes.

```powershell
git add src/app/projects/dormitory-system/page.tsx src/app/about/AboutContent.tsx src/data/projects.ts src/data/projects.test.mts public/projects/dormitory-system package.json
git commit -m "feat: publish dormitory system portfolio case"
```
