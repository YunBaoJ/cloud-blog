"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  Disc,
  ListMusic,
  Sparkles,
  Heart,
} from "lucide-react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverColor: string;
  duration: number; // in seconds
  bpm: number;
  chords: number[][]; // Frequency combinations for synthesized melody
}

const PLAYLIST: Track[] = [
  {
    id: "moonlight",
    title: "月光与落叶",
    artist: "Cloud & Lofi Studio",
    album: "Wabi-Sabi Ambient",
    coverColor: "from-[#8C4A31] to-[#36513B]",
    duration: 184, // 3:04
    bpm: 65,
    chords: [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ],
  },
  {
    id: "midnight_code",
    title: "深夜代码与书房雨声",
    artist: "Cloud",
    album: "Midnight Sessions",
    coverColor: "from-[#2D2B2C] to-[#4A3B32]",
    duration: 215, // 3:35
    bpm: 72,
    chords: [
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [196.00, 246.94, 293.66, 392.00], // G7
      [261.63, 329.63, 392.00, 523.25], // Cmaj7
      [220.00, 261.63, 329.63, 440.00], // Am7
    ],
  },
  {
    id: "forest_whispers",
    title: "森林静谧与雨后湿气",
    artist: "Nature Ensemble",
    album: "Organic Sounds",
    coverColor: "from-[#36513B] to-[#7CD090]",
    duration: 198, // 3:18
    bpm: 60,
    chords: [
      [174.61, 220.00, 261.63, 349.23], // Fmaj7
      [196.00, 246.94, 293.66, 392.00], // G
      [164.81, 207.65, 246.94, 329.63], // E7
      [220.00, 261.63, 329.63, 440.00], // Am
    ],
  },
  {
    id: "study_afternoon",
    title: "午后阳光的温润随想",
    artist: "Acoustic Cafe",
    album: "Sunny Terrace",
    coverColor: "from-[#C8A05A] to-[#8C4A31]",
    duration: 165, // 2:45
    bpm: 78,
    chords: [
      [261.63, 329.63, 392.00, 523.25], // C
      [196.00, 246.94, 293.66, 392.00], // G
      [220.00, 261.63, 329.63, 440.00], // Am
      [174.61, 220.00, 261.63, 349.23], // F
    ],
  },
];

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Web Audio Synth References for Ambient Lo-Fi Melodies
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Play Lo-Fi Soft Chord Progression
  const playChordProgression = useCallback(() => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      
      let ctx = audioCtxRef.current;
      if (!ctx || ctx.state === "closed") {
        ctx = new AC();
        audioCtxRef.current = ctx;
      }
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const chords = currentTrack.chords;
      const randomChord = chords[Math.floor(Math.random() * chords.length)];

      randomChord.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        // Lowpass filter for warm analog Lofi feel
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(900, now);

        const targetVol = volume * 0.12;
        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(targetVol, now + idx * 0.15 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 2.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 3.0);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }, [currentTrack, volume]);

  const stopMusic = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  }, []);

  const startMusic = useCallback(() => {
    stopMusic();
    playChordProgression();

    // Loop chord progressions every 3.5 seconds
    timerRef.current = setInterval(() => {
      playChordProgression();
    }, 3600);

    // Update progress bar
    progressTimerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= currentTrack.duration) {
          // Auto next track
          setCurrentTrackIndex((idx) => (idx + 1) % PLAYLIST.length);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  }, [currentTrack, playChordProgression, stopMusic]);

  const togglePlay = () => {
    if (isPlaying) {
      stopMusic();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startMusic();
    }
  };

  const nextTrack = () => {
    setCurrentTime(0);
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const prevTrack = () => {
    setCurrentTime(0);
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  useEffect(() => {
    if (isPlaying) {
      startMusic();
    }
    return () => stopMusic();
  }, [currentTrackIndex, isPlaying, startMusic, stopMusic]);

  // Format Time Format (e.g. 02:45)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative inline-block">
      {/* Navbar Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="音乐播放器"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          isPlaying
            ? "bg-[#36513B] text-white shadow-2xs font-semibold"
            : "text-[#5A5551] dark:text-[#9EB3A4] hover:text-[#2D2B2C] dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/10"
        }`}
      >
        {isPlaying ? (
          <span className="flex items-end gap-0.5 h-3.5 w-3.5">
            <span className="w-0.5 bg-white animate-[bounce_0.6s_infinite_100ms] h-full" />
            <span className="w-0.5 bg-white animate-[bounce_0.6s_infinite_300ms] h-2/3" />
            <span className="w-0.5 bg-white animate-[bounce_0.6s_infinite_200ms] h-4/5" />
          </span>
        ) : (
          <Music className="w-3.5 h-3.5 text-[#8C4A31] dark:text-[#E5987D]" />
        )}
        <span className="hidden sm:inline">
          {isPlaying ? `${currentTrack.title.slice(0, 6)}...` : "音乐"}
        </span>
      </button>

      {/* Floating Popover Music Player Panel */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-80 p-5 rounded-3xl bg-white/95 dark:bg-[#1C1A17]/95 backdrop-blur-xl border border-[#2D2B2C]/10 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.15)] z-50 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#2D2B2C]/8 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#36513B] dark:text-[#7CD090]">
              <Disc className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""}`} />
              <span>Cloud Music Player</span>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="text-[#8C4A31] hover:scale-110 transition-transform"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-[#8C4A31] text-[#8C4A31]" : ""}`} />
            </button>
          </div>

          {/* Track Cover & Info */}
          <div className="flex items-center gap-4">
            {/* Vinyl Disc / Album Art */}
            <div
              className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${currentTrack.coverColor} p-1 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0`}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center bg-black/40 ${
                  isPlaying ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "6s" }}
              >
                <div className="w-3 h-3 rounded-full bg-amber-200 border border-black/50" />
              </div>
            </div>

            {/* Song Meta */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#2D2B2C] dark:text-[#F0F5F1] truncate">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-[#7A736A] dark:text-[#9EB3A4] truncate mt-0.5">
                {currentTrack.artist}
              </p>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-[#24221F] text-[#8C4A31] dark:text-[#E5987D] font-mono border border-[#2D2B2C]/6 dark:border-white/10">
                {currentTrack.album}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-[#FAF7F2] dark:bg-[#24221F] h-1.5 rounded-full overflow-hidden border border-[#2D2B2C]/6 dark:border-white/10">
              <div
                className="bg-[#36513B] dark:bg-[#7CD090] h-full transition-all duration-300"
                style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#7A736A] dark:text-[#9EB3A4]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={prevTrack}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-[#2D2B2C] dark:text-[#F0F5F1] transition-all active:scale-90"
              title="上一首"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#36513B] dark:bg-[#7CD090] text-white dark:text-[#142219] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
              title={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-[#2D2B2C] dark:text-[#F0F5F1] transition-all active:scale-90"
              title="下一首"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => setVolume((v) => (v === 0 ? 0.5 : 0))}
                className="text-[#7A736A] dark:text-[#9EB3A4] hover:text-[#2D2B2C]"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-14 h-1 accent-[#36513B] bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
