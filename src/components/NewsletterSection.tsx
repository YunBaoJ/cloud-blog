import { Mail, Send, Sparkles } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";

export default function NewsletterSection() {
  return (
    <section className="relative w-full px-4 bg-transparent select-none">
      <div className="max-w-4xl mx-auto">
        <div data-home-mail-card className="relative bg-white/90 dark:bg-[#16231A]/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-[#2D2B2C]/8 dark:border-white/10 shadow-[0_8px_32px_rgba(45,43,44,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-center space-y-6 overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FDEEE9] dark:bg-[#36513B]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#E2EBE4] dark:bg-[#7CD090]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Badge & Title */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0EA] dark:bg-[#23382C] text-[#8C4A31] dark:text-[#7CD090] text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>保持联系</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D2B2C] dark:text-[#F0F5F1] tracking-tight">
              写信给 Kasumi
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] dark:text-[#9EB3A4] max-w-lg mx-auto leading-relaxed">
              想聊前端、摄影或这个数字小屋，欢迎直接来信。我会认真阅读每一封邮件。
            </p>
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("来自数字小屋的来信")}`}
            className="relative z-10 mx-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#36513B] hover:bg-[#283E2C] dark:bg-[#7CD090] dark:hover:bg-[#68B87C] px-6 py-3 text-sm font-semibold text-white dark:text-[#121413] shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36513B] active:scale-[0.98]"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span className="font-mono">{CONTACT_EMAIL}</span>
            <Send className="h-4 w-4" aria-hidden="true" />
          </a>

          <p className="relative z-10 text-[11px] text-[#7A736A] dark:text-[#9EB3A4] font-mono">
            点击后将使用你的默认邮件应用
          </p>

        </div>
      </div>
    </section>
  );
}
