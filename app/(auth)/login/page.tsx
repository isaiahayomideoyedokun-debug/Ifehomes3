"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("verified") === "1";
  const justReset = searchParams.get("reset") === "1";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notVerified, setNotVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotVerified(false);
    setLoading(true);
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error === "not-verified") {
      setNotVerified(true);
      return;
    }
    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/listings");
    router.refresh();
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-semibold text-3xl mb-2">Welcome back</h1>
      <p className="text-inkSoft mb-8 text-sm">Sign in to your Ife Homes account.</p>

      {justVerified && (
        <p className="text-sm bg-paperDim border border-ink/10 rounded-lg px-4 py-3 mb-6">
          Your account is verified — sign in below.
        </p>
      )}
      {justReset && (
        <p className="text-sm bg-paperDim border border-ink/10 rounded-lg px-4 py-3 mb-6">
          Your password has been reset — sign in with your new password.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Email</label>
          <input required type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label !mb-0">Password</label>
            <Link href="/forgot-password" className="text-xs text-laterite font-semibold">Forgot password?</Link>
          </div>
          <div className="relative">
            <input required type={showPassword ? "text" : "password"} className="field pr-16" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
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
        {notVerified && (
          <p className="text-laterite text-sm">
            Please verify your account first —{" "}
            <Link href={`/verify?email=${encodeURIComponent(form.email)}`} className="font-semibold underline">
              verify it now
            </Link>.
          </p>
        )}
        <button disabled={loading} className="btn-gold justify-center mt-2">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-inkSoft mt-6">
        New to Ife Homes? <Link href="/signup" className="text-laterite font-semibold">Create an account</Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}