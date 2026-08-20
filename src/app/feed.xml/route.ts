import { getAllNotes } from "@/lib/notes";
import { SITE_URL } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const notes = getAllNotes();
  const items = notes.map((note) => {
    const url = `${SITE_URL}/notes/${note.id}`;
    return [
      "<item>",
      `<title>${escapeXml(note.title)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<description>${escapeXml(note.summary)}</description>`,
      `<pubDate>${new Date(`${note.date}T00:00:00+08:00`).toUTCString()}</pubDate>`,
      "</item>",
    ].join("");
  }).join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "<channel>",
    "<title>Kasumi 的数字小屋</title>",
    `<link>${escapeXml(SITE_URL)}</link>`,
    "<description>记录技术实践、设计观察与日常灵感。</description>",
    "<language>zh-CN</language>",
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
