"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HomeScrollMotion() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = gsap.utils.toArray<HTMLElement>("[data-home-scroll-section]");

    sections.forEach((section) => {
      const content = section.querySelector<HTMLElement>("[data-home-scroll-content]");
      const ambient = section.querySelector<HTMLElement>("[data-home-scroll-ambient]");

      if (content) {
        gsap.from(content.children, {
          y: 28,
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }

      if (ambient) {
        gsap.fromTo(
          ambient,
          { yPercent: 10 },
          {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.55,
            },
          }
        );
      }
    });
  });

  return null;
}
