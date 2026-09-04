"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

interface CoinWalletProps {
  totalCoins: number;
}

export default function CoinWallet({ totalCoins }: CoinWalletProps) {
  const [displayCoins, setDisplayCoins] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = totalCoins / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      setDisplayCoins(Math.min(Math.round(current), totalCoins));
      if (current >= totalCoins) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [totalCoins]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-sky-500/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-lg"
        >
          <Coins className="h-8 w-8" />
        </motion.div>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Your Coins</p>
          <motion.p
            key={displayCoins}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-3xl font-bold text-white"
          >
            {displayCoins.toLocaleString()}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
