import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import CommandMenu from "@/components/CommandMenu";
import Navbar from "@/components/Navbar";
import ReadingProgress from "@/components/ReadingProgress";
import RouteTheme from "@/components/RouteTheme";
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
    >
      <body className="antialiased selection:bg-[#E2EBE4] selection:text-[#36513B] min-h-screen bg-[#FAF8F4] dark:bg-[#142219]">
        {/* Global Immersive Fixed Wallpaper Ambient Overlay across ALL pages */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.12] dark:opacity-[0.18] transition-opacity duration-700 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-user-final.png')" }}
        />
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_30%,rgba(250,248,244,0.35),rgba(250,248,244,0.82))] dark:bg-[radial-gradient(circle_at_50%_20%,rgba(20,34,25,0.5),rgba(20,34,25,0.95))]" />

        <div className="relative z-10">
          <ThemeProvider>
            <RouteTheme>
              <ReadingProgress />
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
