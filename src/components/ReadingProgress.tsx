"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function ReadingProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const totalHeight = scrollHeight - clientHeight;

      const currentRatio = totalHeight > 0 ? Math.min(1, Math.max(0, scrollTop / totalHeight)) : 0;

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: currentRatio,
          duration: 0.1,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
    };

    // Immediate calculation + delayed recalculation after images/content mount
    updateProgress();
    const timer = setTimeout(updateProgress, 300);

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1.5 bg-black/5 dark:bg-white/5 pointer-events-none">
      <div
        ref={progressRef}
        className="h-full bg-gradient-to-r from-[#36513B] via-[#4E7A56] to-[#7CD090] dark:from-[#36513B] dark:via-[#7CD090] dark:to-[#A8F0BA] shadow-[0_0_12px_#36513B] dark:shadow-[0_0_14px_#7CD090] origin-left scale-x-0"
      />
    </div>
  );
}
