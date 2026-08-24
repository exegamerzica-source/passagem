import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/data/store";
import type { Destination, Hotel } from "@/data/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { brl, slugify } from "@/lib/format";

export function CatalogAdmin() {
  const { destinations, hotels, upsert, remove, toggleActive } = useStore();
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const [destForm, setDestForm] = useState<Partial<Destination>>({});
  const [hotelForm, setHotelForm] = useState<Partial<Hotel>>({});

  const openDestEditor = (d?: Destination) => {
    if (d) {
      setDestForm({ ...d });
      setEditingDest(d);
    } else {
      setDestForm({ name: "", uf: "", region: "", country: "Brasil", description: "", image: "destination-3", active: true });
      setEditingDest({ id: "new" } as Destination);
    }
  };

  const saveDest = () => {
    if (!destForm.name) return toast.error("Informe um nome.");
    const dest: Destination = {
      ...(destForm as Destination),
      id: editingDest?.id === "new" ? `d${Math.random().toString(36).slice(2, 8)}` : editingDest!.id,
      slug: editingDest?.id === "new" ? slugify(destForm.name) : destForm.slug!,
    };
    upsert("destinations", dest);
    toast.success(`Destino ${dest.name} salvo.`);
    setEditingDest(null);
  };

  const openHotelEditor = (h?: Hotel) => {
    if (h) {
      setHotelForm({ ...h });
      setEditingHotel(h);
    } else {
      setHotelForm({ name: "", stars: 3, nightPrice: 300, description: "", address: "", active: true, reviews: 0, rating: 8, board: "Café da manhã", image: "hotel-1", gallery: ["hotel-1"] });
      setEditingHotel({ id: "new" } as Hotel);
    }
  };

  const saveHotel = () => {
    if (!hotelForm.name) return toast.error("Informe um nome.");
    const h: Hotel = {
      ...(hotelForm as Hotel),
      id: editingHotel?.id === "new" ? `h${Math.random().toString(36).slice(2, 8)}` : editingHotel!.id,
      slug: editingHotel?.id === "new" ? slugify(hotelForm.name) : hotelForm.slug!,
    };
    upsert("hotels", h);
    toast.success(`Hotel ${h.name} salvo.`);
    setEditingHotel(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* DESTINOS */}
      <div className="surface-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Destinos</h2>
          <Button size="sm" onClick={() => openDestEditor()}><Plus className="mr-1 h-3 w-3" /> Adicionar</Button>
        </div>
        <ul className="divide-y divide-border">
          {destinations.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="flex-1">
                <span className="font-semibold">{d.name}</span> <span className="text-xs text-muted-foreground">{d.uf} - {d.region}</span>
              </span>
              <div className="flex gap-2 items-center">
                <Switch checked={d.active} onCheckedChange={() => toggleActive("destinations", d.id)} />
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openDestEditor(d)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => remove("destinations", d.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* HOTEIS */}
      <div className="surface-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Hotéis</h2>
          <Button size="sm" onClick={() => openHotelEditor()}><Plus className="mr-1 h-3 w-3" /> Adicionar</Button>
        </div>
        <ul className="divide-y divide-border">
          {hotels.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="flex-1">
                <span className="font-semibold">{h.name}</span> <span className="text-xs text-muted-foreground">{h.stars}⭐ - {brl(h.nightPrice)}/noite</span>
              </span>
              <div className="flex gap-2 items-center">
                <Switch checked={h.active} onCheckedChange={() => toggleActive("hotels", h.id)} />
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openHotelEditor(h)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => remove("hotels", h.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* MODAL DESTINO */}
      <Dialog open={!!editingDest} onOpenChange={(val) => !val && setEditingDest(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingDest?.id === "new" ? "Novo Destino" : "Editar Destino"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Nome</Label>
              <Input value={destForm.name} onChange={e => setDestForm({...destForm, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>UF (ex: SC)</Label>
                <Input value={destForm.uf} onChange={e => setDestForm({...destForm, uf: e.target.value})} />
              </div>
              <div>
                <Label>Região (ex: Sul)</Label>
                <Input value={destForm.region} onChange={e => setDestForm({...destForm, region: e.target.value})} />
              </div>
            </div>
            <div>
              <Label>País</Label>
              <Input value={destForm.country} onChange={e => setDestForm({...destForm, country: e.target.value})} />
            </div>
            <div>
              <Label>Imagem / Foto URL</Label>
              <Input value={destForm.image} onChange={e => setDestForm({...destForm, image: e.target.value})} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Input value={destForm.description} onChange={e => setDestForm({...destForm, description: e.target.value})} />
            </div>
          </div>
          <DialogFooter><Button onClick={saveDest}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL HOTEL */}
      <Dialog open={!!editingHotel} onOpenChange={(val) => !val && setEditingHotel(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingHotel?.id === "new" ? "Novo Hotel" : "Editar Hotel"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Nome do Hotel</Label>
              <Input value={hotelForm.name} onChange={e => setHotelForm({...hotelForm, name: e.target.value})} />
            </div>
            <div>
              <Label>Endereço Completo</Label>
              <Input value={hotelForm.address} onChange={e => setHotelForm({...hotelForm, address: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Estrelas (1-5)</Label>
                <Input type="number" value={hotelForm.stars} onChange={e => setHotelForm({...hotelForm, stars: Number(e.target.value)})} />
              </div>
              <div>
                <Label>Diária (R$)</Label>
                <Input type="number" value={hotelForm.nightPrice} onChange={e => setHotelForm({...hotelForm, nightPrice: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <Label>Alimentação (Regime)</Label>
              <Input value={hotelForm.board} onChange={e => setHotelForm({...hotelForm, board: e.target.value})} />
            </div>
            <div>
              <Label>Imagem / Foto URL</Label>
              <Input value={hotelForm.image} onChange={e => setHotelForm({...hotelForm, image: e.target.value})} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Input value={hotelForm.description} onChange={e => setHotelForm({...hotelForm, description: e.target.value})} />
            </div>
          </div>
          <DialogFooter><Button onClick={saveHotel}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
