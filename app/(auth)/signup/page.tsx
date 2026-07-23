"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PHONE_VERIFY_ENABLED = process.env.NEXT_PUBLIC_ENABLE_PHONE_VERIFY === "true";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "AGENT">("STUDENT");
  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role, verifyChannel: channel }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      router.push(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-semibold text-3xl mb-2">Create your account</h1>
      <p className="text-inkSoft mb-8 text-sm">Join Ife Homes as a student or an agent.</p>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setRole("STUDENT")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border ${role === "STUDENT" ? "bg-indigo900 text-paper border-indigo900" : "border-ink/15 text-inkSoft"}`}
        >
          I&apos;m a student
        </button>
        <button
          type="button"
          onClick={() => setRole("AGENT")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border ${role === "AGENT" ? "bg-indigo900 text-paper border-indigo900" : "border-ink/15 text-inkSoft"}`}
        >
          I&apos;m an agent
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Full name</label>
          <input required className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input required type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">WhatsApp / phone number</label>
          <input
            required
            type="tel"
            className="field"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="e.g. 08031234567"
          />
          <p className="text-xs text-inkSoft mt-1">
            Shown on your listings or roommate card so people can chat you directly on WhatsApp.
          </p>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input required minLength={6} type={showPassword ? "text" : "password"} className="field pr-16" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-inkSoft"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label className="label">How should we send your verification code?</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border ${channel === "email" ? "bg-indigo900 text-paper border-indigo900" : "border-ink/15 text-inkSoft"}`}
            >
              Email
            </button>
            {PHONE_VERIFY_ENABLED && (
              <button
                type="button"
                onClick={() => setChannel("phone")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border ${channel === "phone" ? "bg-indigo900 text-paper border-indigo900" : "border-ink/15 text-inkSoft"}`}
              >
                Phone (SMS)
              </button>
            )}
          </div>
        </div>

        {error && <p className="text-laterite text-sm">{error}</p>}
        <button disabled={loading} className="btn-gold justify-center mt-2">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-inkSoft mt-6">
        Already have an account? <Link href="/login" className="text-laterite font-semibold">Sign in</Link>
      </p>
    </main>
  );
}