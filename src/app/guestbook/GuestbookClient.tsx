"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Heart, Coffee, ShieldCheck } from "lucide-react";

interface GuestbookEntry {
  id: string;
  name: string;
  avatar: string;
  message: string;
  date: string;
  likes: number;
}

const PRESET_MESSAGES: GuestbookEntry[] = [
  {
    id: "g-1",
    name: "林风 (Film Enthusiast)",
    avatar: "📷",
    message: "西湖暮色那张 Portra 400 胶片感太棒了！文字读起来很让人平静，小屋的设计极具温度。",
    date: "2026-08-05",
    likes: 12,
  },
  {
    id: "g-2",
    name: "Avery_Dev",
    avatar: "☕",
    message: "游乐场里的五子棋 AI 进化得很有挑战性，手冲咖啡计时器也很实用！保持这份数字宁静。",
    date: "2026-08-04",
    likes: 8,
  },
  {
    id: "g-3",
    name: "夏木",
    avatar: "🌿",
    message: "在这个充斥着算法推送的时代，能找到这样一个安安静静看文、听雨声的小屋真好。",
    date: "2026-08-02",
    likes: 15,
  },
  {
    id: "g-4",
    name: "Cloud",
    avatar: "📖",
    message: "欢迎来到我的数字小屋！无论是关于前端代码、胶片摄影还是手冲咖啡，都欢迎留下你的足迹。",
    date: "2026-08-01",
    likes: 24,
  },
];

const AVATAR_OPTIONS = ["☕", "📷", "🌿", "📖", "🎨", "🌙", "🍵", "🕯️", "🪵"];

export default function GuestbookClient() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(PRESET_MESSAGES);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("☕");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load persistent user entries from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cloud_blog_guestbook");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
        }
      }
    } catch {
      // Fallback to presets
    }
  }, []);

  // Save to LocalStorage
  const saveEntries = (newEntries: GuestbookEntry[]) => {
    setEntries(newEntries);
    try {
      localStorage.setItem("cloud_blog_guestbook", JSON.stringify(newEntries));
    } catch {
      // Ignore quota limits
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || submitting) return;

    setSubmitting(true);

    const newEntry: GuestbookEntry = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      avatar,
      message: message.trim(),
      date: new Date().toISOString().split("T")[0],
      likes: 0,
    };

    const updated = [newEntry, ...entries];
    saveEntries(updated);

    setMessage("");
    setSubmitting(false);
  };

  const handleLike = (id: string) => {
    const updated = entries.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    saveEntries(updated);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDEEE9] dark:bg-[#38231C] text-[#8C4A31] dark:text-[#E5987D] text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>时光留言墙</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2B2C] dark:text-[#F0F5F1] tracking-tight">
          数字小屋留言板 (Guestbook)
        </h1>
        <p className="text-sm sm:text-base text-[#5A5551] dark:text-[#9EB3A4] max-w-lg mx-auto leading-relaxed">
          写下一句问候，留下你此刻的想法。愿文字如手冲咖啡般平实温润。
        </p>
      </div>

      {/* Input Card Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1E2721]/50 rounded-3xl p-6 sm:p-8 border border-[#2D2B2C]/6 dark:border-white/8 shadow-[0_4px_24px_rgba(45,43,44,0.05)] space-y-6"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-[#2D2B2C]/5 dark:border-white/5">
          <MessageSquare className="w-5 h-5 text-[#8C4A31]" />
          <h2 className="text-base font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">签署留言</h2>
        </div>

        {/* Avatar picker & Name input */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-[#7A736A] dark:text-[#9EB3A4]">
            选择一个象征形象 & 输入你的昵称
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Avatar Select */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setAvatar(opt)}
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg transition-all ${
                    avatar === opt
                      ? "bg-[#36513B] text-white scale-110 shadow-xs"
                      : "bg-[#FAF7F2] dark:bg-[#24221F] hover:bg-[#E2EBE4]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Name Input */}
            <input
              type="text"
              required
              placeholder="你的名字 / 昵称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#24221F] border border-[#2D2B2C]/8 dark:border-white/10 text-xs font-medium text-[#2D2B2C] dark:text-[#F0F5F1] focus:outline-none focus:border-[#36513B]"
            />
          </div>
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#7A736A] dark:text-[#9EB3A4]">
            留言内容
          </label>
          <textarea
            required
            rows={3}
            maxLength={300}
            placeholder="留下想说的话、建议或者静谧的祝福..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#24221F] border border-[#2D2B2C]/8 dark:border-white/10 text-xs font-medium text-[#2D2B2C] dark:text-[#F0F5F1] focus:outline-none focus:border-[#36513B] resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-[#B0A99F] dark:text-[#6FAF79] font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#36513B]" />
            <span>无跟踪 · 本地与自由持久化</span>
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#36513B] dark:bg-[#7CD090] text-white dark:text-[#142219] text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>发布留言</span>
          </button>
        </div>
      </form>

      {/* Guestbook Entries Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#7A736A] dark:text-[#9EB3A4] font-medium px-2">
          <span>共 {entries.length} 条时光留言</span>
          <span>按时间倒序</span>
        </div>

        <div className="space-y-4">
          {entries.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#1E2721]/50 rounded-3xl p-6 border border-[#2D2B2C]/6 dark:border-white/8 shadow-[0_4px_24px_rgba(45,43,44,0.04)] space-y-3 hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] dark:bg-[#24221F] flex items-center justify-center text-xl shadow-2xs">
                    {item.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-[#B0A99F] font-mono">{item.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#24221F] hover:bg-[#FDEEE9] dark:hover:bg-[#38231C] text-xs font-semibold text-[#8C4A31] transition-all group"
                >
                  <Heart className="w-3.5 h-3.5 group-hover:scale-125 transition-transform fill-current" />
                  <span>{item.likes}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#5A5551] dark:text-[#D1E0D4] leading-relaxed font-normal pl-1">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
