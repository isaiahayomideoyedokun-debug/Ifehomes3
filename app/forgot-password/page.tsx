"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/reset-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Couldn't send the code.");
      return;
    }
    setInfo(`Code sent to ${email}.`);
    setStep("reset");
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Couldn't reset your password.");
      return;
    }
    router.push("/login?reset=1");
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-semibold text-3xl mb-2">Reset your password</h1>
      <p className="text-inkSoft mb-8 text-sm">
        {step === "request"
          ? "Enter your account email and we'll send you a code."
          : "Enter the code and choose a new password."}
      </p>

      {step === "request" ? (
        <form onSubmit={requestCode} className="flex flex-col gap-4">
          <div>
            <label className="label">Email</label>
            <input required type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p className="text-laterite text-sm">{error}</p>}
          <button disabled={loading} className="btn-gold justify-center">
            {loading ? "Sending…" : "Send reset code"}
          </button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="flex flex-col gap-4">
          {info && <p className="text-sm text-inkSoft">{info}</p>}
          <div>
            <label className="label">6-digit code</label>
            <input
              required
              maxLength={6}
              inputMode="numeric"
              className="field text-center tracking-[0.5em] text-lg"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
            />
          </div>
          <div>
            <label className="label">New password</label>
            <div className="relative">
              <input
                required
                minLength={6}
                type={showPassword ? "text" : "password"}
                className="field pr-16"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-inkSoft"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="text-laterite text-sm">{error}</p>}
          <button disabled={loading} className="btn-gold justify-center">
            {loading ? "Saving…" : "Reset password"}
          </button>
          <button type="button" onClick={() => setStep("request")} className="text-sm text-laterite font-semibold">
            Use a different email
          </button>
        </form>
      )}

      <p className="text-sm text-inkSoft mt-6">
        Remembered it? <Link href="/login" className="text-laterite font-semibold">Sign in</Link>
      </p>
    </main>
  );
}