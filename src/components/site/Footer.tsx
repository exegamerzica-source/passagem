import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Route as rootRoute } from "@/routes/__root";
import { getText } from "@/data/texts";

const getColumns = (texts: any) => [
  {
    title: "Viagens",
    links: [
      { to: "/pacotes", label: getText(texts, "navPackages") },
      { to: "/hoteis", label: getText(texts, "navHotels") },
      { to: "/voos", label: getText(texts, "navFlights") },
      { to: "/ofertas", label: getText(texts, "navDeals") },
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
];

export function Footer() {
  const { settings } = rootRoute.useLoaderData();
  const texts = settings?.siteTexts || {};
  const COLUMNS = getColumns(texts);

  return (
    <footer className="mt-16 border-t border-border bg-primary-deep text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo tone="light" />
          <p className="max-w-xs text-sm text-primary-foreground/70">
            {getText(texts, "footerAboutText")}
          </p>
          <p className="text-xs text-primary-foreground/60">
            {settings?.cnpj ? `CNPJ ${settings.cnpj}` : 'CNPJ 00.000.000/0001-00'} • Cadastur 00.000000.00-0
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
        
        <nav aria-label="Institucional" className="space-y-3 text-sm">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-primary-foreground">
            Institucional
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/sobre" className="text-primary-foreground/70 transition-colors hover:text-highlight">
                {getText(texts, "footerAboutTitle")}
              </Link>
            </li>
            <li>
              <Link to="/suporte" className="text-primary-foreground/70 transition-colors hover:text-highlight">
                {getText(texts, "navSupport")}
              </Link>
            </li>
            <li>
              <Link to="/minhas-viagens" className="text-primary-foreground/70 transition-colors hover:text-highlight">
                {getText(texts, "navMyTrips")}
              </Link>
            </li>
            <li>
              <Link to="/admin" className="text-primary-foreground/70 transition-colors hover:text-highlight">
                {getText(texts, "navAdmin")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-primary-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>{getText(texts, "footerCopy")}</p>
          <p>Preços por pessoa em apartamento duplo, sujeitos a disponibilidade e alteração sem aviso prévio.</p>
        </div>
      </div>
    </footer>
  );
}
