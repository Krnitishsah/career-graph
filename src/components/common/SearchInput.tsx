"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
  disabled = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState("");

  const searchValue = value ?? internalValue;

  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  };

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue("");
    }

    onClear?.();
    onChange?.("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Icon */}
      <Search
        size={18}
        strokeWidth={1.8}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />

      {/* Input */}
      <input
        type="search"
        value={searchValue}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />

      {/* Clear Button */}
      {searchValue && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}