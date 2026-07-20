"use client";

import { useEffect, useState } from "react";

export default function BillingPage() {
  const [status, setStatus] = useState<string>("unpaid");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setStatus(data.agentPaymentStatus ?? "unpaid");
        setLoaded(true);
      });
  }, []);

  async function claimPayment() {
    setLoading(true);
    const res = await fetch("/api/billing/claim", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (res.ok) setStatus(data.status);
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-14">
      <h1 className="font-display font-semibold text-3xl mb-2">Agent plan</h1>
      <p className="text-inkSoft mb-8 text-sm">
        Listing apartments on Ife Homes runs on a simple annual plan.
      </p>

      <div className="bg-indigo950 text-paper rounded-2xl p-8">
        <div className="font-mono text-xs uppercase tracking-widest text-gold mb-2">Annual agent plan</div>
        <div className="font-display text-4xl font-semibold">₦50,000<span className="text-lg text-indigo300"> / year</span></div>
        <p className="text-indigo300 text-sm mt-3 leading-relaxed">
          Unlimited listings, a spot in the roommate-matched search results, and a direct
          WhatsApp link on every listing you publish.
        </p>
      </div>

      <div className="mt-8 border border-ink/10 rounded-2xl p-6">
        <h3 className="font-display font-semibold text-lg mb-3">How to pay</h3>
        <p className="text-inkSoft text-sm mb-4">
          Transfer ₦50,000 to the account below, then tap &quot;I&apos;ve made the transfer&quot;
          — your account will be activated once the payment is confirmed.
        </p>
        <div className="bg-paperDim rounded-xl p-4 text-sm flex flex-col gap-1.5 font-mono">
          <div><span className="text-inkSoft">Account number:</span> 8078307401</div>
          <div><span className="text-inkSoft">Account name:</span> Oyedokun Isaiah Ayomide</div>
          <div><span className="text-inkSoft">Bank:</span> Opay</div>
        </div>
      </div>

      {loaded && (
        <div className="mt-8">
          {status === "paid" ? (
            <p className="bg-paperDim border border-ink/10 rounded-lg px-4 py-3 text-sm font-semibold">
              ✅ Your plan is active — you can publish listings.
            </p>
          ) : status === "pending" ? (
            <p className="bg-paperDim border border-ink/10 rounded-lg px-4 py-3 text-sm">
              Payment marked as sent — you&apos;ll be able to list once it&apos;s confirmed.
            </p>
          ) : (
            <button onClick={claimPayment} disabled={loading} className="btn-gold w-full justify-center">
              {loading ? "Submitting…" : "I've made the transfer"}
            </button>
          )}
        </div>
      )}
    </main>
  );
}
