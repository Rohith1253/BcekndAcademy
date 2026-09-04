"use client";

import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/components/theme/ThemeProvider";

interface ThemeSwitcherProps {
  className?: string;
  showLabels?: boolean;
}

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function ThemeSwitcher({ className = "", showLabels = true }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {showLabels && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Theme
        </span>
      )}
      <div
        role="radiogroup"
        aria-label="Theme selection"
        className="grid grid-cols-3 gap-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-slate-900/70 p-1"
      >
        {themeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${opt.label} theme`}
              onClick={() => setTheme(opt.value)}
              className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-white dark:bg-cyan-500/25 text-cyan-700 dark:text-cyan-300 border border-slate-300/80 dark:border-cyan-500/40 shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-white/[0.05] border border-transparent"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {showLabels && <span className="text-[11px]">{opt.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
