export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-slate-200 p-8">
      {children}
    </div>
  );
}
