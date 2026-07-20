"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const tagOptions = ["Early riser", "Night reader", "Quiet", "Social", "Tidy", "Non-smoker", "Cooks often"];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    level: "100L",
    faculty: "Sciences",
    gender: "F",
    budget: "",
    bio: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name ?? "",
          phone: data.phone ?? "",
          level: data.level ?? "100L",
          faculty: data.faculty ?? "Sciences",
          gender: data.gender ?? "F",
          budget: data.budget?.toString() ?? "",
          bio: data.bio ?? "",
        });
        setTags(data.tags ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []);
        setLoading(false);
      });
  }, []);

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, budget: Number(form.budget) || null, tags: tags.join(",") }),
    });
    setSaved(true);
  }

  if (loading) return <main className="max-w-2xl mx-auto px-6 py-14 text-inkSoft">Loading…</main>;

  const isStudent = session?.user.role === "STUDENT";

  return (
    <main className="max-w-2xl mx-auto px-6 py-14">
      <h1 className="font-display font-semibold text-3xl mb-2">Your profile</h1>
      <p className="text-inkSoft mb-8 text-sm">
        {isStudent ? "This is what other students see on the roommate finder." : "Basic account details."}
      </p>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Full name</label>
          <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">WhatsApp / phone number</label>
          <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 08031234567" />
          <p className="text-xs text-inkSoft mt-1">Shown on your listings or roommate card so people can chat you directly.</p>
        </div>

        {isStudent && (
          <>
            <div>
              <label className="label">Level</label>
              <select className="field" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                {["100L", "200L", "300L", "400L", "500L"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Faculty</label>
              <select className="field" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })}>
                {["Sciences", "Technology", "Arts", "Social Sciences", "Law"].map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="F">Female</option>
                <option value="M">Male</option>
              </select>
            </div>
            <div>
              <label className="label">Budget per session (₦)</label>
              <input type="number" className="field" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="150000" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Short bio</label>
              <textarea className="field" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell future roommates a bit about you…" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Lifestyle tags</label>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((t) => (
                  <label key={t} className={`text-sm px-3.5 py-2 rounded-full border cursor-pointer ${tags.includes(t) ? "bg-indigo900 text-paper border-indigo900" : "border-ink/15 text-inkSoft"}`}>
                    <input type="checkbox" className="hidden" checked={tags.includes(t)} onChange={() => toggleTag(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {saved && <p className="text-sm text-laterite sm:col-span-2">Saved.</p>}
        <button className="btn-gold justify-center sm:col-span-2">Save profile</button>
      </form>
    </main>
  );
}
