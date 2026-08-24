import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Search, Tag, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCatalog } from "@/data/store";
import { ORIGINS, type SearchTab } from "@/lib/search";
import { cn } from "@/lib/utils";

interface Props {
  initial?: Partial<{
    tab: SearchTab;
    origem: string;
    destino: string;
    ida: string;
    volta: string;
    viajantes: number;
    quartos: number;
    cupom: string;
  }>;
  variant?: "hero" | "inline";
}

const TAB_LABELS: { value: SearchTab; label: string }[] = [
  { value: "pacotes", label: "Pacotes" },
  { value: "hoteis", label: "Hotéis" },
  { value: "voos", label: "Voos" },
  { value: "passeios", label: "Passeios" },
];

export function SearchWidget({ initial, variant = "hero" }: Props) {
  const navigate = useNavigate();
  const { destinations } = useCatalog();
  const [tab, setTab] = useState<SearchTab>(initial?.tab ?? "pacotes");
  const [origem, setOrigem] = useState(initial?.origem ?? ORIGINS[0] ?? "");
  const [destino, setDestino] = useState(initial?.destino ?? "");
  const [ida, setIda] = useState(initial?.ida ?? "");
  const [volta, setVolta] = useState(initial?.volta ?? "");
  const [viajantes, setViajantes] = useState(String(initial?.viajantes ?? 2));
  const [quartos, setQuartos] = useState(String(initial?.quartos ?? 1));
  const [cupom, setCupom] = useState(initial?.cupom ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showFlightFields = tab !== "hoteis";
  const showRooms = tab === "pacotes" || tab === "hoteis";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ida && volta && volta < ida) {
      setError("A data de volta precisa ser posterior à data de ida.");
      return;
    }
    setError(null);
    setLoading(true);
    navigate({
      to: "/busca",
      search: {
        tab,
        origem: showFlightFields ? origem : "",
        destino,
        ida,
        volta,
        viajantes: Number(viajantes),
        quartos: Number(quartos),
        cupom: cupom.toUpperCase(),
        ordenar: "relevancia",
      },
    }).finally(() => setLoading(false));
  };

  return (
    <section
      aria-label="Pesquisar viagens"
      className={cn(
        "w-full rounded-2xl border border-border bg-card p-4 shadow-lift md:p-5",
        variant === "hero" && "backdrop-blur",
      )}
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as SearchTab)}>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary p-1">
          {TAB_LABELS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-lg px-4 py-2 text-sm font-semibold data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <form onSubmit={submit} className="mt-4 grid gap-3 lg:grid-cols-12">
        {showFlightFields && (
          <div className="lg:col-span-3">
            <Label htmlFor="origem" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
              <MapPin className="size-3.5 text-primary" aria-hidden="true" /> Origem
            </Label>
            <Select value={origem} onValueChange={setOrigem}>
              <SelectTrigger id="origem" className="h-11">
                <SelectValue placeholder="Escolha o aeroporto" />
              </SelectTrigger>
              <SelectContent>
                {ORIGINS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className={showFlightFields ? "lg:col-span-3" : "lg:col-span-4"}>
          <Label htmlFor="destino" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
            <MapPin className="size-3.5 text-highlight" aria-hidden="true" /> Destino
          </Label>
          <Input
            id="destino"
            list="lista-destinos"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Para onde você quer ir?"
            className="h-11"
            autoComplete="off"
          />
          <datalist id="lista-destinos">
            {destinations.map((d) => (
              <option key={d.slug} value={`${d.name}, ${d.uf}`} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:col-span-3">
          <div>
            <Label htmlFor="ida" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
              <CalendarDays className="size-3.5 text-primary" aria-hidden="true" /> Ida
            </Label>
            <Input id="ida" type="date" value={ida} onChange={(e) => setIda(e.target.value)} className="h-11" />
          </div>
          <div>
            <Label htmlFor="volta" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
              <CalendarDays className="size-3.5 text-primary" aria-hidden="true" /> Volta
            </Label>
            <Input id="volta" type="date" value={volta} onChange={(e) => setVolta(e.target.value)} className="h-11" />
          </div>
        </div>

        <div className={cn("grid gap-3", showRooms ? "grid-cols-2 lg:col-span-2" : "lg:col-span-2")}>
          <div>
            <Label htmlFor="viajantes" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
              <Users className="size-3.5 text-primary" aria-hidden="true" /> Viajantes
            </Label>
            <Select value={viajantes} onValueChange={setViajantes}>
              <SelectTrigger id="viajantes" className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? "viajante" : "viajantes"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {showRooms && (
            <div>
              <Label htmlFor="quartos" className="mb-1.5 text-xs font-semibold">
                Quartos
              </Label>
              <Select value={quartos} onValueChange={setQuartos}>
                <SelectTrigger id="quartos" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "quarto" : "quartos"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <Label htmlFor="cupom" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
            <Tag className="size-3.5 text-highlight" aria-hidden="true" /> Código promocional
          </Label>
          <Input
            id="cupom"
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
            placeholder="Ex.: VOAR10"
            className="h-11 uppercase"
          />
        </div>

        <div className="flex items-end lg:col-span-9">
          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-end lg:col-span-3">
          <Button type="submit" variant="highlight" size="xl" className="w-full" disabled={loading}>
            <Search aria-hidden="true" />
            {loading ? "Pesquisando..." : "Pesquisar"}
          </Button>
        </div>
      </form>
    </section>
  );
}
