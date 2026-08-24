import { createFileRoute, Link } from "@tanstack/react-router";
import { Plane } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SearchWidget } from "@/components/travel/SearchWidget";
import { SectionHeading } from "@/components/travel/Bits";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/data/store";
import { brl, brlCents, dateBR } from "@/lib/format";

export const Route = createFileRoute("/voos")({
  head: () => ({
    meta: [
      { title: "Passagens aéreas nacionais | Voar Brasil" },
      {
        name: "description",
        content:
          "Compare passagens aéreas de Azul, GOL e LATAM para os principais destinos do Brasil e economize adicionando hotel ao seu voo.",
      },
      { property: "og:title", content: "Passagens aéreas nacionais | Voar Brasil" },
      { property: "og:description", content: "Tarifas de voos nacionais com opção de pacote voo + hotel." },
    ],
  }),
  component: Voos,
});

function Voos() {
  const { packages, destinationBySlug } = useCatalog();

  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-brand py-10 text-primary-foreground">
        <div className="container-page">
          <nav aria-label="Trilha de navegação" className="mb-3 text-xs text-primary-foreground/70">
            <Link to="/" className="hover:text-highlight">
              Início
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="font-semibold">Voos</span>
          </nav>
          <h1 className="text-3xl font-extrabold md:text-4xl">Passagens aéreas</h1>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80 md:text-base">
            Buscamos tarifas em tempo real nas principais companhias aéreas nacionais. Combine com hotel e economize até
            22%.
          </p>
          <div className="mt-6">
            <SearchWidget initial={{ tab: "voos" }} variant="inline" />
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <SectionHeading
          eyebrow="Tarifas em destaque"
          title="Rotas mais procuradas nesta semana"
          description="Valores de ida e volta por pessoa, taxas inclusas, sujeitos a disponibilidade."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => {
            const dest = destinationBySlug(p.destinationSlug);
            const fare = Math.round(p.price * 0.55);
            return (
              <article key={p.id} className="surface-card hover-lift flex flex-col p-5">
                <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Plane className="size-3.5 text-primary" aria-hidden="true" /> {p.flight.airline} •{" "}
                  {p.flight.stops === 0 ? "voo direto" : "1 conexão"}
                </p>
                <h3 className="mt-2 font-display text-lg font-extrabold">
                  {p.origin.split(" (")[0]} → {dest?.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {dateBR(p.departure)} • ida {p.flight.outbound.split(" → ")[0]} / volta{" "}
                  {p.flight.inbound.split(" → ")[0]}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{p.flight.baggage}</p>
                <div className="mt-auto pt-4">
                  <p className="text-xs text-muted-foreground">Ida e volta por pessoa</p>
                  <p className="font-display text-2xl font-extrabold text-primary">{brl(fare)}</p>
                  <p className="text-xs text-muted-foreground">
                    Em até 10x de {brlCents(fare / 10)} sem juros
                  </p>
                  <Button asChild variant="highlight" className="mt-3 w-full">
                    <Link to="/pacotes/$slug" params={{ slug: p.slug }}>
                      Ver voo + hotel
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}
