"use client";

import { useState } from "react";
import { Feather, Heart, Mail, Globe, ArrowUp, Send, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#FAF7F2] text-[#5A5551] pt-16 pb-12 border-t border-[#2D2B2C]/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter Subscription Bar */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#E2EBE4]/60 border border-[#36513B]/15 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-[#2D2B2C]">订阅「云间通信」Newsletter</h3>
            <p className="text-xs text-[#5A5551]">每月一封，分享不定期更新的代码探索、胶片镜头与生活絮语。</p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-2">
            {!subscribed ? (
              <div className="flex items-center w-full md:w-80 bg-white rounded-2xl p-1.5 border border-[#2D2B2C]/10 focus-within:border-[#36513B] shadow-2xs transition-all">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入你的 Email 邮箱..."
                  className="w-full px-3 py-1 text-xs bg-transparent text-[#2D2B2C] focus:outline-none placeholder-[#7A736A]"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#36513B] text-white text-xs font-bold hover:bg-[#2A402E] active:scale-95 transition-all flex-shrink-0"
                >
                  <span>订阅</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#36513B] text-white text-xs font-bold animate-in fade-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>订阅成功！感谢关注「云间通信」</span>
              </div>
            )}
          </form>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-[#2D2B2C]/8">
          {/* Brand Info */}
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E2EBE4] border border-[#D2DFD5] flex items-center justify-center text-[#36513B]">
                <Feather className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-[#2D2B2C] tracking-tight">
                Cloud 的数字小屋
              </span>
            </div>
            <p className="text-xs text-[#7A736A] max-w-sm leading-relaxed">
              这里记录写给机器的代码，也记录留给生活的诗意与摄影。感谢你的每一次停留。
            </p>
          </div>

          {/* Nav Links & Actions */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[#5A5551]">
            <a href="/notes" className="hover:text-[#36513B] transition-colors">
              随笔笔记
            </a>
            <a href="/gallery" className="hover:text-[#36513B] transition-colors">
              摄影画廊
            </a>
            <a href="/playground" className="hover:text-[#36513B] transition-colors">
              灵感游乐场
            </a>
            <a href="/about" className="hover:text-[#36513B] transition-colors">
              关于小屋
            </a>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#2D2B2C]/10 text-[#2D2B2C] hover:bg-[#36513B] hover:text-white transition-all shadow-2xs hover:scale-105 active:scale-95"
            >
              <span>回到顶部</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Social & Copyright */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A736A]">
          <div className="flex items-center gap-4">
            <a
              href="mailto:cloud@example.com"
              className="p-2.5 rounded-full bg-white border border-[#2D2B2C]/8 hover:text-[#36513B] hover:border-[#36513B]/30 hover:scale-110 transition-all"
              aria-label="Email Cloud"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-white border border-[#2D2B2C]/8 hover:text-[#36513B] hover:border-[#36513B]/30 hover:scale-110 transition-all"
              aria-label="Code Repository"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Cloud. Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#C46A4A] fill-[#C46A4A]/20 mx-0.5 animate-pulse" />
            <span>&amp; Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
