"use client";

import Footer from "@/components/Footer";
import AmbientAudioPlayer from "@/components/AmbientAudioPlayer";
import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Timer, Feather, Play, Pause, RefreshCw, Copy, Check, Loader2, RotateCcw } from "lucide-react";

const HITOKOTO_TYPES: Record<string, string> = {
  a: "动漫经典", b: "漫画名句", c: "游戏物语", d: "文学名著",
  e: "原创灵感", f: "网络佳句", g: "其他金句", h: "哲学思考",
  i: "古风诗词", j: "网易云热评", k: "人生格言", l: "故事沉淀",
};

// Pomodoro durations in seconds
const MODES = [
  { label: "专注", seconds: 25 * 60, accent: "#36513B" },
  { label: "短休", seconds: 5 * 60, accent: "#8C4A31" },
  { label: "长休", seconds: 15 * 60, accent: "#2B4C6F" },
];

function fmt(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function PomodoroTimer() {
  const [modeIdx, setModeIdx] = useState(0);
  const [remaining, setRemaining] = useState(MODES[0].seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const mode = MODES[modeIdx];
  const total = mode.seconds;
  const progress = 1 - remaining / total;
  const circumference = 2 * Math.PI * 72; // r=72

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          stopTimer();
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    if (running) {
      startTimer();
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [running, startTimer, stopTimer]);

  const switchMode = (idx: number) => {
    stopTimer();
    setRunning(false);
    setModeIdx(idx);
    setRemaining(MODES[idx].seconds);
  };

  const reset = () => {
    stopTimer();
    setRunning(false);
    setRemaining(mode.seconds);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#2D2B2C]/6 shadow-[0_4px_24px_rgba(45,43,44,0.05)] space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#E2EBE4] flex items-center justify-center flex-shrink-0">
          <Timer className="w-5 h-5 text-[#36513B]" />
        </div>
        <div>
          <p className="text-xs text-[#7A736A] font-medium">治愈小工具</p>
          <h3 className="text-lg font-bold text-[#2D2B2C]">番茄钟专注计时器</h3>
        </div>
      </div>

      {/* Mode Pills */}
      <div className="flex items-center gap-2">
        {MODES.map((m, i) => (
          <button
            key={m.label}
            onClick={() => switchMode(i)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              modeIdx === i
                ? "bg-[#36513B] text-white shadow-sm"
                : "bg-[#FAF7F2] text-[#7A736A] hover:bg-[#E2EBE4] hover:text-[#36513B] border border-[#2D2B2C]/8"
            }`}
          >
            {m.label} {m.label === "专注" ? "25min" : m.label === "短休" ? "5min" : "15min"}
          </button>
        ))}
      </div>

      {/* SVG Circular Progress Ring */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative w-44 h-44">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Track */}
            <circle cx="80" cy="80" r="72" fill="none" stroke="#E2EBE4" strokeWidth="6" />
            {/* Progress arc */}
            <circle
              cx="80" cy="80" r="72"
              fill="none"
              stroke={mode.accent}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: "stroke-dashoffset 0.9s linear" }}
            />
          </svg>
          {/* Center time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold tabular-nums font-mono text-[#2D2B2C] tracking-tight">
              {fmt(remaining)}
            </span>
            <span className="text-xs text-[#7A736A] font-medium mt-0.5">{mode.label}中</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="p-3 rounded-full bg-[#FAF7F2] hover:bg-[#E2EBE4] text-[#7A736A] transition-all border border-[#2D2B2C]/8"
            title="重置"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#36513B] text-white text-sm font-semibold hover:bg-[#283E2C] transition-all shadow-md active:scale-95"
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{running ? "暂停" : remaining === mode.seconds ? "开始专注" : "继续"}</span>
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-[#B0A99F] font-mono">
        {running ? "专注中，保持当下的宁静" : "准备好了吗？按下开始，进入心流"}
      </p>
    </div>
  );
}

function HitokotoCard() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    hitokoto: "醉后不知天在水，满床清梦压星河。",
    from: "题游桃花源",
    from_who: "唐温如",
    type: "i",
  });

  const fetchHitokoto = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://v1.hitokoto.cn/?c=i&c=d&c=h&c=k&c=a&c=j");
      if (res.ok) {
        const d = await res.json();
        setData({
          hitokoto: d.hitokoto,
          from: d.from || "一言",
          from_who: d.from_who || null,
          type: d.type || "i",
        });
      }
    } catch {
      // silently fail, keep previous
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = `"${data.hitokoto}" —— ${data.from_who ? data.from_who + " " : ""}《${data.from}》`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#2D2B2C]/6 shadow-[0_4px_24px_rgba(45,43,44,0.05)] space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FDEEE9] flex items-center justify-center flex-shrink-0">
            <Feather className="w-5 h-5 text-[#8C4A31]" />
          </div>
          <div>
            <p className="text-xs text-[#7A736A] font-medium">
              {HITOKOTO_TYPES[data.type] || "一言精选"}
            </p>
            <h3 className="text-lg font-bold text-[#2D2B2C]">每日一言诗句</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchHitokoto}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-white text-xs font-medium text-[#2D2B2C] border border-[#2D2B2C]/10 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 text-[#36513B] animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-[#36513B]" />}
            <span>{loading ? "请求中..." : "随机抽取"}</span>
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#36513B] text-white text-xs font-medium hover:bg-[#283E2C] transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "已复制" : "复制"}</span>
          </button>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#2D2B2C]/5 text-center space-y-4">
        <blockquote className="text-xl sm:text-2xl font-bold text-[#2D2B2C] leading-relaxed tracking-wide">
          &ldquo;{data.hitokoto}&rdquo;
        </blockquote>
        <p className="text-xs text-[#7A736A] font-mono">
          {data.from_who ? `― ${data.from_who} ` : "― "}《{data.from}》
        </p>
      </div>
    </div>
  );
}

export default function PlaygroundClient() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2D2B2C]">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 sm:px-12 lg:px-20 border-b border-[#2D2B2C]/8 bg-gradient-to-b from-[#FDEEE9]/35 to-transparent">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDEEE9] text-[#C46A4A] text-xs font-semibold border border-[#C46A4A]/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>数字实验室</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2B2C]">
            灵感游乐场
          </h1>
          <p className="text-base sm:text-lg text-[#5A5551] max-w-2xl leading-relaxed">
            专注番茄钟与每日一言诗句生成器，为安静的创作时光寻找轻盈灵感。
          </p>
        </div>
      </section>

      {/* Lab Grid */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <PomodoroTimer />
          <HitokotoCard />
        </div>
        <AmbientAudioPlayer />
      </section>

      <Footer />
    </main>
  );
}
