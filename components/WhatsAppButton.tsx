"use client";

import { toWhatsAppLink } from "@/lib/utils";

export default function WhatsAppButton({
  phone,
  message,
  className,
  label = "Chat on WhatsApp",
}: {
  phone: string | null | undefined;
  message?: string;
  className?: string;
  label?: string;
}) {
  const href = toWhatsAppLink(phone, message);
  if (!href) {
    return <span className="text-sm text-inkSoft">No WhatsApp number on file yet.</span>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? "btn-gold"}
    >
      💬 {label}
    </a>
  );
}
