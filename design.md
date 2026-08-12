# Cloud's Digital Cottage — Design System

## Design Intent

Cloud's Digital Cottage is a personal blog for notes, small experiments, and a growing collection of illustrations and images. The visual language should feel quiet, fresh, and personal rather than technical or corporate.

The site combines three ideas:

- A dark, photographic home hero that creates an immediate sense of place.
- Pale green-paper content pages that keep reading and artwork calm.
- Lightweight glass navigation and information surfaces that sit above imagery without competing with it.

The target feeling is **a small digital room near a garden**: warm enough for daily writing, cool enough for night photography, and restrained enough for long reading sessions.

## Visual Principles

1. **Content leads.** Photography, illustrations, and writing are the primary visual elements. Decorative layers must remain subtle.
2. **One atmosphere, not many styles.** The home hero is dark and cinematic; all other routes use the same natural family in a lighter register.
3. **Soft contrast over hard decoration.** Use tinted shadows, translucent surfaces, and paper-like backgrounds instead of heavy outlines or saturated effects.
4. **Asymmetry with a clear reading order.** Gallery items may vary vertically, but headings, captions, and controls should remain predictable.
5. **Motion should explain, never demand attention.** Entrance motion is brief, respects `prefers-reduced-motion`, and must not cause visible flashing.

## Active Palette: 04 — Mossland Warm Light

This is the selected production palette. It was derived from the SpringBlog hero reference, then shifted slightly warmer for the blog's illustration and daily-life content.

| Role | Token / value | Use |
| --- | --- | --- |
| Hero ink | `#26352A` | Home hero overlays and dark anchors |
| Paper | `#F6F4EC` | Page background, hero primary CTA |
| Text green | `#33483A` | Default text and strong foreground |
| Soft surface | `#FFFEF9` | Elevated reading and utility surfaces |
| Secondary surface | `#E4E9DD` | Quiet panels and low-priority backgrounds |
| Moss | `#718F6E` | Primary interactive accent |
| Soft moss | `#9DB289` | Status indicators and supporting color |
| Sunset apricot | `#D79B7B` | A single warm accent for small visual moments |
| Muted text | `#748176` | Supporting labels and metadata |

### Color Usage Rules

- Use moss green for navigation states, emphasis, and standard actions.
- Use sunset apricot sparingly: icons, tiny badges, or a single callout within a view.
- Paper and soft surfaces must carry most light-mode area; avoid pure white as the default page color.
- Dark mode should preserve the same relationships: warm paper-like text, deep green surfaces, moss accents, and apricot details.
- Do not add a second saturated accent color.

## Typography

The project uses the platform sans-serif stack already configured in `src/app/globals.css`, prioritizing legibility for Chinese and English content.

| Element | Direction |
| --- | --- |
| Hero title | Large, compact sans-serif, left aligned, one visual idea per line |
| Page title | Large but quieter than the hero; use the same left edge as page content |
| Section title | Medium weight, concise, with generous space above |
| Body copy | Comfortable line height and a constrained measure for long notes |
| Metadata | Smaller and muted; never compete with the title or artwork |
| Utility labels | Short Chinese labels, generally no English subtitle unless it adds real meaning |

The interface should avoid oversized display type on inner pages. The gallery heading defines the preferred scale and alignment for all non-home routes.

## Layout System

### Global frame

- A centered, floating pill navigation stays near the top of every route.
- The home route uses its own full-bleed dark hero treatment.
- Non-home routes use a pale green-paper base with a fixed, low-opacity floral image layer behind the content.
- Content sits above that image layer so text, cards, and artwork remain crisp.

### Home page

1. Hero: full-width photograph, dark green overlay, identity capsule, static title, two actions, and a translucent daily quote panel.
2. Statistics: a brief transition from atmosphere to content.
3. Featured notes: the reading entry point.
4. Gallery teaser: selected visual work.
5. Playground teaser: small interactive experiments.
6. Newsletter and footer: a quiet close rather than a hard conversion block.

### Inner pages

All inner routes should follow the same order:

1. Small route label or icon.
2. Left-aligned page title of no more than four Chinese characters where possible.
3. One short explanatory sentence.
4. A thin divider.
5. Page-specific content.

This shared rhythm keeps Notes, Gallery, Archive, About, Guestbook, and Playground recognizably related without making them identical.

### Gallery

- Artwork uses a calm, staggered three-column composition on wide screens and collapses gracefully on smaller screens.
- The first viewport should reveal part of the second row, signalling that the collection continues.
- Images should retain their natural aspect ratio in the list. Do not force every image into a 16:9 crop or a white padded frame.
- The gallery has no category filter: the growing collection is browsed as one stream.
- Opening an item uses a light, paper-like detail scene with the image and its information side by side. The backdrop must not be black.

## Surfaces, Borders, and Depth

- Navigation: translucent paper tint, soft white border, high backdrop blur, pill shape.
- Cards: use only where elevation communicates grouping. Most editorial sections should rely on spacing or a thin divider.
- Shadows: low-opacity and green-tinted or neutral; no stark black shadow on pale surfaces.
- Radius rule: pill controls, soft 16–24px content surfaces, circular identity/media elements.
- Background imagery: a separate fixed layer with low opacity, never a background that reduces text contrast.

## Interaction and Motion

- Buttons lift slightly on hover and settle on press.
- Hero content may use a single staged entrance; titles must remain static after rendering.
- Image dialogs should open from the selected work with a soft light backdrop and an obvious close control.
- Respect `prefers-reduced-motion` for all non-essential animation.
- Avoid route-wide fade transitions that can make gallery images flash.

## Accessibility Baseline

- Maintain readable foreground/background contrast in both themes.
- Give every meaningful image useful alternative text.
- Make the gallery dialog operable with keyboard focus and an explicit close action.
- Do not rely on color alone for active or selected states.
- Keep controls comfortably tappable on small screens.

## Design Review Checklist

- Does the page use the active palette rather than a local, unrelated color?
- Is the artwork or writing more prominent than the decorative UI?
- Does the title scale match the gallery-led inner-page pattern?
- Is the accent color limited to moss and occasional apricot detail?
- Does the route remain calm when the background image is hidden or motion is reduced?
- Are desktop and mobile layouts both deliberate rather than merely compressed?
