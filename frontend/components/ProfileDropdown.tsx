"use client";

import { useState, useRef, useEffect } from "react";
import { User as UserIcon, ArrowRight, LogOut, LayoutDashboard, UserCheck } from "lucide-react";
import { useClient, clearClientAuthToken } from "@/lib/store";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { getApiUrl } from "@/lib/http";

export default function ProfileDropdown() {
  const { user, refreshUser } = useClient();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(getApiUrl("/api/auth/logout"), { method: "POST", credentials: "include" });
      clearClientAuthToken();
      await refreshUser();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 bg-[var(--surface)] px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-sm transition hover:bg-slate-100 dark:hover:bg-white/[0.08] cursor-pointer"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User account menu"
      >
        <UserIcon className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
        <span className="font-semibold max-w-[120px] truncate">{user.name || "Account"}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 dark:border-white/10 bg-[var(--surface)] text-[var(--foreground)] shadow-xl z-50 p-3 backdrop-blur-md"
        >
          <div className="px-2 py-1.5 border-b border-slate-200 dark:border-white/10 mb-2">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {user.name || "Learner"}
            </p>
            {user.email && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <a
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>Dashboard</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>Profile</span>
              </div>
            </a>
          </div>

          <div className="my-2.5 border-t border-slate-200 dark:border-white/10 pt-2.5">
            <ThemeSwitcher />
          </div>

          <div className="border-t border-slate-200 dark:border-white/10 pt-2 mt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 px-3 py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
