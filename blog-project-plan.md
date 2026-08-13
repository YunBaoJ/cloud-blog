# Cloud's Digital Cottage — Project Overview and Design Plan

## 1. Purpose

Cloud's Digital Cottage is a Next.js personal blog that brings together writing, visual work, and small browser experiments. It is not a portfolio site with a fixed number of projects; the gallery and notes are intended to grow over time.

The project has three primary content modes:

1. **Notes** — long-form personal writing and technical essays.
2. **Gallery** — illustrations, collected images, and visual references.
3. **Playground** — lightweight interactive games and experiments.

The experience should make these modes feel like rooms in one small home rather than separate products.

## 2. Current Technical Architecture

| Area | Current approach |
| --- | --- |
| Framework | Next.js 16 App Router with React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 plus global design tokens |
| Content parsing | `gray-matter` for Markdown front matter |
| Motion | GSAP for isolated entrance interactions |
| Icons | Lucide React |
| SEO | App Router metadata, `sitemap.ts`, and `robots.ts` |

### Source of truth

```text
content/notes/*.md
        ↓
src/lib/notes.ts
        ↓
App Router page components
        ↓
Reusable client components where interaction is needed
```

Markdown files in `content/notes` are the only source of article bodies. Shared non-article data, such as gallery entries and playground definitions, belongs in `src/data/siteContent.ts`. Site-level configuration belongs in `src/lib/site.ts`.

## 3. Route Map

| Route | Purpose | Primary layout |
| --- | --- | --- |
| `/` | Home | Dark photographic hero followed by selected content modules |
| `/notes` | Notes index | Editorial list and search entry point |
| `/notes/[id]` | Individual note | Reading layout with Markdown rendering and table of contents |
| `/gallery` | Visual archive | Staggered artwork stream and light detail dialog |
| `/playground` | Experiments | Small game and interaction launch area |
| `/archive` | Article archive | Chronological and metadata-driven overview |
| `/now` | Recent activity | Cross-content activity stream |
| `/about` | Personal context | Short profile and site introduction |

## 4. Shared Interface Architecture

`src/app/layout.tsx` assembles the persistent interface:

- `ThemeProvider` manages the selected color mode.
- `RouteTheme` adds the non-home green-paper and background-image layers.
- `ReadingProgress` provides reading feedback.
- `Navbar` provides site navigation, theme toggle, ambient player, and search access.
- `CommandMenu` receives note metadata for site-wide search.

This structure keeps route pages focused on their own content while preserving a consistent navigation and theme layer.

## 5. Information Architecture and Content Rules

### Notes

- Create each article in `content/notes` as one Markdown file with front matter.
- Keep the title, summary, date, category, tags, and featured state in front matter.
- Do not duplicate article body text in a React component or static data file.
- Use clear titles and concise summaries so navigation and search can work from metadata alone.

### Gallery

- Treat the gallery as one continuously growing visual archive, not a camera catalogue.
- Add an item to `GALLERY_PHOTOS` in `src/data/siteContent.ts` and place its source image in `public/gallery`.
- Use a truthful source label where the image is collected rather than created by the site owner.
- Provide a title, date, and short story for every work so the detail view remains meaningful.
- Keep the listing focused on image discovery; detailed metadata belongs in the dialog.

### Playground

- Keep each game or experiment self-contained in the appropriate component/module.
- Avoid introducing a global state dependency for a single isolated interaction.
- Design the launch UI as a calm invitation, not an arcade dashboard.

## 6. Layout Planning Rules

### Home

The home page is the atmospheric entry point. Its dark Hero is intentionally distinct from the rest of the site. Subsequent modules should gradually reduce visual intensity:

```text
Hero → small signals → selected writing → selected artwork → experiments → newsletter → footer
```

### Inner routes

The inner-page frame should remain consistent:

```text
Route label
Page title
One-sentence context
Divider
Primary content
```

For narrow screens, preserve this order and reduce columns before reducing legibility. The page title should not dominate more than the content itself.

### Gallery scaling plan

As the gallery expands, retain the current staggered stream and introduce only the following controls when they solve a real navigation problem:

1. Start with chronological browsing and a clear count of works.
2. When the collection becomes difficult to scan, add a lightweight year jump or lazy loading.
3. Add tags only when enough works share stable, useful labels.
4. Do not reintroduce category chips merely to fill interface space.

## 7. Delivery and Maintenance Workflow

### For a visual change

1. Identify the route and the existing shared token/component that owns the behavior.
2. Make the smallest change that satisfies the design goal.
3. Check desktop and mobile hierarchy, dark mode, focus state, and reduced-motion behavior.
4. Run `npm run lint` and `npm run build`.
5. Verify the changed route locally before considering the task complete.

### For new content

1. Add the Markdown note or gallery data entry.
2. Add only the assets referenced by that content.
3. Confirm that image paths, alternative text, and metadata are correct.
4. Verify the relevant route at desktop and mobile widths.

### For cleanup

1. Trace imports, direct paths, filename matches, and dynamic path construction.
2. Remove an asset or module only after its references are confirmed absent.
3. Remove dependencies only when the feature and all imports are gone.
4. Run lint, build, and `git diff --check` after cleanup.

## 8. Quality Gates

Every code change should pass:

```bash
npm run lint
npm run build
```

In addition, perform a local route check for visual or interactive work. A successful production build alone is not sufficient evidence that the experience is correct.

## 9. Near-Term Priorities

1. Keep the Mossland Warm Light palette consistent across any remaining legacy color literals.
2. Continue replacing unnecessary English navigation subtitles with short Chinese labels.
3. Grow the gallery by adding real work and accurate metadata rather than decorative placeholder cards.
4. Keep background imagery as a restrained atmosphere layer, especially on text-heavy pages.
5. Review each interactive area for keyboard behavior and reduced-motion support when it changes.

## 10. Success Criteria

The blog is succeeding when a visitor can immediately understand where to read, where to browse visual work, and where to explore small experiments; when longer writing remains comfortable to read; and when new content can be added without changing the layout system or duplicating data.
