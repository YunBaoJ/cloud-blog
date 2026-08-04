"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
      className="flex items-center justify-center w-7 h-7 rounded-full transition-all hover:scale-110 active:scale-95"
      style={{
        background: theme === "dark"
          ? "rgba(237,233,228,0.10)"
          : "rgba(45,43,44,0.06)",
      }}
    >
      {theme === "dark" ? (
        <Sun className="w-3.5 h-3.5 text-[#EDE9E4]" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#5A5551]" />
      )}
    </button>
  );
}
