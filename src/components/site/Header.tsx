import { Link, useNavigate } from "@tanstack/react-router";
import { Headset, LogOut, Menu, ShieldCheck, Ticket, User } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/data/store";

const NAV = [
  { to: "/pacotes", label: "Pacotes" },
  { to: "/hoteis", label: "Hotéis" },
  { to: "/voos", label: "Voos" },
  { to: "/ofertas", label: "Ofertas" },
  { to: "/destinos", label: "Destinos" },
] as const;

export function Header() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="hidden bg-highlight text-highlight-foreground md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs font-bold">
          <p className="flex items-center gap-2">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Compra 100% segura • Parcele em até 12x sem juros
          </p>
          <p className="flex items-center gap-4">
            <a href="tel:+551140028922" className="hover:underline">
              Central de vendas: (11) 4002-8922
            </a>
            <Link to="/suporte" className="hover:underline">
              Atendimento
            </Link>
          </p>
        </div>
      </div>

      <div className="container-page flex h-16 items-center gap-4">
        <Logo />

        <nav aria-label="Navegação principal" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative rounded-full px-3.5 py-2 text-sm font-bold text-primary transition-colors after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-[3px] after:rounded-full after:bg-highlight after:opacity-0 after:transition-opacity hover:after:opacity-100"
              activeProps={{ className: "after:opacity-100" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>


        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex">
            <Link to="/suporte">
              <Headset aria-hidden="true" /> Suporte
            </Link>
          </Button>
          <Button asChild variant="soft" size="sm" className="hidden md:inline-flex">
            <Link to="/minhas-viagens">
              <Ticket aria-hidden="true" /> Minhas viagens
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User aria-hidden="true" />
                  <span className="hidden max-w-28 truncate capitalize sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/minhas-viagens">Minhas viagens</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin">Painel administrativo</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut aria-hidden="true" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="highlight" className="hidden sm:inline-flex">
              <Link to="/entrar">Entrar ou cadastrar</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menu">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm p-0">
              <SheetHeader className="border-b border-border px-5 py-4 text-left">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Navegação mobile" className="flex flex-col p-3">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-semibold text-foreground hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link
                  to="/minhas-viagens"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-semibold hover:bg-accent"
                >
                  Minhas viagens
                </Link>
                <Link
                  to="/suporte"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-semibold hover:bg-accent"
                >
                  Suporte
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-semibold hover:bg-accent"
                >
                  Painel administrativo
                </Link>
                <div className="p-3">
                  {user ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      Sair da conta
                    </Button>
                  ) : (
                    <Button asChild variant="highlight" className="w-full">
                      <Link to="/entrar" onClick={() => setOpen(false)}>
                        Entrar ou cadastrar
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
