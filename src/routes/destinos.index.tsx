import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DestinationCard } from "@/components/travel/DestinationCard";
import { CardSkeleton } from "@/components/travel/Bits";
import { useCatalog, useStore } from "@/data/store";

export const Route = createFileRoute("/destinos/")({
  head: () => ({
    meta: [
      { title: "Destinos de viagem no Brasil | Voar Brasil" },
      {
        name: "description",
        content:
          "Conheça os destinos mais procurados do Brasil: Porto Seguro, Maceió, Rio de Janeiro, Gramado, Natal, Recife e mais, com pacotes a partir de R$ 899.",
      },
      { property: "og:title", content: "Destinos de viagem no Brasil | Voar Brasil" },
      { property: "og:description", content: "Praias, serra e grandes cidades com pacotes completos." },
    ],
  }),
  component: DestinosIndex,
});

function DestinosIndex() {
  const { ready } = useStore();
  const { destinations } = useCatalog();
  const regions = Array.from(new Set(destinations.map((d) => d.region)));

  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-brand py-10 text-primary-foreground">
        <div className="container-page">
          <nav aria-label="Trilha de navegação" className="mb-3 text-xs text-primary-foreground/70">
            <Link to="/" className="hover:text-highlight">
              Início
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="font-semibold">Destinos</span>
          </nav>
          <h1 className="text-3xl font-extrabold md:text-4xl">Destinos em destaque</h1>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80 md:text-base">
            {destinations.length} destinos nacionais com hotéis auditados, voos das principais companhias e roteiros
            prontos.
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        {!ready ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          regions.map((region) => (
            <section key={region} className="mb-12" aria-labelledby={`regiao-${region}`}>
              <h2 id={`regiao-${region}`} className="mb-4 text-xl font-extrabold">
                {region}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {destinations
                  .filter((d) => d.region === region)
                  .map((d) => (
                    <DestinationCard key={d.id} destination={d} />
                  ))}
              </div>
            </section>
          ))
        )}
      </div>
    </SiteLayout>
  );
}
