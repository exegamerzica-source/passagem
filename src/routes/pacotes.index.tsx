import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ResultsExplorer } from "@/components/travel/ResultsExplorer";

export const Route = createFileRoute("/pacotes/")({
  head: () => ({
    meta: [
      { title: "Pacotes de viagem nacionais com voo e hotel | Voar Brasil" },
      {
        name: "description",
        content:
          "Pacotes de viagem com voo, hotel, traslado e regime de alimentação inclusos. Compare mais de 12 roteiros nacionais e parcele em até 12x.",
      },
      { property: "og:title", content: "Pacotes de viagem nacionais | Voar Brasil" },
      {
        property: "og:description",
        content: "Voo + hotel + traslado nos principais destinos do Brasil, com filtros de preço e avaliação.",
      },
    ],
  }),
  component: PacotesIndex,
});

function PacotesIndex() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-brand py-10 text-primary-foreground">
        <div className="container-page">
          <nav aria-label="Trilha de navegação" className="mb-3 text-xs text-primary-foreground/70">
            <Link to="/" className="hover:text-highlight">
              Início
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="font-semibold text-primary-foreground">Pacotes</span>
          </nav>
          <h1 className="text-3xl font-extrabold md:text-4xl">Pacotes de viagem</h1>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80 md:text-base">
            Todos os pacotes incluem passagem aérea, hospedagem e assistência da nossa equipe. Use os filtros para
            encontrar o roteiro ideal.
          </p>
        </div>
      </section>

      <section className="container-page py-8">
        <ResultsExplorer />
      </section>
    </SiteLayout>
  );
}
