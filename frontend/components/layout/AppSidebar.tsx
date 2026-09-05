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
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  Layers,
  Cpu
} from "lucide-react";
import { useClient } from "@/lib/store";

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navGroups = [
  {
    title: "LEARNING",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Learning Path", href: "/roadmap", icon: Map },
      { label: "Course Catalog", href: "/courses", icon: BookOpen },
      { label: "11 Backend Languages", href: "/backend-languages", icon: Cpu },
    ],
  },
  {
    title: "PRACTICE & LABS",
    items: [
      { label: "Coding Workspace", href: "/workspace", icon: Code },
      { label: "Coding Challenges", href: "/challenges", icon: Terminal },
      { label: "Architecture Labs", href: "/architecture-labs", icon: Layers },
      { label: "Playground", href: "/playground", icon: Terminal },
    ],
  },
  {
    title: "ASSISTANCE & PROFILE",
    items: [
      { label: "AI Assistant", href: "/ai-assistant", icon: Bot },
      { label: "Profile & Settings", href: "/profile", icon: User },
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
  const { user } = useClient();

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/courses") return pathname.startsWith("/courses") || pathname.startsWith("/learn");
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderContent = (mobile = false) => (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="space-y-6">
        {/* Toggle / Header */}
        <div className={`flex items-center pt-2 pb-1 ${isCollapsed && !mobile ? "justify-center" : "justify-between px-2"}`}>
          {(!isCollapsed || mobile) ? (
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950/40">
                <Terminal className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-wider text-white group-hover:text-cyan-400 transition">BACKEND</span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold leading-none">ACADEMY</span>
              </div>
            </Link>
          ) : (
            <Link href="/" title="Backend Academy" className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md">
              <Terminal className="h-4 w-4" />
            </Link>
          )}
          {!mobile && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="rounded-xl border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              {isCollapsed ? <PanelLeftOpen className="h-4 w-4 text-cyan-400" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          )}
          {mobile && onClose && (
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="rounded-xl border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {(!isCollapsed || mobile) && (
              <p className="px-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
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
                    onClick={() => mobile && onClose && onClose()}
                    title={isCollapsed && !mobile ? item.label : undefined}
                    className={`group relative flex items-center rounded-xl py-2 transition-all duration-150 ${
                      isCollapsed && !mobile
                        ? "justify-center px-0"
                        : "gap-3 px-3 text-xs font-medium"
                    } ${
                      active
                        ? "bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-500 font-semibold"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <Icon
                      className={`shrink-0 ${isCollapsed && !mobile ? "h-5 w-5" : "h-4 w-4"} ${
                        active ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                    />
                    {(!isCollapsed || mobile) && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Platform / User Footer */}
      <div className={`rounded-2xl border border-slate-800 bg-slate-900/60 ${isCollapsed && !mobile ? "p-2 text-center" : "p-3"}`}>
        {(!isCollapsed || mobile) ? (
          <div>
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-bold text-xs shrink-0">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-white truncate group-hover:text-cyan-300 transition">{user.name || "Student"}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email || "Active Learner"}</p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-white">Backend Academy</p>
                  <p className="text-[10px] text-slate-500">13-Level Production Track</p>
                </div>
                <Link
                  href="/login"
                  className="rounded-lg bg-cyan-500/15 border border-cyan-500/30 px-2 py-1 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-500/25 transition"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[10px] font-mono text-cyan-400 font-bold">
            {user ? (user.name ? user.name[0].toUpperCase() : "U") : "BA"}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        aria-label="Application Navigation"
        className={`fixed left-0 top-0 bottom-0 z-40 hidden border-r border-slate-800 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ease-in-out lg:flex flex-col ${
          isCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              aria-label="Mobile Navigation"
              className="fixed bottom-0 left-0 top-0 z-50 w-72 border-r border-slate-800 bg-slate-950 backdrop-blur-2xl shadow-2xl lg:hidden flex flex-col"
            >
              {renderContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
