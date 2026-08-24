import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getStoreSettings } from "@/api/settings";

export function Logo({ tone = "brand", className }: { tone?: "brand" | "light"; className?: string }) {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  useEffect(() => {
    getStoreSettings()
      .then((s: any) => {
        if (s?.logoBase64) setLogoBase64(s.logoBase64);
      })
      .catch(() => {}); // silently fail - show default logo
  }, []);

  return (
    <Link
      to="/"
      aria-label="Voar Brasil — página inicial"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      {logoBase64 ? (
        // Logo customizada do banco de dados
        <img
          src={logoBase64}
          alt="Logo da loja"
          className="h-10 max-w-[120px] object-contain transition-transform group-hover:scale-105"
        />
      ) : (
        // Logo padrão (SVG)
        <>
          <span
            className={cn(
              "grid size-9 place-items-center rounded-xl transition-transform group-hover:scale-105",
              tone === "light" ? "bg-primary-foreground/15 backdrop-blur" : "bg-gradient-brand",
            )}
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                d="M2.5 13.2 21 4.5l-4.6 9.4-2.6-1.2-2 4.6-1.7-3.6-3.4 2.1.6-3.1-4.8.5Z"
                fill="currentColor"
                className={tone === "light" ? "text-primary-foreground" : "text-primary-foreground"}
              />
              <path d="M9.9 15.3 20.4 5.1" stroke="currentColor" strokeWidth="1.2" className="text-highlight" />
            </svg>
          </span>
          <span className="leading-none">
            <span
              className={cn(
                "block font-display text-lg font-extrabold tracking-tight",
                tone === "light" ? "text-primary-foreground" : "text-foreground",
              )}
            >
              Voar<span className="text-highlight">Brasil</span>
            </span>
            <span
              className={cn(
                "block text-[10px] font-medium uppercase tracking-[0.18em]",
                tone === "light" ? "text-primary-foreground/70" : "text-muted-foreground",
              )}
            >
              Viagens e Turismo
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
