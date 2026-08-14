"use client";

import { Search, X } from "lucide-react";

interface RoleSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function RoleSearch({
  value,
  onChange,
  placeholder = "Search roles...",
  disabled = false,
}: RoleSearchProps) {
  const hasValue = value.trim().length > 0;

  const handleClear = () => {
    if (disabled) return;
    onChange("");
  };

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <Search
        size={18}
        aria-hidden="true"
        className="
          pointer-events-none absolute left-3.5 top-1/2 z-10
          -translate-y-1/2
          text-muted-foreground
        "
      />

      {/* Search Input */}
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        className="
          h-11 w-full appearance-none rounded-xl
          border border-border
          bg-card
          pl-10 pr-11
          text-sm text-foreground
          shadow-sm
          outline-none
          transition-colors duration-200

          placeholder:text-muted-foreground

          hover:border-input

          focus:border-primary
          focus:ring-4
          focus:ring-ring/20

          disabled:cursor-not-allowed
          disabled:opacity-60

          [&::-webkit-search-cancel-button]:appearance-none
          [&::-webkit-search-decoration]:appearance-none
        "
      />

      {/* Clear Button */}
      {hasValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear role search"
          title="Clear search"
          className="
            absolute right-2.5 top-1/2
            flex h-7 w-7
            -translate-y-1/2
            items-center justify-center
            rounded-lg
            text-muted-foreground
            transition-colors duration-150

            hover:bg-secondary
            hover:text-foreground

            focus:outline-none
            focus:ring-2
            focus:ring-ring/30
          "
        >
          <X
            size={15}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}