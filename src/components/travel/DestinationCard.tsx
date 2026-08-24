import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { img } from "@/data/images";
import type { Destination } from "@/data/types";
import { brl } from "@/lib/format";

export function DestinationCard({ destination, tall = false }: { destination: Destination; tall?: boolean }) {
  return (
    <article className="hover-lift group relative overflow-hidden rounded-2xl border border-border shadow-card">
      <img
        src={img(destination.image)}
        alt={`${destination.name}, ${destination.uf}`}
        loading="lazy"
        width={960}
        height={640}
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
          tall ? "h-80 md:h-[26rem]" : "h-60"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-card-fade" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
          {destination.uf} • {destination.region}
        </p>
        <h3 className="mt-1 text-xl font-extrabold text-primary-foreground">{destination.name}</h3>
        <p className="mt-1 line-clamp-2 max-w-sm text-sm text-primary-foreground/80">{destination.short}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-primary-foreground">
            A partir de <span className="text-highlight">{brl(destination.fromPrice)}</span>
          </p>
          <Link
            to="/destinos/$slug"
            params={{ slug: destination.slug }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary-foreground/30 px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/15"
          >
            Explorar <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
