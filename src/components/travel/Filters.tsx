import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { brl } from "@/lib/format";

export interface FilterState {
  priceMax: number;
  destinos: string[];
  categorias: string[];
  estrelas: number[];
  ratingMin: number;
  boards: string[];
  nightsMax: number;
  airlines: string[];
  periods: string[];
  transferOnly: boolean;
}

export const defaultFilters = (priceCeiling: number): FilterState => ({
  priceMax: priceCeiling,
  destinos: [],
  categorias: [],
  estrelas: [],
  ratingMin: 0,
  boards: [],
  nightsMax: 14,
  airlines: [],
  periods: [],
  transferOnly: false,
});

interface Options {
  destinos: { value: string; label: string }[];
  categorias: string[];
  boards: string[];
  airlines: string[];
  priceCeiling: number;
}

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
  options: Options;
  resultCount: number;
}

const PERIODS = ["Manhã (até 12h)", "Tarde (12h — 18h)", "Noite (após 18h)"];

function toggle<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-4 last:border-0">
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Check({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal text-muted-foreground">
        {label}
      </Label>
    </div>
  );
}

export function FilterPanel({ value, onChange, options, resultCount }: Props) {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-bold">Filtros</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(defaultFilters(options.priceCeiling))}
          className="text-xs"
        >
          <X aria-hidden="true" /> Limpar
        </Button>
      </div>
      <p aria-live="polite" className="pb-2 text-xs text-muted-foreground">
        {resultCount} resultados com os filtros atuais
      </p>

      <Group title="Preço por pessoa">
        <Slider
          value={[value.priceMax]}
          min={500}
          max={options.priceCeiling}
          step={50}
          onValueChange={([v]) => set({ priceMax: v ?? value.priceMax })}
          aria-label="Preço máximo por pessoa"
        />
        <p className="text-xs text-muted-foreground">Até {brl(value.priceMax)}</p>
      </Group>

      <Group title="Destino">
        {options.destinos.map((d) => (
          <Check
            key={d.value}
            id={`dest-${d.value}`}
            label={d.label}
            checked={value.destinos.includes(d.value)}
            onChange={() => set({ destinos: toggle(value.destinos, d.value) })}
          />
        ))}
      </Group>

      <Group title="Categoria">
        {options.categorias.map((c) => (
          <Check
            key={c}
            id={`cat-${c}`}
            label={c}
            checked={value.categorias.includes(c)}
            onChange={() => set({ categorias: toggle(value.categorias, c) })}
          />
        ))}
      </Group>

      <Group title="Estrelas do hotel">
        {[5, 4, 3].map((s) => (
          <Check
            key={s}
            id={`star-${s}`}
            label={`${s} estrelas`}
            checked={value.estrelas.includes(s)}
            onChange={() => set({ estrelas: toggle(value.estrelas, s) })}
          />
        ))}
      </Group>

      <Group title="Avaliação dos hóspedes">
        {[
          { v: 9, l: "Excelente (9+)" },
          { v: 8.5, l: "Muito bom (8,5+)" },
          { v: 8, l: "Bom (8+)" },
        ].map((o) => (
          <Check
            key={o.v}
            id={`rating-${o.v}`}
            label={o.l}
            checked={value.ratingMin === o.v}
            onChange={() => set({ ratingMin: value.ratingMin === o.v ? 0 : o.v })}
          />
        ))}
      </Group>

      <Group title="Regime de alimentação">
        {options.boards.map((b) => (
          <Check
            key={b}
            id={`board-${b}`}
            label={b}
            checked={value.boards.includes(b)}
            onChange={() => set({ boards: toggle(value.boards, b) })}
          />
        ))}
      </Group>

      <Group title="Duração">
        <Slider
          value={[value.nightsMax]}
          min={2}
          max={14}
          step={1}
          onValueChange={([v]) => set({ nightsMax: v ?? value.nightsMax })}
          aria-label="Duração máxima em noites"
        />
        <p className="text-xs text-muted-foreground">Até {value.nightsMax} noites</p>
      </Group>

      <Group title="Companhia aérea">
        {options.airlines.map((a) => (
          <Check
            key={a}
            id={`air-${a}`}
            label={a}
            checked={value.airlines.includes(a)}
            onChange={() => set({ airlines: toggle(value.airlines, a) })}
          />
        ))}
      </Group>

      <Group title="Horário do voo de ida">
        {PERIODS.map((p) => (
          <Check
            key={p}
            id={`per-${p}`}
            label={p}
            checked={value.periods.includes(p)}
            onChange={() => set({ periods: toggle(value.periods, p) })}
          />
        ))}
      </Group>

      <Group title="Localização e serviços">
        <Check
          id="transfer"
          label="Somente com traslado incluso"
          checked={value.transferOnly}
          onChange={() => set({ transferOnly: !value.transferOnly })}
        />
      </Group>
    </div>
  );
}

export function FilterDrawer(props: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal aria-hidden="true" /> Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Filtrar resultados</SheetTitle>
        </SheetHeader>
        <div className="mt-2">
          <FilterPanel {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
