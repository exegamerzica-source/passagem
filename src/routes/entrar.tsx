import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/data/store";

const verifyAdminPassword = createServerFn({ method: "POST" })
  .validator((password: string) => password)
  .handler(async ({ data }) => {
    // Verifica a senha no servidor (process.env.ADMIN_PASSWORD)
    // Se a variavel não existir, cai para uma senha padrão mais forte que '123456'
    const realPassword = process.env.ADMIN_PASSWORD || "V@arBrasil2026";
    return data === realPassword;
  });

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta | Voar Brasil" },
      {
        name: "description",
        content: "Acesse sua conta CVC BRASILpara acompanhar reservas, vouchers e ofertas exclusivas de viagem.",
      },
      { property: "og:title", content: "Entrar ou criar conta | Voar Brasil" },
      { property: "og:description", content: "Gerencie suas reservas e vouchers na sua conta Voar Brasil." },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const navigate = useNavigate();
  const { login, user, logout } = useStore();
  const [signin, setSignin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(signin.email)) return setError("Informe um e-mail válido.");
    if (signin.password.length < 6) return setError("A senha deve ter ao menos 6 caracteres.");
    setError("");
    
    // Verificação super segura para o Admin (roda no servidor!)
    if (signin.email.toLowerCase().startsWith("admin")) {
      const isOk = await verifyAdminPassword({ data: signin.password });
      if (!isOk) {
        return setError("Senha de administrador incorreta. Acesso negado.");
      }
    }

    const u = login(signin.email);
    toast.success(`Bem-vindo de volta, ${u.name}!`);
    navigate({ to: u.role === "admin" ? "/admin" : "/minhas-viagens" });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signup.name.trim().length < 3) return setError("Informe seu nome completo.");
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(signup.email)) return setError("Informe um e-mail válido.");
    if (signup.password.length < 6) return setError("A senha deve ter ao menos 6 caracteres.");
    setError("");
    login(signup.email, signup.name);
    toast.success("Conta criada! Você já está logado.");
    navigate({ to: "/minhas-viagens" });
  };

  return (
    <SiteLayout>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" /> Clube Voar Brasil
          </span>
          <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">Sua conta, suas viagens</h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground md:text-base">
            Guarde vouchers, acompanhe o status das reservas, receba alertas de preço e resgate cupons exclusivos em
            pacotes nacionais.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Vouchers digitais sempre à mão",
              "Alertas de mudança de voo e check-in",
              "Cupons progressivos a cada viagem concluída",
              "Atendimento prioritário 24 horas",
            ].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-success" aria-hidden="true" /> {i}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-xl bg-secondary p-4 text-xs text-muted-foreground">
            Ambiente de demonstração: qualquer e-mail e senha funcionam. Use um e-mail iniciando com{" "}
            <strong>admin</strong> (ex.: admin@voarbrasil.com) para acessar o painel administrativo.
          </p>
        </div>

        <div className="surface-card p-6">
          {user ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Você está conectado como</p>
              <p className="mt-1 text-lg font-bold">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                {user.email} • {user.role}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Button asChild variant="highlight">
                  <Link to="/minhas-viagens">Ir para minhas viagens</Link>
                </Button>
                <Button variant="outline" onClick={() => logout()}>
                  Sair da conta
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="entrar">
              <TabsList className="w-full">
                <TabsTrigger value="entrar" className="flex-1">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="cadastrar" className="flex-1">
                  Criar conta
                </TabsTrigger>
              </TabsList>

              {error && (
                <p role="alert" className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
                  {error}
                </p>
              )}

              <TabsContent value="entrar">
                <form className="mt-4 space-y-4" onSubmit={handleSignin}>
                  <div>
                    <Label htmlFor="login-email" className="mb-1.5 text-xs font-semibold">
                      E-mail
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={signin.email}
                      onChange={(e) => setSignin({ ...signin, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-pass" className="mb-1.5 text-xs font-semibold">
                      Senha
                    </Label>
                    <Input
                      id="login-pass"
                      type="password"
                      autoComplete="current-password"
                      value={signin.password}
                      onChange={(e) => setSignin({ ...signin, password: e.target.value })}
                    />
                  </div>
                  <Button type="submit" variant="highlight" size="lg" className="w-full">
                    <LogIn className="size-4" aria-hidden="true" /> Entrar
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="cadastrar">
                <form className="mt-4 space-y-4" onSubmit={handleSignup}>
                  <div>
                    <Label htmlFor="new-name" className="mb-1.5 text-xs font-semibold">
                      Nome completo
                    </Label>
                    <Input
                      id="new-name"
                      autoComplete="name"
                      value={signup.name}
                      onChange={(e) => setSignup({ ...signup, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-email" className="mb-1.5 text-xs font-semibold">
                      E-mail
                    </Label>
                    <Input
                      id="new-email"
                      type="email"
                      autoComplete="email"
                      value={signup.email}
                      onChange={(e) => setSignup({ ...signup, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-pass" className="mb-1.5 text-xs font-semibold">
                      Crie uma senha
                    </Label>
                    <Input
                      id="new-pass"
                      type="password"
                      autoComplete="new-password"
                      value={signup.password}
                      onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                    />
                  </div>
                  <Button type="submit" variant="highlight" size="lg" className="w-full">
                    Criar minha conta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
