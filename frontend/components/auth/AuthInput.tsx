"use client";

import React, { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string | null;
}

export default function AuthInput({
  label,
  icon,
  error,
  className = "",
  id,
  ...props
}: AuthInputProps) {
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
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-200 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
          className={`w-full rounded-xl bg-slate-950/60 border ${
            error
              ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-white/[0.12] hover:border-white/25 focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20"
          } py-3 ${
            icon ? "pl-11" : "pl-4"
          } pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:bg-slate-950/90 ${className}`}
        />
      </div>
      {error && (
        <p id={errorId} className="text-xs text-rose-400 font-medium pl-0.5 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}
