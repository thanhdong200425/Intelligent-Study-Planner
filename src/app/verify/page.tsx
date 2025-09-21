"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Facebook, Twitter } from "lucide-react";

/**
 *  Divider 
 */
function Divider({ label = "OR" }: { label?: string }) {
  return (
    <div className="relative py-2 text-center mt-4 select-none" role="separator" aria-orientation="horizontal">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-200" />
      </div>
      <span className="relative bg-white px-3 text-xs tracking-wider text-slate-400">
        {label}
      </span>
    </div>
  );
}

/**
 * Social auth button
 */
const SocialButton = React.memo(function SocialButton({
  icon,
  children,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="h-12 w-full rounded-full border border-slate-200 bg-white text-slate-800 text-[15px] font-semibold hover:bg-slate-50 flex items-center justify-center gap-3"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
});

/**
 * Brand logo 
 */
function BrandLogo({ src = "/studygo-high-resolution-logo-transparent.png" }: { src?: string }) {
  return (
    <div className="flex justify-center mb-6">
      <Image
        src={src}
        alt="StudyGo"
        width={120}
        height={48}
        className="h-12 w-auto"
        priority
      />
    </div>
  );
}

/**
 * OTP input group 
 */
function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  inputClassName = "",
  autoFocus = true,
  name = "one-time-code",
}: {
  length?: number;
  value: string[];
  onChange: (next: string[]) => void;
  onComplete?: (code: string) => void;
  inputClassName?: string;
  autoFocus?: boolean;
  name?: string; 
}) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  
  const focusIndex = useCallback((idx: number) => {
    inputsRef.current[idx]?.focus();
    inputsRef.current[idx]?.select?.();
  }, []);

  const handleChange = useCallback(
    (i: number, raw: string) => {
      const digit = raw.replace(/\D/g, "").slice(-1);
      if (digit === value[i]) return; 

      const next = value.slice();
      next[i] = digit ?? "";
      onChange(next);

      
      if (digit && i < length - 1) focusIndex(i + 1);

      
      if (onComplete) {
        const joined = next.join("");
        if (joined.length === length && !joined.includes("")) onComplete(joined);
      }
    },
    [focusIndex, length, onChange, onComplete, value]
  );

  const handleKeyDown = useCallback(
    (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (!value[i] && i > 0) {
          const prev = i - 1;
          const next = value.slice();
          next[prev] = "";
          onChange(next);
          focusIndex(prev);
          e.preventDefault();
        }
        return;
      }
      if (e.key === "ArrowLeft" && i > 0) focusIndex(i - 1);
      if (e.key === "ArrowRight" && i < length - 1) focusIndex(i + 1);
      if (e.key === "Home") focusIndex(0);
      if (e.key === "End") focusIndex(length - 1);
    },
    [focusIndex, length, onChange, value]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (!text) return;
      const next = text.split("");
      while (next.length < length) next.push("");
      onChange(next);

      
      const lastFilled = Math.min(text.length, length) - 1;
      focusIndex(Math.max(0, lastFilled));
      e.preventDefault();

      if (onComplete && text.length === length) onComplete(text);
    },
    [focusIndex, length, onChange, onComplete]
  );

  
  const inputs = useMemo(
    () => Array.from({ length }).map((_, i) => (
      <input
        key={i}
        ref={(el) => { inputsRef.current[i] = el; }}
        inputMode="numeric"
        autoComplete={i === 0 ? name : "off"}
        aria-label={`Digit ${i + 1}`}
        value={value[i] ?? ""}
        onChange={(e) => handleChange(i, e.target.value)}
        onKeyDown={(e) => handleKeyDown(i, e)}
        onPaste={i === 0 ? handlePaste : undefined}
        className={
          "h-12 w-12 text-center text-lg font-semibold rounded-md border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 " +
          inputClassName
        }
      />
    )),
    [handleChange, handleKeyDown, handlePaste, inputClassName, length, name, value]
  );

  // Optional autofocus on mount
  React.useEffect(() => {
    if (autoFocus) focusIndex(0);
  }, [autoFocus, focusIndex]);

  return <div className="flex justify-center gap-3">{inputs}</div>;
}

/**
 * Submit button
 */
function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-8 group h-12 w-full rounded-full bg-slate-900 text-white text-[15px] font-semibold shadow-sm hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <span>{children}</span>
      <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/**
 * VERIFY CODE PAGE 
 */
export default function VerifyCodePage({
  email = "abc@gmail.com",
  length = 6,
}: {
  email?: string;
  length?: number;
}) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));

  const handleComplete = useCallback((fullCode: string) => {
   
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const value = code.join("");
      console.log("Verify code:", value);
    },
    [code]
  );

  const isFilled = useMemo(() => code.every((c) => c && c.length === 1), [code]);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-slate-200 p-8">
        <BrandLogo />

        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-slate-900 text-center">Please Check Your Email</h1>
          <p className="mt-4 text-slate-600 text-center">
            We’ve sent a code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 w-full">
          <OTPInput
            length={length}
            value={code}
            onChange={setCode}
            onComplete={handleComplete}
            inputClassName=""
          />

          <SubmitButton disabled={!isFilled}>Continue</SubmitButton>

          <Divider label="OR" />

          <div className="mt-3 space-y-3">
            <SocialButton icon={<Facebook size={18} />} onClick={() => console.log("Sign in with Facebook")}> 
              Sign In With Facebook
            </SocialButton>

            <SocialButton icon={<Twitter size={18} />} onClick={() => console.log("Sign in with Twitter")}> 
              Sign In With Twitter
            </SocialButton>
          </div>
        </form>
      </div>
    </div>
  );
}

