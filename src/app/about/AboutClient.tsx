"use client";

import { useRef } from "react";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  Code2, Heart, Coffee, Mail, Globe,
  Camera, BookOpen, Layers, Cpu, Palette,
  MapPin, ArrowUpRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SKILLS = [
  { icon: Code2, label: "Next.js / React", color: "bg-[#E2EBE4] text-[#36513B]" },
  { icon: Layers, label: "TypeScript", color: "bg-[#E2EBE4] text-[#2B4C6F]" },
  { icon: Palette, label: "CSS / Tailwind", color: "bg-[#F4F1EA] text-[#544F49]" },
  { icon: Cpu, label: "Node.js", color: "bg-[#E2EBE4] text-[#36513B]" },
  { icon: Camera, label: "胶片摄影", color: "bg-[#FAF0EA] text-[#8C4A31]" },
  { icon: Coffee, label: "手冲咖啡", color: "bg-[#FDEEE9] text-[#C46A4A]" },
  { icon: BookOpen, label: "阅读与写作", color: "bg-[#F4F1EA] text-[#544F49]" },
  { icon: Heart, label: "设计系统", color: "bg-[#FDEEE9] text-[#8C4A31]" },
];

const TIMELINE = [
  {
    year: "2026",
    events: [
      { month: "08月", desc: "搭建「数字小屋」个人博客，将文字、摄影与互动实验融为一体" },
      { month: "07月", desc: "开始系统学习高端 Web 动效设计与摄影灯光构图理论" },
    ],
  },
  {
    year: "2025",
    events: [
      { month: "11月", desc: "发表首篇关于 React Server Components 的深度实践笔记" },
      { month: "06月", desc: "购入 Fujifilm X100V，踏入胶片摄影的美丽世界" },
      { month: "01月", desc: "开始每日手冲咖啡记录，探索埃塞俄比亚与哥伦比亚豆的风味差异" },
    ],
  },
  {
    year: "2024",
    events: [
      { month: "09月", desc: "深入研究 Web 性能优化与 Core Web Vitals 工程实践" },
      { month: "03月", desc: "参与开源社区，在 GitHub 维护一套 React 组件设计系统" },
    ],
  },
];

export default function AboutClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Desk photo parallax
    gsap.from(".about-desk-img", {
      scale: 1.08,
      duration: 1.2,
      ease: "power2.out",
      clearProps: "scale",
    });

    // Skill pills entrance
    gsap.from(".about-skill-pill", {
      y: 20,
      opacity: 0,
      stagger: 0.06,
      duration: 0.6,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: ".about-skills-section",
        start: "top 80%",
      },
    });

    // Timeline entrance
    gsap.from(".about-timeline-item", {
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: ".about-timeline-section",
        start: "top 75%",
      },
    });
  }, { scope: containerRef });
  return (
    <main ref={containerRef} className="min-h-screen bg-[#FAF7F2] text-[#2D2B2C]">
      {/* — Asymmetric Split Header — */}
      <section className="pt-28 pb-0 px-6 sm:px-12 lg:px-20 border-b border-[#2D2B2C]/8 bg-gradient-to-b from-[#E2EBE4]/25 to-transparent">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">

          {/* Left: bio copy */}
          <div className="pb-14 space-y-6">
            <p className="text-xs font-mono text-[#4E7A56] uppercase tracking-widest">
              Frontend Engineer &amp; Designer
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2D2B2C] leading-[1.05]">
              Cloud<br />
              <span className="text-[#36513B]">云归何处</span>
            </h1>
            <p className="text-base text-[#5A5551] leading-relaxed max-w-md">
              这里是我的数字客房与生活实验场地。在白天书写极致性能的现代 Web 应用，在夜晚磨手冲咖啡、拍胶片、记录岁月的诗意。
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium pt-2">
              <div className="flex items-center gap-1.5 text-[#7A736A]">
                <MapPin className="w-3.5 h-3.5 text-[#8C4A31]" />
                <span>杭州 · 中国</span>
              </div>
              <span className="w-px h-3 bg-[#2D2B2C]/15" />
              <Link href="/gallery" className="flex items-center gap-1 text-[#36513B] hover:underline underline-offset-2 transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <span>摄影画廊</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
              <Link href="/notes" className="flex items-center gap-1 text-[#36513B] hover:underline underline-offset-2 transition-colors">
                <BookOpen className="w-3.5 h-3.5" />
                <span>阅读文章</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right: hero photograph */}
          <div className="relative h-[340px] sm:h-[400px] lg:h-[480px] rounded-t-3xl overflow-hidden self-end">
            <Image
              src="/about-desk.jpg"
              alt="Cloud 的工作台与日常"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="about-desk-img object-cover object-top"
            />
            {/* Subtle vignette at bottom edge */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF7F2]/60 to-transparent" />
          </div>

        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-16 space-y-16 pb-24">

        {/* Stats — 4-column, no icons, big numbers only */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#2D2B2C]/8 rounded-2xl overflow-hidden border border-[#2D2B2C]/8">
          {[
            { val: "5+", label: "篇文章" },
            { val: "7+", label: "张照片" },
            { val: "365+", label: "杯手冲" },
            { val: "10k+", label: "行代码" },
          ].map((s) => (
            <div key={s.label} className="bg-white px-6 py-8 text-center">
              <span className="text-3xl font-extrabold text-[#36513B] block">{s.val}</span>
              <p className="text-xs text-[#7A736A] font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="about-skills-section space-y-5">
          <h2 className="text-xl font-bold text-[#2D2B2C]">技能与热爱</h2>
          <div className="flex flex-wrap gap-2.5">
            {SKILLS.map((skill) => (
              <div
                key={skill.label}
                className={`about-skill-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-[1.03] cursor-default select-none ${skill.color}`}
              >
                <skill.icon className="w-3.5 h-3.5" />
                <span>{skill.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline — left-spine, right-cards */}
        <div className="about-timeline-section space-y-6">
          <h2 className="text-xl font-bold text-[#2D2B2C]">成长时间线</h2>

          <div className="space-y-10">
            {TIMELINE.map((block) => (
              <div key={block.year} className="about-timeline-item grid grid-cols-[48px_1fr] sm:grid-cols-[64px_1fr] gap-x-6">
                {/* Year label + spine */}
                <div className="flex flex-col items-center gap-0 pt-0.5">
                  <span className="text-sm font-extrabold text-[#2B4C6F] tabular-nums">{block.year}</span>
                  <div className="w-px flex-1 bg-[#2D2B2C]/12 mt-2" />
                </div>

                {/* Events */}
                <div className="space-y-3 pb-2">
                  {block.events.map((ev, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white border border-[#2D2B2C]/6 hover:border-[#36513B]/20 hover:shadow-[0_4px_20px_rgba(54,81,59,0.07)] transition-all space-y-0.5"
                    >
                      <span className="text-[10px] font-mono text-[#36513B] font-bold uppercase tracking-wider">
                        {block.year} · {ev.month}
                      </span>
                      <p className="text-sm text-[#5A5551] leading-relaxed">{ev.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact — dark green block */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#36513B] text-white space-y-5">
          <div className="space-y-2 max-w-lg">
            <h2 className="text-xl sm:text-2xl font-bold">与我取得联系</h2>
            <p className="text-sm text-white/70 leading-relaxed">
              如果您对小屋的设计、项目合作或技术交流感兴趣，欢迎随时联系。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <a
              href="mailto:cloud@example.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-all text-white border border-white/20 hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>cloud@example.com</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-all text-white border border-white/20 hover:scale-105"
            >
              <Globe className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-all text-white border border-white/20 hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              <span>摄影画廊</span>
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
