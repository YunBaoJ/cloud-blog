import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

export default function ProjectTeaser() {
  return (
    <section className="w-full bg-transparent px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/projects/dormitory-system"
          className="group grid gap-8 rounded-3xl bg-[#36513B] p-7 text-[#F6F4EC] shadow-[0_18px_50px_rgba(45,43,44,0.16)] outline-none transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[#36513B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F6F4EC] motion-reduce:transition-none sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 lg:p-12"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#CFE0CC]">
              <Building2 className="size-4" strokeWidth={1.8} aria-hidden="true" />
              <span>开发项目</span>
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              智慧宿舍管理系统
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#E4E9DD] sm:text-base">
              正在开发的 Spring Boot 与 Vue 全栈项目，围绕学生、宿管和管理员的宿舍日常流程展开。
            </p>
          </div>
          <span className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#F6F4EC]">
            查看案例
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" strokeWidth={1.8} aria-hidden="true" />
          </span>
        </Link>
      </div>
    </section>
  );
}
