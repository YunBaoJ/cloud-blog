import { Mail, Send, Sparkles } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";

export default function NewsletterSection() {
  return (
    <section className="relative w-full py-20 px-4 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/90 shadow-[0_8px_32px_rgba(45,43,44,0.05)] text-center space-y-6 overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FDEEE9] rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#E2EBE4] rounded-full blur-2xl pointer-events-none" />

          {/* Badge & Title */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0EA] text-[#8C4A31] text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>保持联系</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D2B2C] tracking-tight">
              写信给 Cloud
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] max-w-lg mx-auto leading-relaxed">
              想聊前端、摄影或这个数字小屋，欢迎直接来信。我会认真阅读每一封邮件。
            </p>
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("来自数字小屋的来信")}`}
            className="relative z-10 mx-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#36513B] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#283E2C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36513B] focus-visible:ring-offset-4 active:scale-[0.98]"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>{CONTACT_EMAIL}</span>
            <Send className="h-4 w-4" aria-hidden="true" />
          </a>

          <p className="relative z-10 text-[11px] text-[#7A736A] font-mono">
            点击后将使用你的默认邮件应用
          </p>

        </div>
      </div>
    </section>
  );
}
