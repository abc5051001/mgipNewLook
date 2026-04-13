import { Link } from "react-router-dom";
import { FadeIn } from "../FadeIn";
import { ShieldAlert } from "lucide-react";

const clauses = [
  "The information provided on this website is for general informational purposes only and is not intended to be legal advice. Users should consult with a professional attorney before taking any action based on the content provided here.",
  "The use of this website, including any 'Contact' email links, does not establish an attorney-client relationship between Muncy, Geissler, Olds & Lowe, PC and the user.",
  "While we strive to ensure the accuracy of the information on this site, Muncy, Geissler, Olds & Lowe, PC is not responsible for any errors or omissions, nor for any results obtained from the use of this information.",
  "This website may contain links to third-party websites. Muncy, Geissler, Olds & Lowe, PC does not endorse or make any representations regarding the accuracy of information on those third-party sites.",
];

export function Disclaimer() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-navy pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal mb-3">
              Legal
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Disclaimer
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16">
        <FadeIn>
          <div className="rounded-2xl border border-border bg-white shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-brand-navy/5 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-brand-navy" />
              </div>
              <div>
                <h2 className="font-semibold text-brand-navy">Website Disclaimer</h2>
                <p className="text-xs text-muted-foreground">
                  Please read carefully before using this website.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {clauses.map((text, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {text}
                </p>
              ))}

              <p className="text-sm text-muted-foreground leading-relaxed">
                <Link
                  to="/ScottT"
                  className="font-semibold text-brand-navy underline underline-offset-2 hover:text-brand-teal transition-colors"
                >
                  Scott Tulino
                </Link>{" "}
                is responsible for ensuring the accuracy of all content on this website.
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Have questions?{" "}
            <Link to="/contact" className="text-brand-navy font-medium hover:text-brand-teal transition-colors">
              Contact us
            </Link>
            .
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
