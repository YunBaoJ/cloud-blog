# About Page Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current résumé-like About page with a truthful, static editorial introduction that matches the blog's Mossland Warm Light identity.

**Architecture:** Replace the page-specific Client Component with one static Server Component that owns the About presentation and uses only repository-confirmed content. Keep route metadata in `page.tsx`, reuse the existing local image and shared `Footer`, and rely on semantic CSS variables for both themes. No new dependency, global token, data source, route, or client state is introduced.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, TypeScript, Tailwind CSS 4, `next/image`, `next/link`, existing `lucide-react` icons.

## Global Constraints

- Preserve the Mossland Warm Light palette, floating navigation, inner-page background, system font stack, and `/about` route.
- Reuse `public/about-desk.jpg`; add no image asset or dependency.
- Keep Chinese as the primary interface language and keep visible labels short.
- Use `CONTACT_EMAIL` from `src/lib/site.ts`; do not hard-code another address.
- Remove unsupported statistics, chronology, location, equipment, career titles, achievements, and the generic GitHub link.
- Remove page-specific GSAP behavior and the About page's unnecessary client boundary.
- Use semantic variables from `src/app/globals.css`; do not change global tokens.
- Leave existing unrelated changes in `src/app/notes/NotesClient.tsx`, `src/components/Hero.tsx`, preview HTML files, and other superpowers documents untouched.
- Required gates are `npm run lint`, `npm run build`, `git diff --check`, HTTP 200, and desktop/mobile light/dark visual inspection.

## File Structure

- Create `src/app/about/AboutContent.tsx`: static editorial layout, factual copy, internal destinations, contact action, desk image, and footer.
- Modify `src/app/about/page.tsx`: import `AboutContent` and replace unsupported metadata copy.
- Delete `src/app/about/AboutClient.tsx`: remove the obsolete client-only layout, data, and GSAP behavior after the replacement exists.
- Do not modify `src/app/globals.css`, `src/components/Footer.tsx`, `src/lib/site.ts`, or `public/about-desk.jpg`.

---

### Task 1: Replace the About Route With a Static Editorial Page

**Files:**
- Create: `src/app/about/AboutContent.tsx`
- Modify: `src/app/about/page.tsx:1-15`
- Delete: `src/app/about/AboutClient.tsx`
- Reference: `docs/superpowers/specs/2026-08-13-about-page-editorial-redesign-design.md`
- Reference: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- Reference: `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
- Reference: `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`

**Interfaces:**
- Consumes: `CONTACT_EMAIL: string` from `@/lib/site`, `Footer`, `next/image`, `next/link`, and existing Lucide icon components.
- Produces: default export `AboutContent(): JSX.Element`, rendered by `AboutPage()` at `/about`.

- [ ] **Step 1: Load implementation guidance before editing**

Read the three Next.js 16 guides listed above. Then load the Impeccable layout playbook and craft floor before editing:

```powershell
Get-Content node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md -Raw -Encoding UTF8
Get-Content node_modules/next/dist/docs/01-app/01-getting-started/12-images.md -Raw -Encoding UTF8
Get-Content node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md -Raw -Encoding UTF8
Get-Content C:\Users\Administrator\.agents\skills\impeccable\reference\layout.md -Raw -Encoding UTF8
Get-Content C:\Users\Administrator\.agents\skills\impeccable\reference\craft-floor.md -Raw -Encoding UTF8
```

Expected: the current Next.js Server Component, image, and metadata rules are available, together with the page-layout and production craft constraints.

- [ ] **Step 2: Record the failing acceptance baseline**

Run:

```powershell
rg -n '"use client"|gsap|useGSAP|365\+|10k\+|杭州|Fujifilm|Frontend Engineer|github\.com' src/app/about
```

Expected: matches in the current About implementation. This proves the obsolete client boundary, motion code, unsupported claims, statistics, and placeholder external link still exist before the change.

- [ ] **Step 3: Create the static editorial component**

Create `src/app/about/AboutContent.tsx` with this implementation:

```tsx
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Gamepad2,
  ImageIcon,
  Mail,
  Sprout,
} from "lucide-react";

const COTTAGE_ROOMS = [
  {
    href: "/notes",
    title: "文字",
    description: "写下技术实践，也整理阅读与生活中的想法。",
    action: "去阅读",
    icon: BookOpen,
  },
  {
    href: "/gallery",
    title: "图像",
    description: "收集原创插画、动漫作品与日常视觉灵感。",
    action: "看作品",
    icon: ImageIcon,
  },
  {
    href: "/playground",
    title: "实验",
    description: "把好奇心做成可以在浏览器里打开的小作品。",
    action: "去体验",
    icon: Gamepad2,
  },
] as const;

export default function AboutContent() {
  return (
    <main className="min-h-[100dvh] bg-transparent text-[var(--foreground)]">
      <section className="px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-24 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[var(--accent-green)]">
              <Sprout className="size-4" strokeWidth={1.8} aria-hidden="true" />
              <span>关于小屋</span>
            </div>
            <h1 className="text-4xl font-light tracking-[-0.05em] sm:text-5xl">
              关于我
            </h1>
          </div>

          <div className="mt-12 grid items-end gap-9 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-14">
            <div className="pb-1">
              <p className="max-w-[24ch] text-2xl font-medium leading-snug tracking-[-0.035em] sm:text-3xl">
                你好，我是 Cloud。这是我保存文字、图像与小实验的地方。
              </p>
              <p className="mt-6 max-w-[56ch] text-sm leading-7 text-[var(--muted)] sm:text-base">
                我在这里整理正在学习的技术，也留下阅读、创作和日常生活中的灵感。比起展示一份履历，我更希望这间小屋能慢慢长成真实的个人记录。
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[var(--surface-2)] shadow-[0_18px_50px_rgba(45,43,44,0.09)] dark:shadow-none">
              <Image
                src="/about-desk.jpg"
                alt="摆放着键盘、笔记本、绿植和咖啡的桌面"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              这间小屋
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
              内容没有严格边界，但始终围绕三件事展开。
            </p>
          </div>

          <div className="mt-10 divide-y divide-[var(--border-line-color)] border-y border-[var(--border-line-color)]">
            {COTTAGE_ROOMS.map((room) => {
              const Icon = room.icon;

              return (
                <Link
                  key={room.href}
                  href={room.href}
                  className="group grid min-h-24 items-center gap-3 py-5 outline-none transition-colors duration-200 hover:text-[var(--accent-green)] focus-visible:text-[var(--accent-green)] focus-visible:ring-2 focus-visible:ring-[var(--accent-green)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] motion-reduce:transition-none md:grid-cols-[9rem_minmax(0,1fr)_auto] md:gap-8"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-5 text-[var(--accent-green)]" strokeWidth={1.7} aria-hidden="true" />
                    <h3 className="text-lg font-semibold">{room.title}</h3>
                  </div>
                  <p className="text-sm leading-6 text-[var(--muted)]">{room.description}</p>
                  <span className="inline-flex min-h-11 items-center gap-1.5 justify-self-start text-sm font-semibold md:justify-self-end">
                    {room.action}
                    <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-6xl rounded-[1.5rem] bg-[var(--surface)] p-7 ring-1 ring-[var(--border-line-color)] sm:p-10 lg:p-14">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              正在做的事
            </h2>
            <p className="mt-6 text-2xl font-medium leading-snug tracking-[-0.035em] sm:text-4xl">
              把学到的东西写清楚，把喜欢的东西留下来。
            </p>
            <p className="mt-6 max-w-[62ch] text-sm leading-7 text-[var(--muted)] sm:text-base">
              目前主要在持续整理技术笔记、维护这间小屋，也尝试把一些想法做成能够直接打开和体验的网页作品。
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 pt-16 sm:px-8 lg:px-12 lg:pb-32 lg:pt-24">
        <div className="mx-auto max-w-6xl rounded-[1.5rem] bg-[var(--accent-green)] p-7 text-[var(--background)] sm:p-10 lg:p-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              保持联系
            </h2>
            <p className="mt-4 text-sm leading-7 opacity-80 sm:text-base">
              如果你想聊聊文章、作品或网站本身，欢迎给我写信。
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-flex min-h-11 max-w-full items-center gap-2 rounded-full bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--accent-green)] outline-none transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--surface)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--accent-green)] motion-reduce:transition-none"
            >
              <Mail className="size-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
              <span className="truncate">{CONTACT_EMAIL}</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
```

Expected: the file has no `"use client"`, hook, or GSAP import. The content contains one image, one continuous three-row destination list, one current-focus surface, and one contact action.

- [ ] **Step 4: Update route metadata and component import**

Replace `src/app/about/page.tsx` with:

```tsx
import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "关于 Cloud",
  description: "关于 Cloud 与这间数字小屋：记录技术笔记、图像收藏和浏览器实验。",
  openGraph: {
    title: "关于 Cloud | Cloud 的数字小屋",
    description: "记录技术笔记、图像收藏和浏览器实验。",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
```

Expected: metadata describes only repository-confirmed content and the route renders the new Server Component.

- [ ] **Step 5: Remove the obsolete client component**

Delete only:

```text
src/app/about/AboutClient.tsx
```

Expected: `AboutClient`, `TIMELINE`, `SKILLS`, `ScrollTrigger`, `useGSAP`, and page-specific GSAP selectors no longer exist under `src/app/about`.

- [ ] **Step 6: Verify the acceptance baseline now passes**

Run:

```powershell
$forbidden = rg -n '"use client"|gsap|useGSAP|365\+|10k\+|杭州|Fujifilm|Frontend Engineer|github\.com' src/app/about
if ($LASTEXITCODE -eq 0) { $forbidden; throw 'Forbidden About-page content remains.' }
if ($LASTEXITCODE -ne 1) { throw 'About-page scan failed.' }
rg -n '关于我|这间小屋|正在做的事|保持联系|CONTACT_EMAIL|/notes|/gallery|/playground' src/app/about
```

Expected: the forbidden scan prints nothing; the required scan finds every heading, destination, and the shared contact constant.

- [ ] **Step 7: Run static quality gates**

Run:

```powershell
npm run lint
npm run build
git diff --check
node C:\Users\Administrator\.agents\skills\impeccable\scripts\detect.mjs --json src/app/about/AboutContent.tsx src/app/about/page.tsx
```

Expected: lint and build exit 0, no whitespace errors are reported, and the detector reports no blocking design violations. If the detector reports a concrete violation, correct only the changed About files and rerun this step once.

- [ ] **Step 8: Start the app and verify rendered content**

Run:

```powershell
$aboutStartedPid = $null
$listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if (-not $listener) {
  $aboutProcess = Start-Process -FilePath 'npm.cmd' -ArgumentList @('run', 'dev') -WorkingDirectory 'F:\Agent\Antigravity\blog' -WindowStyle Hidden -PassThru
  $aboutStartedPid = $aboutProcess.Id
}
for ($attempt = 0; $attempt -lt 30; $attempt++) {
  try {
    $aboutResponse = Invoke-WebRequest -Uri 'http://localhost:3000/about' -UseBasicParsing -TimeoutSec 3
    if ($aboutResponse.StatusCode -eq 200) { break }
  } catch {
    Start-Sleep -Seconds 1
  }
}
if ($aboutResponse.StatusCode -ne 200) { throw 'The About route did not return HTTP 200.' }
foreach ($text in @('关于我', '这间小屋', '正在做的事', '保持联系')) {
  if (-not $aboutResponse.Content.Contains($text)) { throw "Missing rendered text: $text" }
}
```

Expected: `/about` returns HTTP 200 and server-rendered HTML contains all four section headings. Keep the server running for the screenshot step; record whether this task started it in `$aboutStartedPid`.

- [ ] **Step 9: Capture and inspect desktop, mobile, and dark screenshots**

Run:

```powershell
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$desktopShot = Join-Path $env:TEMP 'codex-about-desktop.png'
$mobileShot = Join-Path $env:TEMP 'codex-about-mobile.png'
$darkShot = Join-Path $env:TEMP 'codex-about-dark.png'
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1440,1100', "--screenshot=$desktopShot", 'http://localhost:3000/about') -Wait -WindowStyle Hidden
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=390,844', "--screenshot=$mobileShot", 'http://localhost:3000/about') -Wait -WindowStyle Hidden
Start-Process -FilePath $chrome -ArgumentList @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-dark-mode', '--window-size=1440,1100', "--screenshot=$darkShot", 'http://localhost:3000/about') -Wait -WindowStyle Hidden
Get-Item $desktopShot, $mobileShot, $darkShot | Select-Object FullName,Length
```

Inspect all three images. Confirm:

- Desktop uses an asymmetric intro and aligned 6xl content frame.
- Mobile is one column with no clipped image, link, email, or horizontal overflow.
- The next section is visibly discoverable below the first viewport.
- Light and dark modes preserve readable hierarchy and moss-green interaction color.
- Focus styling exists in markup, interactive targets are at least 44px high, and no information depends on hover.
- The page has no template-like statistics, skill pills, chronology cards, decorative status dots, or duplicate calls to action.

If a screenshot exposes a defect, make one batched correction in `AboutContent.tsx`, then rerun Steps 7-9 once. Do not open an unbounded polish loop.

- [ ] **Step 10: Review the exact diff and commit the implementation**

Run:

```powershell
git diff -- src/app/about/page.tsx src/app/about/AboutContent.tsx src/app/about/AboutClient.tsx
git status --short
git add -- src/app/about/page.tsx src/app/about/AboutContent.tsx src/app/about/AboutClient.tsx
$aboutStaged = @(git diff --cached --name-only)
$expectedAboutFiles = @('src/app/about/AboutClient.tsx', 'src/app/about/AboutContent.tsx', 'src/app/about/page.tsx')
if (Compare-Object $aboutStaged $expectedAboutFiles) { throw 'Unexpected staged files.' }
git diff --cached --check
git commit -m 'feat: redesign about page as editorial profile'
```

Expected: only the two current About files and the deleted old component are staged; the commit succeeds without including any unrelated working-tree file.

If this task started the development server and the user does not want it left running, stop only the recorded process:

```powershell
if ($aboutStartedPid) { Stop-Process -Id $aboutStartedPid }
```

Expected final state: `/about` is a static, factual, responsive editorial page; unrelated working-tree changes remain untouched.
