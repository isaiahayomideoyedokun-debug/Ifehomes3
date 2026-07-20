"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { fmtNaira } from "@/lib/utils";
import type { ListingLite } from "@/components/ListingCard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<ListingLite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => {
        setListings(data.filter((l: any) => l.agentId === session.user.id));
        setLoading(false);
      });
  }, [session]);

  async function remove(id: string) {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    if (res.ok) setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <div className="flex justify-between items-end flex-wrap gap-4 mb-8">
        <h1 className="font-display font-semibold text-3xl">My listings</h1>
        <Link href="/listings/new" className="btn-gold">+ Upload a listing</Link>
      </div>

      {loading ? (
        <p className="text-inkSoft">Loading…</p>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-ink/20 rounded-2xl text-inkSoft">
          You haven&apos;t listed any apartments yet.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-ink/10 border border-ink/10 rounded-2xl overflow-hidden">
          {listings.map((l) => (
            <div key={l.id} className="flex items-center justify-between p-4 gap-4 flex-wrap">
              <div>
                <Link href={`/listings/${l.id}`} className="font-semibold hover:underline">{l.title}</Link>
                <div className="text-inkSoft text-sm">{l.area} · {fmtNaira(l.price)}/session</div>
              </div>
              <button onClick={() => remove(l.id)} className="text-laterite text-sm font-semibold">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
