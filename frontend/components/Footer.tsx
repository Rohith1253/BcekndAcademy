import React from "react";
import { Terminal } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Playground", href: "/playground" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070913]/90 py-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-slate-950 shadow-md">
            <Terminal className="h-4 w-4 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">
              Backend Learning Platform
            </p>
            <p className="text-[11px] text-slate-500">
              Learn. Build. Master Backend Development.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 font-medium">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-slate-500 text-[11px]">
          © {new Date().getFullYear()} Backend Learning Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
