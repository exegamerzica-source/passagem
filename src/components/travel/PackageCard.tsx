import { Link } from "@tanstack/react-router";
import { BedDouble, CalendarDays, MapPin, Plane, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscountTag, ProductBadge, RatingBadge, Stars } from "./Bits";
import { img } from "@/data/images";
import type { Destination, Hotel, TravelPackage } from "@/data/types";
import { brl, brlCents, dateShort, discountPct } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  pkg: TravelPackage;
  hotel?: Hotel | undefined;
  destination?: Destination | undefined;
  layout?: "grid" | "row" | undefined;
}

export function PackageCard({ pkg, hotel, destination, layout = "grid" }: Props) {
  const off = discountPct(pkg.price, pkg.oldPrice);
  const image = img(hotel?.image ?? destination?.image ?? "hero");

  return (
    <article
      className={cn(
        "surface-card hover-lift group flex overflow-hidden",
        layout === "grid" ? "flex-col" : "flex-col sm:flex-row",
      )}
    >
      <div className={cn("relative overflow-hidden", layout === "grid" ? "h-48" : "sm:w-72 sm:shrink-0")}>
        <img
          src={image}
          alt={`${hotel?.name ?? pkg.title} — ${destination?.name ?? "destino"}`}
          loading="lazy"
          width={960}
          height={640}
          className={cn(
            "size-full object-cover transition-transform duration-500 group-hover:scale-105",
            layout === "row" && "h-48 sm:h-full",
          )}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {pkg.badges.map((b) => (
            <ProductBadge key={b} label={b} />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <MapPin className="size-3.5 text-highlight" aria-hidden="true" />
          {pkg.origin} → {destination?.name ?? "Destino"}, {destination?.uf}
        </p>
        <h3 className="mt-1.5 text-base font-bold leading-snug md:text-lg">
          <Link to="/pacotes/$slug" params={{ slug: pkg.slug }} className="hover:text-primary">
            {pkg.title}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {dateShort(pkg.departure)} a {dateShort(pkg.ret)} • {pkg.nights} noites
          </span>
          <span className="inline-flex items-center gap-1">
            <Utensils className="size-3.5" aria-hidden="true" />
            {pkg.board}
          </span>
          <span className="inline-flex items-center gap-1">
            <Plane className="size-3.5" aria-hidden="true" />
            {pkg.flight.stops === 0 ? "Voo direto" : `${pkg.flight.stops} conexão`}
          </span>
          {pkg.transfer && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" aria-hidden="true" /> Traslado incluso
            </span>
          )}
        </div>

        {hotel && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <Link
              to="/hoteis/$slug"
              params={{ slug: hotel.slug }}
              className="text-sm font-semibold hover:text-primary"
            >
              {hotel.name}
            </Link>
            <Stars value={hotel.stars} />
            <RatingBadge value={hotel.rating} />
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            {off > 0 && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <s>{brl(pkg.oldPrice)}</s>
                <DiscountTag percent={off} />
              </p>
            )}
            <p className="text-xs text-muted-foreground">A partir de</p>
            <p className="font-display text-2xl font-extrabold text-primary">
              {brl(pkg.price)}
              <span className="ml-1 text-xs font-semibold text-muted-foreground">por pessoa</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Em até {pkg.installments}x de {brlCents(pkg.price / pkg.installments)} sem juros
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {pkg.seats <= 6 && <span className="text-xs font-bold text-destructive">Restam {pkg.seats} vagas</span>}
            <Button asChild variant="highlight">
              <Link to="/pacotes/$slug" params={{ slug: pkg.slug }}>
                Ver oferta
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
