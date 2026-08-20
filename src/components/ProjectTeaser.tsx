import ProjectArchiveStack from "@/components/ProjectArchiveStack";
import { PROJECT_ARCHIVE_ITEMS } from "@/data/projects";

export default function ProjectTeaser() {
  return (
    <section className="w-full border-t border-[#36513B]/16 bg-transparent px-4 py-20 dark:border-white/16 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div>
            <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#6F7E70]">04 / SELECTED WORKS</p>
            <h2 className="mt-3 font-[family-name:var(--section-heading-font)] text-5xl font-semibold leading-[0.9] tracking-[-0.1em] text-[#26352A] dark:text-[#F0F5F1] sm:text-6xl">
              精选<em className="ml-1 font-[family-name:var(--section-heading-font)] not-italic font-medium">项目</em>
            </h2>
          </div>
          <p className="max-w-[17.5rem] text-sm leading-7 text-[#627161] dark:text-[#9EB3A4]">
            把项目像一组整齐但有层次的档案，连续叠放在同一条轨迹上。
          </p>
        </div>

        <div className="mt-14">
          <ProjectArchiveStack items={PROJECT_ARCHIVE_ITEMS} />
        </div>

        <div className="hidden grid-cols-5 gap-1 font-mono text-[10px] text-[#708071] lg:grid">
          <span className="font-bold text-[#466145]">01 / DORMITORY</span>
          <span>02 / ARCHIVE</span>
          <span>03 / LINUX</span>
          <span>04 / MONITOR</span>
          <span>05 / NEXT</span>
        </div>
      </div>
    </section>
  );
}
