"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, UserPlus } from "lucide-react";
import { useClient } from "@/lib/store";
import { getApiUrl } from "@/lib/http";
import LoginForm from "@/components/auth/LoginForm";

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: "login" | "register";
  onClose: () => void;
}

export default function AuthModal({ isOpen, initialMode = "login", onClose }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { refreshUser } = useClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const normalizedEmail = email.trim().toLowerCase();
    const body = mode === "login" ? { email: normalizedEmail, password } : { email: normalizedEmail, password, name };

    try {
      const res = await fetch(getApiUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || "Authentication failed");
      }

      // Success: Refresh user state across application and redirect to dashboard
      await refreshUser();
      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative my-auto w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-lg border border-white/[0.10] bg-slate-900 p-6 sm:p-8 shadow-xl text-slate-100 z-[101]"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer z-20"
          >
            <X className="h-5 w-5" />
          </button>

          {mode === "login" ? (
            <LoginForm variant="modal" />
          ) : (
            <div>
              <div className="mb-5 sm:mb-6">
                <div className="mb-3 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-md bg-cyan-500 text-slate-950 shadow-sm">
                  <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Create Account</h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-400">
                  Join Backend Academy and start learning
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Dev"
                      autoCapitalize="words"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 sm:py-3 pl-11 sm:pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 sm:py-3 pl-11 sm:pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2.5 sm:py-3 pl-11 sm:pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center rounded-md bg-cyan-500 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-cyan-400 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError(null);
                    }}
                    className="text-xs font-medium text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
