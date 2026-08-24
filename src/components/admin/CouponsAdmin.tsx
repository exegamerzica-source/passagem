import { useState } from "react";
import { toast } from "sonner";
import { Percent, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/data/store";
import type { Coupon } from "@/data/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export function CouponsAdmin() {
  const { coupons, upsert, remove, toggleActive } = useStore();
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Partial<Coupon>>({});

  const openEditor = (coupon?: Coupon) => {
    if (coupon) {
      setForm({ ...coupon });
      setEditing(coupon);
    } else {
      setForm({ code: "", percent: 10, description: "" });
      setEditing({ id: "new" } as Coupon);
    }
  };

  const save = () => {
    if (!form.code || form.code.trim().length < 3) {
      toast.error("Informe um código com pelo menos 3 caracteres.");
      return;
    }
    const percent = Number(form.percent);
    if (!Number.isFinite(percent) || percent <= 0 || percent > 60) {
      toast.error("O desconto deve estar entre 1% e 60%.");
      return;
    }

    const coupon: Coupon = {
      ...(form as Coupon),
      id: editing?.id === "new" ? `c${Math.random().toString(36).slice(2, 8)}` : editing!.id,
      code: form.code.trim().toUpperCase(),
      percent,
      description: form.description || `Desconto de ${percent}% em pacotes selecionados`,
      active: editing?.id === "new" ? true : form.active!,
    };

    upsert("coupons", coupon);
    toast.success(`Cupom ${coupon.code} salvo com sucesso.`);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Cupons de Desconto</h2>
          <p className="text-sm text-muted-foreground">Crie ou edite promoções para seus clientes.</p>
        </div>
        <Dialog open={!!editing} onOpenChange={(val) => !val && setEditing(null)}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditor()}>
              <Percent className="mr-2 h-4 w-4" /> Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing?.id === "new" ? "Novo Cupom" : "Editar Cupom"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Código</Label>
                <Input value={form.code} className="uppercase" onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <Label>Desconto (%)</Label>
                <Input type="number" value={form.percent} onChange={(e) => setForm({ ...form, percent: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button onClick={save}>Salvar Cupom</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.id} className="surface-card p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-lg font-extrabold text-primary">{c.code}</span>
              <Badge className="bg-highlight/15 text-highlight">{c.percent}% OFF</Badge>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{c.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold">
                <Switch
                  checked={c.active}
                  onCheckedChange={() => toggleActive("coupons", c.id)}
                />
                Ativo
              </label>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditor(c)}>
                  <Edit className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => remove("coupons", c.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
