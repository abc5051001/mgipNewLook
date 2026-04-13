import ContactForm from "./ContactForm";
import { FadeIn } from "../FadeIn";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { Separator } from "../ui/separator";
import PageHero from "../ui/PageHero";
const contactDetails = [
  {
    icon: MapPin,
    label: "Office",
    lines: ["125 S Royal St", "Alexandria, VA 22314"],
    href: "https://maps.google.com/?q=Muncy+Geissler+Olds+Lowe+Alexandria+VA",
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["+1 (703) 621-7140"],
    href: "tel:+17036217140",
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["mailroom@mg-ip.com"],
    href: "mailto:mailroom@mg-ip.com",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    lines: ["Muncy, Geissler, Olds & Lowe"],
    href: "https://www.linkedin.com/company/muncy-geissler-olds-&-lowe/",
    external: true,
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        subtitle="Have a question about protecting your intellectual property? Our team is ready to help."
      />
      {/* Body */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left — contact info + map */}
          <div className="lg:col-span-2">
            <FadeIn>
              <h2 className="text-lg font-semibold text-brand-navy mb-6">Our Office</h2>

              <div className="space-y-5">
                {contactDetails.map(({ icon: Icon, label, lines, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-brand-navy/5 flex items-center justify-center shrink-0 group-hover:bg-brand-navy/10 transition-colors">
                      <Icon className="h-4 w-4 text-brand-navy" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                        {label}
                      </p>
                      {lines.map((line, i) => (
                        <p key={i} className="text-sm text-brand-navy group-hover:text-brand-teal transition-colors">
                          {line}
                          {external && i === lines.length - 1 && (
                            <ExternalLink size={11} className="inline ml-1 opacity-60" />
                          )}
                        </p>
                      ))}
                    </div>
                  </a>
                ))}
              </div>

              <Separator className="my-8" />

              {/* Map embed */}
              <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12437.201206246542!2d-77.0503829!3d38.8026719!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b64f449e66070f%3A0x112d2d84c8d832f5!2sMuncy%2C%20Geissler%2C%20Olds%20%26%20Lowe%2C%20P.C.!5e0!3m2!1sen!2sus!4v1730179648591!5m2!1sen!2sus"
                  width="100%"
                  height="240"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <FadeIn>
              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-brand-navy mb-1">Send a Message</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you promptly.
                </p>
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
