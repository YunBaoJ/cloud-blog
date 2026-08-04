import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import CommandMenu from "@/components/CommandMenu";
import Navbar from "@/components/Navbar";
import ReadingProgress from "@/components/ReadingProgress";
import "./globals.css";

// Load official HarmonyOS Sans SC (Regular 400 + Bold 700)
const harmonyOSFont = localFont({
  src: [
    {
      path: "../../public/fonts/HarmonyOS_Sans_SC_Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/HarmonyOS_Sans_SC_Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-custom-sans",
  display: "swap",
});

const BASE_URL = "https://cloud.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Cloud 的数字小屋 | 代码、诗意与生活",
    template: "%s | Cloud 的数字小屋",
  },
  description: "记录写给机器的代码，也记录留给生活的诗意与摄影。一个前端工程师的数字客房，关于 Web 工程、胶片摄影与手冲咖啡。",
  keywords: ["前端工程师", "博客", "摄影", "Web开发", "Next.js", "胶片", "手冲咖啡"],
  authors: [{ name: "云归何处", url: BASE_URL }],
  creator: "云归何处",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: BASE_URL,
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
  return (
    <html
      lang="zh-CN"
      className={`${harmonyOSFont.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className="antialiased selection:bg-[#E2EBE4] selection:text-[#36513B]">
        <ThemeProvider>
          <ReadingProgress />
          <Navbar />
          <CommandMenu />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
