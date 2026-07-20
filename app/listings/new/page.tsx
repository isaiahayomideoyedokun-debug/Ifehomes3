"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    area: "",
    type: "selfcon",
    price: "",
    badge: "",
    description: "",
    amenities: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        images: images.join(","),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    router.push(`/listings/${data.id}`);
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-14">
      <h1 className="font-display font-semibold text-3xl mb-2">Upload a listing</h1>
      <p className="text-inkSoft mb-8 text-sm">Add your apartment — it goes live for students right away.</p>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Title</label>
          <input required className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Self-contain, Road 1" />
        </div>
        <div>
          <label className="label">Area / location</label>
          <input required className="field" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. Road 1, near the main gate" />
        </div>
        <div>
          <label className="label">Room type</label>
          <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="selfcon">Self-contain</option>
            <option value="1bed">1 bedroom</option>
            <option value="2bed">2 bedroom</option>
            <option value="shared">Shared room</option>
            <option value="studio">Studio</option>
          </select>
        </div>
        <div>
          <label className="label">Price per session (₦)</label>
          <input required type="number" min={0} step={1000} className="field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="180000" />
        </div>
        <div>
          <label className="label">Badge (optional)</label>
          <select className="field" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
            <option value="">None</option>
            <option value="Verified">Verified</option>
            <option value="New">New</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea className="field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="5 min walk to OAU main gate, prepaid meter, tarred road…" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Amenities (comma separated)</label>
          <input className="field" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Ensuite, Prepaid meter, Parking" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Photos</label>
          <ImageUploader onUploaded={(url) => setImages((prev) => [...prev, url])} />
          {images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="w-20 h-20 object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>
        {error && <p className="text-laterite text-sm sm:col-span-2">{error}</p>}
        <button disabled={loading} className="btn-gold justify-center sm:col-span-2">
          {loading ? "Publishing…" : "Publish listing"}
        </button>
      </form>
    </main>
  );
}
