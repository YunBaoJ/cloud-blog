"use client";

import { useState } from "react";
import { Mail, Send, Check, Sparkles } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="relative w-full py-20 px-4 bg-gradient-to-b from-[#FAF7F2] via-[#F2EDE2]/60 to-[#FAF7F2] border-t border-[#2D2B2C]/8">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/90 shadow-[0_8px_32px_rgba(45,43,44,0.05)] text-center space-y-6 overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FDEEE9] rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#E2EBE4] rounded-full blur-2xl pointer-events-none" />

          {/* Badge & Title */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0EA] text-[#8C4A31] text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>数字周刊</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D2B2C] tracking-tight">
              订阅 Cloud 的周记与随笔
            </h2>
            <p className="text-sm sm:text-base text-[#5A5551] max-w-lg mx-auto leading-relaxed">
              不定期分享写给机器的代码逻辑、留给生活的胶片光影与独处时的灵感思考。零垃圾邮件。
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative z-10 max-w-md mx-auto flex items-center gap-2 pt-2">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A736A]" />
              <input
                type="email"
                required
                placeholder="输入你的电子邮箱..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-[#FAF7F2] border border-[#2D2B2C]/10 text-sm text-[#2D2B2C] placeholder-[#A39B91] focus:outline-none focus:border-[#36513B] focus:ring-2 focus:ring-[#36513B]/10 transition-all"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#36513B] hover:bg-[#283E2C] text-white text-sm font-semibold transition-all active:scale-95 shadow-md flex-shrink-0"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4 text-[#86AB89]" />
                  <span>已成功订阅</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>免费订阅</span>
                </>
              )}
            </button>
          </form>

          <p className="relative z-10 text-[11px] text-[#7A736A] font-mono">
            随时可一键取消订阅 · 尊重并保护隐私
          </p>

        </div>
      </div>
    </section>
  );
}
