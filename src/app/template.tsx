import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="page-transition-enter min-h-screen">
      {children}
    </div>
  );
}
