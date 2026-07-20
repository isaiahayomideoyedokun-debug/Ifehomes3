"use client";

import Link from "next/link";
import { fmtNaira, csvToList } from "@/lib/utils";

const grads = [
  "from-indigo600 to-indigo900",
  "from-laterite to-[#8a3b21]",
  "from-gold to-goldDim",
  "from-indigo900 to-indigo950",
  "from-indigo300 to-indigo600",
];

export type ListingLite = {
  id: string;
  title: string;
  area: string;
  type: string;
  price: number;
  badge?: string | null;
  description?: string | null;
  amenities?: string | null;
  images?: string | null;
};

export default function ListingCard({
  listing,
  saved,
  onToggleSave,
  index = 0,
}: {
  listing: ListingLite;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  index?: number;
}) {
  const amenities = csvToList(listing.amenities).slice(0, 3);
  const firstImage = csvToList(listing.images)[0];
  const grad = grads[index % grads.length];

  return (
    <div className="bg-paper rounded-2xl overflow-hidden border border-ink/10 transition hover:-translate-y-1.5 hover:shadow-xl">
      <div
        className={`h-44 relative flex items-end p-3.5 bg-gradient-to-br ${firstImage ? "" : grad}`}
        style={firstImage ? { backgroundImage: `url(${firstImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
      >
        {onToggleSave && (
          <button
            onClick={() => onToggleSave(listing.id)}
            className={`absolute top-3.5 left-3.5 w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 ${saved ? "bg-paper text-laterite" : "bg-ink/55 text-paper"}`}
            aria-label="Save listing"
          >
            ♥
          </button>
        )}
        {listing.badge && (
          <span className="absolute top-3.5 right-3.5 bg-gold text-indigo950 text-[0.68rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {listing.badge}
          </span>
        )}
        <Link href={`/listings/${listing.id}`} className="bg-ink/80 text-paper font-mono text-sm px-3 py-1.5 rounded-lg">
          {fmtNaira(listing.price)} / session
        </Link>
      </div>
      <Link href={`/listings/${listing.id}`} className="block p-4">
        <h4 className="font-display font-semibold text-lg">{listing.title}</h4>
        <div className="text-inkSoft text-sm mt-1">{listing.area}</div>
        <div className="flex gap-3.5 mt-3 text-xs text-inkSoft flex-wrap">
          {amenities.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </div>
      </Link>
    </div>
  );
}
