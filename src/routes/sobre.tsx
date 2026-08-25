import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Building2, Globe2, HeartHandshake, Plane, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/travel/Bits";
import { Button } from "@/components/ui/button";
import { img } from "@/data/images";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a CVC BRASIL— agência de viagens nacional" },
      {
        name: "description",
        content:
          "Conheça a Voar Brasil: mais de 20 anos organizando pacotes nacionais, com lojas físicas, consultores especializados e atendimento 24h.",
      },
      { property: "og:title", content: "Sobre a CVC BRASIL— agência de viagens nacional" },
      {
        property: "og:description",
        content: "Nossa história, números e compromisso com quem viaja pelo Brasil.",
      },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <img
          src={img("hero")}
          alt="Litoral brasileiro visto do alto"
          width={1920}
          height={900}
          className="h-72 w-full object-cover md:h-96"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-page absolute inset-x-0 bottom-8 text-primary-foreground">
          <h1 className="max-w-2xl text-3xl font-extrabold drop-shadow md:text-5xl">
            Há 20 anos levando brasileiros para conhecer o Brasil
          </h1>
        </div>
      </section>

      <div className="container-page py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, value: "1,8 milhão", label: "de clientes atendidos" },
            { icon: Building2, value: "230 lojas", label: "em 24 estados" },
            { icon: Plane, value: "+3.400", label: "saídas mensais garantidas" },
            { icon: Award, value: "4,8/5", label: "média de avaliação" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="surface-card p-5 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-3 font-display text-2xl font-extrabold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="Nossa história" title="Uma agência nascida na rodoviária de Santos" />
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                A CVC BRASILcomeçou em 2006 com uma sala de 20m² e uma ideia simples: organizar viagens nacionais com
                preço justo, parcelamento honesto e alguém de verdade do outro lado do telefone.
              </p>
              <p>
                Duas décadas depois, operamos voos fretados para o Nordeste, blocos de apartamentos em resorts e
                excursões próprias na serra gaúcha e mineira. Nossa curadoria é feita por consultores que visitam
                pessoalmente os hotéis que vendem.
              </p>
              <p>
                Somos cadastrados no Ministério do Turismo, associados à ABAV e trabalhamos com pagamento protegido e
                política de cancelamento clara em todas as reservas.
              </p>
            </div>
          </div>
          <img
            src={img("gramado")}
            alt="Rua decorada em destino de serra no Brasil"
            loading="lazy"
            width={1200}
            height={800}
            className="h-80 w-full rounded-2xl object-cover shadow-lg"
          />
        </div>

        <div className="mt-16">
          <SectionHeading
            eyebrow="No que acreditamos"
            title="Compromissos com quem viaja"
            description="Regras claras, preço transparente e suporte de gente que conhece o destino."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: HeartHandshake,
                title: "Transparência total",
                desc: "Preço final com taxas desde a primeira tela, sem surpresa no checkout.",
              },
              {
                icon: Globe2,
                title: "Turismo responsável",
                desc: "Parcerias com operadores locais, guias credenciados e comércio da comunidade.",
              },
              {
                icon: Award,
                title: "Curadoria própria",
                desc: "Cada hotel é vistoriado pelo nosso time antes de entrar no catálogo.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <article key={title} className="surface-card hover-lift p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-highlight/15 text-highlight">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl bg-gradient-brand p-8 text-primary-foreground md:p-12">
          <h2 className="max-w-xl text-2xl font-extrabold md:text-3xl">
            Pronto para a próxima viagem pelo Brasil?
          </h2>
          <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">
            Mais de 3 mil saídas confirmadas por mês, com parcelamento em até 10x sem juros.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="highlight" size="lg">
              <Link to="/pacotes">Ver pacotes</Link>
            </Button>
            <Button asChild variant="onDark" size="lg">
              <Link to="/suporte">Falar com um consultor</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
