"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RoommateCard, { RoommateLite } from "@/components/RoommateCard";

const faculties = ["all", "Sciences", "Technology", "Arts", "Social Sciences", "Law"];
const budgetOptions = [
  { label: "Any budget", min: "", max: "" },
  { label: "Under ₦100,000", min: "0", max: "100000" },
  { label: "₦100,000 – ₦200,000", min: "100000", max: "200000" },
  { label: "₦200,000+", min: "200000", max: "" },
];
const genderOptions = [
  { label: "No preference", value: "any" },
  { label: "Female only", value: "F" },
  { label: "Male only", value: "M" },
];

export default function RoommatesClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [roommates, setRoommates] = useState<RoommateLite[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [faculty, setFaculty] = useState("all");
  const [budget, setBudget] = useState(0);
  const [gender, setGender] = useState("any");
  const [loading, setLoading] = useState(true);

  const fetchRoommates = useCallback(async () => {
    setLoading(true);
    const b = budgetOptions[budget];
    const params = new URLSearchParams();
    if (faculty !== "all") params.set("faculty", faculty);
    if (gender !== "any") params.set("gender", gender);
    if (b.min) params.set("minBudget", b.min);
    if (b.max) params.set("maxBudget", b.max);
    const res = await fetch(`/api/roommates?${params.toString()}`);
    const data = await res.json();
    setRoommates(data.filter((r: RoommateLite) => r.id !== session?.user.id));
    setLoading(false);
  }, [faculty, budget, gender, session?.user.id]);

  useEffect(() => {
    fetchRoommates();
  }, [fetchRoommates]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/saved-profiles")
      .then((r) => r.json())
      .then((data) => setSavedIds(data.map((p: RoommateLite) => p.id)));
  }, [session]);

  async function toggleSave(id: string) {
    if (!session) {
      router.push("/login");
      return;
    }
    const res = await fetch("/api/saved-profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: id }),
    });
    const data = await res.json();
    setSavedIds((prev) => (data.saved ? [...prev, id] : prev.filter((x) => x !== id)));
  }

  return (
    <main className="bg-indigo950 text-paper min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex justify-between items-end flex-wrap gap-5 mb-8">
          <div>
            <span className="font-mono uppercase text-xs tracking-widest text-gold">Split the rent, not the peace</span>
            <h1 className="font-display font-semibold text-3xl mt-2">Roommate profiles</h1>
          </div>
          {session?.user.role === "STUDENT" && (
            <a href="/profile" className="rounded-full border border-paper/25 px-6 py-3 text-sm font-semibold hover:bg-paper hover:text-indigo950 transition">
              + Edit your profile
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {faculties.map((f) => (
            <div
              key={f}
              onClick={() => setFaculty(f)}
              className={`px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition ${faculty === f ? "bg-gold text-indigo950 border-gold" : "border-paper/25 text-paper"}`}
            >
              {f === "all" ? "All faculties" : f}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <select className="field !w-auto !bg-indigo900 !text-paper !border-paper/20" value={budget} onChange={(e) => setBudget(Number(e.target.value))}>
            {budgetOptions.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
          </select>
          <select className="field !w-auto !bg-indigo900 !text-paper !border-paper/20" value={gender} onChange={(e) => setGender(e.target.value)}>
            {genderOptions.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="text-indigo300">Loading profiles…</p>
        ) : roommates.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-paper/20 rounded-2xl text-indigo300">
            No profiles match those filters yet. Try widening your search, or create your own.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {roommates.map((r, i) => (
              <RoommateCard key={r.id} roommate={r} saved={savedIds.includes(r.id)} onToggleSave={toggleSave} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
