"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [contact, setContact] = useState("");
  const [channel, setChannel] = useState<"email" | "phone" | "">("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const res = await fetch("/api/verify/send", {
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
    setChannel(data.channel);
    setContact(data.contact);
    setSent(true);
    setInfo(`Code sent to ${data.contact}.`);
  }

  // Auto-send once if we arrived here straight from signup with ?email=...
  useEffect(() => {
    if (searchParams.get("email") && !sent) {
      sendCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function confirmCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/verify/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "That code didn't work.");
      return;
    }
    router.push("/login?verified=1");
  }

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-semibold text-3xl mb-2">Verify your account</h1>
      <p className="text-inkSoft mb-8 text-sm">
        Enter the code we sent to confirm it&apos;s really you.
      </p>

      {!sent ? (
        <form onSubmit={sendCode} className="flex flex-col gap-4">
          <div>
            <label className="label">Email</label>
            <input required type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p className="text-laterite text-sm">{error}</p>}
          <button disabled={loading} className="btn-gold justify-center">
            {loading ? "Sending…" : "Send verification code"}
          </button>
        </form>
      ) : (
        <form onSubmit={confirmCode} className="flex flex-col gap-4">
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
          {error && <p className="text-laterite text-sm">{error}</p>}
          <button disabled={loading} className="btn-gold justify-center">
            {loading ? "Checking…" : "Verify account"}
          </button>
          <button type="button" onClick={() => sendCode()} className="text-sm text-laterite font-semibold">
            Resend code
          </button>
        </form>
      )}

      <p className="text-sm text-inkSoft mt-6">
        Already verified? <Link href="/login" className="text-laterite font-semibold">Sign in</Link>
      </p>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}
