"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-ink/10">
      <nav className="max-w-6xl mx-auto px-6 h-[76px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <span
            className="w-8 h-8 rounded-full inline-block"
            style={{
              background:
                "conic-gradient(from 210deg, #283569, #e8a33d 40%, #c1502e 70%, #283569)",
            }}
          />
          Ife Homes
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-inkSoft">
          <Link href="/listings" className="hover:text-ink">Apartments</Link>
          <Link href="/roommates" className="hover:text-ink">Roommates</Link>
          {session?.user.role === "AGENT" && (
            <>
              <Link href="/dashboard" className="hover:text-ink">My listings</Link>
              <Link href="/dashboard/billing" className="hover:text-ink">Billing</Link>
            </>
          )}
          {session && <Link href="/profile" className="hover:text-ink">Profile</Link>}
          {session?.user.isAdmin && <Link href="/admin" className="hover:text-ink">Admin</Link>}
        </div>

        <div className="flex items-center gap-3">
          {status === "loading" ? null : session ? (
            <>
              <span className="hidden sm:inline text-sm text-inkSoft">Hi, {session.user.name?.split(" ")[0]}</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-ghost !py-2 !px-4">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost !py-2 !px-4">Sign in</Link>
              <Link href="/signup" className="btn-gold !py-2 !px-4">Get started</Link>
            </>
          )}
          <button className="md:hidden text-xl" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-ink/10 px-6 py-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/listings" onClick={() => setOpen(false)}>Apartments</Link>
          <Link href="/roommates" onClick={() => setOpen(false)}>Roommates</Link>
          {session?.user.role === "AGENT" && (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>My listings</Link>
              <Link href="/dashboard/billing" onClick={() => setOpen(false)}>Billing</Link>
            </>
          )}
          {session && <Link href="/profile" onClick={() => setOpen(false)}>Profile</Link>}
          {session?.user.isAdmin && <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>}
        </div>
      )}
    </header>
  );
}
