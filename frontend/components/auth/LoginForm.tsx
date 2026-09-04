"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import anime from "animejs";
import { Mail, Terminal, ArrowRight, Loader2, AlertCircle, User as UserIcon } from "lucide-react";
import { useClient, setClientAuthToken } from "@/lib/store";
import { getApiUrl } from "@/lib/http";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";

interface LoginFormProps {
  initialMode?: "login" | "register";
  onSuccessRedirect?: string;
  className?: string;
  variant?: "page" | "modal";
}

export default function LoginForm({
  initialMode = "login",
  onSuccessRedirect = "/dashboard",
  className = "",
  variant = "page",
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useClient();

  const urlMode = searchParams?.get("mode") === "register" ? "register" : initialMode;
  const [mode, setMode] = useState<"login" | "register">(urlMode);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("remember_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || !cardRef.current) return;

    const staggerElements = cardRef.current.querySelectorAll(".stagger-item");
    if (staggerElements.length === 0) return;

    const anim = anime({
      targets: staggerElements,
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(60, { start: 50 }),
      duration: 700,
      easing: "easeOutCubic",
    });

    return () => {
      anim.pause();
      anime.remove(staggerElements);
    };
  }, [mode]);

  const validateForm = (): boolean => {
    let isValid = true;
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setServerError(null);

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (mode === "register") {
      if (!trimmedName) {
        setNameError("Full name is required");
        isValid = false;
      } else if (trimmedName.length < 2) {
        setNameError("Name must be at least 2 characters");
        isValid = false;
      }
    }

    if (!trimmedEmail) {
      setEmailError("Email address is required");
      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmedEmail)
    ) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (mode === "register" && password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleButtonClickBounce = () => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || !submitButtonRef.current) return;

    anime({
      targets: submitButtonRef.current,
      scale: [1, 0.96, 1.02, 1],
      duration: 300,
      easing: "easeOutQuad",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleButtonClickBounce();

    if (loading || isSubmittingRef.current) return;
    if (!validateForm()) return;

    isSubmittingRef.current = true;
    setLoading(true);
    setServerError(null);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const normalizedEmail = email.trim().toLowerCase();
    const body =
      mode === "login"
        ? { email: normalizedEmail, password }
        : { email: normalizedEmail, password, name: name.trim() };

    try {
      const res = await fetch(getApiUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error || json.message || (mode === "login" ? "Invalid email or password" : "Registration failed")
        );
      }

      if (json.data?.token) {
        setClientAuthToken(json.data.token);
      }

      try {
        if (rememberMe) {
          localStorage.setItem("remember_email", normalizedEmail);
        } else {
          localStorage.removeItem("remember_email");
        }
      } catch {
        // Ignore storage errors
      }

      await refreshUser();

      const redirectParam = searchParams?.get("redirect");
      const isSafeInternalUrl =
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//") &&
        !redirectParam.includes(":\\") &&
        !redirectParam.includes("://");

      const destination = isSafeInternalUrl
        ? redirectParam
        : onSuccessRedirect;

      router.push(destination);
    } catch (err: any) {
      setServerError(
        err?.message || (mode === "login" ? "Failed to sign in. Please check your credentials." : "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setServerError(null);
  };

  const containerClasses =
    variant === "page"
      ? `w-full max-w-[440px] rounded-[24px] sm:rounded-[28px] border border-white/[0.12] bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden text-slate-100 ${className}`
      : `w-full text-slate-100 ${className}`;

  return (
    <div ref={cardRef} className={containerClasses}>
      {variant === "page" && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      )}

      <div className="stagger-item flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-slate-950 shadow-md shadow-cyan-500/20">
          <Terminal className="h-5 w-5 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
            Platform Security
          </span>
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Backend Learning Platform
          </h2>
        </div>
      </div>

      <div className="stagger-item mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {mode === "login" ? "Welcome back" : "Create Account"}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          {mode === "login"
            ? "Sign in to continue your learning journey."
            : "Join Backend Academy and start mastering backend engineering."}
        </p>
      </div>

      {serverError && (
        <div className="stagger-item mb-5 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 backdrop-blur-sm animate-fadeIn">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="stagger-item">
            <AuthInput
              label="Full Name"
              type="text"
              placeholder="Alex Dev"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              error={nameError}
              icon={<UserIcon className="w-4 h-4" />}
              autoCapitalize="words"
              autoComplete="name"
            />
          </div>
        )}

        <div className="stagger-item">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            error={emailError}
            icon={<Mail className="w-4 h-4" />}
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        <div className="stagger-item">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            error={passwordError}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {mode === "login" && (
          <div className="stagger-item flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-slate-950/80 text-cyan-400 focus:ring-cyan-500/30 focus:ring-offset-0 transition cursor-pointer"
              />
              <span className="group-hover:text-slate-200 transition-colors">
                Remember me
              </span>
            </label>

            <span
              title="Password reset is managed by system administrator"
              className="font-medium text-slate-500 cursor-not-allowed select-none"
            >
              Forgot password?
            </span>
          </div>
        )}

        <div className="stagger-item pt-2">
          <button
            ref={submitButtonRef}
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 p-px font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-cyan-500/35 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <div className="w-full h-full rounded-[11px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 py-3.5 px-6 text-sm text-slate-950 font-bold flex items-center justify-center gap-2 transition-all duration-300">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{mode === "login" ? "Signing in..." : "Creating Account..."}</span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign in" : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </div>
          </button>
        </div>

        <div className="stagger-item text-center pt-3 text-xs text-slate-400">
          <span>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
