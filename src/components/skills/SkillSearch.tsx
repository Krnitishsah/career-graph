"use client";

import { Search, X } from "lucide-react";

interface SkillSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SkillSearch({
  value,
  onChange,
  placeholder = "Search skills...",
  disabled = false,
}: SkillSearchProps) {
  const hasValue = value.trim().length > 0;

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <Search
        size={18}
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-3.5 top-1/2 z-10
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
        className="
          h-11 w-full
          rounded-xl
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

          [&::-webkit-search-cancel-button]:hidden
          [&::-webkit-search-decoration]:hidden
        "
      />

      {/* Custom Clear Button */}
      {hasValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear skill search"
          title="Clear search"
          className="
            absolute right-2.5 top-1/2
            z-10
            flex h-7 w-7
            -translate-y-1/2
            items-center justify-center
            rounded-lg
            text-muted-foreground
            transition-colors

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