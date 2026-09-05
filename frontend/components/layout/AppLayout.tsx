"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import AppSidebar from "@/components/layout/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const STORAGE_KEY = "app_sidebar_collapsed";

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Restore desktop collapsed preference from localStorage safely after mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        setIsCollapsed(true);
      }
    } catch (e) {
      // Ignore SSR/storage errors
    }
  }, []);

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileDrawerOpen]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const nextState = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(nextState));
      } catch (e) {}
      return nextState;
    });
  };

  const isHomePage = pathname === "/";

  // Application routes where AppSidebar is active
  const isAppPage = !isHomePage && (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/roadmap") ||
    pathname.startsWith("/playground") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/backend-languages") ||
    pathname.startsWith("/architecture-labs") ||
    pathname.startsWith("/api-labs") ||
    pathname.startsWith("/ai-assistant") ||
    pathname.startsWith("/games") ||
    pathname.startsWith("/gamification") ||
    pathname.startsWith("/progress") ||
    pathname === "/challenges" ||
    pathname === "/coding-lab"
  );

  const shouldRenderSidebar = isAppPage;

  // Determine main container left padding on desktop
  const getMainPaddingClass = () => {
    if (!shouldRenderSidebar) return "";
    if (isCollapsed) return "lg:pl-[72px] transition-all duration-300 ease-in-out";
    return "lg:pl-64 transition-all duration-300 ease-in-out";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Mobile Drawer Floating Toggle Button (App pages only) */}
      {shouldRenderSidebar && (
        <div className="fixed top-3 left-3 z-30 lg:hidden">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open Navigation Sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-300 shadow-lg backdrop-blur-md hover:bg-slate-800 hover:text-white transition"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {shouldRenderSidebar && (
        <AppSidebar
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          isCollapsed={isMounted ? isCollapsed : false}
          onToggleCollapse={toggleCollapse}
        />
      )}

      <main className={getMainPaddingClass()}>
        {children}
      </main>
    </div>
  );
}
