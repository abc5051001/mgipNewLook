import { useState } from "react";
import { FadeIn, FadeInStagger } from "../FadeIn";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Globe,
  MapPin,
  Gavel,
  ShieldCheck,
  Briefcase,
  Languages,
  X,
  CheckCircle2,
  Lightbulb,
  BadgeCheck,
  Copyright,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────── */
const services = [
  {
    icon: Lightbulb,
    title: "Patent",
    description:
      "Patents are granted for inventions that are novel, non-obvious, and useful — covering new processes, machines, manufactures, compositions of matter, and improvements thereof.",
    details: [
      {
        heading: "Application Drafting",
        body: "Our skilled professionals draft high-quality patent applications that accurately describe your inventions, maximizing approval likelihood.",
      },
      {
        heading: "Office Action Responses",
        body: "Strategic guidance and expert responses to patent examiner objections, advocating effectively for your application's approval.",
      },
      {
        heading: "Portfolio Management",
        body: "Comprehensive management services including deadline monitoring, portfolio expansion evaluation, and IP asset optimization.",
      },
    ],
  },
  {
    icon: BadgeCheck,
    title: "Trademark",
    description:
      "A trademark is a distinctive sign used to identify and distinguish goods or services — encompassing words, names, logos, slogans, symbols, designs, colors, sounds, and more.",
    details: [
      {
        heading: "Search & Clearance",
        body: "Thorough trademark searches assessing availability and registrability, identifying potential conflicts to minimize infringement risk.",
      },
      {
        heading: "Application Filing",
        body: "Preparation and filing of trademark applications ensuring compliance with all legal requirements for successful registration.",
      },
      {
        heading: "Monitoring & Enforcement",
        body: "Proactive monitoring services safeguarding your trademarks against unauthorized use, with enforcement strategies to protect your brand.",
      },
    ],
  },
  {
    icon: Copyright,
    title: "Copyright",
    description:
      "Copyright grants exclusive rights to creators of original works — protecting literary, artistic, musical, and dramatic works, as well as software code and architectural designs.",
    details: [
      {
        heading: "Registration",
        body: "Registering your original works with copyright offices, providing the strongest available legal protection and enforcement rights.",
      },
      {
        heading: "Licensing & Agreements",
        body: "Drafting and negotiating copyright licenses, assignments, and agreements to monetize your copyrights while safeguarding your interests.",
      },
      {
        heading: "Digital Rights Management",
        body: "Guidance on DRM strategies to control distribution and access to digital content, mitigating unauthorized copying and exploitation.",
      },
    ],
  },
];

const features = [
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Serving corporations, mid-sized businesses, start-ups, and universities globally with tailored IP strategies.",
  },
  {
    icon: MapPin,
    title: "Prime Location",
    description:
      "Located in the D.C. metro area, minutes from the USPTO — providing convenient and timely support.",
  },
  {
    icon: Gavel,
    title: "Technical Expertise",
    description:
      "Attorneys with technical and scientific backgrounds, many with prior experience as USPTO patent examiners.",
  },
  {
    icon: Briefcase,
    title: "Cost-Effective",
    description:
      "Committed to delivering top-quality work with efficiency and cost-effectiveness for exceptional results.",
  },
  {
    icon: ShieldCheck,
    title: "Swift Protection",
    description:
      "Focused on securing intellectual property protection quickly and affordably for our clients.",
  },
  {
    icon: Languages,
    title: "Multilingual",
    description:
      "Multilingual proficiency supporting the IP needs of global businesses: English, Español, Deutsch, Italiano, Русский, 繁體中文, 简体中文, 日本語, 한국인.",
  },
];

const milestones = [
  {
    year: "2006",
    title: "A Year of Beginnings",
    events: [
      "Firm founded by Martin Geissler and Mark Olds",
      "Scott Lowe joins as Principal Shareholder",
    ],
  },
  {
    year: "2008",
    title: "Growth & Expansion",
    events: [
      "Firm relocates to Fairfax County, Virginia",
      "Joe (Ken) Muncy joins as Principal Shareholder",
    ],
  },
  {
    year: "2010",
    title: "New Leadership",
    events: ["John Ciccozzi joins as Principal Shareholder"],
  },
  {
    year: "2013",
    title: "Expanding the Team",
    events: ["Daniel Podhajny joins as Principal Shareholder"],
  },
  {
    year: "2016",
    title: "10 Years of Excellence",
    events: [
      "Celebrating a decade of service",
      "Trademark department proudly expands",
    ],
  },
  {
    year: "2021",
    title: "New Principals",
    events: [
      "Scott M. Tulino joins as Principal Shareholder",
      "Aaron J. Sanders joins as Principal Shareholder",
    ],
  },
  {
    year: "2022",
    title: "Alexandria, VA",
    events: [
      "Firm relocates to Alexandria, VA",
      "Conveniently located near the USPTO",
    ],
  },
];

const stats = [
  { value: "2006", label: "Year Founded" },
  { value: "60+", label: "Professionals" },
  { value: "9+", label: "Languages Spoken" },
  { value: "8", label: "Minutes Away from USPTO" },
];

/* ─── Modal ─────────────────────────────────────────── */
function ServiceModal({ service, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <service.icon className="h-8 w-8 text-brand-teal" />
          <h3 className="text-2xl font-bold text-brand-navy">{service.title}</h3>
        </div>
        <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
        <div className="space-y-5">
          {service.details.map((d, i) => (
            <div key={i} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal" />
              <div>
                <p className="font-semibold text-brand-navy text-sm">{d.heading}</p>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{d.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── InfoSection ───────────────────────────────────── */
export default function InfoSection() {
  const [activeService, setActiveService] = useState(null);

  return (
    <div>
      {/* ── 1. About the Firm ── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal mb-4">
                About Our Firm
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy tracking-tight mb-6">
                Advancing Innovation
                <br />
                Through IP Excellence
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 2006, Muncy, Geissler, Olds &amp; Lowe, PC is a top
                intellectual property law firm in the Washington, D.C. area. We
                provide high-quality, efficient IP services for both domestic
                and international clients, leveraging a multilingual team with
                deep expertise in science, technology, and law. Committed to
                advancing our clients' innovations, we offer tailored solutions
                to meet diverse industry challenges and adapt to the evolving IP
                landscape.
              </p>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeInStagger faster>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <FadeIn key={stat.label}>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-brand-navy">{stat.value}</p>
                    <Separator className="my-3 mx-auto w-8 bg-brand-teal h-0.5" />
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* ── 2. Services ── */}
      <section className="py-24 bg-muted/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal mb-4">
                What We Do
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy tracking-tight">
                Our Services
              </h2>
            </div>
          </FadeIn>

          <FadeInStagger>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((svc, i) => (
                <FadeIn key={i}>
                  <Card className="group h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/60 cursor-pointer">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-navy/5">
                        <svc.icon className="h-7 w-7 text-brand-teal" />
                      </div>
                      <h3 className="text-xl font-bold text-brand-navy mb-3">
                        {svc.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                        {svc.description}
                      </p>
                      <button
                        onClick={() => setActiveService(svc)}
                        className="mt-6 inline-flex items-center text-sm font-semibold text-brand-teal hover:text-brand-navy transition-colors group-hover:gap-2 gap-1"
                      >
                        Learn More
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* ── 3. Why Choose Us ── */}
      <section className="py-24 bg-brand-navy">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal mb-4">
                Why MG-IP
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Built for Exceptional Results
              </h2>
            </div>
          </FadeIn>

          <FadeInStagger>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <FadeIn key={i}>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-teal/20">
                        <Icon className="h-6 w-6 text-brand-teal" />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </FadeInStagger>
        </div>
      </section>

      {/* ── 4. Milestones ── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal mb-4">
                Our History
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy tracking-tight">
                Our Milestones
              </h2>
            </div>
          </FadeIn>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border md:left-1/2" />

            <FadeInStagger>
              {milestones.map((m, i) => {
                const isRight = i % 2 === 0;
                return (
                  <FadeIn key={i}>
                    <div
                      className={`relative mb-10 flex md:items-center ${
                        isRight ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Dot */}
                      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-brand-teal border-2 border-white shadow-md z-10" />

                      {/* Content */}
                      <div
                        className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                          isRight ? "md:pr-8" : "md:pl-8"
                        }`}
                      >
                        <div className="rounded-xl border border-border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                          <span className="inline-block mb-2 text-xs font-bold text-brand-teal uppercase tracking-wider">
                            {m.year}
                          </span>
                          <h4 className="font-semibold text-brand-navy mb-2">{m.title}</h4>
                          <ul className="space-y-1">
                            {m.events.map((evt, j) => (
                              <li
                                key={j}
                                className="text-sm text-muted-foreground flex items-start gap-2"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-teal shrink-0" />
                                {evt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* ── 5. CTA strip ── */}
      <section className="py-20 bg-muted/50 border-t border-border">
        <FadeIn>
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mb-4">
              Ready to Protect Your Innovation?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our team of experienced IP professionals is ready to help you
              navigate the complex landscape of intellectual property law.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full" onClick={() => (window.location.href = "/contact")}>
                Contact Us Today
              </Button>
              <Button variant="outline" size="lg" className="rounded-full" onClick={() => (window.location.href = "/team")}>
                Meet Our Team
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Service modal */}
      {activeService && (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </div>
  );
}
