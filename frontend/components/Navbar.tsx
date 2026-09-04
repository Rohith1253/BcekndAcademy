"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Terminal, ArrowRight } from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { useClient } from "@/lib/store";
import AuthModal from "@/components/AuthModal";
interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user } = useClient();
  const pathname = usePathname();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const isHomePage = pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.08] bg-[var(--surface)]/85 backdrop-blur-xl transition-colors duration-200"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button for Application Pages */}
            {!isHomePage && onToggleSidebar && user && (
              <button
                type="button"
                onClick={onToggleSidebar}
                aria-label="Toggle navigation menu"
                className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/80 p-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white lg:hidden cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            <a href="/" className="flex items-center gap-3 transition hover:opacity-90 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-800 text-slate-100 shadow-sm hover:bg-gray-700 transition-transform duration-200">
                <Terminal className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 leading-tight">
                  Backend Platform
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Backend Academy
                </span>
              </div>
            </a>
          </div>

          {/* Middle Navigation Section Removed as requested (Navigation is fully handled by AppSidebar) */}

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <ProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  <ThemeSwitcher showLabels={false} />
                </div>
                <a
                  href="/login"
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-white/[0.08] cursor-pointer"
                >
                  Sign In
                </a>
                <a
                  href="/login?mode=register"
                  className="inline-flex items-center justify-center rounded-md bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
