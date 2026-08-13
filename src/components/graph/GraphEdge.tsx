"use client";

interface GraphEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  label?: string;

  active?: boolean;
  dashed?: boolean;

  className?: string;
}

export default function GraphEdge({
  x1,
  y1,
  x2,
  y2,
  label,
  active = false,
  dashed = false,
  className = "",
}: GraphEdgeProps) {
  // ============================================================
  // LINE GEOMETRY
  // ============================================================

  const dx = x2 - x1;
  const dy = y2 - y1;

  const length = Math.sqrt(dx * dx + dy * dy);

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const labelX = (x1 + x2) / 2;
  const labelY = (y1 + y2) / 2;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <g
      className={`
        pointer-events-none
        transition-opacity
        duration-200
        ${active ? "opacity-100" : "opacity-60"}
        ${className}
      `}
    >
      {/* ========================================================
          EDGE LINE
      ======================================================== */}

      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={active ? 2.5 : 1.5}
        strokeDasharray={dashed ? "6 5" : undefined}
        strokeLinecap="round"
        className={
          active
            ? "text-primary"
            : "text-border"
        }
      />

      {/* ========================================================
          ARROW
      ======================================================== */}

      {length > 20 && (
        <polygon
          points="0,-4 8,0 0,4"
          fill="currentColor"
          className={
            active
              ? "text-primary"
              : "text-muted-foreground"
          }
          transform={`
            translate(${x2} ${y2})
            rotate(${angle})
          `}
        />
      )}

      {/* ========================================================
          RELATIONSHIP LABEL
      ======================================================== */}

      {label && length > 120 && (
        <g
          transform={`
            translate(${labelX} ${labelY})
          `}
        >
          {/* Label Background */}

          <rect
            x="-42"
            y="-11"
            width="84"
            height="22"
            rx="6"
            className="
              fill-card
              stroke-border
            "
          />

          {/* Label Text */}

          <text
            x="0"
            y="4"
            textAnchor="middle"
            className="
              fill-muted-foreground
              text-[10px]
              font-medium
            "
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
}