"use client";
import { UseFormRegisterReturn } from "react-hook-form";

export default function CheckboxField({
  id,
  label,
  register,
}: {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-700 select-none" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
        {...register}
      />
      {label}
    </label>
  );
}
