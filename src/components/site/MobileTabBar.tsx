import { Link } from "@tanstack/react-router";
import { Home, Package, Percent, Ticket } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Início", icon: Home },
  { to: "/pacotes", label: "Pacotes", icon: Package },
  { to: "/ofertas", label: "Ofertas", icon: Percent },
  { to: "/minhas-viagens", label: "Viagens", icon: Ticket },
] as const;

export function MobileTabBar() {
  return (
    <nav
      aria-label="Navegação inferior"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors"
              activeProps={{ className: "text-primary" }}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
