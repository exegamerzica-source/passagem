import { Link, getRouteApi } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const rootRoute = getRouteApi("__root__");

export function Logo({ className }: { tone?: "brand" | "light"; className?: string }) {
  const { settings } = rootRoute.useLoaderData();
  const logo = settings?.logoBase64 || settings?.logo_base64 || settings?.LOGOBASE64;
  const logoBase64 = logo && logo.length > 100 ? logo : null;

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
