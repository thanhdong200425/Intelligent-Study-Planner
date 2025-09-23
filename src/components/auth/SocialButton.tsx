"use client";
import React from "react";

type SocialButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  ariaLabel?: string;
};

const SocialButton = React.memo(
  React.forwardRef<HTMLButtonElement, SocialButtonProps>(function SocialButton(
    { icon, children, className, ariaLabel, type = "button", ...rest },
    ref
  ) {
    const base =
      "h-12 w-full rounded-full border border-slate-200 bg-white text-slate-800 text-[15px] font-semibold hover:bg-slate-50 flex items-center justify-center gap-3";
    const cls = className ? `${base} ${className}` : base;

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        className={cls}
        {...rest}
      >
        {icon}
        <span>{children}</span>
      </button>
    );
  })
);

export default SocialButton;
