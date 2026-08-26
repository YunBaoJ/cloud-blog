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
      const divider = section.querySelector<HTMLElement>("[data-home-scroll-divider]");
      const heading = section.querySelector<HTMLElement>("[data-home-scroll-heading]");
      const rail = section.querySelector<HTMLElement>("[data-home-scroll-rail]");

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

      if (divider) {
        gsap.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      if (heading) {
        gsap.to(heading, {
          y: -14,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 54%",
            end: "bottom 42%",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });
      }

      if (rail) {
        gsap.to(rail, {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 52%",
            end: "bottom 36%",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    const mailCard = document.querySelector<HTMLElement>("[data-home-mail-card]");

    if (mailCard) {
      gsap.fromTo(
        mailCard,
        { autoAlpha: 0, y: 80 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: mailCard,
            start: "top 92%",
            end: "top 54%",
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        }
      );
    }
  });

  return null;
}
