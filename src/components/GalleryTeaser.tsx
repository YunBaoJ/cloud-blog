"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, ArrowRight, MapPin, Calendar } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FeaturedPhoto {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  src: string;
  rotation: string;
}

const FEATURED_PHOTOS: FeaturedPhoto[] = [
  {
    id: "p1",
    title: "雨后花枝与透光月色",
    category: "日常随手拍",
    location: "植物园温室",
    date: "2026-07-28",
    src: "/gallery/nature.jpg",
    rotation: "-rotate-3",
  },
  {
    id: "p2",
    title: "日落黄昏时的金黄落叶",
    category: "风光日落",
    location: "郊外枫林公园",
    date: "2026-06-15",
    src: "/gallery/sunset.jpg",
    rotation: "rotate-2",
  },
  {
    id: "p3",
    title: "书房案头与晨光微影",
    category: "阅读与生活",
    location: "客房桌前",
    date: "2026-07-10",
    src: "/gallery/coffee.jpg",
    rotation: "-rotate-1",
  },
];

export default function GalleryTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".gallery-card-anim", {
      y: 20,
      opacity: 0,
      scale: 0.98,
      duration: 0.4,
      stagger: 0.06,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
      },
    });
  }, { scope: containerRef });
  return (
    <section ref={containerRef} className="relative w-full py-20 md:py-28 px-4 bg-[#F5F0E6] border-t border-[#2D2B2C]/8 overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#8C4A31]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="gallery-card-anim flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0EA] text-[#8C4A31] text-xs font-semibold tracking-wide shadow-2xs">
              <Camera className="w-3.5 h-3.5" />
              <span>光影定格</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2B2C] tracking-tight">
              胶片相册集锦 (Gallery)
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] max-w-lg font-normal">
              用相机捕捉生活中的微光、雨后空气与静谧瞬间。纯白日系拍立得风格陈列。
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C4A31] hover:text-[#6E3622] transition-colors group"
          >
            <span>进入独立相册页 (6张)</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Polaroid Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {FEATURED_PHOTOS.map((photo) => (
            <Link
              key={photo.id}
              href="/gallery"
              className={`gallery-card-anim group relative bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgba(45,43,44,0.06)] hover:shadow-[0_20px_40px_rgba(45,43,44,0.12)] transition-all duration-500 transform ${photo.rotation} hover:rotate-0 hover:-translate-y-2 flex flex-col justify-between`}
            >
              {/* Semi-transparent Washi Tape (和纸胶带) */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#F5E8D3]/85 border border-[#E8D7BE]/70 rotate-[-1deg] backdrop-blur-2xs shadow-2xs z-10 pointer-events-none rounded-xs flex items-center justify-center">
                <span className="w-16 h-px bg-amber-900/10" />
              </div>

              {/* Photo Image Container */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF7F2] mb-4 border border-[#2D2B2C]/5">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-[10px] font-medium text-white">
                  {photo.category}
                </div>
              </div>

              {/* Label */}
              <div className="space-y-2 px-1">
                <h3 className="text-base font-bold text-[#2D2B2C] group-hover:text-[#8C4A31] transition-colors leading-snug">
                  {photo.title}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-[#7A736A] font-medium">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8C4A31]" />
                    <span>{photo.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{photo.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
