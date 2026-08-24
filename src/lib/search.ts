export type SearchTab = "pacotes" | "hoteis" | "voos" | "passeios";

export interface BuscaSearch {
  tab: SearchTab;
  origem: string;
  destino: string;
  ida: string;
  volta: string;
  viajantes: number;
  quartos: number;
  cupom: string;
  ordenar: string;
}

const TABS: SearchTab[] = ["pacotes", "hoteis", "voos", "passeios"];

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback: number) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

/** Validação tolerante: qualquer valor inválido na URL cai no padrão. */
export const validateBuscaSearch = (raw: Record<string, unknown>): BuscaSearch => ({
  tab: TABS.includes(str(raw['tab']) as SearchTab) ? (str(raw['tab']) as SearchTab) : "pacotes",
  origem: str(raw['origem']).slice(0, 60),
  destino: str(raw['destino']).slice(0, 60),
  ida: str(raw['ida']).slice(0, 10),
  volta: str(raw['volta']).slice(0, 10),
  viajantes: Math.min(9, num(raw['viajantes'], 2)),
  quartos: Math.min(5, num(raw['quartos'], 1)),
  cupom: str(raw['cupom']).slice(0, 20).toUpperCase(),
  ordenar: ["relevancia", "menor-preco", "maior-preco", "avaliacao", "duracao"].includes(str(raw['ordenar']))
    ? str(raw['ordenar'])
    : "relevancia",
});

export const ORIGINS = [
  "São Paulo (GRU)",
  "São Paulo (CGH)",
  "Rio de Janeiro (GIG)",
  "Belo Horizonte (CNF)",
  "Brasília (BSB)",
  "Curitiba (CWB)",
  "Porto Alegre (POA)",
  "Recife (REC)",
  "Salvador (SSA)",
];
