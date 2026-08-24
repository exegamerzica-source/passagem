import { CreditCard, Headset, Hotel, LifeBuoy, ShieldCheck } from "lucide-react";
import { SectionHeading } from "./Bits";
import { getText } from "@/data/texts";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Compra segura",
    text: "Ambiente monitorado, dados criptografados e antifraude em todas as reservas.",
  },
  {
    icon: Headset,
    title: "Atendimento especializado",
    text: "Consultores de viagem certificados ajudam a montar o roteiro ideal.",
  },
  {
    icon: LifeBuoy,
    title: "Suporte durante a viagem",
    text: "Canal 24h por WhatsApp e telefone enquanto você estiver fora de casa.",
  },
  {
    icon: CreditCard,
    title: "Pagamento protegido",
    text: "Parcele em até 12x sem juros, Pix ou boleto — com estorno garantido.",
  },
  {
    icon: Hotel,
    title: "Parceiros selecionados",
    text: "Hotéis e companhias aéreas auditados e reavaliados a cada temporada.",
  },
];

export function TrustSection({ texts }: { texts?: Record<string, string> }) {
  return (
    <section aria-labelledby="confianca" className="container-page py-14 md:py-20">
      <SectionHeading
        eyebrow={getText(texts, "whyBadge")}
        title={getText(texts, "whyTitle")}
        description={getText(texts, "whyDesc")}
      />
      <h2 id="confianca" className="sr-only">
        {getText(texts, "whyBadge")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="surface-card p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-sm font-bold">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <dl className="mt-8 grid gap-4 rounded-2xl bg-gradient-brand p-6 text-primary-foreground sm:grid-cols-4">
        {[
          [getText(texts, "whyStat1Value"), getText(texts, "whyStat1Label")],
          [getText(texts, "whyStat2Value"), getText(texts, "whyStat2Label")],
          [getText(texts, "whyStat3Value"), getText(texts, "whyStat3Label")],
          [getText(texts, "whyStat4Value"), getText(texts, "whyStat4Label")],
        ].map(([value, label]) => (
          <div key={label}>
            <dt className="font-display text-2xl font-extrabold text-highlight">{value}</dt>
            <dd className="text-sm text-primary-foreground/80">{label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
