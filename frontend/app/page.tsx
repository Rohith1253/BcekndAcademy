import React from "react";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Backend Academy | Master Backend Engineering",
  description:
    "Learn Node.js, TypeScript, REST APIs, Express, MongoDB, and Production Security through interactive lessons, quizzes, and real-time VM code challenges.",
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Dark Glowing Background Orbs */}
      <AnimatedBackground />

      <main className="relative z-10">
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  );
}
