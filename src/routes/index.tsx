import { createFileRoute, Link, getRouteApi } from "@tanstack/react-router";
import { ArrowRight, Percent, Plane, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SearchWidget } from "@/components/travel/SearchWidget";
import { PackageCard } from "@/components/travel/PackageCard";
import { DestinationCard } from "@/components/travel/DestinationCard";
import { TrustSection } from "@/components/travel/TrustSection";
import { CardSkeleton, SectionHeading } from "@/components/travel/Bits";
import { Button } from "@/components/ui/button";
import { useCatalog, useStore } from "@/data/store";
import { img } from "@/data/images";
import heroImage from "@/assets/hero.jpg";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Voar Brasil | Pacotes de viagem, hotéis e voos em até 12x" },
      {
        name: "description",
        content:
          "Pesquise pacotes, hotéis e voos para Porto Seguro, Maceió, Rio de Janeiro, Gramado e mais de 10 destinos. Ofertas com até 35% de desconto e parcelamento sem juros.",
      },
      { property: "og:title", content: "Voar Brasil | Pacotes de viagem, hotéis e voos" },
      {
        property: "og:description",
        content: "Ofertas de pacotes nacionais com hotel, voo e traslado inclusos. Parcele em até 12x sem juros.",
      },
    ],
  }),
  component: Home,
});

const rootRoute = getRouteApi("__root__");

function Home() {
  const { ready } = useStore();
  const { packages, destinations, hotels, banners, destinationBySlug, hotelBySlug } = useCatalog();
  const offers = packages.filter((p) => p.featured).slice(0, 6);
  
  const { settings } = rootRoute.useLoaderData();
  const banner = settings?.bannerBase64 || settings?.banner_base64 || settings?.BANNERBASE64;
  const heroBg = banner && banner.length > 100 ? banner : heroImage;

  return (
    <SiteLayout>
      {/* HERO / PROMO BANNER */}
      <section className="relative bg-primary">
        {heroBg !== heroImage ? (
          // Layout quando há um banner promocional (como o flyer do Rio)
          <div className="container-page pb-8 pt-4 md:pt-8 flex flex-col md:flex-row gap-8 items-center">
            {/* Texto / Buscador na esquerda */}
            <div className="flex-1 text-primary-foreground space-y-6 w-full">
              <div>
                <span className="inline-block bg-highlight text-highlight-foreground px-3 py-1 text-sm font-bold uppercase rounded-full mb-4">
                  🔥 Oferta Exclusiva
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                  Viaje mais. Pague menos. Viva o melhor!
                </h1>
                <p className="text-primary-foreground/90 text-lg">
                  Aproveite nossa promoção relâmpago. Garanta já a sua viagem com tudo incluso e pague em até 12x sem juros.
                </p>
              </div>
              <div className="w-full">
                <SearchWidget />
              </div>
            </div>
            
            {/* Poster / Banner na direita (clicável para o checkout) */}
            <div className="w-full md:w-[400px] flex-shrink-0 group relative shadow-2xl rounded-2xl overflow-hidden border-4 border-highlight transition-transform hover:-translate-y-2">
              <Link to="/checkout/rio-de-janeiro-promo-casal" className="block focus:outline-none">
                <img 
                  src={heroBg} 
                  alt="Promoção exclusiva" 
                  className="w-full h-auto object-cover"
                />
                {/* Sobreposição de hover para incentivar o clique */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                   <div className="opacity-0 group-hover:opacity-100 bg-highlight text-highlight-foreground font-bold px-6 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                      Ir para o Checkout →
                   </div>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          // Layout padrão se não houver banner promocional (hero default)
          <div className="relative isolate">
            <img
              src={heroBg}
              alt="Imagem de destaque da loja"
              width={1920}
              height={1080}
              className="absolute inset-0 -z-10 size-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-hero" aria-hidden="true" />
            <div className="container-page pb-8 pt-12 md:pb-14 md:pt-20">
              <div className="max-w-2xl text-primary-foreground">
                <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur">
                  <Sparkles className="size-3.5 text-highlight" aria-hidden="true" />
                  Mais de 320 mil viajantes atendidos
                </p>
                <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
                  Sua próxima viagem começa com o melhor preço do Brasil
                </h1>
                <p className="mt-3 max-w-xl text-sm text-primary-foreground/85 md:text-base">
                  Pacotes com voo, hotel e traslado, hotéis auditados e voos nacionais. Reserve em minutos e pague em até
                  12x sem juros.
                </p>
              </div>
              <div className="mt-6 md:mt-8">
                <SearchWidget />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* FAIXA DE MARCA */}
      <section aria-label="Nossa promessa" className="bg-highlight text-highlight-foreground">
        <div className="container-page flex flex-col gap-4 py-7 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-2xl font-extrabold leading-tight md:text-3xl">
            Pra toda viagem. <span className="block md:inline">Pra vida toda.</span>
          </p>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-bold md:grid-cols-4 md:text-base">
            <li>+320 mil viajantes</li>
            <li>12x sem juros</li>
            <li>Hotéis auditados</li>
            <li>Suporte 24h</li>
          </ul>
        </div>
      </section>

      {/* BANNERS / CAMPANHAS */}
      <section aria-label="Campanhas em destaque" className="container-page -mt-2 py-10 md:py-14">

        <div className="grid gap-4 md:grid-cols-3">
          {banners.slice(0, 3).map((b) => (
            <article key={b.id} className="hover-lift group relative overflow-hidden rounded-2xl border border-border">
              <img
                src={img(b.image)}
                alt={b.title}
                loading="lazy"
                width={960}
                height={640}
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-card-fade" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-lg font-extrabold text-primary-foreground">{b.title}</h3>
                <p className="mt-1 text-sm text-primary-foreground/85">{b.subtitle}</p>
                <Link
                  to={b.link as "/ofertas"}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-highlight hover:underline"
                >
                  {b.cta} <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* OFERTAS */}
      <section aria-labelledby="ofertas-home" className="container-page py-4 md:py-8">
        <h2 id="ofertas-home" className="sr-only">
          Ofertas para você viajar mais
        </h2>
        <SectionHeading
          eyebrow="Ofertas da semana"
          title="Ofertas para você viajar mais"
          description="Pacotes completos com voo, hospedagem e traslado. Preços por pessoa em apartamento duplo."
          action={
            <Button asChild variant="outline">
              <Link to="/ofertas">
                <Percent aria-hidden="true" /> Ver todas as ofertas
              </Link>
            </Button>
          }
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {!ready
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : offers.map((p) => (
                <PackageCard
                  key={p.id}
                  pkg={p}
                  hotel={hotelBySlug(p.hotelSlug)}
                  destination={destinationBySlug(p.destinationSlug)}
                />
              ))}
        </div>
      </section>

      {/* DESTINOS */}
      <section aria-labelledby="destinos-home" className="container-page py-14 md:py-20">
        <h2 id="destinos-home" className="sr-only">
          Destinos em destaque
        </h2>
        <SectionHeading
          eyebrow="Destinos em destaque"
          title="Para onde os brasileiros estão viajando"
          description="Praias, serra e cidades com estrutura completa para famílias, casais e viagens de negócios."
          action={
            <Button asChild variant="ghost">
              <Link to="/destinos">
                Todos os destinos <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.slice(0, 2).map((d) => (
            <div key={d.id} className="sm:col-span-1 lg:col-span-2">
              <DestinationCard destination={d} tall />
            </div>
          ))}
          {destinations.slice(2, 10).map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </section>

      {/* VOOS */}
      <section className="bg-secondary py-14 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Passagens aéreas"
            title="Voos nacionais com as principais companhias"
            description="Compare tarifas de Azul, GOL e LATAM e adicione hotel para economizar até 22% no pacote."
            action={
              <Button asChild>
                <Link to="/voos">
                  <Plane aria-hidden="true" /> Buscar voos
                </Link>
              </Button>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packages.slice(0, 4).map((p) => {
              const dest = destinationBySlug(p.destinationSlug);
              return (
                <Link
                  key={p.id}
                  to="/pacotes/$slug"
                  params={{ slug: p.slug }}
                  className="surface-card hover-lift block p-4"
                >
                  <p className="text-xs font-semibold text-muted-foreground">{p.origin}</p>
                  <p className="mt-1 font-display text-lg font-extrabold">{dest?.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.flight.airline} • {p.flight.stops === 0 ? "voo direto" : "1 conexão"}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">Ida e volta a partir de</p>
                  <p className="font-display text-xl font-extrabold text-primary">{brl(Math.round(p.price * 0.55))}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOTÉIS */}
      <section className="container-page py-14 md:py-20">
        <SectionHeading
          eyebrow="Hotéis e resorts"
          title="Hospedagens auditadas pela nossa equipe"
          description="Visitamos e reavaliamos cada parceiro a cada temporada para garantir o padrão prometido."
          action={
            <Button asChild variant="outline">
              <Link to="/hoteis">Ver todos os hotéis</Link>
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.slice(0, 4).map((h) => (
            <Link
              key={h.id}
              to="/hoteis/$slug"
              params={{ slug: h.slug }}
              className="surface-card hover-lift group overflow-hidden"
            >
              <img
                src={img(h.image)}
                alt={h.name}
                loading="lazy"
                width={960}
                height={640}
                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-4">
                <p className="text-sm font-bold">{h.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {h.stars} estrelas • {h.board}
                </p>
                <p className="mt-2 text-sm font-semibold text-primary">Diária desde {brl(h.nightPrice)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <TrustSection />
    </SiteLayout>
  );
}
