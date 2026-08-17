import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import CommandMenu from "@/components/CommandMenu";
import Navbar from "@/components/Navbar";
import ReadingProgress from "@/components/ReadingProgress";
import RouteTheme from "@/components/RouteTheme";
import ToastViewport from "@/components/ToastViewport";
import { getAllNotes } from "@/lib/notes";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cloud 的数字小屋 | 极简 Web 工程与生活美学",
    template: "%s | Cloud 的数字小屋",
  },
  description: "记录写给机器的代码，也记录留给生活的诗意与摄影。一个前端工程师的数字客房，关于 Web 工程、胶片摄影与深度阅读。",
  keywords: ["前端工程师", "博客", "摄影", "Web开发", "Next.js", "胶片", "阅读思考"],
  authors: [{ name: "云归何处", url: SITE_URL }],
  creator: "云归何处",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: "Cloud 的数字小屋",
    title: "Cloud 的数字小屋 | 代码、诗意与生活",
    description: "记录写给机器的代码，也记录留给生活的诗意与摄影。",
    images: [
      {
        url: "/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Cloud 的数字小屋",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud 的数字小屋 | 代码、诗意与生活",
    description: "记录写给机器的代码，也记录留给生活的诗意与摄影。",
    images: ["/og-cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchNotes = getAllNotes().map(({ id, title, summary, category, tags }) => ({
    id,
    title,
    summary,
    category,
    tags,
  }));

  return (
    <html
      lang="zh-CN"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="antialiased selection:bg-[#E2EBE4] selection:text-[#36513B] min-h-screen bg-[linear-gradient(135deg,rgb(236,240,235)_0%,rgb(242,243,237)_40%,rgb(247,245,238)_100%)] dark:bg-[#142219]"
      >
        {/* Global Immersive Fixed Wallpaper Ambient Overlay across ALL pages */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.12] dark:opacity-[0.18] transition-opacity duration-700 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-user-final.png')" }}
        />
        {/* Dual-tone overlay: pine-green (236,240,235) blended into warm-paper (247,245,238) */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(236,240,235,0.55),transparent_55%),radial-gradient(ellipse_at_80%_100%,rgba(247,245,238,0.60),transparent_55%),linear-gradient(160deg,rgba(236,240,235,0.30)_0%,rgba(247,245,238,0.45)_100%)] dark:bg-[radial-gradient(circle_at_50%_20%,rgba(20,34,25,0.5),rgba(20,34,25,0.95))]" />

        <div id="site-root" className="relative z-10">
          <ThemeProvider>
            <RouteTheme>
              <ReadingProgress />
              <ToastViewport />
              <Navbar />
              <CommandMenu notes={searchNotes} />
              {children}
            </RouteTheme>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
