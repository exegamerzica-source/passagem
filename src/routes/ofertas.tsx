import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ResultsExplorer } from "@/components/travel/ResultsExplorer";
import { useCatalog } from "@/data/store";
import { img } from "@/data/images";

export const Route = createFileRoute("/ofertas")({
  head: () => ({
    meta: [
      { title: "Ofertas de viagem com até 35% de desconto | Voar Brasil" },
      {
        name: "description",
        content:
          "Ofertas de pacotes com desconto real, hotéis auditados e parcelamento em até 12x sem juros. Vagas limitadas por saída.",
      },
      { property: "og:title", content: "Ofertas para você viajar mais | Voar Brasil" },
      { property: "og:description", content: "Pacotes em promoção com voo, hotel e traslado inclusos." },
    ],
  }),
  component: Ofertas,
});

function Ofertas() {
  const { banners, coupons } = useCatalog();

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/60 py-10">
        <div className="container-page">
          <nav aria-label="Trilha de navegação" className="mb-3 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Início
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="font-semibold text-foreground">Ofertas</span>
          </nav>
          <h1 className="text-3xl font-extrabold md:text-4xl">Ofertas para você viajar mais</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Preços por pessoa em apartamento duplo, com voo, hospedagem e traslado. Sujeito a disponibilidade.
          </p>

          {coupons.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {coupons.map((c) => (
                <li
                  key={c.id}
                  className="rounded-full border border-dashed border-highlight bg-card px-3 py-1.5 text-xs font-bold text-highlight"
                >
                  {c.code} — {c.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {banners.length > 0 && (
        <section aria-label="Campanhas ativas" className="container-page pt-8">
          <div className="grid gap-4 md:grid-cols-3">
            {banners.map((b) => (
              <article key={b.id} className="relative overflow-hidden rounded-2xl border border-border">
                <img
                  src={img(b.image)}
                  alt={b.title}
                  loading="lazy"
                  width={960}
                  height={640}
                  className="h-36 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-card-fade" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h2 className="text-base font-extrabold text-primary-foreground">{b.title}</h2>
                  <p className="text-xs text-primary-foreground/85">{b.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-8">
        <ResultsExplorer onlyOffers initialSort="menor-preco" />
      </section>
    </SiteLayout>
  );
}
