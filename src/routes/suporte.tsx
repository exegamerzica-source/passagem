import { createFileRoute } from "@tanstack/react-router";
import { Clock, Headphones, Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/travel/Bits";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/suporte")({
  head: () => ({
    meta: [
      { title: "Central de ajuda e atendimento | Voar Brasil" },
      {
        name: "description",
        content:
          "Fale com a CVC BRASILpor telefone, WhatsApp ou e-mail, tire dúvidas sobre reservas, vouchers, bagagem e cancelamentos.",
      },
      { property: "og:title", content: "Central de ajuda e atendimento | Voar Brasil" },
      { property: "og:description", content: "Atendimento 24h para reservas, vouchers e alterações de viagem." },
    ],
  }),
  component: Suporte,
});

const FAQ = [
  {
    q: "Como recebo meu voucher de viagem?",
    a: "O voucher é enviado por e-mail imediatamente após a confirmação do pagamento e também fica disponível em Minhas viagens, na sua conta.",
  },
  {
    q: "Posso alterar as datas da minha reserva?",
    a: "Sim. Alterações podem ser solicitadas até 21 dias antes da saída, sujeitas à disponibilidade e à diferença tarifária da nova data.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Cartão de crédito em até 10x sem juros, cartão de débito, Pix com desconto e boleto bancário com vencimento em 1 dia útil.",
  },
  {
    q: "Preciso de documento para embarcar em voos nacionais?",
    a: "Sim. É necessário documento oficial com foto (RG, CNH ou passaporte) válido. Menores de 16 anos precisam de autorização quando não acompanhados pelos pais.",
  },
  {
    q: "O que acontece se meu voo atrasar ou for cancelado?",
    a: "Nossa equipe monitora todos os voos e reacomoda automaticamente os passageiros. Você é avisado por e-mail e WhatsApp sobre qualquer mudança.",
  },
  {
    q: "Como funciona o seguro viagem?",
    a: "É opcional e pode ser incluído no checkout. Cobre despesas médicas, bagagem extraviada e cancelamento por motivos previstos em apólice.",
  },
];

function Suporte() {
  const [form, setForm] = useState({ name: "", email: "", code: "", subject: "Dúvida sobre reserva", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3 || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(form.email) || form.message.trim().length < 10) {
      toast.error("Preencha nome, e-mail válido e uma mensagem com pelo menos 10 caracteres.");
      return;
    }
    toast.success("Mensagem enviada! Nosso time responde em até 2 horas úteis.");
    setForm({ name: "", email: "", code: "", subject: "Dúvida sobre reserva", message: "" });
  };

  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-brand py-10 text-primary-foreground">
        <div className="container-page">
          <h1 className="text-3xl font-extrabold md:text-4xl">Central de ajuda</h1>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80 md:text-base">
            Atendimento humano 24 horas, todos os dias, antes, durante e depois da sua viagem.
          </p>
        </div>
      </section>

      <div className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Phone, title: "Telefone", value: "0800 555 2026", hint: "Ligação gratuita" },
            { icon: MessageCircle, title: "WhatsApp", value: "(11) 99000-2026", hint: "Resposta em minutos" },
            { icon: Mail, title: "E-mail", value: "ajuda@voarbrasil.com.br", hint: "Até 2h úteis" },
            { icon: Clock, title: "Horário", value: "24 horas", hint: "7 dias por semana" },
          ].map(({ icon: Icon, title, value, hint }) => (
            <div key={title} className="surface-card hover-lift p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-sm font-bold">{title}</h2>
              <p className="text-sm font-semibold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Perguntas frequentes" title="Dúvidas mais comuns" />
            <Accordion type="single" collapsible>
              {FAQ.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div>
            <SectionHeading eyebrow="Fale com a gente" title="Enviar uma mensagem" />
            <form className="surface-card space-y-4 p-5" onSubmit={submit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="s-name" className="mb-1.5 text-xs font-semibold">
                    Nome
                  </Label>
                  <Input id="s-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="s-email" className="mb-1.5 text-xs font-semibold">
                    E-mail
                  </Label>
                  <Input
                    id="s-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="s-code" className="mb-1.5 text-xs font-semibold">
                    Código da reserva (opcional)
                  </Label>
                  <Input
                    id="s-code"
                    placeholder="VB-123456"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="s-subject" className="mb-1.5 text-xs font-semibold">
                    Assunto
                  </Label>
                  <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                    <SelectTrigger id="s-subject">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Dúvida sobre reserva",
                        "Alteração de datas",
                        "Cancelamento e reembolso",
                        "Problema no pagamento",
                        "Outro assunto",
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="s-msg" className="mb-1.5 text-xs font-semibold">
                  Mensagem
                </Label>
                <Textarea
                  id="s-msg"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <Button type="submit" variant="highlight" size="lg" className="w-full">
                <Headphones className="size-4" aria-hidden="true" /> Enviar mensagem
              </Button>
            </form>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
