"use client";
import { Mail } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

export default function InputWithIcon({
  id,
  placeholder,
  register,
  error,
  autoComplete = "on",
  inputMode,
}: {
  id: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
        Email Address
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Mail size={18} className="text-slate-400" />
        </span>
        <input
          id={id}
          type="email"
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={!!error}
          className="h-12 w-full rounded-full border border-slate-200 bg-white px-12 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300"
          {...register}
        />
      </div>
    </div>
  );
}
