"use client";

import { useEffect, useState } from "react";
import { fmtNaira } from "@/lib/utils";

type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  agentPaymentStatus: string;
  agentPaidAt: string | null;
};

export default function AdminPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch("/api/admin/agents")
      .then((r) => r.json())
      .then((data) => {
        setAgents(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function setPaid(agentId: string, status: "paid" | "unpaid") {
    await fetch("/api/admin/mark-paid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, status }),
    });
    load();
  }

  const pending = agents.filter((a) => a.agentPaymentStatus === "pending");
  const others = agents.filter((a) => a.agentPaymentStatus !== "pending");

  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="font-display font-semibold text-3xl mb-2">Agent payments</h1>
      <p className="text-inkSoft mb-8 text-sm">
        Annual plan: {fmtNaira(50000)}. Confirm the Opay transfer, then mark the agent as paid.
      </p>

      {loading ? (
        <p className="text-inkSoft">Loading…</p>
      ) : (
        <>
          <h2 className="font-semibold text-lg mb-3">Awaiting confirmation ({pending.length})</h2>
          {pending.length === 0 ? (
            <p className="text-inkSoft text-sm mb-8">No pending payments right now.</p>
          ) : (
            <div className="flex flex-col divide-y divide-ink/10 border border-ink/10 rounded-2xl overflow-hidden mb-10">
              {pending.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 gap-4 flex-wrap">
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-inkSoft text-sm">{a.email} {a.phone ? `· ${a.phone}` : ""}</div>
                  </div>
                  <button onClick={() => setPaid(a.id, "paid")} className="btn-gold !py-2 !px-4">
                    Mark as paid
                  </button>
                </div>
              ))}
            </div>
          )}

          <h2 className="font-semibold text-lg mb-3">All other agents ({others.length})</h2>
          <div className="flex flex-col divide-y divide-ink/10 border border-ink/10 rounded-2xl overflow-hidden">
            {others.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 gap-4 flex-wrap">
                <div>
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-inkSoft text-sm">{a.email} · {a.agentPaymentStatus}</div>
                </div>
                {a.agentPaymentStatus === "paid" ? (
                  <button onClick={() => setPaid(a.id, "unpaid")} className="btn-ghost !py-2 !px-4">
                    Revoke
                  </button>
                ) : (
                  <button onClick={() => setPaid(a.id, "paid")} className="btn-gold !py-2 !px-4">
                    Mark as paid
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
