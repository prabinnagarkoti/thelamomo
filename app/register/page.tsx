"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getPasswordStrength(password: string) {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  if (checks.length) score++;
  if (checks.uppercase) score++;
  if (checks.lowercase) score++;
  if (checks.number) score++;
  if (checks.special) score++;

  let label = "Too Weak";
  let color = "#ef4444";
  if (score >= 5) {
    label = "Very Strong";
    color = "#22c55e";
  } else if (score >= 4) {
    label = "Strong";
    color = "#3b82f6";
  } else if (score >= 3) {
    label = "Fair";
    color = "#f59e0b";
  } else if (score >= 2) {
    label = "Weak";
    color = "#f97316";
  }

  return { score, label, color, checks };
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (strength.score < 5) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4 py-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-3xl shadow-lg shadow-amber-500/30 mb-4">
            🍽️
          </div>
          <h1 className="font-display text-3xl font-bold">Create Account</h1>
          <p className="text-sm text-slate-400 mt-2">
            Join us to start ordering your favorite dishes
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="glass rounded-3xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-check text-2xl text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Account Created!</h2>
            <p className="text-sm text-slate-400">
              Redirecting you to sign in...
            </p>
          </div>
        ) : (
          /* Register Card */
          <form onSubmit={submit} className="glass rounded-3xl p-8 space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 animate-shake">
                <span className="text-rose-400 text-lg mt-0.5">
                  <i className="fa-solid fa-circle-exclamation" />
                </span>
                <p className="text-sm font-medium text-rose-300">{error}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 ml-1">Full name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <i className="fa-solid fa-user" />
                </span>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition placeholder:text-slate-600"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 ml-1">Email address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <i className="fa-solid fa-envelope" />
                </span>
                <input
                  id="register-email"
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
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  {/* Strength Bar */}
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            strength.score >= level ? strength.color : "rgba(148, 163, 184, 0.2)"
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label}
                  </p>

                  {/* Requirements Checklist */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                    <Requirement met={strength.checks.length} text="8+ characters" />
                    <Requirement met={strength.checks.uppercase} text="Uppercase (A-Z)" />
                    <Requirement met={strength.checks.lowercase} text="Lowercase (a-z)" />
                    <Requirement met={strength.checks.number} text="Number (0-9)" />
                    <Requirement met={strength.checks.special} text="Special char (!@#)" />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 ml-1">Confirm password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <i className="fa-solid fa-shield-halved" />
                </span>
                <input
                  id="register-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/30 transition placeholder:text-slate-600"
                  placeholder="••••••••"
                />
                {confirmPassword.length > 0 && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    {password === confirmPassword ? (
                      <i className="fa-solid fa-circle-check text-emerald-400" />
                    ) : (
                      <i className="fa-solid fa-circle-xmark text-rose-400" />
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-slate-950 rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/30 hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-amber-300 hover:text-amber-200 font-medium transition"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Requirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] transition-colors duration-200">
      <i
        className={`fa-solid ${met ? "fa-circle-check text-emerald-400" : "fa-circle text-slate-600"}`}
        style={{ fontSize: "10px" }}
      />
      <span className={met ? "text-slate-300" : "text-slate-500"}>{text}</span>
    </div>
  );
}
