"use client";

export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="text-center max-w-md p-8">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-exclamation-triangle text-2xl text-rose-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-400 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-xl text-sm font-semibold hover:brightness-110 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
