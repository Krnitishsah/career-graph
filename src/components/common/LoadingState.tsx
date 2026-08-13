import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function LoadingState({
  title = "Loading...",
  description = "Please wait while we fetch the data.",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center ${className}`}
    >
      {/* Spinner */}
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Loader2
          size={28}
          strokeWidth={2}
          className="animate-spin"
        />
      </div>

      {/* Content */}
      <h3 className="mt-5 text-base font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}