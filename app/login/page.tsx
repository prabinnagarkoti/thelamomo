"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      });
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-3xl shadow-lg shadow-amber-500/30 mb-4">
            🍽️
          </div>
          <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={submit}
          className="glass rounded-3xl p-8 space-y-5"
        >
          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 animate-shake">
              <span className="text-rose-400 text-lg mt-0.5">
                <i className="fa-solid fa-circle-exclamation" />
              </span>
              <div>
                <p className="text-sm font-medium text-rose-300">{error}</p>
                {error.includes("No account") && (
                  <p className="text-xs text-rose-400/70 mt-1">
                    Need an account?{" "}
                    <Link href="/register" className="underline text-rose-300 hover:text-rose-200">
                      Register here
                    </Link>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 ml-1">Email address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <i className="fa-solid fa-envelope" />
              </span>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition placeholder:text-slate-600"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <i className="fa-solid fa-lock" />
              </span>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/30 hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-spinner fa-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-amber-300 hover:text-amber-200 font-medium transition"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
