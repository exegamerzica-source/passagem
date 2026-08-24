import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/data/store";
import { brl, slugify } from "@/lib/format";
import type { TravelPackage, Flight } from "@/data/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export function PackagesAdmin() {
  const { packages, destinations, hotels, upsert, remove, toggleActive } = useStore();
  const [editing, setEditing] = useState<TravelPackage | null>(null);

  const [form, setForm] = useState<Partial<TravelPackage>>({});
  const [flightForm, setFlightForm] = useState<Partial<Flight>>({});

  const openEditor = (pkg?: TravelPackage) => {
    if (pkg) {
      setForm({ ...pkg });
      setFlightForm({ ...pkg.flight });
      setEditing(pkg);
    } else {
      setForm({
        title: "",
        destinationSlug: destinations[0]?.slug ?? "",
        hotelSlug: hotels[0]?.slug ?? "",
        nights: 5,
        price: 2490,
        oldPrice: 2990,
        installments: 12,
        transfer: true,
        seats: 10,
        departure: "São Paulo (GRU)",
        ret: "Destino",
        category: "Praia",
        featured: false,
        badges: ["Oferta especial"],
      });
      setFlightForm({
        airline: "GOL",
        outbound: "08:00",
        inbound: "15:00",
        baggage: "10kg",
        stops: 0,
      });
      setEditing({ id: "new" } as TravelPackage);
    }
  };

  const save = () => {
    if (!form.title || form.title.length < 3) {
      toast.error("Informe um título válido.");
      return;
    }
    
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Informe um preço válido.");
      return;
    }

    const pkg: TravelPackage = {
      ...(form as TravelPackage),
      id: editing?.id === "new" ? `p${Math.random().toString(36).slice(2, 8)}` : editing!.id,
      slug: editing?.id === "new" ? `${slugify(form.title)}-${Math.random().toString(36).slice(2, 5)}` : form.slug!,
      price,
      oldPrice: Number(form.oldPrice) || Math.round(price * 1.2),
      active: editing?.id === "new" ? true : form.active!,
      flight: flightForm as Flight,
    };

    upsert("packages", pkg);
    toast.success("Pacote salvo com sucesso.");
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Pacotes</h2>
          <p className="text-sm text-muted-foreground">Gerencie os pacotes de viagem disponíveis.</p>
        </div>
        <Dialog open={!!editing} onOpenChange={(val) => !val && setEditing(null)}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditor()}>
              <Plus className="mr-2 h-4 w-4" /> Novo Pacote
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing?.id === "new" ? "Novo Pacote" : "Editar Pacote"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="col-span-2">
                <Label>Título do pacote</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>Destino</Label>
                <Select value={form.destinationSlug} onValueChange={(val) => setForm({ ...form, destinationSlug: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {destinations.map((d) => (
                      <SelectItem key={d.slug} value={d.slug}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hotel</Label>
                <Select value={form.hotelSlug} onValueChange={(val) => setForm({ ...form, hotelSlug: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {hotels.map((h) => (
                      <SelectItem key={h.slug} value={h.slug}>{h.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Noites</Label>
                <Input type="number" value={form.nights} onChange={(e) => setForm({ ...form, nights: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={form.category} onValueChange={(val: any) => setForm({ ...form, category: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Praia">Praia</SelectItem>
                    <SelectItem value="Serra">Serra</SelectItem>
                    <SelectItem value="Cidade">Cidade</SelectItem>
                    <SelectItem value="Resort">Resort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Preço Final (R$)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Preço Original (R$ - Riscado)</Label>
                <Input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: Number(e.target.value) })} />
              </div>
              <div className="col-span-2 mt-4 font-semibold border-b pb-2">Informações do Voo</div>
              <div>
                <Label>Cia Aérea</Label>
                <Input value={flightForm.airline} onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })} />
              </div>
              <div>
                <Label>Bagagem</Label>
                <Input value={flightForm.baggage} onChange={(e) => setFlightForm({ ...flightForm, baggage: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button onClick={save}>Salvar Pacote</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="surface-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ativo</TableHead>
              <TableHead>Pacote</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Switch checked={p.active} onCheckedChange={() => toggleActive("packages", p.id)} />
                </TableCell>
                <TableCell className="font-medium">
                  {p.title}
                  <div className="text-xs text-muted-foreground font-normal">
                    {p.nights} noites ? Voo {p.flight?.airline}
                  </div>
                </TableCell>
                <TableCell>{brl(p.price)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditor(p)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => remove("packages", p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {packages.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Nenhum pacote cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
