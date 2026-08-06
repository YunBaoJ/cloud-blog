"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Sparkles, CloudRain, Flame, Coffee } from "lucide-react";

type SoundType = "rain" | "fire" | "cafe";

export default function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<SoundType>("rain");
  const [volume, setVolume] = useState(0.4);
  const [isOpen, setIsOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioNode | null>(null);

  const stopAudio = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // Safe fallback
      }
      audioCtxRef.current = null;
    }
  };

  const startAudio = () => {
    stopAudio();

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Synthesize noise profile according to soundType
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        
        if (soundType === "rain") {
          // Pink/Brown noise for rain
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else if (soundType === "fire") {
          // Warm crackling fire noise
          output[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = output[i];
          if (Math.random() < 0.002) {
            output[i] += (Math.random() * 0.8 - 0.4); // crackle pop
          }
          output[i] *= 2.8;
        } else {
          // Soft ambient coffee shop warmth
          output[i] = (lastOut + 0.015 * white) / 1.015;
          lastOut = output[i];
          output[i] *= 2.0;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter settings
      const filter = ctx.createBiquadFilter();
      if (soundType === "rain") {
        filter.type = "lowpass";
        filter.frequency.value = 800;
      } else if (soundType === "fire") {
        filter.type = "bandpass";
        filter.frequency.value = 450;
        filter.Q.value = 1.0;
      } else {
        filter.type = "lowpass";
        filter.frequency.value = 500;
      }

      const gainNode = ctx.createGain();
      gainNode.gain.value = volume;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start();
      gainNodeRef.current = gainNode;
      noiseSourceRef.current = whiteNoise;
    } catch {
      // Ignore audio autoplay restrictions gracefully
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    }
    return () => stopAudio();
  }, [soundType]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  return (
    <div className="relative inline-block">
      {/* Trigger Button in Nav Bar */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        title="环境白噪音"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          isPlaying
            ? "bg-[#36513B] text-white shadow-2xs font-semibold"
            : "text-[#5A5551] hover:text-[#2D2B2C] hover:bg-white/70"
        }`}
      >
        {isPlaying ? (
          <span className="flex items-end gap-0.5 h-3 w-3">
            <span className="w-0.5 bg-white animate-[bounce_0.6s_infinite_100ms] h-full" />
            <span className="w-0.5 bg-white animate-[bounce_0.6s_infinite_300ms] h-2/3" />
            <span className="w-0.5 bg-white animate-[bounce_0.6s_infinite_200ms] h-4/5" />
          </span>
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-[#8C4A31]" />
        )}
        <span className="hidden md:inline">{isPlaying ? "白噪音中" : "白噪音"}</span>
      </button>

      {/* Floating Control Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-72 p-4 rounded-3xl bg-white/95 dark:bg-[#1C1A17]/95 backdrop-blur-xl border border-[#2D2B2C]/10 dark:border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.12)] z-50 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">数字小屋 · 白噪音</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#7A736A] hover:text-[#2D2B2C] font-mono px-1.5 py-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSoundType("rain")}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl text-[11px] font-semibold transition-all ${
                soundType === "rain"
                  ? "bg-[#36513B] text-white shadow-xs"
                  : "bg-[#FAF7F2] dark:bg-[#24221F] text-[#7A736A] hover:bg-[#E2EBE4]"
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span>森林雨声</span>
            </button>

            <button
              onClick={() => setSoundType("fire")}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl text-[11px] font-semibold transition-all ${
                soundType === "fire"
                  ? "bg-[#8C4A31] text-white shadow-xs"
                  : "bg-[#FAF7F2] dark:bg-[#24221F] text-[#7A736A] hover:bg-[#FDEEE9]"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>柴火篝火</span>
            </button>

            <button
              onClick={() => setSoundType("cafe")}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl text-[11px] font-semibold transition-all ${
                soundType === "cafe"
                  ? "bg-[#2B4C6F] text-white shadow-xs"
                  : "bg-[#FAF7F2] dark:bg-[#24221F] text-[#7A736A] hover:bg-[#E8F0F8]"
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>午后咖啡</span>
            </button>
          </div>

          {/* Play/Pause & Volume */}
          <div className="flex items-center gap-3 pt-1 border-t border-[#2D2B2C]/5 dark:border-white/5">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-[#36513B] dark:bg-[#7CD090] text-white dark:text-[#142219] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all flex-shrink-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <div className="flex-1 flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#24221F] px-3 py-2 rounded-xl border border-[#2D2B2C]/6 dark:border-white/10">
              {volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-[#7A736A]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#36513B] dark:text-[#7CD090]" />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-[#36513B] dark:accent-[#7CD090] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
