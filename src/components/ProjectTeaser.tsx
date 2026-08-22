import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectArchiveStack from "@/components/ProjectArchiveStack";
import { PROJECT_ARCHIVE_ITEMS } from "@/data/projects";

export default function ProjectTeaser() {
  return (
    <section data-home-scroll-section className="relative min-h-[100dvh] w-full overflow-hidden border-t border-[#36513B]/16 bg-transparent px-4 py-20 select-none dark:border-white/16 sm:px-6 md:py-28 lg:px-8">
      {/* Background Ambient Pine Glow */}
      <div data-home-scroll-ambient className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#36513B]/6 dark:bg-[#7CD090]/4 blur-3xl rounded-full pointer-events-none" />

      <div data-home-scroll-content className="relative z-10 max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* Section Header - 完全与其他模块统一标准 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#6F7E70] uppercase">
              02 / SELECTED WORKS
            </p>
            <h2 className="font-[family-name:var(--section-heading-font)] text-5xl font-semibold leading-[0.9] tracking-[-0.1em] text-[#26352A] dark:text-[#F0F5F1] sm:text-6xl">
              精选<em className="ml-1 font-[family-name:var(--section-heading-font)] not-italic font-medium">项目</em>
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] dark:text-[#9EB3A4] max-w-lg font-normal">
              把项目像一组整齐但有层次的档案，连续叠放在同一条轨迹上。
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#36513B] dark:text-[#7CD090] hover:text-[#283E2C] dark:hover:text-white transition-colors group self-start sm:self-end"
          >
            <span>查看全部</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 扇形档案堆叠卡片 */}
        <div className="pt-2">
          <ProjectArchiveStack items={PROJECT_ARCHIVE_ITEMS} />
        </div>

        {/* 底部小序号标签 */}
        <div className="hidden grid-cols-5 gap-1 font-mono text-[10px] text-[#708071] lg:grid pt-2">
          <span className="font-bold text-[#466145] dark:text-[#7CD090]">01 / DORMITORY</span>
          <span>02 / ARCHIVE</span>
          <span>03 / LINUX</span>
          <span>04 / MONITOR</span>
          <span>05 / NEXT</span>
        </div>
      </div>
    </section>
  );
}
