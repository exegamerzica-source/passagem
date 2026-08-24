import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SearchWidget } from "@/components/travel/SearchWidget";
import { ResultsExplorer } from "@/components/travel/ResultsExplorer";
import { validateBuscaSearch } from "@/lib/search";

export const Route = createFileRoute("/busca")({
  validateSearch: validateBuscaSearch,
  head: () => ({
    meta: [
      { title: "Resultados da pesquisa | Voar Brasil" },
      {
        name: "description",
        content: "Compare pacotes de viagem com voo, hotel e traslado. Filtre por preço, estrelas, regime e duração.",
      },
      { property: "og:title", content: "Resultados da pesquisa | Voar Brasil" },
      { property: "og:description", content: "Pacotes filtrados por preço, avaliação, duração e companhia aérea." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Busca,
});

function Busca() {
  const search = Route.useSearch();

  return (
    <SiteLayout>
      <div className="border-b border-border bg-secondary/60 py-6">
        <div className="container-page">
          <nav aria-label="Trilha de navegação" className="mb-3 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Início
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="font-semibold text-foreground">Resultados</span>
          </nav>
          <SearchWidget initial={search} variant="inline" />
        </div>
      </div>

      <section className="container-page py-8">
        <h1 className="mb-6 text-2xl font-extrabold md:text-3xl">
          {search.destino ? `Viagens para ${search.destino}` : "Pacotes disponíveis"}
        </h1>
        <ResultsExplorer
          query={search.destino}
          origin={search.tab === "hoteis" ? "" : search.origem}
          travelers={search.viajantes}
          initialSort={search.ordenar}
        />
      </section>
    </SiteLayout>
  );
}
