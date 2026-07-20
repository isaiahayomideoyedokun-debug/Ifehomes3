export function fmtNaira(n: number | null | undefined): string {
  if (n === null || n === undefined) return "";
  return "₦" + Number(n).toLocaleString("en-NG");
}

export function typeLabel(t: string): string {
  const map: Record<string, string> = {
    selfcon: "Self-con",
    "1bed": "1 bedroom",
    "2bed": "2 bedroom",
    shared: "Shared room",
    studio: "Studio",
  };
  return map[t] || t;
}

export function csvToList(s: string | null | undefined): string[] {
  if (!s) return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Strips everything but digits and a leading "+" so a stored phone number
// becomes a valid wa.me link, e.g. "0803 123 4567" (Nigeria) -> "2348031234567".
export function toWhatsAppLink(phone: string | null | undefined, message?: string): string | null {
  if (!phone) return null;
  let digits = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (digits.startsWith("0")) digits = "234" + digits.slice(1); // assume Nigerian local format
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}
