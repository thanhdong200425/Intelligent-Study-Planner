"use client";
export default function Divider({ label = "OR" }: { label?: string }) {
  return (
    <div className="relative py-2 text-center mt-4 select-none" role="separator" aria-orientation="horizontal">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-200" />
      </div>
      <span className="relative bg-white/80 backdrop-blur px-3 text-xs tracking-wider text-slate-400">{label}</span>
    </div>
  );
}
