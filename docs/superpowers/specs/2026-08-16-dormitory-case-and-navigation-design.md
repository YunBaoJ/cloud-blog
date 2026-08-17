# Dormitory Case Study and Navigation Design

## Purpose

Refine the existing Dormitory Management System case study into a clearer recruiter-facing reading flow, expose it through the site navigation, and remove the unrelated ambient music player from the navigation bar. The website remains a personal blog and the Dormitory Management System remains the only project case.

## Scope

### Case-study layout

- Keep the existing route at `/projects/dormitory-system` and retain its real, sanitized screenshots.
- Recompose the introduction into a desktop split layout: project title, summary, status, and a direct case link sit beside the login screenshot. On narrow screens, text precedes the screenshot in one column.
- Keep the three role workbench screenshots together beneath the introduction. Each remains clickable through the existing light preview dialog.
- Present system structure, personal responsibilities, and implemented workflows as a calm reading sequence with spacing and dividers instead of competing cards.
- Preserve the active Mossland Warm Light palette, low-motion behavior, existing accessibility labels, and the light screenshot preview treatment.

### Navigation

- Add a `项目` navigation item that links to `/projects/dormitory-system`.
- Display it in the desktop floating navigation and add it to the mobile `更多导航` menu.
- Add the same destination to the command search navigation results.
- Use the existing Lucide icon family and the established active, hover, and focus states.

### Ambient music removal

- Remove the ambient music trigger and popover from `Navbar`.
- Delete `AmbientPlayer.tsx` after confirming it has no remaining imports.
- Do not change `src/lib/gameSounds.ts`, game components, or any game background music and effects.

## Non-goals

- No new project routes, project categories, primary navigation redesign, or music settings replacement.
- No fabricated project metrics, deployment claims, user data, or new screenshots.
- No automatic page animations or page-wide transitions.

## Verification

- The desktop nav exposes `项目`; the mobile more menu and command search expose the same route.
- No references to `AmbientPlayer` remain, while game audio imports and tests remain unchanged.
- The project route renders its split introduction at desktop and one-column flow on mobile.
- Screenshot preview still opens and closes with its visible control, background click, and `Esc`.
- Run `npm test`, `npm run lint`, `npm run build`, `git diff --check`, plus local desktop and mobile inspection of the home, navigation, and project route.
