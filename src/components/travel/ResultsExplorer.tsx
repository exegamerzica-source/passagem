import { useEffect, useMemo, useState } from "react";
import { defaultFilters, FilterDrawer, FilterPanel, type FilterState } from "./Filters";
import { PackageCard } from "./PackageCard";
import { CardSkeleton, EmptyState } from "./Bits";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCatalog, useStore } from "@/data/store";
import type { TravelPackage } from "@/data/types";
import { slugify } from "@/lib/format";

interface Props {
  /** texto digitado na pesquisa (destino) */
  query?: string;
  origin?: string;
  travelers?: number;
  onlyOffers?: boolean;
  initialSort?: string;
  heading?: string;
}

const hourOf = (outbound: string) => Number(outbound.slice(0, 2));

const inPeriod = (outbound: string, periods: string[]) => {
  if (!periods.length) return true;
  const h = hourOf(outbound);
  return periods.some((p) =>
    p.startsWith("Manhã") ? h < 12 : p.startsWith("Tarde") ? h >= 12 && h < 18 : h >= 18,
  );
};

export function ResultsExplorer({ query = "", origin = "", travelers = 2, onlyOffers, initialSort = "relevancia" }: Props) {
  const { ready } = useStore();
  const { packages, destinations, hotelBySlug, destinationBySlug } = useCatalog();
  const priceCeiling = useMemo(() => Math.max(3000, ...packages.map((p) => p.price)), [packages]);
  const [filters, setFilters] = useState<FilterState>(() => defaultFilters(priceCeiling));
  const [sort, setSort] = useState(initialSort);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(t);
  }, [query, origin, sort, filters]);

  const options = useMemo(
    () => ({
      destinos: destinations.map((d) => ({ value: d.slug, label: `${d.name}, ${d.uf}` })),
      categorias: ["Praia", "Serra", "Cidade", "Resort"],
      boards: ["All inclusive", "Meia pensão", "Café da manhã", "Pensão completa"],
      airlines: Array.from(new Set(packages.map((p) => p.flight.airline))),
      priceCeiling,
    }),
    [destinations, packages, priceCeiling],
  );

  const filtered = useMemo(() => {
    const q = slugify(query.split(",")[0] ?? "");
    let list: TravelPackage[] = packages.filter((p) => {
      const hotel = hotelBySlug(p.hotelSlug);
      const dest = destinationBySlug(p.destinationSlug);
      if (q && !(`${slugify(dest?.name ?? "")} ${slugify(p.title)}`.includes(q))) return false;
      if (origin && p.origin !== origin) return false;
      if (onlyOffers && p.oldPrice <= p.price) return false;
      if (p.price > filters.priceMax) return false;
      if (filters.destinos.length && !filters.destinos.includes(p.destinationSlug)) return false;
      if (filters.categorias.length && !filters.categorias.includes(p.category)) return false;
      if (filters.estrelas.length && !filters.estrelas.includes(hotel?.stars ?? 0)) return false;
      if (filters.ratingMin && (hotel?.rating ?? 0) < filters.ratingMin) return false;
      if (filters.boards.length && !filters.boards.includes(p.board)) return false;
      if (p.nights > filters.nightsMax) return false;
      if (filters.airlines.length && !filters.airlines.includes(p.flight.airline)) return false;
      if (!inPeriod(p.flight.outbound, filters.periods)) return false;
      if (filters.transferOnly && !p.transfer) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      const ha = hotelBySlug(a.hotelSlug)?.rating ?? 0;
      const hb = hotelBySlug(b.hotelSlug)?.rating ?? 0;
      switch (sort) {
        case "menor-preco":
          return a.price - b.price;
        case "maior-preco":
          return b.price - a.price;
        case "avaliacao":
          return hb - ha;
        case "duracao":
          return b.nights - a.nights;
        default:
          return Number(b.featured) - Number(a.featured) || a.price - b.price;
      }
    });
    return list;
  }, [packages, query, origin, onlyOffers, filters, sort, hotelBySlug, destinationBySlug]);

  const panelProps = { value: filters, onChange: setFilters, options, resultCount: filtered.length };

  return (
    <div className="grid gap-6 lg:grid-cols-[19rem_1fr]">
      <aside className="hidden lg:block">
        <div className="surface-card sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto p-4">
          <FilterPanel {...panelProps} />
        </div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold" aria-live="polite">
            {loading ? "Buscando as melhores tarifas..." : `${filtered.length} pacotes encontrados`}
            {travelers > 1 && !loading && (
              <span className="ml-1 font-normal text-muted-foreground">para {travelers} viajantes</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <FilterDrawer {...panelProps} />
            <Label htmlFor="ordenar" className="hidden text-xs font-semibold sm:block">
              Ordenar por
            </Label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger id="ordenar" className="h-10 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Relevância</SelectItem>
                <SelectItem value="menor-preco">Menor preço</SelectItem>
                <SelectItem value="maior-preco">Maior preço</SelectItem>
                <SelectItem value="avaliacao">Melhor avaliação</SelectItem>
                <SelectItem value="duracao">Maior duração</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading || !ready ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nenhum pacote encontrado"
            description="Tente ampliar o preço máximo, remover filtros de estrelas ou escolher outro destino próximo."
            action={
              <Button variant="outline" onClick={() => setFilters(defaultFilters(priceCeiling))}>
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((p) => (
              <PackageCard
                key={p.id}
                pkg={p}
                layout="row"
                hotel={hotelBySlug(p.hotelSlug)}
                destination={destinationBySlug(p.destinationSlug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
