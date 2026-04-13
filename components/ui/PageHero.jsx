import { FadeIn } from "../FadeIn";

/**
 * Reusable page hero banner with layered decorative shapes.
 * Props:
 *   eyebrow  – small label above the heading
 *   title    – h1 text
 *   subtitle – paragraph below the heading
 */
export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <div className="relative bg-brand-navy overflow-hidden pt-32 pb-16">

      {/* ── Decorative shapes ── */}

      {/* Large dark ellipse — bottom-right anchor */}
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full"
        style={{ background: "#1e2d3d" }}
      />

      {/* Medium brand-blue circle — top-right */}
      <div
        className="pointer-events-none absolute -top-16 right-1/3 h-72 w-72 rounded-full opacity-40"
        style={{ background: "#3a5570" }}
      />

      {/* Smaller teal accent — top-left bleed */}
      <div
        className="pointer-events-none absolute -top-10 -left-16 h-56 w-56 rounded-full opacity-25"
        style={{ background: "#5B9A93" }}
      />

      {/* Thin diagonal band */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, transparent 55%, rgba(55,80,105,0.35) 55%, rgba(55,80,105,0.35) 70%, transparent 70%)",
        }}
      />

      {/* Subtle bottom-left circle */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 -translate-y-1/2 rounded-full opacity-20"
        style={{ background: "#577C8E" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal mb-3">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-white/65 text-lg max-w-xl">{subtitle}</p>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
