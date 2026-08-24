import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HotelCard } from "@/components/travel/HotelCard";
import { EmptyState } from "@/components/travel/Bits";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCatalog } from "@/data/store";
import { slugify } from "@/lib/format";

export const Route = createFileRoute("/hoteis/")({
  head: () => ({
    meta: [
      { title: "Hotéis e resorts no Brasil | Voar Brasil" },
      {
        name: "description",
        content:
          "Reserve hotéis e resorts auditados em Porto Seguro, Maceió, Rio de Janeiro, Gramado e outros destinos, com café da manhã ou all inclusive.",
      },
      { property: "og:title", content: "Hotéis e resorts no Brasil | Voar Brasil" },
      { property: "og:description", content: "Hospedagens avaliadas por hóspedes reais, com diárias a partir de R$ 285." },
    ],
  }),
  component: HoteisIndex,
});

function HoteisIndex() {
  const { hotels, destinations } = useCatalog();
  const [q, setQ] = useState("");
  const [dest, setDest] = useState("todos");

  const list = hotels.filter(
    (h) =>
      (dest === "todos" || h.destinationSlug === dest) &&
      (!q || slugify(`${h.name} ${h.address}`).includes(slugify(q))),
  );

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/60 py-10">
        <div className="container-page">
          <nav aria-label="Trilha de navegação" className="mb-3 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Início
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="font-semibold text-foreground">Hotéis</span>
          </nav>
          <h1 className="text-3xl font-extrabold md:text-4xl">Hotéis e resorts</h1>
          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_16rem]">
            <div>
              <Label htmlFor="busca-hotel" className="mb-1.5 text-xs font-semibold">
                Buscar por nome ou endereço
              </Label>
              <Input
                id="busca-hotel"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ex.: Oceano Palace"
                className="h-11 bg-card"
              />
            </div>
            <div>
              <Label htmlFor="filtro-destino" className="mb-1.5 text-xs font-semibold">
                Destino
              </Label>
              <Select value={dest} onValueChange={setDest}>
                <SelectTrigger id="filtro-destino" className="h-11 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os destinos</SelectItem>
                  {destinations.map((d) => (
                    <SelectItem key={d.slug} value={d.slug}>
                      {d.name}, {d.uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <p className="mb-4 text-sm font-semibold" aria-live="polite">
          {list.length} hotéis encontrados
        </p>
        {list.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum hotel encontrado"
            description="Ajuste a busca ou selecione outro destino."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQ("");
                  setDest("todos");
                }}
              >
                Limpar busca
              </Button>
            }
          />
        )}
      </section>
    </SiteLayout>
  );
}
