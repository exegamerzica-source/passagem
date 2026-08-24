import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PackageBadge } from "@/data/types";
import { Skeleton } from "@/components/ui/skeleton";

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} estrelas`}>
      {Array.from({ length: value }).map((_, i) => (
        <Star key={i} className="size-3.5 fill-warning text-warning" aria-hidden="true" />
      ))}
    </span>
  );
}

export function RatingBadge({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <span className="rounded-md bg-primary px-1.5 py-1 font-bold text-primary-foreground">
        {value.toFixed(1).replace(".", ",")}
      </span>
      <span className="text-muted-foreground">
        {value >= 9 ? "Excelente" : value >= 8.5 ? "Muito bom" : "Bom"}
        {reviews ? ` • ${reviews.toLocaleString("pt-BR")} avaliações` : ""}
      </span>
    </span>
  );
}

const BADGE_STYLES: Record<PackageBadge, string> = {
  "Oferta especial": "bg-gradient-highlight text-highlight-foreground",
  "Mais vendido": "bg-primary text-primary-foreground",
  "Últimas vagas": "bg-destructive text-destructive-foreground",
  "Melhor preço": "bg-success text-success-foreground",
};

export function ProductBadge({ label }: { label: PackageBadge }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm",
        BADGE_STYLES[label],
      )}
    >
      {label}
    </span>
  );
}

export function DiscountTag({ percent }: { percent: number }) {
  if (percent <= 0) return null;
  return (
    <span className="inline-flex items-center rounded-md bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
      -{percent}%
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-highlight">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-extrabold md:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm text-muted-foreground md:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-2xl" aria-hidden="true">
        🧭
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
