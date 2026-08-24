import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingBadge, Stars } from "./Bits";
import { img } from "@/data/images";
import type { Hotel } from "@/data/types";
import { brl } from "@/lib/format";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="surface-card hover-lift group flex flex-col overflow-hidden">
      <div className="h-44 overflow-hidden">
        <img
          src={img(hotel.image)}
          alt={hotel.name}
          loading="lazy"
          width={960}
          height={640}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <Stars value={hotel.stars} />
          <span className="text-xs font-semibold text-muted-foreground">{hotel.board}</span>
        </div>
        <h3 className="mt-1.5 text-base font-bold">
          <Link to="/hoteis/$slug" params={{ slug: hotel.slug }} className="hover:text-primary">
            {hotel.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {hotel.address}
        </p>
        <div className="mt-2">
          <RatingBadge value={hotel.rating} reviews={hotel.reviews} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="text-sm">
            <span className="block text-xs text-muted-foreground">Diária a partir de</span>
            <span className="font-display text-xl font-extrabold text-primary">{brl(hotel.nightPrice)}</span>
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/hoteis/$slug" params={{ slug: hotel.slug }}>
              Ver hotel
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
