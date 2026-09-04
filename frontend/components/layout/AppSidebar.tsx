"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Map,
  Code,
  Terminal,
  LayoutDashboard,
  User,
  X,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  Cpu,
} from "lucide-react";

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navGroups = [
  {
    title: "LEARN",
    items: [
      { label: "Home", href: "/", icon: Home },
      { label: "Courses", href: "/courses", icon: BookOpen },
      { label: "Languages", href: "/backend-languages", icon: Cpu },
      { label: "Roadmap", href: "/roadmap", icon: Map },
    ],
  },
  {
    title: "PRACTICE",
    items: [
      { label: "Coding Practice", href: "/challenges", icon: Terminal },
      { label: "AI Coding Lab", href: "/coding-lab", icon: Bot },
      { label: "Playground", href: "/playground", icon: Code },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Profile", href: "/profile", icon: User },
    ],
  },
];

export default function AppSidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: AppSidebarProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/courses") {
      return pathname === "/courses" || pathname.startsWith("/courses/") || pathname.startsWith("/learn/");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // --- Desktop Navigation Content ---
  const renderDesktopContent = () => (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="space-y-5">
        {/* Desktop Header Toggle Button */}
        <div className={`flex items-center pt-1 pb-2 ${isCollapsed ? "justify-center" : "justify-between px-2"}`}>
          {!isCollapsed && (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Navigation
            </span>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar (256px)" : "Collapse sidebar (72px)"}
              className="rounded-xl border border-white/10 bg-slate-900/80 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4 text-violet-300" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Nav Groups */}
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`group relative flex items-center rounded-xl py-2.5 transition-all duration-200 ${
                      isCollapsed
                        ? "justify-center px-0"
                        : "gap-3.5 px-3.5 text-sm font-medium"
                    } ${
                      active
                        ? "bg-violet-500/15 text-violet-300 border-l-2 border-violet-500 font-semibold shadow-sm shadow-violet-500/10"
                        : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                    }`}
                  >
                    <Icon
                      className={`shrink-0 transition-colors ${
                        isCollapsed ? "h-5 w-5" : "h-4 w-4"
                      } ${active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"}`}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Footer Badge */}
      <div className={`rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md ${isCollapsed ? "p-2 text-center" : "p-3.5"}`}>
        {isCollapsed ? (
          <div className="flex justify-center text-violet-300" title="Backend Pro Platform">
            <Sparkles className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Backend Pro</p>
              <p className="text-[10px] text-slate-400">Production Platform</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // --- Mobile Drawer Content (Always Full Width) ---
  const renderMobileContent = () => (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 text-xs font-bold text-slate-950 shadow-md shadow-violet-500/20">
              BA
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Backend</p>
              <p className="text-sm font-semibold text-white">Academy</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="rounded-xl border border-white/10 bg-slate-900 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav Groups */}
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-3 text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onClose && onClose()}
                    className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-violet-500/15 text-violet-300 border-l-2 border-violet-500 font-semibold shadow-sm shadow-violet-500/10"
                        : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Footer Badge */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="font-semibold text-slate-200">Backend Pro</p>
            <p className="text-[10px] text-slate-400">Production Platform</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar (Supports 256px Open & 72px Collapsed) */}
      <aside
        aria-label="Application Navigation"
        className={`fixed left-0 top-16 bottom-0 z-40 hidden border-r border-white/10 bg-slate-950/90 backdrop-blur-xl transition-all duration-300 ease-in-out lg:flex flex-col ${
          isCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {renderDesktopContent()}
      </aside>

      {/* Mobile Drawer (Always Full Width Slide-out) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-out Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              aria-label="Mobile Navigation"
              className="fixed bottom-0 left-0 top-0 z-50 w-72 border-r border-white/10 bg-slate-950/95 backdrop-blur-2xl shadow-2xl lg:hidden flex flex-col"
            >
              {renderMobileContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
