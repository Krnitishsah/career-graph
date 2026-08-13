// ============================================================
// FORMATTERS
// ============================================================

// ============================================================
// STRING FORMATTERS
// ============================================================

export function capitalize(
  value: string
): string {
  if (!value) {
    return "";
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

export function capitalizeWords(
  value: string
): string {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .split(/\s+/)
    .map(capitalize)
    .join(" ");
}

export function toTitleCase(
  value: string
): string {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(capitalize)
    .join(" ");
}

// ============================================================
// SLUG FORMATTERS
// ============================================================

export function slugify(
  value: string
): string {
  if (!value) {
    return "";
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function unslugify(
  value: string
): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(capitalize)
    .join(" ");
}

// ============================================================
// TEXT FORMATTERS
// ============================================================

export function truncate(
  value: string,
  maxLength: number
): string {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(
    0,
    Math.max(0, maxLength - 3)
  )}...`;
}

export function stripHtml(
  value: string
): string {
  if (!value) {
    return "";
  }

  return value.replace(
    /<[^>]*>/g,
    ""
  );
}

export function normalizeWhitespace(
  value: string
): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// NUMBER FORMATTERS
// ============================================================

export function formatNumber(
  value: number
): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-IN"
  ).format(value);
}

export function formatDecimal(
  value: number,
  decimals = 2
): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toFixed(decimals);
}

// ============================================================
// PERCENTAGE FORMATTERS
// ============================================================

export function formatPercentage(
  value: number,
  decimals = 0
): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${value.toFixed(
    decimals
  )}%`;
}

export function clampPercentage(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, value)
  );
}

// ============================================================
// SCORE FORMATTERS
// ============================================================

export function formatMatchScore(
  score: number
): string {
  return formatPercentage(
    clampPercentage(score)
  );
}

export function getMatchLevel(
  score: number
): "excellent" | "good" | "average" | "low" {
  const normalized =
    clampPercentage(score);

  if (normalized >= 80) {
    return "excellent";
  }

  if (normalized >= 60) {
    return "good";
  }

  if (normalized >= 40) {
    return "average";
  }

  return "low";
}

// ============================================================
// DATE FORMATTERS
// ============================================================

export function formatDate(
  value: string | Date | null | undefined
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

export function formatDateTime(
  value: string | Date | null | undefined
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

// ============================================================
// ARRAY FORMATTERS
// ============================================================

export function unique<T>(
  values: T[]
): T[] {
  return [...new Set(values)];
}

export function uniqueBy<T>(
  values: T[],
  key: (item: T) => string | number
): T[] {
  const seen = new Set<
    string | number
  >();

  return values.filter((item) => {
    const value = key(item);

    if (seen.has(value)) {
      return false;
    }

    seen.add(value);

    return true;
  });
}

// ============================================================
// CATEGORY FORMATTERS
// ============================================================

export function formatCategory(
  category: string
): string {
  if (!category) {
    return "";
  }

  return category
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(capitalize)
    .join(" ");
}

// ============================================================
// LEVEL FORMATTERS
// ============================================================

export function formatLevel(
  level: string
): string {
  if (!level) {
    return "";
  }

  return level
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(capitalize)
    .join(" ");
}

// ============================================================
// SALARY FORMATTERS
// ============================================================

export function formatSalary(
  value: number,
  currency = "INR"
): string {
  if (!Number.isFinite(value)) {
    return "";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(value);
}

// ============================================================
// ID FORMATTERS
// ============================================================

export function shortId(
  value: string,
  length = 8
): string {
  if (!value) {
    return "";
  }

  if (value.length <= length) {
    return value;
  }

  return value.slice(0, length);
}

// ============================================================
// SEARCH FORMATTER
// ============================================================

export function normalizeSearch(
  value: string
): string {
  return normalizeWhitespace(
    value
  ).toLowerCase();
}