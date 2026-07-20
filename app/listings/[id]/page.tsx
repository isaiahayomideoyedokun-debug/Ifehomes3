import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { fmtNaira, csvToList } from "@/lib/utils";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { agent: { select: { id: true, name: true, phone: true } } },
  });
  if (!listing) notFound();

  const amenities = csvToList(listing.amenities);
  const images = csvToList(listing.images);

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <div className="grid md:grid-cols-2 gap-3 mb-8">
        {images.length > 0 ? (
          images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt={listing.title} className="rounded-2xl w-full h-64 object-cover" />
          ))
        ) : (
          <div className="rounded-2xl w-full h-64 bg-gradient-to-br from-indigo600 to-indigo900" />
        )}
      </div>

      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="font-display font-semibold text-3xl">{listing.title}</h1>
          <p className="text-inkSoft mt-1">{listing.area}</p>
        </div>
        <div className="font-mono text-xl text-laterite">{fmtNaira(listing.price)} / session</div>
      </div>

      {listing.description && <p className="mt-6 leading-relaxed text-inkSoft">{listing.description}</p>}

      {amenities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {amenities.map((a) => (
            <span key={a} className="text-sm px-3 py-1.5 rounded-full bg-paperDim border border-ink/10">{a}</span>
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-ink/10 pt-6 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-inkSoft">Listed by <span className="font-semibold text-ink">{listing.agent.name}</span></div>
        <WhatsAppButton
          phone={listing.agent.phone}
          message={`Hi, I'm interested in "${listing.title}" on Ife Homes.`}
          label="Chat with agent on WhatsApp"
        />
      </div>
    </main>
  );
}
