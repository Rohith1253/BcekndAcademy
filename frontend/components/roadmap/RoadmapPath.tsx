"use client";

import { motion } from "framer-motion";
import type { RoadmapModule } from "@/components/roadmap/types";

interface RoadmapPathProps {
  from: RoadmapModule;
  to: RoadmapModule;
}

export default function RoadmapPath({ from, to }: RoadmapPathProps) {
  const startX = from.x + 168;
  const startY = from.y + 57;
  const endX = to.x;
  const endY = to.y + 57;
  const controlX = (startX + endX) / 2;
  const controlY = startY;

  const path = `M ${startX} ${startY} C ${controlX} ${controlY} ${controlX} ${endY} ${endX} ${endY}`;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <motion.path
        d={path}
        fill="none"
        stroke="rgba(99, 102, 241, 0.55)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <circle cx={endX} cy={endY} r="4" fill="rgba(99,102,241,0.95)" />
    </svg>
  );
}
