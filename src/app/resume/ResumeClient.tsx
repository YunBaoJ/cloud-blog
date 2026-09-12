"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  Copy,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Printer,
  Share2,
} from "lucide-react";
import { RESUME_DATA } from "@/data/resume";

export default function ResumeClient() {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string, type: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 2500);
      });
    }
  }, []);

  const handleCopyPhone = () => copyToClipboard(RESUME_DATA.basicInfo.phone, "phone");
  const handleCopyEmail = () => copyToClipboard(RESUME_DATA.basicInfo.email, "email");
  const handleCopyShareLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://cloud-blog.s2445686870.workers.dev/resume";
    copyToClipboard(url, "link");
  };

  const handleCopyBossGreeting = () => {
    const text = `您好！这是我的在线简历与真实集群实战手册：https://cloud-blog.s2445686870.workers.dev/resume 包含 K8s、GitOps 与 OpenStack 部署排错实录，欢迎审阅！期待能有机会与您进一步沟通交流。`;
    copyToClipboard(text, "boss");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const { basicInfo, skills, education, projects } = RESUME_DATA;

  return (
    <div className="min-h-screen bg-[#F6F4EC] dark:bg-[#141C16] text-[#2D2B2C] dark:text-[#E2EBE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:pt-0 print:text-black">
      
      {/* 顶部操作工具栏 (打印时自动隐藏) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-[#1E2721]/80 border border-[#36513B]/15 dark:border-white/10 text-xs font-semibold text-[#36513B] dark:text-[#7CD090] hover:bg-white transition-all shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回小屋</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {/* 复制 Boss 招呼文案 */}
          <button
            type="button"
            onClick={handleCopyBossGreeting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#36513B] text-white hover:bg-[#2A3F2E] text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="一键复制专用于 Boss 直聘聊天的自我介绍文案"
          >
            {copiedType === "boss" ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#7CD090]" />
                <span>已复制 Boss 沟通语录！</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-3.5 h-3.5" />
                <span>复制 Boss 沟通语录</span>
              </>
            )}
          </button>

          {/* 复制在线简历链接 */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1E2721]/90 border border-[#36513B]/20 dark:border-white/15 text-xs font-semibold hover:bg-white text-[#33483A] dark:text-[#C5D6C7] transition-all shadow-2xs"
          >
            {copiedType === "link" ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#36513B]" />
                <span>已复制简历链接</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#718F6E]" />
                <span>分享简历</span>
              </>
            )}
          </button>

          {/* 打印 / 另存为 PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1E2721]/90 border border-[#36513B]/20 dark:border-white/15 text-xs font-semibold hover:bg-white text-[#33483A] dark:text-[#C5D6C7] transition-all shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#718F6E]" />
            <span>打印 / 导出 PDF</span>
          </button>

          {/* 下载 PDF 原件 */}
          <a
            href={basicInfo.pdfUrl}
            download="孙乾云-云计算运维工程师-个人简历.pdf"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1E2721]/90 border border-[#36513B]/20 dark:border-white/15 text-xs font-semibold hover:bg-white text-[#33483A] dark:text-[#C5D6C7] transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#D79B7B]" />
            <span>下载 PDF 原件</span>
          </a>
        </div>
      </div>

      {/* 核心简历纸质容器 */}
      <main className="max-w-4xl mx-auto bg-[#FFFEF9] dark:bg-[#19221C] border border-[#26352A]/12 dark:border-white/12 rounded-3xl shadow-[0_16px_48px_rgba(38,53,42,0.08)] p-6 sm:p-10 lg:p-12 print:border-none print:shadow-none print:p-0 print:rounded-none print:bg-white print:text-black">
        
        {/* ================= 头部：个人名片与正装照片 ================= */}
        <section className="pb-8 border-b border-[#36513B]/12 dark:border-white/10 flex flex-col-reverse sm:flex-row items-center sm:items-start justify-between gap-6 print:pb-5">
          <div className="space-y-3.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#26352A] dark:text-[#F0F5F1] print:text-black">
                {basicInfo.name}
              </h1>
              <span className="px-3 py-1 rounded-full bg-[#36513B]/10 dark:bg-[#7CD090]/15 text-[#36513B] dark:text-[#7CD090] text-xs font-bold tracking-wide print:border print:border-black/30 print:text-black">
                {basicInfo.graduationStatus}
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-[#36513B] dark:text-[#9DB289] tracking-tight print:text-black">
              求职意向：{basicInfo.title}
            </p>

            {/* 基础标签与联系方式 */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-xs text-[#5A5551] dark:text-[#A7B9AB] font-medium print:text-black">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#718F6E] print:hidden" />
                <span>{basicInfo.birth}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#718F6E] print:hidden" />
                <span>{basicInfo.location}</span>
              </span>

              {/* 电话 (点击复制 / 拨打) */}
              <div className="inline-flex items-center gap-1">
                <a
                  href={`tel:${basicInfo.phone}`}
                  className="hover:text-[#36513B] dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#718F6E] print:hidden" />
                  <span className="font-mono">{basicInfo.phone}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  aria-label="复制电话"
                  className="p-1 hover:text-[#36513B] text-[#718F6E] transition-colors print:hidden"
                  title="点击复制电话号码"
                >
                  {copiedType === "phone" ? (
                    <Check className="w-3 h-3 text-[#36513B]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* 邮箱 (点击复制 / 发送) */}
              <div className="inline-flex items-center gap-1">
                <a
                  href={`mailto:${basicInfo.email}`}
                  className="hover:text-[#36513B] dark:hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#718F6E] print:hidden" />
                  <span className="font-mono">{basicInfo.email}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="复制邮箱"
                  className="p-1 hover:text-[#36513B] text-[#718F6E] transition-colors print:hidden"
                  title="点击复制电子邮箱"
                >
                  {copiedType === "email" ? (
                    <Check className="w-3 h-3 text-[#36513B]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* 个人主页链接 */}
              <Link
                href="/"
                className="hover:text-[#36513B] dark:hover:text-white transition-colors inline-flex items-center gap-1.5 font-semibold text-[#718F6E] print:text-black"
              >
                <ExternalLink className="w-3.5 h-3.5 print:hidden" />
                <span>个人技术博客</span>
              </Link>
            </div>
          </div>

          {/* 右侧证件照 */}
          <div className="relative w-28 h-36 sm:w-32 sm:h-40 shrink-0 rounded-2xl overflow-hidden border-2 border-[#36513B]/20 dark:border-white/20 shadow-md print:shadow-none print:border-black/40">
            <Image
              src={basicInfo.photoUrl}
              alt="孙乾云 个人证件照"
              fill
              priority
              sizes="128px"
              className="object-cover object-top"
            />
          </div>
        </section>

        {/* ================= 个人总结 ================= */}
        <section className="py-6 border-b border-[#36513B]/12 dark:border-white/10 space-y-3 print:py-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#36513B] dark:bg-[#7CD090] print:bg-black" />
            <h2 className="text-lg font-bold tracking-tight text-[#26352A] dark:text-[#F0F5F1] print:text-black">
              个人总结
            </h2>
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm text-[#3A453C] dark:text-[#C5D6C7] leading-relaxed print:text-black">
            {basicInfo.summary.map((text, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-[#718F6E] font-bold select-none">•</span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </section>

        {/* ================= 专业技能 ================= */}
        <section className="py-6 border-b border-[#36513B]/12 dark:border-white/10 space-y-4 print:py-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#36513B] dark:bg-[#7CD090] print:bg-black" />
            <h2 className="text-lg font-bold tracking-tight text-[#26352A] dark:text-[#F0F5F1] print:text-black">
              专业技能
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
            {skills.map((group) => (
              <div
                key={group.category}
                className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1E2721]/60 border border-[#36513B]/10 dark:border-white/8 space-y-2.5 print:bg-white print:border-black/20 print:p-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#26352A] dark:text-[#F0F5F1] print:text-black">
                    {group.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#36513B]/8 dark:bg-white/10 text-[#36513B] dark:text-[#9DB289] font-semibold print:text-black">
                    {group.tag}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#4E5B50] dark:text-[#BACABA] leading-relaxed print:text-black">
                  {group.items.map((skill) => (
                    <p key={skill.name}>
                      <span className="font-bold text-[#26352A] dark:text-[#E2EBE4] print:text-black">
                        {skill.name}：
                      </span>
                      {skill.desc}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 教育经历 ================= */}
        <section className="py-6 border-b border-[#36513B]/12 dark:border-white/10 space-y-4 print:py-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#36513B] dark:bg-[#7CD090] print:bg-black" />
            <h2 className="text-lg font-bold tracking-tight text-[#26352A] dark:text-[#F0F5F1] print:text-black">
              教育经历
            </h2>
          </div>

          <div className="space-y-4 print:space-y-3">
            {education.map((edu) => (
              <div
                key={edu.school}
                className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1E2721]/60 border border-[#36513B]/10 dark:border-white/8 space-y-2 print:bg-white print:border-black/20 print:p-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-base text-[#26352A] dark:text-[#F0F5F1] print:text-black">
                      {edu.school}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#36513B]/10 dark:bg-[#7CD090]/15 text-[#36513B] dark:text-[#7CD090] font-semibold print:text-black">
                      {edu.major} · {edu.degree}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D79B7B]/15 text-[#A25738] dark:text-[#E6B097] font-semibold print:text-black">
                      {edu.badge}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#748176] dark:text-[#8E9F90] print:text-black">
                    {edu.period}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-[#4E5B50] dark:text-[#BACABA] print:text-black">
                  {edu.highlights.map((h, i) => (
                    <p key={i} className="flex items-start gap-1.5">
                      <span className="text-[#718F6E]">•</span>
                      <span>{h}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 项目经历 ================= */}
        <section className="pt-6 space-y-6 print:pt-4 print:space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#36513B] dark:bg-[#7CD090] print:bg-black" />
            <h2 className="text-lg font-bold tracking-tight text-[#26352A] dark:text-[#F0F5F1] print:text-black">
              项目经历
            </h2>
          </div>

          <div className="space-y-6 print:space-y-4">
            {projects.map((proj) => (
              <article
                key={proj.name}
                className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#1E2721]/60 border border-[#36513B]/12 dark:border-white/10 space-y-3.5 print:bg-white print:border-black/20 print:p-3 break-inside-avoid"
              >
                {/* 项目头部信息 */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#36513B]/10 dark:border-white/8 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#26352A] dark:text-[#F0F5F1] print:text-black">
                      {proj.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#718F6E] dark:text-[#9DB289] mt-0.5 print:text-black">
                      {proj.role}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#748176] dark:text-[#8E9F90] print:text-black">
                    {proj.period}
                  </span>
                </div>

                {/* 核心技术栈标签 */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-[#26352A] dark:text-[#E2EBE4] print:text-black">
                    核心技术：
                  </span>
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-[#151D17] border border-[#36513B]/12 dark:border-white/8 text-[11px] font-mono font-medium text-[#36513B] dark:text-[#9DB289] print:text-black print:border-black/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* 关键项目手记直跳入口 (在 K8s 项目展现，极大提高面试说服力) */}
                {proj.handbookHref && (
                  <div className="p-2.5 rounded-xl bg-[#E2EBE4]/70 dark:bg-[#151D17]/80 border border-[#36513B]/15 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 print:hidden">
                    <span className="text-xs text-[#36513B] dark:text-[#7CD090] font-medium flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span>已将完整部署架构、Grafana 监控看板与排错经验梳理为技术长文</span>
                    </span>
                    <Link
                      href={proj.handbookHref}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#36513B] dark:text-[#7CD090] hover:underline"
                    >
                      <span>查看完整实战手册 →</span>
                    </Link>
                  </div>
                )}

                {/* 项目具体执行板块 */}
                <div className="space-y-2.5 text-xs sm:text-sm text-[#3A453C] dark:text-[#C5D6C7] leading-relaxed print:text-black">
                  {proj.sections.map((sec) => (
                    <div key={sec.title} className="space-y-0.5">
                      <span className="font-bold text-[#26352A] dark:text-[#F0F5F1] print:text-black">
                        • {sec.title}：
                      </span>
                      <span>{sec.details}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      {/* 底部 Toast 提示 */}
      {copiedType && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 inset-x-0 mx-auto w-fit z-50 px-4 py-2 rounded-full bg-[#26352A] text-white text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 print:hidden"
        >
          <Check className="w-4 h-4 text-[#7CD090]" />
          <span>
            {copiedType === "phone" && "电话号码已复制到剪贴板"}
            {copiedType === "email" && "电子邮箱已复制到剪贴板"}
            {copiedType === "link" && "在线简历链接已复制到剪贴板"}
            {copiedType === "boss" && "Boss 直聘沟通文案已复制到剪贴板！"}
          </span>
        </aside>
      )}

      {/* 打印全局样式覆盖 */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          header, footer, nav, aside {
            display: none !important;
          }
          main {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
