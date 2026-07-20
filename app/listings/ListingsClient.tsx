"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ListingCard, { ListingLite } from "@/components/ListingCard";

const budgetOptions = [
  { label: "Any budget", min: "", max: "" },
  { label: "Under ₦150,000", min: "0", max: "150000" },
  { label: "₦150,000 – ₦300,000", min: "150000", max: "300000" },
  { label: "₦300,000+", min: "300000", max: "" },
];
const typeOptions = [
  { label: "Any type", value: "any" },
  { label: "Self-contain", value: "selfcon" },
  { label: "1 bedroom", value: "1bed" },
  { label: "2 bedroom", value: "2bed" },
  { label: "Shared room", value: "shared" },
  { label: "Studio", value: "studio" },
];

export default function ListingsClient() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<ListingLite[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState(0);
  const [type, setType] = useState("any");
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const b = budgetOptions[budget];
    const params = new URLSearchParams();
    if (area.trim()) params.set("area", area.trim());
    if (type !== "any") params.set("type", type);
    if (b.min) params.set("minPrice", b.min);
    if (b.max) params.set("maxPrice", b.max);
    const res = await fetch(`/api/listings?${params.toString()}`);
    const data = await res.json();
    setListings(data);
    setLoading(false);
  }, [area, budget, type]);

  // Debounce the free-text location search so it doesn't fire on every keystroke.
  useEffect(() => {
    const t = setTimeout(fetchListings, 350);
    return () => clearTimeout(t);
  }, [fetchListings]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/saved-listings")
      .then((r) => r.json())
      .then((data) => setSavedIds(data.map((l: ListingLite) => l.id)));
  }, [session]);

  async function toggleSave(id: string) {
    if (!session) {
      window.location.href = "/login";
      return;
    }
    const res = await fetch("/api/saved-listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: id }),
    });
    const data = await res.json();
    setSavedIds((prev) => (data.saved ? [...prev, id] : prev.filter((x) => x !== id)));
  }

  return (
    <main className="bg-paperDim min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex justify-between items-end flex-wrap gap-5 mb-8">
          <div>
            <span className="font-mono uppercase text-xs tracking-widest text-laterite">Fresh on the market</span>
            <h1 className="font-display font-semibold text-3xl mt-2">Apartments near campus</h1>
          </div>
          {session?.user.role === "AGENT" && (
            <Link href="/listings/new" className="btn-ghost">+ Upload a listing</Link>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <input
            className="field !w-auto min-w-[220px]"
            placeholder="Search by location, e.g. Road 1, Mayfair…"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <select className="field !w-auto" value={budget} onChange={(e) => setBudget(Number(e.target.value))}>
            {budgetOptions.map((b, i) => (
              <option key={b.label} value={i}>{b.label}</option>
            ))}
          </select>
          <select className="field !w-auto" value={type} onChange={(e) => setType(e.target.value)}>
            {typeOptions.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-inkSoft">Loading listings…</p>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-ink/20 rounded-2xl text-inkSoft">
            No apartments match those filters yet. Try widening your search.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l, i) => (
              <ListingCard key={l.id} listing={l} saved={savedIds.includes(l.id)} onToggleSave={toggleSave} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
