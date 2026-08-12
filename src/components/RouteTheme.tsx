"use client";

import { usePathname } from "next/navigation";

export default function RouteTheme({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === "/";

  if (isHome) return children;

  return (
    <div className="subpage-theme relative isolate min-h-[100dvh]">
      <div aria-hidden="true" className="fixed inset-0 z-0 bg-[var(--background)]" />
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[1] bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-5"
        style={{ backgroundImage: "url('/gallery/【哲风壁纸】围墙白花-夜空-晨曦.png')" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
