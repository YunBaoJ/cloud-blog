# Dormitory System Case Study Design

## Purpose

Add the first recruiter-facing project case study to Cloud's Digital Cottage. The page documents the ongoing Dormitory Management System truthfully, helping a reviewer understand its scope, stack, and implemented work without presenting it as a deployed product.

## Scope

- New route: `/projects/dormitory-system`.
- One project entry point from the existing About page.
- Real screenshots captured from `F:\bishe\Antigravity\Dorm-Sys` only.
- Static, server-rendered case-study content with the existing Mossland Warm Light route frame.

The Dorm-Sys repository is read-only for this work. No project code, database data, credentials, or deployment configuration will be copied into the blog.

## Confirmed Facts

- Frontend: Vue 3, Vite, Pinia, Element Plus, Axios, Vue Router.
- Backend: Spring Boot 3, Java 17, MyBatis-Plus, MySQL, JWT.
- Roles: student, dorm manager, administrator.
- Implemented route and controller areas include room and bed resources, repair requests, visitor records, transfer requests, fee bills, notices, operation logs, dashboards, and chat-related APIs.
- The repository contains frontend E2E coverage and backend controller, service, authorization, and JWT tests.
- Project status: ongoing development. No public deployment, adoption, performance, or completion claims will be made.

## Page Structure

1. **Introduction**
   - Title: 智慧宿舍管理系统.
   - A concise description of the role-based, full-stack practice project.
   - A visible “开发中” status with plain wording.

2. **Real Interface**
   - A small, responsive image sequence from the running local project.
   - Intended captures: login, student workspace, dorm-manager workbench, administrator overview.
   - Images include descriptive alt text and are optimized with `next/image`.

3. **What Is Implemented**
   - Group features by actual workflow rather than showing an exhaustive module list.
   - Planned groups: role access, student services, dormitory operations, and administration.

4. **Technical Approach**
   - Explain frontend, backend, persistence, and authorization in concise sections.
   - Mention existing automated test coverage as repository evidence, without fabricated pass rates.

5. **Current Focus**
   - State that the project is still being developed.
   - Identify current effort as completing and verifying the full workflow, rather than claiming delivery.

## Visual and Interaction Direction

Reading this as: a developer portfolio case study for recruiters, with a calm editorial language that inherits the existing Mossland Warm Light design.

- Design variance: 5. The route follows the blog rhythm and uses one asymmetric image/content moment only.
- Motion intensity: 3. Buttons have hover and focus feedback; no decorative or continuous animation.
- Visual density: 4. Recruiters can scan the stack and implementation groups quickly without dashboard-like density.
- Use the existing semantic color tokens, floating navigation, soft surfaces, and 1.5rem content radius.
- The desktop image/content split collapses to one column below `md`.
- The page does not add a navigation item. The About page provides the first entry to avoid overloading the existing floating navigation.

## Content Rules

- All visible copy is Chinese, concise, and uses no unnecessary English subtitle.
- Do not display a phone number, address, birthday, database dump, test credentials, or secrets.
- Do not create fake product screenshots, metrics, deployment links, or user counts.
- Do not describe incomplete features as finished or production-ready.
- If the live local project cannot be captured safely, the screenshot section remains absent rather than showing fabricated placeholders.

## Verification

1. Confirm each described feature has a corresponding route, controller, service, or test in Dorm-Sys.
2. Confirm screenshots are captured from the local Dorm-Sys interface and contain no credentials or sensitive personal data.
3. Check `/projects/dormitory-system` and the new About entry at desktop and mobile widths.
4. Run `npm run lint`, `npm run build`, and `git diff --check` in the blog repository.
