"use client";

import { usePathname } from "next/navigation";

export default function RouteTheme({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === "/";

  if (isHome) return children;

  return (
    <div className="subpage-theme relative isolate min-h-[100dvh]">
      <div aria-hidden="true" className="fixed inset-0 z-0 bg-[var(--background)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
