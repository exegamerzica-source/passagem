import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Download, MapPin, Ticket, Users } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { EmptyState, SectionHeading } from "@/components/travel/Bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/data/store";
import { brl, dateBR } from "@/lib/format";
import type { Booking, BookingStatus } from "@/data/types";

export const Route = createFileRoute("/minhas-viagens")({
  head: () => ({
    meta: [
      { title: "Minhas viagens e vouchers | Voar Brasil" },
      {
        name: "description",
        content: "Acompanhe suas reservas, baixe vouchers, veja passageiros e status de pagamento das suas viagens.",
      },
      { property: "og:title", content: "Minhas viagens e vouchers | Voar Brasil" },
      { property: "og:description", content: "Todas as suas reservas Voar Brasil em um só lugar." },
    ],
  }),
  component: MinhasViagens,
});

const statusStyle: Record<BookingStatus, string> = {
  Confirmada: "bg-success/15 text-success",
  Pendente: "bg-highlight/15 text-highlight",
  Concluída: "bg-primary-soft text-primary",
  Cancelada: "bg-destructive/10 text-destructive",
};

function MinhasViagens() {
  const { bookings, user, updateBookingStatus } = useStore();

  const upcoming = bookings.filter((b) => b.status === "Confirmada" || b.status === "Pendente");
  const past = bookings.filter((b) => b.status === "Concluída" || b.status === "Cancelada");

  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-brand py-10 text-primary-foreground">
        <div className="container-page">
          <h1 className="text-3xl font-extrabold md:text-4xl">Minhas viagens</h1>
          <p className="mt-2 text-sm text-primary-foreground/80">
            {user ? `Olá, ${user.name}. ` : ""}
            {bookings.length} {bookings.length === 1 ? "reserva registrada" : "reservas registradas"} na sua conta.
          </p>
          {!user && (
            <Button asChild variant="highlight" className="mt-5">
              <Link to="/entrar">Entrar na minha conta</Link>
            </Button>
          )}
        </div>
      </section>

      <div className="container-page py-12">
        <Tabs defaultValue="proximas">
          <TabsList>
            <TabsTrigger value="proximas">Próximas ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="historico">Histórico ({past.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="proximas" className="mt-6">
            {upcoming.length === 0 ? (
              <EmptyState
                title="Nenhuma viagem programada"
                description="Assim que você concluir uma reserva, ela aparece aqui com voucher e detalhes de embarque."
                action={
                  <Button asChild variant="highlight">
                    <Link to="/pacotes">Explorar pacotes</Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {upcoming.map((b) => (
                  <BookingCard key={b.id} booking={b} onCancel={() => updateBookingStatus(b.id, "Cancelada")} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="historico" className="mt-6">
            {past.length === 0 ? (
              <EmptyState title="Sem histórico ainda" description="Suas viagens concluídas ficarão registradas aqui." />
            ) : (
              <div className="space-y-4">
                {past.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-14">
          <SectionHeading
            eyebrow="Precisa de ajuda?"
            title="Suporte para a sua reserva"
            description="Alterações de data, inclusão de bagagem, dúvidas sobre voucher e cancelamentos."
          />
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/suporte">Central de ajuda</Link>
            </Button>
            <Button asChild variant="soft">
              <Link to="/ofertas">Ver ofertas do mês</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel?: () => void }) {
  return (
    <article className="surface-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={statusStyle[booking.status]}>{booking.status}</Badge>
            <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <Ticket className="size-3.5" aria-hidden="true" /> {booking.code}
            </span>
          </div>
          <h2 className="mt-2 text-lg font-bold">{booking.packageTitle}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 text-highlight" aria-hidden="true" /> {booking.destination}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Valor total</p>
          <p className="font-display text-xl font-extrabold text-primary">{brl(booking.total)}</p>
          <p className="text-xs text-muted-foreground">{booking.paymentMethod}</p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-3">
        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 size-4 text-primary" aria-hidden="true" />
          <div>
            <dt className="text-xs text-muted-foreground">Período</dt>
            <dd className="font-semibold">
              {dateBR(booking.departure)} a {dateBR(booking.ret)}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Users className="mt-0.5 size-4 text-primary" aria-hidden="true" />
          <div>
            <dt className="text-xs text-muted-foreground">Passageiros</dt>
            <dd className="font-semibold">
              {booking.travelers.map((t) => t.name).filter(Boolean).join(", ") || `${booking.travelers.length} viajantes`}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Ticket className="mt-0.5 size-4 text-primary" aria-hidden="true" />
          <div>
            <dt className="text-xs text-muted-foreground">Serviços</dt>
            <dd className="font-semibold">{booking.extras.length ? booking.extras.join(", ") : "Pacote padrão"}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success(`Voucher ${booking.code} enviado para ${booking.contactEmail}.`)}
        >
          <Download className="size-4" aria-hidden="true" /> Baixar voucher
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link to="/pacotes/$slug" params={{ slug: booking.packageSlug }}>
            Ver detalhes do pacote
          </Link>
        </Button>
        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              onCancel();
              toast.info(`Reserva ${booking.code} cancelada.`);
            }}
          >
            Solicitar cancelamento
          </Button>
        )}
      </div>
    </article>
  );
}
