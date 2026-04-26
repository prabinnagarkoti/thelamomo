"use client";
import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-amber-400" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifiedBanner, setVerifiedBanner] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      setVerifiedBanner("Email verified successfully! You can now sign in.");
    } else if (verified === "already") {
      setVerifiedBanner("Your email was already verified. Go ahead and sign in.");
    } else if (verified === "error") {
      const reason = searchParams.get("reason");
      if (reason === "invalid_token") {
        setError("Invalid or expired verification code. Please request a new one.");
      } else if (reason === "missing_token") {
        setError("Invalid verification.");
      } else {
        setError("Verification failed. Please try again.");
      }
    }
  }, [searchParams]);

  const needsVerification = error?.includes("verify your email");

  const resendVerification = async () => {
    if (!email) {
      setError("Enter your email above, then click resend.");
      return;
    }
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setError("");
      setVerifiedBanner(data.message || "Verification email sent!");
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setError("");
    setVerifiedBanner(null);
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

        {/* Verified Banner */}
        {verifiedBanner && (
          <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 mb-4 animate-fade-in">
            <span className="text-emerald-400 text-lg mt-0.5">
              <i className="fa-solid fa-circle-check" />
            </span>
            <p className="text-sm font-medium text-emerald-300">{verifiedBanner}</p>
          </div>
        )}

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
                {needsVerification && (
                  <button
                    type="button"
                    onClick={resendVerification}
                    disabled={resending}
                    className="mt-2 text-xs text-amber-300 hover:text-amber-200 underline transition"
                  >
                    {resending ? (
                      <><i className="fa-solid fa-spinner fa-spin mr-1" /> Sending...</>
                    ) : (
                      <><i className="fa-solid fa-rotate-right mr-1" /> Resend verification email</>
                    )}
                  </button>
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
