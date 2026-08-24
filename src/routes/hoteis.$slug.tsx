import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PackageCard } from "@/components/travel/PackageCard";
import { EmptyState, RatingBadge, SectionHeading, Stars } from "@/components/travel/Bits";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/data/store";
import { img } from "@/data/images";
import { seedHotels } from "@/data/seed";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/hoteis/$slug")({
  loader: async ({ params }) => {
    const items = await getHotels();
    const item = items.find((p: any) => p.slug === params.slug);
    if (!item) throw notFound();
    return { name: item.name, stars: item.stars, price: item.nightPrice };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Hotel indisponível | Voar Brasil" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — hotel ${loaderData.stars} estrelas | Voar Brasil`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description.slice(0, 155) },
      ],
    };
  },
  component: HotelDetalhe,
});

function HotelDetalhe() {
  const { slug } = Route.useParams();
  const { hotelBySlug, destinationBySlug, packages } = useCatalog();
  const hotel = hotelBySlug(slug);

  if (!hotel) {
    return (
      <SiteLayout>
        <div className="container-page py-16">
          <EmptyState
            title="Hotel não encontrado"
            description="Este hotel pode estar desativado no momento."
            action={
              <Button asChild>
                <Link to="/hoteis">Ver hotéis disponíveis</Link>
              </Button>
            }
          />
        </div>
      </SiteLayout>
    );
  }

  const destination = destinationBySlug(hotel.destinationSlug);
  const related = packages.filter((p) => p.hotelSlug === hotel.slug);

  return (
    <SiteLayout>
      <div className="container-page pt-6">
        <nav aria-label="Trilha de navegação" className="mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Início
          </Link>
          <span aria-hidden="true"> / </span>
          <Link to="/hoteis" className="hover:text-primary">
            Hotéis
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="font-semibold text-foreground">{hotel.name}</span>
        </nav>

        <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
          {hotel.gallery.slice(0, 4).map((g, i) => (
            <img
              key={`${g}-${i}`}
              src={img(g)}
              alt={`${hotel.name} — imagem ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              width={960}
              height={640}
              className={`w-full rounded-xl object-cover ${
                i === 0 ? "h-64 sm:col-span-2 sm:row-span-2 sm:h-full" : "h-32 sm:h-full"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">{hotel.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Stars value={hotel.stars} />
              <RatingBadge value={hotel.rating} reviews={hotel.reviews} />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" /> {hotel.address}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{hotel.description}</p>

            <h2 className="mt-8 text-lg font-bold">Comodidades</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {hotel.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="size-4 text-success" aria-hidden="true" /> {a}
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-lg font-bold">Política de cancelamento</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Cancelamento gratuito até 15 dias antes do check-in. Entre 14 e 7 dias, multa de 30% do valor total. A
              menos de 7 dias, sem reembolso do serviço de hospedagem.
            </p>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="surface-card p-5">
              <p className="text-xs text-muted-foreground">Diária a partir de</p>
              <p className="font-display text-3xl font-extrabold text-primary">{brl(hotel.nightPrice)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{hotel.board} • impostos inclusos</p>
              <Button asChild variant="highlight" size="lg" className="mt-4 w-full">
                <Link to="/busca" search={{ tab: "hoteis", destino: destination?.name ?? "", origem: "", ida: "", volta: "", viajantes: 2, quartos: 1, cupom: "", ordenar: "relevancia" }}>
                  Ver disponibilidade
                </Link>
              </Button>
              {destination && (
                <Button asChild variant="outline" className="mt-2 w-full">
                  <Link to="/destinos/$slug" params={{ slug: destination.slug }}>
                    Conhecer {destination.name}
                  </Link>
                </Button>
              )}
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="py-12">
            <SectionHeading eyebrow="Pacotes" title="Pacotes com este hotel" />
            <div className="space-y-4">
              {related.map((p) => (
                <PackageCard key={p.id} pkg={p} layout="row" hotel={hotel} destination={destination} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
