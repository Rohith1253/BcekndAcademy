"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import LoginForm from "@/components/auth/LoginForm";
import { useClient } from "@/lib/store";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useClient();

  useEffect(() => {
    if (!loading && user) {
      const redirectParam = searchParams?.get("redirect");
      const isSafeInternalUrl =
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//") &&
        !redirectParam.includes(":\\") &&
        !redirectParam.includes("://");

      const destination = isSafeInternalUrl ? redirectParam : "/dashboard";
      router.replace(destination);
    }
  }, [user, loading, router, searchParams]);

  if (loading || user) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <p className="text-xs font-medium tracking-wide uppercase text-slate-400">
          {user ? "Redirecting to Dashboard..." : "Checking Session..."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full flex justify-center items-center">
      <LoginForm />
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-[#070913]">
      {/* Animated Ambient Glowing Orbs Background */}
      <AnimatedBackground />

      {/* Centered Dark Glassmorphism Login Card Wrapped in Suspense */}
      <Suspense
        fallback={
          <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-slate-300">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs font-medium tracking-wide uppercase text-slate-400">
              Loading Interface...
            </p>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </main>
  );
}
