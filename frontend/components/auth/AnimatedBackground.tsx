"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";

export default function AnimatedBackground() {
  const cyanOrbRef = useRef<HTMLDivElement>(null);
  const indigoOrbRef = useRef<HTMLDivElement>(null);
  const magentaOrbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const animations: anime.AnimeInstance[] = [];

    // Cyan Orb Floating (#22D3EE)
    if (cyanOrbRef.current) {
      animations.push(
        anime({
          targets: cyanOrbRef.current,
          translateX: [-40, 50, -20, 30],
          translateY: [-30, 40, -50, 20],
          scale: [1, 1.15, 0.95, 1.05],
          duration: 18000,
          easing: "easeInOutSine",
          direction: "alternate",
          loop: true,
        })
      );
    }

    // Indigo Orb Floating (#6366F1)
    if (indigoOrbRef.current) {
      animations.push(
        anime({
          targets: indigoOrbRef.current,
          translateX: [30, -50, 40, -30],
          translateY: [40, -30, 30, -40],
          scale: [0.95, 1.2, 1, 1.1],
          duration: 22000,
          easing: "easeInOutSine",
          direction: "alternate",
          loop: true,
        })
      );
    }

    // Magenta Orb Floating (#D946EF)
    if (magentaOrbRef.current) {
      animations.push(
        anime({
          targets: magentaOrbRef.current,
          translateX: [-30, 40, -40, 20],
          translateY: [20, -40, 50, -20],
          scale: [1.1, 0.9, 1.15, 1],
          duration: 20000,
          easing: "easeInOutSine",
          direction: "alternate",
          loop: true,
        })
      );
    }

    return () => {
      animations.forEach((anim) => {
        anim.pause();
        anime.remove(anim.animatables.map((a) => a.target));
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[#070913] z-0">
      {/* Ambient Radial Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#070913] to-[#070913] opacity-80" />

      {/* Subtle Noise / Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Floating Ambient Glowing Orbs */}
      <div className="relative w-full h-full">
        {/* Cyan Orb (#22D3EE) */}
        <div
          ref={cyanOrbRef}
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] rounded-full bg-[#22D3EE]/20 blur-[120px] sm:blur-[140px]"
        />

        {/* Indigo Orb (#6366F1) */}
        <div
          ref={indigoOrbRef}
          className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-[#6366F1]/25 blur-[130px] sm:blur-[160px]"
        />

        {/* Magenta Orb (#D946EF) */}
        <div
          ref={magentaOrbRef}
          className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] rounded-full bg-[#D946EF]/20 blur-[110px] sm:blur-[140px]"
        />
      </div>
    </div>
  );
}
