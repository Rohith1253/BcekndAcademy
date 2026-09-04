"use client";

import { motion } from "framer-motion";

interface InteractiveDiagramProps {
  items?: string[];
}

export default function InteractiveDiagram({ items = [] }: InteractiveDiagramProps) {
  const defaultFlow = items.length > 0 ? items : ["Client", "Request", "Server", "Processing", "Response"];

  return (
    <div className="not-prose my-8 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <div className="flex flex-col items-center justify-center gap-4">
        {defaultFlow.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="w-full"
          >
            <div className="rounded-[1.5rem] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-slate-900/80 p-5 text-center">
              <p className="font-semibold text-white">{item}</p>
            </div>
            {index < defaultFlow.length - 1 && (
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                className="flex justify-center py-3 text-cyan-400"
              >
                ↓
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
