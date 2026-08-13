import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  loading?: boolean;
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  loading = false,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Icon */}
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon
            className="h-5 w-5 text-primary"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-5">
        <p className="text-sm font-medium text-muted-foreground">
          {title}
        </p>

        {loading ? (
          <div
            className="mt-2 h-9 w-20 animate-pulse rounded-md bg-muted"
            aria-label={`Loading ${title}`}
          />
        ) : (
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        )}

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}