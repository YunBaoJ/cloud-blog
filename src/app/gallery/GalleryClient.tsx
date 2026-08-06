"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Footer from "@/components/Footer";
import { GALLERY_PHOTOS, GalleryPhoto } from "@/data/mockData";
import Image from "next/image";
import { Camera, MapPin, Calendar, X, ChevronLeft, ChevronRight, Sliders, Crosshair, Sparkles } from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "全部作品" },
  { key: "film", label: "胶片随笔" },
  { key: "nature", label: "自然与植物" },
  { key: "coffee", label: "咖啡与日常" },
  { key: "city", label: "城市与建筑" },
];

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Filter photos
  const filteredPhotos = GALLERY_PHOTOS.filter(
    (photo) => activeCategory === "all" || photo.category === activeCategory
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPhoto]);

  // Keyboard navigation & Mouse Wheel Scroll to Switch Photos
  useEffect(() => {
    if (!selectedPhoto) return;

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      } else if (e.key === "ArrowLeft") {
        const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
        if (currentIndex > 0) {
          setSelectedPhoto(filteredPhotos[currentIndex - 1]);
        }
      } else if (e.key === "ArrowRight") {
        const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
        if (currentIndex < filteredPhotos.length - 1) {
          setSelectedPhoto(filteredPhotos[currentIndex + 1]);
        }
      }
    };

    // Mouse Wheel controls with throttling for smooth photo switching
    let isThrottled = false;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isThrottled) return;

      const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);

      if (e.deltaY > 0) {
        // Scroll down -> Next photo
        if (currentIndex < filteredPhotos.length - 1) {
          setSelectedPhoto(filteredPhotos[currentIndex + 1]);
        }
      } else if (e.deltaY < 0) {
        // Scroll up -> Previous photo
        if (currentIndex > 0) {
          setSelectedPhoto(filteredPhotos[currentIndex - 1]);
        }
      }

      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 250);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [selectedPhoto, filteredPhotos]);

  const currentIndex = selectedPhoto
    ? filteredPhotos.findIndex((p) => p.id === selectedPhoto.id)
    : -1;

  // Preset polaroid tilt rotations
  const rotations = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-3", "-rotate-3", "rotate-1"];

  return (
    <>
      <main className="min-h-screen bg-[#FAF7F2] text-[#2D2B2C]">
      {/* Header Section */}
      <section className="pt-32 pb-12 px-6 sm:px-12 lg:px-20 bg-gradient-to-b from-[#E2EBE4]/35 via-[#FAF7F2] to-[#FAF7F2] border-b border-[#2D2B2C]/8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF0EA] text-[#8C4A31] text-xs font-mono font-semibold border border-[#8C4A31]/20 shadow-2xs">
            <Camera className="w-3.5 h-3.5" />
            <span>胶片集锦 &amp; EXIF 画廊</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2B2C] leading-tight">
            用快门与镜头，留住生活的柔软与温度
          </h1>

          <p className="text-base sm:text-lg text-[#7A736A] max-w-3xl leading-relaxed">
            记录日常里的晨光、胶片颗粒、手冲咖啡与远山落日。点击任意照片可开启大图，支持滚轮与方向键自由切换照片。
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  activeCategory === cat.key
                    ? "bg-[#36513B] text-[#E2EBE4] shadow-md scale-105"
                    : "bg-white/80 text-[#7A736A] hover:bg-white hover:text-[#2D2B2C] border border-[#2D2B2C]/8"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Gallery Photo Grid — Japanese Washi Tape Polaroid Style Cards */}
      <section className="py-16 pb-24 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-4">
          {filteredPhotos.map((photo, idx) => {
            const rotationClass = rotations[idx % rotations.length];

            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className={`group relative bg-white rounded-2xl p-4 pb-6 shadow-[0_6px_24px_rgba(45,43,44,0.06)] border border-[#2D2B2C]/8 transition-all duration-300 transform ${rotationClass} hover:rotate-0 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(45,43,44,0.14)] cursor-pointer z-10 hover:z-20`}
              >
                {/* Semi-transparent Washi Tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#F5E8D3]/85 border border-[#E8D7BE]/70 rotate-[-1deg] backdrop-blur-2xs shadow-2xs z-20 pointer-events-none rounded-xs flex items-center justify-center">
                  <span className="w-16 h-px bg-amber-900/10" />
                </div>

                {/* Photo Image Container */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF7F2] mb-4 border border-[#2D2B2C]/5">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-[10px] font-mono text-white/90 font-medium">
                    {photo.categoryLabel}
                  </div>

                  {/* EXIF Quick Tag */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-mono text-[#E2EBE4] font-medium flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#E2EBE4]" />
                    <span>{photo.exif.aperture} · {photo.exif.focalLength}</span>
                  </div>
                </div>

                {/* Polaroid Label Footer */}
                <div className="space-y-2 px-1">
                  <h3 className="text-base font-bold text-[#2D2B2C] group-hover:text-[#8C4A31] transition-colors leading-snug truncate">
                    {photo.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-[#7A736A] font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8C4A31]" />
                      <span>{photo.location}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-[#36513B]" />
                      <span>{photo.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>

    {/* Masterclass Lightbox Modal — Portal directly to document.body */}
    {mounted && selectedPhoto && createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#2D2B2C]/50 backdrop-blur-2xl animate-in fade-in duration-200"
        onClick={(e) => { if (e.target === e.currentTarget) setSelectedPhoto(null); }}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedPhoto(null)}
          className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/80 hover:bg-white text-[#2D2B2C] transition-all shadow-lg border border-white/60 hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Previous / Next Arrow Controls */}
        {currentIndex > 0 && (
          <button
            onClick={() => setSelectedPhoto(filteredPhotos[currentIndex - 1])}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/80 hover:bg-white text-[#2D2B2C] transition-all shadow-lg border border-white/60 hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {currentIndex < filteredPhotos.length - 1 && (
          <button
            onClick={() => setSelectedPhoto(filteredPhotos[currentIndex + 1])}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/80 hover:bg-white text-[#2D2B2C] transition-all shadow-lg border border-white/60 hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Modal Content Box */}
        <div className="relative w-full max-w-6xl max-h-[85vh] bg-[#FAF7F2] text-[#2D2B2C] rounded-3xl overflow-hidden border border-white/90 shadow-[0_24px_64px_rgba(0,0,0,0.22)] grid grid-cols-1 lg:grid-cols-12">
          {/* Left Image Viewfinder HUD Area */}
          <div className="lg:col-span-8 relative bg-[#141715] flex flex-col items-center justify-between p-4 sm:p-5 select-none overflow-hidden border-b lg:border-b-0 lg:border-r border-[#36513B]/20">
            {/* Top Camera Focal Scale Ruler Bar */}
            <div className="w-full flex items-center justify-between text-xs font-mono text-[#E2EBE4]/90 z-20 pb-3 border-b border-[#36513B]/30 bg-[#1A1F1C]/90 backdrop-blur-md px-4 py-2.5 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
                <span className="font-bold text-white tracking-widest uppercase text-[11px]">REC ● AF-C SPOT</span>
              </div>
              <div className="hidden sm:flex items-center gap-3.5 text-[10px] font-mono text-[#98A79C]">
                <div className="flex items-end gap-1">
                  <span className="text-white/40">18</span>
                  <span className="h-2 w-px bg-white/25" />
                  <span className="h-3 w-px bg-white/45" />
                  <span className="h-2 w-px bg-white/25" />
                </div>
                <div className="flex flex-col items-center px-2.5 py-0.5 rounded bg-[#36513B]/80 border border-emerald-400/50 text-emerald-300 font-bold shadow-2xs">
                  <span className="text-[11px] leading-tight font-mono">{selectedPhoto.exif.focalLength}</span>
                  <span className="h-1.5 w-0.5 bg-emerald-400 mt-0.5" />
                </div>
                <div className="flex items-end gap-1">
                  <span className="h-2 w-px bg-white/25" />
                  <span className="h-3 w-px bg-white/45" />
                  <span className="h-2 w-px bg-white/25" />
                  <span className="text-white/40">85</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-semibold">
                <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">RAW 14-bit</span>
              </div>
            </div>

            {/* Center Photo Area */}
            <div className="relative w-full h-full min-h-[300px] lg:min-h-[460px] flex items-center justify-center py-3 my-auto">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-contain rounded-lg"
                priority
              />
            </div>

            {/* Bottom Metering Scale Bar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#E2EBE4] z-20 pt-3 border-t border-[#36513B]/30 bg-[#1A1F1C]/90 backdrop-blur-md px-4 py-2.5 rounded-b-2xl">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-[#25382B] text-emerald-300 font-bold border border-emerald-500/30">
                  ⚡ {selectedPhoto.exif.shutterSpeed}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#3D251A] text-amber-300 font-bold border border-amber-500/30">
                  ⭕ {selectedPhoto.exif.aperture}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#1D2B3D] text-sky-300 font-bold border border-sky-500/30">
                  🎛️ ISO {selectedPhoto.exif.iso}
                </span>
              </div>
              <div className="text-[11px] text-[#98A79C] font-mono flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedPhoto.location}</span>
              </div>
            </div>
          </div>

          {/* Right Side Info & Story Panel */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-[#FAF7F2] overflow-y-auto space-y-6 flex flex-col justify-between max-h-[85vh]">
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-[#36513B] text-[#E2EBE4] font-semibold">
                  {selectedPhoto.categoryLabel}
                </span>
                <span className="flex items-center gap-1 text-[#7A736A]">
                  <Calendar className="w-3.5 h-3.5 text-[#36513B]" />
                  {selectedPhoto.date}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#2D2B2C] leading-tight">
                  {selectedPhoto.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A5551] leading-relaxed font-serif pt-1">
                  {selectedPhoto.story}
                </p>
              </div>

              <hr className="border-[#2D2B2C]/10" />

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#2D2B2C]/8 shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono text-[#7A736A] uppercase block">相机型号</span>
                  <span className="text-sm font-bold text-[#2D2B2C] font-mono">{selectedPhoto.exif.camera}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#2D2B2C]/8 shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono text-[#7A736A] uppercase block">镜头规格</span>
                  <span className="text-sm font-bold text-[#2D2B2C] font-mono">{selectedPhoto.exif.lens}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 text-center border-t border-[#2D2B2C]/10 space-y-1">
              <p className="text-[11px] font-mono text-[#36513B] font-semibold">
                鼠标滚轮 / 键盘 ← → 控制照片切换
              </p>
              <p className="text-[10px] font-mono text-[#7A736A]">
                （Esc 键退出弹窗）
              </p>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
  </>
);
}
