"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Menu, 
  Terminal, 
  ArrowRight, 
  BookOpen, 
  Map, 
  Code2, 
  Bot, 
  Layers,
  LayoutDashboard
} from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { useClient } from "@/lib/store";
import AuthModal from "@/components/AuthModal";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Learning Path", href: "/roadmap", icon: Map },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Workspace", href: "/workspace", icon: Code2 },
  { label: "Practice", href: "/challenges", icon: Terminal },
  { label: "AI Assistant", href: "/ai-assistant", icon: Bot },
];

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user } = useClient();
  const pathname = usePathname();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const isHomePage = pathname === "/";

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/courses") return pathname.startsWith("/courses") || pathname.startsWith("/learn");
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 lg:px-8">
          
          {/* Left: Brand & Mobile Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {!isHomePage && onToggleSidebar && user && (
              <button
                type="button"
                onClick={onToggleSidebar}
                aria-label="Toggle navigation menu"
                className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white lg:hidden cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20">
                <Terminal className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 leading-tight">
                  Backend Academy
                </span>
                <span className="text-sm font-extrabold text-white tracking-tight leading-tight">
                  Developer Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Middle: Clean Streamlined Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    active
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Auth Controls & Profile */}
          <div className="flex items-center gap-3">
            {user ? (
              <ProfileDropdown />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:block">
                  <ThemeSwitcher showLabels={false} />
                </div>
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?mode=register"
                  className="inline-flex items-center gap-1 rounded-xl bg-cyan-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
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
