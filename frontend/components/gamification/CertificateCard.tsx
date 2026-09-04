"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface CertificateCardProps {
  title: string;
  date: string;
  description: string;
}

export default function CertificateCard({ title, date, description }: CertificateCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="group cursor-pointer rounded-[2rem] border-2 border-gradient-to-r from-amber-400 to-orange-500 bg-gradient-to-br from-slate-950 to-slate-900 p-8 shadow-2xl shadow-amber-500/20 transition hover:shadow-amber-500/30"
      style={{
        borderImage: "linear-gradient(135deg, #fbbf24, #f97316) 1",
      }}
    >
      <div className="text-center">
        <Award className="mx-auto h-16 w-16 text-amber-400 group-hover:scale-110 transition" />
        <h3 className="mt-6 text-2xl font-bold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
        <p className="mt-6 text-xs uppercase tracking-[0.24em] text-slate-500">Earned on {date}</p>
      </div>
    </motion.div>
  );
}
