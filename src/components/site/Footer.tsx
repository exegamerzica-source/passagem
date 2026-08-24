import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Viagens",
    links: [
      { to: "/pacotes", label: "Pacotes" },
      { to: "/hoteis", label: "Hotéis" },
      { to: "/voos", label: "Voos" },
      { to: "/ofertas", label: "Ofertas" },
    ],
  },
  {
    title: "Destinos",
    links: [
      { to: "/destinos/$slug", params: { slug: "porto-seguro" }, label: "Porto Seguro" },
      { to: "/destinos/$slug", params: { slug: "maceio" }, label: "Maceió" },
      { to: "/destinos/$slug", params: { slug: "rio-de-janeiro" }, label: "Rio de Janeiro" },
      { to: "/destinos/$slug", params: { slug: "gramado" }, label: "Gramado" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { to: "/sobre", label: "Sobre a Voar Brasil" },
      { to: "/suporte", label: "Central de ajuda" },
      { to: "/minhas-viagens", label: "Minhas viagens" },
      { to: "/admin", label: "Área administrativa" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-primary-deep text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo tone="light" />
          <p className="max-w-xs text-sm text-primary-foreground/70">
            Agência de viagens digital com mais de 320 mil viajantes atendidos, hotéis auditados e atendimento humano em
            todas as etapas da sua reserva.
          </p>
          <p className="text-xs text-primary-foreground/60">
            CNPJ 00.000.000/0001-00 • Cadastur 00.000000.00-0
            <br />
            Av. das Nações Unidas, 1200 — São Paulo, SP
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="space-y-3 text-sm">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary-foreground">
              {col.title}
            </h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} params={"params" in l ? l.params : {}} className="text-primary-foreground/70 transition-colors hover:text-highlight">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Voar Brasil Viagens e Turismo. Todos os direitos reservados.</p>
          <p>Preços por pessoa em apartamento duplo, sujeitos a disponibilidade e alteração sem aviso prévio.</p>
        </div>
      </div>
    </footer>
  );
}
