// Loboto-Me · Custom inline SVG logo.
// A clinical "L+M" monogram: an ink slab inside a target-circle (Müller-Brockmann red),
// with an aqua tick echoing a clinical chart line. Works monochrome via currentColor.
export function Logo({ className = "", title = "Loboto-Me" }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* Outer red target — atomic mark */}
      <circle cx="32" cy="32" r="29" fill="hsl(var(--atomic))" />
      <circle cx="32" cy="32" r="22" fill="hsl(var(--paper))" />
      {/* L slab */}
      <path d="M18 18 H26 V40 H40 V46 H18 Z" fill="hsl(var(--ink))" />
      {/* M dot — vault yellow */}
      <circle cx="44" cy="22" r="5" fill="hsl(var(--vault))" />
      {/* Aqua chart-tick */}
      <path
        d="M14 50 H30 L34 44 L40 54 L50 50"
        stroke="hsl(var(--aqua))"
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo className="h-8 w-8" />
      <div className="leading-none">
        <div className="display-slab text-lg tracking-tight">
          Loboto<span className="text-atomic">·</span>Me
        </div>
        <div className="eyebrow text-[0.55rem] tracking-[0.28em]">A Concept Marketplace</div>
      </div>
    </div>
  );
}
