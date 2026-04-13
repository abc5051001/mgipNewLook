import { FadeIn } from "../FadeIn";
import { Button } from "../ui/button";
import PageHero from "../ui/PageHero";
import { Separator } from "../ui/separator";
import { CheckCircle2, ExternalLink, Users, Scale, Lightbulb, Heart } from "lucide-react";

const perks = [
  { icon: Users, title: "Collaborative Culture", desc: "Work alongside top legal and technical professionals in a collegial environment." },
  { icon: Scale, title: "IP Focus", desc: "Deepen your expertise in Patent, Trademark, and Copyright law from day one." },
  { icon: Lightbulb, title: "Technical Innovation", desc: "Engage with cutting-edge inventions across engineering, software, biotech, and more." },
  { icon: Heart, title: "Comprehensive Benefits", desc: "We offer a competitive compensation package and equal opportunity employment." },
];

export function Careers() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PageHero
        eyebrow="Join Our Team"
        title="Career Opportunities"
        subtitle="We welcome talented individuals eager to contribute to a dynamic intellectual property law practice."
      />
      {/* Body */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left – description */}
          <FadeIn>
            <h2 className="text-2xl font-bold text-brand-navy mb-5">Why Work With Us?</h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              At Muncy, Geissler, Olds &amp; Lowe PC, we welcome inquiries from
              motivated candidates with a passion for learning, a strong work
              ethic, and an interest in the dynamic fields of patent, trademark,
              and copyright law.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              As an equal opportunity employer, we offer a comprehensive benefits
              package and a clear path for professional growth in a firm that has
              been a leader in IP law since 2006.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {perks.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-muted/30 p-6"
                >
                  <div className="h-10 w-10 rounded-lg bg-brand-navy/5 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-brand-navy" />
                  </div>
                  <p className="font-semibold text-base text-brand-navy mb-2">{title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Right – apply card */}
          <FadeIn>
            <div className="rounded-2xl border border-border bg-white shadow-sm p-8 sticky top-28">
              <h2 className="text-xl font-bold text-brand-navy mb-2">Open Positions</h2>
              <p className="text-sm text-muted-foreground mb-6">
                View all current openings and apply through our recruiting portal.
              </p>

              <Separator className="mb-6" />

              <ul className="space-y-3 mb-8">
                {[
                  "Patent Prosecution (Electrical / Mechanical)",
                  "Trademark Associates",
                  "Technical Advisors",
                  "Administrative & Support Staff",
                ].map((role) => (
                  <li key={role} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-brand-teal shrink-0" />
                    {role}
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="w-full gap-2"
                onClick={() =>
                  window.open(
                    "https://recruiting.paylocity.com/recruiting/jobs/All/5847c0ea-c9f8-4ed7-8865-cbd0d03e3e2d/Muncy-Geissler-Olds-Lowe-PC",
                    "_blank"
                  )
                }
              >
                View All Openings
                <ExternalLink size={15} />
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Opens our recruiting portal in a new tab.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
