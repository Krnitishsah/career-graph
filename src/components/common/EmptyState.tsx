import type { LucideIcon } from "lucide-react";
import { Database, Plus } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title = "No data available",
  description = "There is no data to display at the moment.",
  icon: Icon = Database,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center ${className}`}
    >
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <Icon size={26} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <h3 className="mt-5 text-base font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {/* Action */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}