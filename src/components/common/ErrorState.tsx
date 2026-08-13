import type { LucideIcon } from "lucide-react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load the requested data. Please try again.",
  icon: Icon = AlertCircle,
  actionLabel = "Try again",
  onAction,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-red-100 bg-white px-6 py-12 text-center ${className}`}
    >
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-600">
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
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RefreshCw size={15} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}