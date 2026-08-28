import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/notes";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/archive", "/gallery", "/notes", "/now", "/playground"];

  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...getAllNotes().map((note) => ({
      url: `${SITE_URL}/notes/${note.id}`,
      lastModified: note.date,
    })),
  ];
}
