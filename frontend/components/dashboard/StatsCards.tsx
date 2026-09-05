"use client";

import { useEffect, useState } from "react";
import { Clock3, Layers, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useClient } from "@/lib/store";
import { calculateLevel } from "@/lib/xp-backend";

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 900;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const interval = window.setInterval(() => {
      current += increment;
      setCount(Math.min(Math.round(current), value));
      if (current >= value) {
        window.clearInterval(interval);
      }
    }, duration / steps);

    return () => window.clearInterval(interval);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

export default function StatsCards() {
  const { user } = useClient();

  const userXP = user?.totalXP ?? 0;
  const userLevel = calculateLevel(userXP);
  const lessonsCompleted = user?.lessonsCompleted ?? (user ? 1 : 0);
  const projectsFinished = user ? 1 : 0;

  const stats = [
    {
      title: "XP Earned",
      value: userXP,
      icon: Zap,
      accent: "from-violet-500 to-fuchsia-500",
    },
    {
      title: "Current Level",
      value: userLevel,
      icon: Trophy,
      accent: "from-cyan-500 to-sky-500",
    },
    {
      title: "Lessons Completed",
      value: lessonsCompleted,
      icon: Layers,
      accent: "from-emerald-400 to-teal-500",
    },
    {
      title: "Projects Finished",
      value: projectsFinished,
      icon: Clock3,
      accent: "from-fuchsia-500 to-violet-500",
    },
  ];

  return (
    <section className="grid gap-5 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.article
            key={stat.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -8 }}
            className="group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl transition duration-300"
          >
            <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${stat.accent} text-white shadow-lg shadow-slate-950/40`}>
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{stat.title}</p>
            <div className="mt-4 text-4xl font-semibold text-white">
              <AnimatedCounter value={stat.value} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {stat.title === "XP Earned"
                ? "Progress your backend journey with every lesson."
                : stat.title === "Current Level"
                ? "You are closing in on the next mastery tier."
                : stat.title === "Lessons Completed"
                ? "Each lesson adds real backend momentum."
                : "Project experience builds deep backend intuition."}
            </p>
          </motion.article>
        );
      })}
    </section>
  );
}
