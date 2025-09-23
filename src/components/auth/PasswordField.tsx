"use client";
import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

type PasswordFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: string;
};

const PasswordField = React.memo(
  React.forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
    {
      id = "password",
      placeholder = "••••••••••",
      register,
      error,
      className,
      // nếu cha không truyền, mặc định tốt cho login:
      autoComplete = "current-password",
      ...rest
    },
    ref
  ) {
    const [show, setShow] = React.useState(false);

    // Tách ref & props từ RHF
    const { ref: registerRef, ...regProps } = register;

    const base =
      "h-12 w-full rounded-full border border-slate-200 bg-white px-12 pr-12 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300";
    const inputClass = className ? `${base} ${className}` : base;

    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
          Password
        </label>

        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Lock size={18} className="text-slate-400" />
          </span>

          <input
            id={id}
            type={show ? "text" : "password"}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            className={inputClass}
            // props từ RHF (onChange, onBlur, name, v.v.)
            {...regProps}
            // merge ref của RHF với ref bên ngoài
            ref={(el) => {
              registerRef(el);
              if (typeof ref === "function") ref(el);
              else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
            }}
            {...rest}
          />

          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-3 inline-flex items-center justify-center rounded-full p-2 text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Nếu muốn hiện lỗi ngay trong component */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  })
);

export default PasswordField;
