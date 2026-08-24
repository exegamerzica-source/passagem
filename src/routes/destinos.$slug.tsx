import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PackageCard } from "@/components/travel/PackageCard";
import { HotelCard } from "@/components/travel/HotelCard";
import { EmptyState, SectionHeading } from "@/components/travel/Bits";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/data/store";
import { img } from "@/data/images";
import { seedDestinations } from "@/data/seed";

export const Route = createFileRoute("/destinos/$slug")({
  loader: async ({ params }) => {
    const items = await getDestinations();
    const item = items.find((p: any) => p.slug === params.slug);
    if (!item) throw notFound();
    return { name: item.name, uf: item.uf };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Destino indisponível | Voar Brasil" }, { name: "robots", content: "noindex" }] };
    }
    const title = `Viagens para ${loaderData.name}, ${loaderData.uf} | Voar Brasil`;
    return {
      meta: [
        { title },
        { name: "description", content: `${loaderData.short} Pacotes com voo, hotel e traslado para ${loaderData.name}.` },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.short },
      ],
    };
  },
  component: DestinoDetalhe,
});

function DestinoDetalhe() {
  const { slug } = Route.useParams();
  const { destinationBySlug, packages, hotels, hotelBySlug } = useCatalog();
  const destination = destinationBySlug(slug);

  if (!destination) {
    return (
      <SiteLayout>
        <div className="container-page py-16">
          <EmptyState
            title="Destino não encontrado"
            description="Este destino pode ter sido desativado pelo administrador."
            action={
              <Button asChild>
                <Link to="/destinos">Ver todos os destinos</Link>
              </Button>
            }
          />
        </div>
      </SiteLayout>
    );
  }

  const destPackages = packages.filter((p) => p.destinationSlug === slug);
  const destHotels = hotels.filter((h) => h.destinationSlug === slug);

  return (
    <SiteLayout>
      <section className="relative isolate">
        <img
          src={img(destination.image)}
          alt={`${destination.name}, ${destination.uf}`}
          width={1920}
          height={720}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-hero" aria-hidden="true" />
        <div className="container-page py-16 text-primary-foreground md:py-24">
          <nav aria-label="Trilha de navegação" className="mb-3 text-xs text-primary-foreground/75">
            <Link to="/" className="hover:text-highlight">
              Início
            </Link>
            <span aria-hidden="true"> / </span>
            <Link to="/destinos" className="hover:text-highlight">
              Destinos
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="font-semibold">{destination.name}</span>
          </nav>
          <h1 className="text-3xl font-extrabold md:text-5xl">
            {destination.name}, {destination.uf}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-primary-foreground/85 md:text-base">{destination.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {destination.highlights.map((h) => (
              <li
                key={h}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold backdrop-blur"
              >
                <Check className="size-3.5 text-highlight" aria-hidden="true" /> {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-12">
        <SectionHeading
          eyebrow="Pacotes"
          title={`Pacotes para ${destination.name}`}
          description="Voo, hospedagem e traslado inclusos, com saídas garantidas."
        />
        {destPackages.length ? (
          <div className="space-y-4">
            {destPackages.map((p) => (
              <PackageCard key={p.id} pkg={p} layout="row" hotel={hotelBySlug(p.hotelSlug)} destination={destination} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Sem pacotes ativos para este destino"
            description="Nossos consultores podem montar um roteiro sob medida para você."
            action={
              <Button asChild variant="highlight">
                <Link to="/suporte">Falar com um consultor</Link>
              </Button>
            }
          />
        )}
      </section>

      {destHotels.length > 0 && (
        <section className="container-page pb-16">
          <SectionHeading eyebrow="Hospedagem" title={`Hotéis em ${destination.name}`} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destHotels.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
