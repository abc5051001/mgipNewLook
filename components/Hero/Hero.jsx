import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { FadeIn } from "../FadeIn";
import bgImage from "../../pictures/washington_white.webp";

export default function Hero({ onLearnMoreClick }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 text-center">
        <FadeIn>
          {/* Eyebrow */}
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Intellectual Property Law · Washington, D.C. Metro Area
          </p>

          {/* Firm name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            MUNCY, GEISSLER,
            <br />
            <span className="text-brand-teal">OLDS &amp; LOWE</span>, P.C.
          </h1>

          {/* Tagline */}
          <p className="mt-8 mx-auto max-w-2xl text-lg sm:text-xl text-white leading-relaxed font-light">
            An Intellectual Property Firm in the Washington, D.C. Metro Area, specializing in Engineering, Science, and Legal Expertise.


          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="white"
              size="xl"
              onClick={onLearnMoreClick}
              className="rounded-full"
            >
              Learn More
            </Button>
            <Button
              variant="outline-white"
              size="xl"
              onClick={() => (window.location.href = "/contact")}
              className="rounded-full"
            >
              Contact Us
            </Button>
          </div>
        </FadeIn>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onLearnMoreClick}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors"
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" />
      </button>
    </section>
  );
}
