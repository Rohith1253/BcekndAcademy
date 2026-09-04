"use client";

import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative flex items-center gap-2 px-4 py-3 font-medium text-sm transition whitespace-nowrap ${
            activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          {tab.icon}
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-cyan-500"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
