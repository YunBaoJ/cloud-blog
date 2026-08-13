# Gallery Artwork Paper Surface Design

## Goal

Give each gallery artwork a clear visual container so images no longer appear to float directly on the page background. The treatment must remain quiet and preserve the artwork-led, staggered archive layout.

## Selected Direction

Use a light paper-sheet surface around every gallery item.

- Wrap the image, divider, title, source, and date in one translucent warm-white surface.
- Use approximately 8–10 px of inset space around the image.
- Add a subtle white edge, a faint green-tinted shadow, and restrained backdrop blur.
- Keep corners soft but modest so the result reads as paper rather than a generic app card.
- Keep the existing moss hover and focus treatment.

The surface must not become a thick white photo mat. The image remains the dominant element and retains its natural displayed proportion.

## Scope

Change only the gallery listing item presentation in `src/app/gallery/GalleryClient.tsx`.

Do not change:

- gallery data or image files;
- the three-column staggered distribution;
- image proportions;
- pagination behavior;
- the light detail dialog;
- other routes or shared theme tokens.

## Responsive and Interaction Behavior

- Desktop keeps the existing three-column asymmetric stream and column offsets.
- Mobile keeps the existing single-column reading order with slightly tighter surface padding.
- Hover and keyboard focus continue to reveal the moss accent and gentle image scale.
- Reduced-motion behavior remains unchanged.
- Existing image failure content stays inside the same paper surface.

## Implementation Boundary

Use existing Tailwind utilities and current CSS variables. Do not add dependencies, introduce a new component abstraction, or create new data flow. The existing article and button remain the semantic and interactive boundaries.

## Verification

1. Inspect `/gallery` at desktop and mobile widths.
2. Confirm artwork items read as complete paper sheets without overpowering the images.
3. Confirm natural image proportions, staggered offsets, loading, focus, hover, and dialog opening still work.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Run `git diff --check`.
