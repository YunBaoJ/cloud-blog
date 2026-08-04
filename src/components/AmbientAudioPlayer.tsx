"use client";

import { useEffect, useRef, useState } from "react";
import { CloudRain, Coffee, Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function AmbientAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<"rain" | "cafe">("rain");
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const stopAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const startAudio = () => {
    stopAudio();
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink / Brown noise for rain or cafe warmth
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      if (soundType === "rain") {
        output[i] *= 3.5;
      } else {
        output[i] *= 2.2;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = soundType === "rain" ? 800 : 400;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    gainNodeRef.current = gainNode;
    noiseNodeRef.current = whiteNoise;
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
    <div className="bg-white dark:bg-[#1C1A17] rounded-3xl p-8 border border-[#2D2B2C]/6 dark:border-white/10 shadow-[0_4px_24px_rgba(45,43,44,0.05)] space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#E8F0F8] dark:bg-[#23382C] flex items-center justify-center flex-shrink-0">
          <CloudRain className="w-5 h-5 text-[#2B4C6F] dark:text-[#8EBAE3]" />
        </div>
        <div>
          <p className="text-xs text-[#7A736A] dark:text-[#9EB3A4] font-medium">环境音生成器</p>
          <h3 className="text-lg font-bold text-[#2D2B2C] dark:text-[#F0F5F1]">森林雨声与咖啡馆白噪音</h3>
        </div>
      </div>

      {/* Sound Type Selection */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSoundType("rain")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-semibold transition-all ${
            soundType === "rain"
              ? "bg-[#36513B] text-white dark:bg-[#7CD090] dark:text-[#142219] shadow-sm"
              : "bg-[#FAF7F2] dark:bg-[#24221F] text-[#7A736A] dark:text-[#9EB3A4] border border-[#2D2B2C]/8 dark:border-white/10"
          }`}
        >
          <CloudRain className="w-4 h-4" />
          <span>森林阵雨</span>
        </button>

        <button
          onClick={() => setSoundType("cafe")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-semibold transition-all ${
            soundType === "cafe"
              ? "bg-[#8C4A31] text-white dark:bg-[#E5987D] dark:text-[#142219] shadow-sm"
              : "bg-[#FAF7F2] dark:bg-[#24221F] text-[#7A736A] dark:text-[#9EB3A4] border border-[#2D2B2C]/8 dark:border-white/10"
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>午后咖啡馆</span>
        </button>
      </div>

      {/* Play Controls & Volume Slider */}
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[#36513B] dark:bg-[#7CD090] text-white dark:text-[#142219] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all flex-shrink-0"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div className="flex-1 flex items-center gap-3 bg-[#FAF7F2] dark:bg-[#24221F] px-4 py-3 rounded-2xl border border-[#2D2B2C]/8 dark:border-white/10">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-[#7A736A] dark:text-[#9EB3A4]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#36513B] dark:text-[#7CD090]" />
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

      <p className="text-center text-xs text-[#B0A99F] dark:text-[#9EB3A4] font-mono">
        {isPlaying ? "正在播放自然白噪音 · 音频由 Web Audio API 实时生成" : "点按播放按钮，开启专注伴音"}
      </p>
    </div>
  );
}
