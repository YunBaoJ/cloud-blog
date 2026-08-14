import { getGalleryWorkHref } from "../../lib/galleryUrl.mts";

export interface ActivityNoteSource {
  id: string;
  title: string;
  summary: string;
  date: string;
}

export interface ActivityGallerySource {
  id: string;
  title: string;
  story: string;
  date: string;
  src: string;
  width: number;
  height: number;
}

export interface ActivityItem {
  id: string;
  kind: "note" | "gallery";
  title: string;
  summary: string;
  date: string;
  href: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
}

export function buildActivityItems(
  notes: ActivityNoteSource[],
  photos: ActivityGallerySource[],
  limit = 8,
): ActivityItem[] {
  const noteItems: ActivityItem[] = notes.map((note) => ({
    id: `note-${note.id}`,
    kind: "note",
    title: note.title,
    summary: note.summary,
    date: note.date,
    href: `/notes/${note.id}`,
  }));

  const galleryItems: ActivityItem[] = photos.map((photo) => ({
    id: `gallery-${photo.id}`,
    kind: "gallery",
    title: photo.title,
    summary: photo.story,
    date: photo.date,
    href: getGalleryWorkHref(photo.id),
    image: {
      src: photo.src,
      width: photo.width,
      height: photo.height,
      alt: photo.title,
    },
  }));

  return [...noteItems, ...galleryItems]
    .sort((left, right) => right.date.localeCompare(left.date) || left.id.localeCompare(right.id))
    .slice(0, Math.max(0, limit));
}
