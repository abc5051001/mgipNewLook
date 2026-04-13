import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Mail, Phone, ChevronLeft, ChevronRight, GraduationCap, Scale, Users, Briefcase } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { FadeIn } from "../FadeIn";
import { teamMembers } from "../../teamMembers_updated";
import { cn } from "../../lib/utils";

/* ─── Section icon mapping ───────────────────────────── */
const SECTION_ICONS = {
  "Bar Admissions": Scale,
  "Education": GraduationCap,
  "Memberships": Users,
  "Experience": Briefcase,
};

/* ─── Membership tooltip ─────────────────────────────── */
function MembershipBadge({ label, membershipsData }) {
  const [show, setShow] = useState(false);
  const info = membershipsData?.[label];

  return (
    <div className="relative inline-block">
      <Badge
        variant="outline"
        className="cursor-default text-sm font-semibold px-4 py-1.5 bg-brand-navy text-white border-brand-teal hover:bg-brand-teal/20 transition-colors"
        onMouseEnter={() => info && setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {label}
      </Badge>
      {show && info && (
        <div className="absolute bottom-full left-0 mb-2 z-20 w-72 rounded-xl bg-brand-navy p-4 text-white shadow-2xl">
          <p className="font-semibold text-sm mb-1">{info.name}</p>
          <p className="text-xs text-white/75 leading-relaxed">{info.description}</p>
          <div className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 bg-brand-navy" />
        </div>
      )}
    </div>
  );
}

/* ─── Section card ───────────────────────────────────── */
function SectionCard({ title, data, membershipsData, index }) {
  if (!data || data.length === 0) return null;

  const Icon = SECTION_ICONS[title];
  const isMemberships = title === "Memberships";

  return (
    <div
      className={cn(
        "rounded-xl border border-border p-6",
        index % 2 === 0 ? "bg-muted/40" : "bg-white"
      )}
    >
      <div className="flex items-center gap-2.5 mb-4">
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-brand-navy/10 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-brand-navy" />
          </div>
        )}
        <h3 className="text-base font-bold uppercase tracking-wide text-brand-navy">
          {title}
        </h3>
      </div>

      {isMemberships ? (
        <div className="flex flex-wrap gap-2">
          {data.map((m, i) => (
            <MembershipBadge key={i} label={m} membershipsData={membershipsData} />
          ))}
        </div>
      ) : (
        <ul className="space-y-1.5">
          {data.map((item, i) =>
            item.length > 100 ? (
              <p key={i} className="text-base text-muted-foreground leading-relaxed">
                {item}
              </p>
            ) : (
              <li key={i} className="flex items-start gap-2 text-base text-muted-foreground">
                <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-brand-teal shrink-0" />
                {item}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

/* ─── Capitalize title ───────────────────────────────── */
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ─── BioPage ─────────────────────────────────────────── */
const BioPage = ({ membershipsData }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedMembers = location.state?.filteredMembers || [];
  const allMembers = passedMembers.length > 0 ? passedMembers : teamMembers;
  const member = allMembers.find((m) => String(m.id) === String(id));
  const currentIndex = allMembers.findIndex((m) => String(m.id) === String(id));

  if (!member) return <Navigate to="/notfound" replace />;

  const goToMember = (index) => {
    const target = allMembers[index];
    if (target) navigate(`/${target.id}`, { state: { filteredMembers: allMembers } });
  };

  /* Build dynamic sections (skip keys already rendered or non-array) */
  const PRIORITIZED = ["bar", "education", "memberships"];
  const SKIP = ["id", "name", "firstName", "middleName", "lastName", "email", "phone", "title", "photo", "field", ...PRIORITIZED];

  const dynamicSections = Object.keys(member)
    .filter((k) => Array.isArray(member[k]) && !SKIP.includes(k) && member[k].length > 0)
    .map((k) => ({
      key: k,
      title: k.replace(/([A-Z])/g, " $1").trim().toUpperCase(),
    }));

  let sectionIndex = 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header band */}
      <div className="relative bg-brand-navy overflow-hidden pt-24 pb-12">

        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full" style={{ background: "#1e2d3d" }} />
        <div className="pointer-events-none absolute -top-16 right-1/3 h-72 w-72 rounded-full opacity-40" style={{ background: "#3a5570" }} />
        <div className="pointer-events-none absolute -top-10 -left-16 h-56 w-56 rounded-full opacity-25" style={{ background: "#5B9A93" }} />
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 55%, rgba(55,80,105,0.35) 55%, rgba(55,80,105,0.35) 70%, transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 -translate-y-1/2 rounded-full opacity-20" style={{ background: "#577C8E" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          {/* Back to team */}
          <button
            onClick={() => navigate("/team")}
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors mb-8"
          >
            <ChevronLeft size={15} />
            Back to Team
          </button>
        </div>

        {/* Profile header card */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Photo */}
              <div className="shrink-0">
                <div className="h-56 w-44 sm:h-64 sm:w-52 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Name / title / contact */}
              <div className="flex-1 pb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {member.name}
                </h1>
                <p className="mt-2 text-base font-medium text-brand-teal uppercase tracking-wide">
                  {toTitleCase(member.title)}
                </p>

                {member.name !== "Mascot" && (
                  <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                      >
                        <Mail size={15} />
                        {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                      >
                        <Phone size={15} />
                        {member.phone}
                      </a>
                    )}
                  </div>
                )}

                {/* Field badges */}
                {Array.isArray(member.field) && member.field.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[...new Set(member.field)].map((f, i) => (
                      <Badge key={i} variant="outline" className="text-sm text-white border-white/40 bg-white/10 px-3 py-1">
                        {f}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>


      {/* Body content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main sections */}
          <div className="lg:col-span-2 space-y-4">
            {/* Prioritized sections */}
            {PRIORITIZED.map((key) => {
              const titleMap = {
                bar: "Bar Admissions",
                education: "Education",
                memberships: "Memberships",
              };
              if (!member[key] || member[key].length === 0) return null;
              const card = (
                <SectionCard
                  key={key}
                  title={titleMap[key]}
                  data={member[key]}
                  membershipsData={membershipsData}
                  index={sectionIndex}
                />
              );
              sectionIndex++;
              return card;
            })}

            {/* Dynamic sections */}
            {dynamicSections.map(({ key, title }) => {
              const card = (
                <SectionCard
                  key={key}
                  title={title}
                  data={member[key]}
                  membershipsData={membershipsData}
                  index={sectionIndex}
                />
              );
              sectionIndex++;
              return card;
            })}
          </div>

          {/* Sidebar – navigation */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border p-5 bg-muted/30 sticky top-28">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-4">
                Navigation
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToMember(currentIndex - 1)}
                  disabled={currentIndex <= 0}
                  className="justify-start gap-2"
                >
                  <ChevronLeft size={15} />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToMember(currentIndex + 1)}
                  disabled={currentIndex >= allMembers.length - 1}
                  className="justify-start gap-2"
                >
                  <ChevronRight size={15} />
                  Next
                </Button>
              </div>
              <Separator className="my-4" />
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => navigate("/team")}
              >
                View All Team Members
              </Button>

              {member.name !== "Mascot" && member.email && (
                <>
                  <Separator className="my-4" />
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 text-sm text-brand-navy font-medium hover:text-brand-teal transition-colors"
                  >
                    <Mail size={15} />
                    Send an Email
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioPage;
