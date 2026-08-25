import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BedDouble, Briefcase, Bus, CalendarDays, Check, MapPin, Plane, ShieldCheck, Utensils } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DiscountTag, EmptyState, ProductBadge, RatingBadge, Stars } from "@/components/travel/Bits";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCatalog } from "@/data/store";
import { img } from "@/data/images";
import { seedPackages } from "@/data/seed";
import { brl, brlCents, dateBR, discountPct } from "@/lib/format";

export const Route = createFileRoute("/pacotes/$slug")({
  loader: async ({ params }) => {
    const items = await getPackages();
    const item = items.find((p: any) => p.slug === params.slug);
    if (!item) throw notFound();
    return { title: item.title, nights: item.nights, price: item.price, board: item.board };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Pacote indisponível | Voar Brasil" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} | Voar Brasil`;
    const description = `Pacote de ${loaderData.nights} noites com ${loaderData.board.toLowerCase()}, voo e traslado a partir de ${brl(
      loaderData.price,
    )} por pessoa.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: PacoteDetalhe,
});

function PacoteDetalhe() {
  const { slug } = Route.useParams();
  const { packageBySlug, hotelBySlug, destinationBySlug } = useCatalog();
  const pkg = packageBySlug(slug);

  if (!pkg) {
    return (
      <SiteLayout>
        <div className="container-page py-16">
          <EmptyState
            title="Pacote não encontrado"
            description="Este pacote pode ter sido encerrado ou desativado. Veja outras opções disponíveis."
            action={
              <Button asChild>
                <Link to="/pacotes">Ver pacotes disponíveis</Link>
              </Button>
            }
          />
        </div>
      </SiteLayout>
    );
  }

  const hotel = hotelBySlug(pkg.hotelSlug);
  const destination = destinationBySlug(pkg.destinationSlug);
  const off = discountPct(pkg.price, pkg.oldPrice);
  const gallery = hotel?.gallery ?? [destination?.image ?? "hero"];
  const taxes = Math.round(pkg.price * 0.08);

  return (
    <SiteLayout>
      <div className="container-page pt-6">
        <nav aria-label="Trilha de navegação" className="mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Início
          </Link>
          <span aria-hidden="true"> / </span>
          <Link to="/pacotes" className="hover:text-primary">
            Pacotes
          </Link>
          {destination && (
            <>
              <span aria-hidden="true"> / </span>
              <Link to="/destinos/$slug" params={{ slug: destination.slug }} className="hover:text-primary">
                {destination.name}
              </Link>
            </>
          )}
          <span aria-hidden="true"> / </span>
          <span className="font-semibold text-foreground">{pkg.nights} noites</span>
        </nav>

        {/* Galeria */}
        <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
          {gallery.slice(0, 4).map((g, i) => (
            <img
              key={`${g}-${i}`}
              src={img(g)}
              alt={`${pkg.title} — imagem ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              width={960}
              height={640}
              className={`w-full rounded-xl object-cover ${
                i === 0 ? "h-64 sm:col-span-2 sm:row-span-2 sm:h-full" : "h-32 sm:h-full"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-8 pb-16 lg:grid-cols-[1fr_22rem]">
          <div>
            <div className="flex flex-wrap gap-1.5">
              {pkg.badges.map((b) => (
                <ProductBadge key={b} label={b} />
              ))}
            </div>
            <h1 className="mt-3 text-2xl font-extrabold md:text-3xl">{pkg.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 text-highlight" aria-hidden="true" />
              {destination?.name}, {destination?.uf} • saída de {pkg.origin}
            </p>
            {hotel && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Stars value={hotel.stars} />
                <RatingBadge value={hotel.rating} reviews={hotel.reviews} />
              </div>
            )}

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {pkg.nights} noites em {destination?.name} com hospedagem no {hotel?.name}, regime de{" "}
              {pkg.board.toLowerCase()}, passagem aérea ida e volta pela {pkg.flight.airline}
              {pkg.transfer ? " e traslado aeroporto/hotel/aeroporto" : ""}. Assistência da CVC BRASILdurante toda a
              viagem.
            </p>

            {/* Informações da viagem */}
            <h2 className="mt-8 text-lg font-bold">Informações da viagem</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { icon: CalendarDays, label: "Datas", value: `${dateBR(pkg.departure)} a ${dateBR(pkg.ret)}` },
                { icon: BedDouble, label: "Hospedagem", value: `${pkg.nights} noites • ${hotel?.name}` },
                { icon: Utensils, label: "Alimentação", value: pkg.board },
                {
                  icon: Bus,
                  label: "Transporte terrestre",
                  value: pkg.transfer ? "Traslado privativo incluso" : "Não incluso",
                },
                { icon: Plane, label: "Voos", value: `${pkg.flight.airline} • ${pkg.flight.stops === 0 ? "direto" : "1 conexão"}` },
                { icon: Briefcase, label: "Bagagem", value: pkg.flight.baggage },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="surface-card flex items-start gap-3 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            {/* Voos detalhados */}
            <h2 className="mt-8 text-lg font-bold">Detalhes dos voos</h2>
            <div className="surface-card mt-3 divide-y divide-border">
              {[
                { label: "Ida", date: pkg.departure, time: pkg.flight.outbound, from: pkg.origin, to: destination?.name },
                { label: "Volta", date: pkg.ret, time: pkg.flight.inbound, from: destination?.name, to: pkg.origin },
              ].map((leg) => (
                <div key={leg.label} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-highlight">{leg.label}</p>
                    <p className="text-sm font-semibold">
                      {leg.from} → {leg.to}
                    </p>
                    <p className="text-xs text-muted-foreground">{dateBR(leg.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold">{leg.time}</p>
                    <p className="text-xs text-muted-foreground">{pkg.flight.airline}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quartos */}
            <h2 className="mt-8 text-lg font-bold">Quartos disponíveis</h2>
            <div className="mt-3 space-y-3">
              {[
                { name: "Standard casal", extra: 0, desc: "Cama queen, ar-condicionado, frigobar. Até 2 pessoas." },
                { name: "Superior vista mar", extra: 320, desc: "Varanda com vista para o mar, até 3 pessoas." },
                { name: "Família", extra: 540, desc: "Dois ambientes, até 4 pessoas, banheira." },
              ].map((room) => (
                <div key={room.name} className="surface-card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-bold">{room.name}</p>
                    <p className="text-xs text-muted-foreground">{room.desc}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {room.extra === 0 ? "Incluído no pacote" : `+ ${brl(room.extra)} no total`}
                  </p>
                </div>
              ))}
            </div>

            <Accordion type="single" collapsible className="mt-8">
              <AccordionItem value="cancel">
                <AccordionTrigger>Política de cancelamento</AccordionTrigger>
                <AccordionContent>
                  Cancelamento gratuito até 21 dias antes da saída. Entre 20 e 8 dias, multa de 25% sobre o valor total.
                  A menos de 7 dias, retenção de 100% dos serviços aéreos e 50% dos serviços terrestres.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="incluso">
                <AccordionTrigger>O que está incluso</AccordionTrigger>
                <AccordionContent>
                  Passagem aérea ida e volta, {pkg.nights} noites de hospedagem, {pkg.board.toLowerCase()},
                  {pkg.transfer ? " traslados aeroporto/hotel/aeroporto," : ""} taxas de embarque e assistência 24h.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="nao-incluso">
                <AccordionTrigger>O que não está incluso</AccordionTrigger>
                <AccordionContent>
                  Passeios opcionais, despesas pessoais, taxa de turismo local (quando aplicável) e seguro viagem — que
                  pode ser adicionado no checkout.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Painel lateral de compra */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="surface-card overflow-hidden">
              <div className="bg-gradient-brand p-4 text-primary-foreground">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
                  Resumo da compra
                </p>
                <p className="mt-1 text-sm">
                  {pkg.nights} noites • {dateBR(pkg.departure)}
                </p>
              </div>
              <div className="space-y-3 p-5">
                {off > 0 && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <s>{brl(pkg.oldPrice)}</s> <DiscountTag percent={off} />
                  </p>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Por pessoa a partir de</p>
                  <p className="font-display text-3xl font-extrabold text-primary">{brl(pkg.price)}</p>
                  <p className="text-xs text-muted-foreground">
                    Em até {pkg.installments}x de {brlCents(pkg.price / pkg.installments)} sem juros
                  </p>
                </div>

                <dl className="space-y-1.5 border-t border-border pt-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Hospedagem + aéreo</dt>
                    <dd>{brl(pkg.price - taxes)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Taxas e impostos</dt>
                    <dd>{brl(taxes)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 font-bold">
                    <dt>Total por pessoa</dt>
                    <dd className="text-primary">{brl(pkg.price)}</dd>
                  </div>
                </dl>

                {pkg.seats <= 6 && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive">
                    Últimas {pkg.seats} vagas para esta saída
                  </p>
                )}

                <Button asChild variant="highlight" size="lg" className="w-full">
                  <Link to="/checkout/$slug" params={{ slug: pkg.slug }}>
                    Continuar reserva
                  </Link>
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-success" aria-hidden="true" /> Compra segura • reserva sem taxa
                </p>
                <ul className="space-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                  {["Confirmação imediata", "Voucher digital", "Suporte 24h durante a viagem"].map((i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="size-3.5 text-success" aria-hidden="true" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
