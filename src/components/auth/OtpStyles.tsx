// src/components/auth/OtpStyles.tsx

export const otpClassNames = {
  base: "w-full flex flex-col items-center",
  wrapper: "w-full flex justify-center gap-3",
  input:
    "w-12 h-14 rounded-xl border border-slate-300 bg-white " +
    "text-xl font-semibold text-slate-800 shadow-sm text-center " +
    "focus:outline-none focus:ring-2 focus:ring-slate-400 " +
    "[&:not(:placeholder-shown)]:border-slate-400",
  errorMessage: "text-center mt-2",
  description: "text-center",
};
