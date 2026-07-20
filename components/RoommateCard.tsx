"use client";

import { fmtNaira, csvToList, initials } from "@/lib/utils";
import WhatsAppButton from "./WhatsAppButton";

export type RoommateLite = {
  id: string;
  name: string;
  level?: string | null;
  faculty?: string | null;
  gender?: string | null;
  budget?: number | null;
  tags?: string | null;
  bio?: string | null;
  phone?: string | null;
};

const avatarBgs = ["bg-gold", "bg-indigo300", "bg-laterite"];

export default function RoommateCard({
  roommate,
  saved,
  onToggleSave,
  index = 0,
}: {
  roommate: RoommateLite;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  index?: number;
}) {
  const tags = csvToList(roommate.tags);
  const bg = avatarBgs[index % avatarBgs.length];
  const textColor = bg === "bg-laterite" ? "text-white" : "text-indigo950";

  return (
    <div className="relative bg-indigo900 border border-paper/10 rounded-2xl p-5 transition hover:-translate-y-1.5 hover:border-gold">
      {onToggleSave && (
        <button
          onClick={() => onToggleSave(roommate.id)}
          className={`absolute top-4 right-4 text-sm ${saved ? "text-gold" : "text-indigo300"}`}
          aria-label="Save profile"
        >
          ♥
        </button>
      )}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-semibold ${bg} ${textColor}`}>
        {initials(roommate.name)}
      </div>
      <h4 className="text-paper font-semibold mt-4">{roommate.name}</h4>
      <div className="text-indigo300 text-sm mt-0.5">
        {roommate.level}{roommate.level && roommate.faculty ? ", " : ""}{roommate.faculty}
      </div>
      {roommate.bio && <p className="text-indigo300 text-xs mt-2 leading-relaxed">{roommate.bio}</p>}
      <div className="flex flex-wrap gap-1.5 mt-3.5">
        {tags.map((t) => (
          <span key={t} className="text-[0.7rem] px-2.5 py-1 rounded-full bg-paper/10 text-indigo300">
            {t}
          </span>
        ))}
      </div>
      {roommate.budget != null && (
        <div className="font-mono text-sm text-gold mt-4">{fmtNaira(roommate.budget)}/session</div>
      )}
      <WhatsAppButton
        phone={roommate.phone}
        message={`Hi ${roommate.name}, I saw your roommate profile on Ife Homes.`}
        className="mt-4 w-full flex justify-center text-center rounded-full border border-paper/25 text-paper text-sm py-2 hover:bg-paper hover:text-indigo950 transition"
      />
    </div>
  );
}
