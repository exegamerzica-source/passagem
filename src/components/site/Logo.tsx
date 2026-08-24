import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getStoreSettings } from "@/api/settings";

export function Logo({ className }: { tone?: "brand" | "light"; className?: string }) {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  useEffect(() => {
    getStoreSettings()
      .then((s: any) => {
        const logo = s?.logoBase64 || s?.logo_base64 || s?.LOGOBASE64;
        if (logo && logo.length > 100) {
          setLogoBase64(logo);
        }
      })
      .catch((err) => {
        console.warn("[Logo] Erro ao buscar settings:", err);
      });
  }, []);

  return (
    <Link
      to="/"
      aria-label="Página inicial"
      className={cn("group inline-flex items-center gap-2.5 min-h-10", className)}
    >
      {logoBase64 ? (
        <img
          src={logoBase64}
          alt="Logo da loja"
          className="h-10 max-w-[160px] object-contain transition-transform group-hover:scale-105"
        />
      ) : (
        // Espaço vazio enquanto carrega para evitar layout shift e sem "piscar" a logo antiga
        <span className="h-10 w-32 animate-pulse rounded-md bg-muted/20"></span>
      )}
    </Link>
  );
}
