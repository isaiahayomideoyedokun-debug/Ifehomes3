import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-indigo950 text-paper py-24">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, transparent 0 34px, rgba(232,163,61,0.09) 35px 37px, transparent 38px), radial-gradient(circle at 82% 18%, transparent 0 30px, rgba(193,80,46,0.12) 31px 33px, transparent 34px), radial-gradient(circle at 25% 85%, transparent 0 26px, rgba(232,163,61,0.10) 27px 29px, transparent 30px)",
            backgroundSize: "220px 220px",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <span className="font-mono uppercase text-xs tracking-widest text-gold flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-gold" /> Ile-Ife · Road 1 to Sub
          </span>
          <h1 className="font-display font-semibold text-5xl md:text-7xl leading-[1.02] max-w-xl">
            Find your <em className="italic text-gold font-medium">Ife</em> home — and the roommate to share it with.
          </h1>
          <p className="max-w-lg mt-6 text-lg leading-relaxed text-indigo300">
            Ife Homes connects agents with verified rooms and flats near campus to students looking for a place — or a person to split rent with.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link href="/listings" className="btn-gold">Browse apartments →</Link>
            <Link href="/roommates" className="rounded-full border border-paper/30 px-6 py-3 text-sm font-semibold hover:bg-paper hover:text-indigo950 transition">
              Find a roommate
            </Link>
          </div>
        </div>
      </section>

      {/* FORK */}
      <section className="py-24 bg-paper">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-12">
            <span className="font-mono uppercase text-xs tracking-widest text-laterite">Two doors, one campus</span>
            <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3">
              Whichever way you're coming from, we've got a door open.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-[2px] bg-ink rounded-xl2 overflow-hidden">
            <div className="bg-indigo900 text-paper p-12">
              <span className="inline-block bg-gold text-indigo950 text-xs px-3 py-1 rounded-full mb-6 font-mono">For agents</span>
              <h3 className="font-display text-2xl mb-3">Upload a listing, reach students first.</h3>
              <p className="text-indigo300 max-w-sm leading-relaxed">
                Post your apartment once, add photos, price per session, and it's live to students hunting for rooms near campus.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-2 mt-7 font-bold text-sm">List your apartment →</Link>
            </div>
            <div className="bg-paper p-12">
              <span className="inline-block bg-laterite text-white text-xs px-3 py-1 rounded-full mb-6 font-mono">For students</span>
              <h3 className="font-display text-2xl mb-3">Search rooms, or search people.</h3>
              <p className="text-inkSoft max-w-sm leading-relaxed">
                Browse verified apartments by area and budget, or build a profile and get matched with roommates who fit.
              </p>
              <Link href="/roommates" className="inline-flex items-center gap-2 mt-7 font-bold text-sm">Find a roommate →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-paper border-t border-ink/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-14">
            <span className="font-mono uppercase text-xs tracking-widest text-laterite">Three steps, no agents&apos; agents</span>
            <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3">How Ife Homes works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              ["01", "Create an account", "Sign up as a student or an agent — takes less than a minute."],
              ["02", "Browse or list", "Search verified apartments and roommates, or publish your own listing."],
              ["03", "Message and move in", "Chat directly on the platform, agree terms, and move into your Ife home."],
            ].map(([idx, title, body]) => (
              <div key={idx}>
                <div className="font-mono text-laterite text-sm">{idx}</div>
                <h3 className="font-display text-xl mt-3">{title}</h3>
                <p className="text-inkSoft mt-2 leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-indigo950 text-indigo300 py-14">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <span className="font-display font-bold text-paper">Ife Homes</span>
          <span className="text-sm">© 2026 Ife Homes. Made for Ile-Ife.</span>
        </div>
      </footer>
    </main>
  );
}
