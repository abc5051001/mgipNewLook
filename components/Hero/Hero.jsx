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
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/35" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 text-center">
        <FadeIn>
          {/* Eyebrow */}
          <p className="mb-6 font-display text-base font-semibold text-white/85">
            Intellectual Property Law · Washington, D.C. Metro Area
          </p>

          {/* Firm name */}
          <h1 className="font-display text-5xl font-semibold tracking-tight text-white [text-wrap:balance] sm:text-6xl lg:text-7xl">
            Muncy, Geissler,
            <br />
            Olds &amp; Lowe, P.C.
          </h1>

          {/* Tagline */}
          <p className="mt-8 mx-auto max-w-2xl text-xl text-white/85 leading-relaxed font-base">
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
