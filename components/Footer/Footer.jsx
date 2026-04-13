import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { Separator } from "../ui/separator";

const quickLinks = [
  { label: "About", to: "/" },
  { label: "Our Team", to: "/team" },
  { label: "Careers", to: "/careers" },
  { label: "Contact Us", to: "/contact" },
  { label: "Disclaimer", to: "/disclaimer" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Column 1 – Firm identity */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">
              Muncy, Geissler,<br />Olds &amp; Lowe, P.C.
            </h3>
            <p className="text-sm text-white/80 leading-relaxed max-w-xs">
              An intellectual property law firm in the Washington, D.C. metro
              area, specializing in Patent, Trademark, and Copyright law.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.linkedin.com/company/muncy-geissler-olds-&-lowe/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={16} />
              </a>
              <a
                href="/contact"
                className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 – Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/65 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5">
              Get In Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brand-teal" />
                <span className="text-sm text-white/65 leading-snug">
                  125 S Royal St<br />Alexandria, VA 22314
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="shrink-0 text-brand-teal" />
                <a
                  href="tel:+17036217140"
                  className="text-sm text-white/65 hover:text-white transition-colors"
                >
                  +1 (703) 621-7140
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="shrink-0 text-brand-teal" />
                <a
                  href="mailto:mailroom@mg-ip.com"
                  className="text-sm text-white/65 hover:text-white transition-colors"
                >
                  mailroom@mg-ip.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white">
          <span>© {year} Muncy, Geissler, Olds &amp; Lowe, P.C. All Rights Reserved.</span>
          <span>
            Website by{" "}
            <a
              href="https://jspwebs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 hover:text-white transition-colors"
            >
              JSP Webs LLC
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
