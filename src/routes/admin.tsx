import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Lock, Package, Paperclip, Percent, Plus, RotateCcw, Trash2, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/data/store";
import { brl, dateBR, slugify } from "@/lib/format";
import type { Booking, Coupon, TravelPackage } from "@/data/types";
import { SettingsAdmin } from "@/components/admin/SettingsAdmin";
import { OrdersAdmin } from "@/components/admin/OrdersAdmin";
import { PackagesAdmin } from "@/components/admin/PackagesAdmin";
import { CouponsAdmin } from "@/components/admin/CouponsAdmin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo | Voar Brasil" },
      { name: "description", content: "Gestão de pacotes, cupons, reservas e clientes da plataforma Voar Brasil." },
      { property: "og:title", content: "Painel administrativo | Voar Brasil" },
      { property: "og:description", content: "Área interna de gestão da operação de viagens." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const store = useStore();
  const { user, packages, destinations, hotels, coupons, bookings, customers } = store;

  const stats = useMemo(() => {
    const revenue = bookings.filter((b) => b.status !== "Cancelada").reduce((s, b) => s + b.total, 0);
    const confirmed = bookings.filter((b) => b.status === "Confirmada").length;
    const ticket = bookings.length ? Math.round(revenue / bookings.length) : 0;
    return { revenue, confirmed, ticket };
  }, [bookings]);

  if (user?.role !== "admin") {
    return (
      <SiteLayout>
        <div className="container-page py-20">
          <div className="surface-card mx-auto max-w-md p-8 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
              <Lock className="size-6" aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold">Área restrita</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Este painel é exclusivo para a equipe interna. Entre com um e-mail administrativo (por exemplo
              admin@voarbrasil.com) para acessar a demonstração.
            </p>
            <Button asChild variant="highlight" className="mt-5 w-full">
              <Link to="/entrar">Entrar como administrador</Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-brand py-8 text-primary-foreground">
        <div className="container-page flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">Painel administrativo</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Conectado como {user.name} • dados de demonstração persistidos localmente
            </p>
          </div>
          <Button
            variant="onDark"
            onClick={() => {
              store.resetDemoData();
              toast.success("Dados de demonstração restaurados.");
            }}
          >
            <RotateCcw className="size-4" aria-hidden="true" /> Restaurar dados
          </Button>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: TrendingUp, label: "Receita registrada", value: brl(stats.revenue) },
            { icon: BarChart3, label: "Reservas confirmadas", value: String(stats.confirmed) },
            { icon: Package, label: "Ticket médio", value: brl(stats.ticket) },
            { icon: Users, label: "Clientes na base", value: String(customers.length) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="surface-card p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="font-display text-2xl font-extrabold text-primary">{value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="configuracoes" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            <TabsTrigger value="pacotes">Pacotes ({packages.length})</TabsTrigger>
            <TabsTrigger value="reservas">Reservas ({bookings.length})</TabsTrigger>
            <TabsTrigger value="cupons">Cupons ({coupons.length})</TabsTrigger>
            <TabsTrigger value="catalogo">Catálogo</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
          </TabsList>

          <TabsContent value="configuracoes" className="mt-6">
            <SettingsAdmin />
          </TabsContent>

          <TabsContent value="pacotes" className="mt-6">
            <PackagesAdmin />
          </TabsContent>

          <TabsContent value="reservas" className="mt-6">
            <OrdersAdmin />
          </TabsContent>

          <TabsContent value="cupons" className="mt-6">
            <CouponsAdmin />
          </TabsContent>

          <TabsContent value="catalogo" className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="surface-card p-5">
              <h2 className="text-lg font-bold">Destinos</h2>
              <ul className="mt-3 divide-y divide-border">
                {destinations.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span>
                      <span className="font-semibold">{d.name}</span>{" "}
                      <span className="text-xs text-muted-foreground">
                        {d.uf} • {d.region}
                      </span>
                    </span>
                    <Switch
                      checked={d.active}
                      onCheckedChange={() => store.toggleActive("destinations", d.id)}
                      aria-label={`Ativar destino ${d.name}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card p-5">
              <h2 className="text-lg font-bold">Hotéis</h2>
              <ul className="mt-3 divide-y divide-border">
                {hotels.map((h) => (
                  <li key={h.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span>
                      <span className="font-semibold">{h.name}</span>{" "}
                      <span className="text-xs text-muted-foreground">
                        {h.stars}★ • {brl(h.nightPrice)}/noite
                      </span>
                    </span>
                    <Switch
                      checked={h.active}
                      onCheckedChange={() => store.toggleActive("hotels", h.id)}
                      aria-label={`Ativar hotel ${h.name}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="clientes" className="mt-6">
            <div className="surface-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Desde</TableHead>
                    <TableHead className="text-right">Reservas</TableHead>
                    <TableHead className="text-right">Total gasto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-semibold">{c.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.email}
                        <br />
                        {c.phone}
                      </TableCell>
                      <TableCell className="text-xs">{dateBR(c.since)}</TableCell>
                      <TableCell className="text-right">{c.bookings}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">{brl(c.spent)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}

function BookingsAdmin({
  bookings,
  onStatus,
}: {
  bookings: Booking[];
  onStatus: (id: string, status: Booking["status"]) => void;
}) {
  return (
    <div className="surface-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Pacote</TableHead>
            <TableHead>Saída</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Comprovante</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-bold">{b.code}</TableCell>
              <TableCell>
                <span className="font-semibold">{b.customerName}</span>
                <br />
                <span className="text-xs text-muted-foreground">{b.contactEmail}</span>
              </TableCell>
              <TableCell className="max-w-64 text-xs">{b.packageTitle}</TableCell>
              <TableCell className="text-xs">{dateBR(b.departure)}</TableCell>
              <TableCell className="max-w-48 text-xs text-muted-foreground">{b.paymentMethod}</TableCell>
              <TableCell className="text-xs">
                {b.proof ? (
                  b.proof.dataUrl ? (
                    <a
                      href={b.proof.dataUrl}
                      target="_blank"
                      rel="noreferrer"
                      download={b.proof.name}
                      className="inline-flex max-w-40 items-center gap-1.5 truncate font-bold text-primary hover:underline"
                    >
                      <Paperclip className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{b.proof.name}</span>
                    </a>
                  ) : (
                    <span className="inline-flex max-w-40 items-center gap-1.5 truncate font-semibold">
                      <Paperclip className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{b.proof.name}</span>
                    </span>
                  )
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right font-semibold text-primary">{brl(b.total)}</TableCell>
              <TableCell>
                <Select value={b.status} onValueChange={(v) => onStatus(b.id, v as Booking["status"])}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Confirmada", "Pendente", "Concluída", "Cancelada"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

