export const GALLERY_WORK_PARAM = "work";

export function getGalleryWorkHref(id: string) {
  return `/gallery?${GALLERY_WORK_PARAM}=${encodeURIComponent(id)}`;
}
