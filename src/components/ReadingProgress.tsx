"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ReadingProgress() {
  const progressRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: "max",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      const timer = setTimeout(() => ScrollTrigger.refresh(), 400);
      return () => clearTimeout(timer);
    },
    { dependencies: [pathname] }
  );

  useEffect(() => {
    gsap.set(progressRef.current, { scaleX: 0 });
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
