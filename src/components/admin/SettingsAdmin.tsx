import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getStoreSettings, updateStoreSettings } from "@/api/settings";
import { defaultSiteTexts } from "@/data/texts";

export function SettingsAdmin() {
  const [cnpj, setCnpj] = useState("");
  const [storeName, setStoreName] = useState("");
  const [logoBase64, setLogoBase64] = useState<string>("");
  const [bannerBase64, setBannerBase64] = useState<string>("");
  const [siteTexts, setSiteTexts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStoreSettings().then(settings => {
      if (settings) {
        setCnpj(settings.cnpj || "");
        setStoreName(settings.storeName || "");
        setLogoBase64(settings.logoBase64 || "");
        setBannerBase64(settings.bannerBase64 || "");
        setSiteTexts(settings.siteTexts || {});
      }
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("A imagem deve ter no moximo 2MB");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateStoreSettings({
        data: {
          cnpj, storeName, logoBase64, bannerBase64, siteTexts
        }
      });
      toast.success("Configurações salvas com sucesso!");
    } catch (e) {
      toast.error("Erro ao salvar configurações");
    }
    setLoading(false);
  };

  const updateText = (key: string, val: string) => {
    setSiteTexts(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6 surface-card p-6">
      <h2 className="text-xl font-bold">Configurações da Loja</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Nome da Loja</Label>
          <Input value={storeName} onChange={e => setStoreName(e.target.value)} />
        </div>
        <div>
          <Label>CNPJ</Label>
          <Input value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Logo da Loja</Label>
          <Input type="file" accept="image/*" onChange={e => handleFileChange(e, setLogoBase64)} />
          {logoBase64 && <img src={logoBase64} alt="Logo Preview" className="h-16 object-contain border p-1 rounded" />}
        </div>
        <div className="space-y-2">
          <Label>Banner Principal</Label>
          <Input type="file" accept="image/*" onChange={e => handleFileChange(e, setBannerBase64)} />
          {bannerBase64 && <img src={bannerBase64} alt="Banner Preview" className="h-24 w-full object-cover border p-1 rounded" />}
        </div>
      </div>

      <div className="mt-8 border-t pt-8">
        <h3 className="text-lg font-bold mb-4">Textos de Todo o Site</h3>
        <p className="text-sm text-muted-foreground mb-4">Altere qualquer texto exibido no site abaixo. Se deixar em branco, o texto original será exibido.</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(defaultSiteTexts).map(([key, config]) => (
            <div key={key}>
              <Label className="block mb-2">{config.label}</Label>
              {config.isTextarea ? (
                <Textarea 
                  className="min-h-[100px]"
                  value={siteTexts[key] !== undefined ? siteTexts[key] : config.default} 
                  onChange={e => updateText(key, e.target.value)} 
                />
              ) : (
                <Input 
                  value={siteTexts[key] !== undefined ? siteTexts[key] : config.default} 
                  onChange={e => updateText(key, e.target.value)} 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading} variant="highlight">
        {loading ? "Salvando..." : "Salvar Configurações"}
      </Button>
    </div>
  );
}
