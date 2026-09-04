"use client";

import React, { useState, InputHTMLAttributes } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

export default function PasswordInput({
  label = "Password",
  error,
  className = "",
  id,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={inputId}
        className="block text-xs font-semibold tracking-wide text-slate-300 uppercase select-none"
      >
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-200 pointer-events-none">
          <Lock className="w-4 h-4" />
        </div>
        <input
          id={inputId}
          type={showPassword ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
          className={`w-full rounded-xl bg-slate-950/60 border ${
            error
              ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-white/[0.12] hover:border-white/25 focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20"
          } py-3 pl-11 pr-11 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:bg-slate-950/90 ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors duration-200 p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && (
        <p id={errorId} className="text-xs text-rose-400 font-medium pl-0.5 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}
