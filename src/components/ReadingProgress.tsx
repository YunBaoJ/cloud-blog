"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const totalHeight = scrollHeight - clientHeight;

      if (totalHeight > 0) {
        const currentProgress = (scrollTop / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      } else {
        setProgress(0);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1.5 bg-black/5 dark:bg-white/5 pointer-events-none">
      <div
        className="h-full bg-[#36513B] dark:bg-[#7CD090] shadow-[0_0_10px_#36513B] dark:shadow-[0_0_12px_#7CD090] transition-all duration-100 ease-out rounded-r-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
