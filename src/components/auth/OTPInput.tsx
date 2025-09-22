"use client";

import React, { useCallback, useMemo, useRef } from "react";

export type OTPInputProps = {
  length?: number;
  value: string[];
  onChange: (next: string[]) => void;
  onComplete?: (code: string) => void;
  inputClassName?: string;
  autoFocus?: boolean;
  name?: string;
};

export default function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  inputClassName = "",
  autoFocus = true,
  name = "one-time-code",
}: OTPInputProps) {
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
    () =>
      Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
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

  React.useEffect(() => {
    if (autoFocus) focusIndex(0);
  }, [autoFocus, focusIndex]);

  return <div className="flex justify-center gap-3">{inputs}</div>;
}
