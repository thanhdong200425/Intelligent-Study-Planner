"use client";
import { ArrowRight } from "lucide-react";

// components/auth/SubmitButton.tsx
export default function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="group h-12 w-full rounded-full bg-slate-900 text-white text-[15px] font-semibold shadow-sm hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed leading-none"
    >
      <span>{children}</span>
      <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
