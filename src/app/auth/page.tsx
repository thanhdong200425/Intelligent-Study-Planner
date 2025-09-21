"use client";

import React, { useState, useMemo, useCallback, FormEvent } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Facebook, Twitter } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  //Derived states (memoized)
  const isEmailValid = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);
  const isPasswordValid = useMemo(() => password.length >= 6, [password]);
  const canSubmit = isEmailValid && isPasswordValid;

  // Handlers (stable references) 
  const toggleShowPassword = useCallback(() => setShowPassword((s) => !s), []);
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSubmit) return;
      const payload = { email: email.trim(), password, remember };
      console.log(payload);
    
    },
    [canSubmit, email, password, remember]
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-slate-200 p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/studygo-high-resolution-logo-transparent.png"
            alt="StudyGo"
            width={120}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </div>

        <h1 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Login Or Sign Up
        </h1>

        <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                aria-invalid={!isEmailValid && email.length > 0}
                className="h-12 w-full rounded-full border border-slate-200 bg-white px-12 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder="••••••••••"
                autoComplete="current-password"
                aria-invalid={!isPasswordValid && password.length > 0}
                className="h-12 w-full rounded-full border border-slate-200 bg-white px-12 pr-12 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300"
              />

              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-3 inline-flex items-center justify-center rounded-full p-2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 select-none" htmlFor="remember">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.currentTarget.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
                />
                Remember Me
              </label>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Forgot Password
              </a>
            </div>
          </div>

          {/* Continue */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="group h-12 w-full rounded-full bg-slate-900 text-white text-[15px] font-semibold shadow-sm hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Divider */}
          <div className="relative py-2 text-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs tracking-wider text-slate-400">OR</span>
          </div>

          {/* Social buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="h-12 w-full rounded-full border border-slate-200 bg-white text-slate-800 text-[15px] font-semibold hover:bg-slate-50 flex items-center justify-center gap-3"
              onClick={() => console.log("Sign in with Facebook")}
              aria-label="Sign in with Facebook"
            >
              <Facebook size={18} />
              <span>Sign In With Facebook</span>
            </button>

            <button
              type="button"
              className="h-12 w-full rounded-full border border-slate-200 bg-white text-slate-800 text-[15px] font-semibold hover:bg-slate-50 flex items-center justify-center gap-3"
              onClick={() => console.log("Sign in with Twitter")}
              aria-label="Sign in with Twitter"
            >
              <Twitter size={18} />
              <span>Sign In With Twitter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
