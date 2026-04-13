import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import PageHero from "../ui/PageHero";

/* ─── Filter options ─────────────────────────────────── */
const titleOptions = [
  { value: "All", label: "All Titles" },
  { value: "PRINCIPAL SHAREHOLDER", label: "Principal Shareholder" },
  { value: "PRINCIPAL", label: "Principal" },
  { value: "SENIOR COUNSEL", label: "Senior Counsel" },
  { value: "OF COUNSEL", label: "Of Counsel" },
  { value: "ASSOCIATE", label: "Associate" },
  { value: "PATENT AGENT", label: "Patent Agent" },
  { value: "TECHNICAL ADVISOR", label: "Technical Advisor" },
  { value: "INTELLECTUAL PROPERTY ADVISOR", label: "IP Advisor" },
  { value: "HR - OFFICE MANAGER", label: "HR / Office Manager" },
  { value: "ACCOUNTING MANAGER", label: "Accounting Manager" },
].sort((a, b) => (a.value === "All" ? -1 : a.label.localeCompare(b.label)));

const membershipOptions = [
  { value: "All", label: "All Memberships" },
  { value: "INTA", label: "INTA" },
  { value: "ABA", label: "ABA" },
  { value: "FICPI", label: "FICPI" },
  { value: "VPP", label: "VPP" },
  { value: "AIPPI", label: "AIPPI" },
  { value: "ASIPI", label: "ASIPI" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* ─── Helpers ─────────────────────────────────────────── */
function getInitials(member) {
  return [member.firstName, member.middleName, member.lastName]
    .filter(Boolean)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
}

function sortMembers(members) {
  return [...members].sort((a, b) => {
    if (a.name === "Mascot") return 1;
    if (b.name === "Mascot") return -1;
    const last = (a.lastName || "").localeCompare(b.lastName || "");
    return last !== 0 ? last : (a.firstName || "").localeCompare(b.firstName || "");
  });
}

/* ─── Custom dropdown ─────────────────────────────────── */
function FilterSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = value !== "All";
  const label = options.find((o) => o.value === value)?.label ?? options[0].label;

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-2 h-11 pl-5 pr-4 rounded-full border text-base font-medium transition-colors whitespace-nowrap",
          active
            ? "border-brand-navy bg-brand-navy text-white"
            : "border-border bg-background text-muted-foreground hover:border-brand-navy/40 hover:text-brand-navy"
        )}
      >
        {label}
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[160px] rounded-xl border border-border bg-white shadow-lg py-1 overflow-hidden">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm transition-colors",
                o.value === value
                  ? "bg-brand-navy text-white font-medium"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Member card ─────────────────────────────────────── */
function MemberCard({ member, filteredMembers }) {
  return (
    <Link
      to={`/${member.id}`}
      state={{ filteredMembers }}
      className="group block rounded-xl overflow-hidden border border-border bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5 pb-6">
        <p className="font-semibold text-brand-navy text-[15px] leading-snug">{member.name}</p>
        <p className="mt-1.5 text-sm text-muted-foreground capitalize leading-snug">
          {member.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
        </p>
      </div>
    </Link>
  );
}

/* ─── Team ────────────────────────────────────────────── */
export const Team = ({ members }) => {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("");
  const [titleFilter, setTitleFilter] = useState("All");
  const [membershipFilter, setMembershipFilter] = useState("All");

  const filtered = members.filter((m) => {
    // Letter filter
    if (activeLetter && !getInitials(m).includes(activeLetter)) return false;
    // Search filter
    if (search && !(m.name || "").toLowerCase().includes(search.toLowerCase())) return false;
    // Title filter
    if (titleFilter !== "All" && m.title !== titleFilter) return false;
    // Membership filter
    if (
      membershipFilter !== "All" &&
      (!Array.isArray(m.memberships) || !m.memberships.includes(membershipFilter))
    )
      return false;
    return true;
  });

  const sorted = sortMembers(filtered);

  const availableInitials = new Set(
    filtered.flatMap((m) => getInitials(m).split(""))
  );

  const hasActiveFilters =
    search || activeLetter || titleFilter !== "All" || membershipFilter !== "All";

  const clearAll = () => {
    setSearch("");
    setActiveLetter("");
    setTitleFilter("All");
    setMembershipFilter("All");
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="Our Professionals"
        title="Meet the Team"
        subtitle="A diverse group of IP attorneys, patent agents, and technical advisors committed to protecting your innovations."
      />

      {/* Controls */}
      <div className="sticky top-[64px] z-30 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name…"
                value={search}
                onChange={(e) => {
                  setActiveLetter("");
                  setSearch(e.target.value);
                }}
                className={cn(
                  "w-full h-11 pl-11 pr-10 rounded-full border border-border bg-background",
                  "text-base placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                )}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter selects */}
            <div className="flex gap-2 flex-wrap">
              <FilterSelect
                value={titleFilter}
                onChange={setTitleFilter}
                options={titleOptions}
                label="Title"
              />
              <FilterSelect
                value={membershipFilter}
                onChange={setMembershipFilter}
                options={membershipOptions}
                label="Membership"
              />
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20 transition-colors"
                >
                  <X size={13} />
                  Clear
                </button>
              )}
            </div>

            <span className="text-sm text-muted-foreground sm:ml-auto">
              {sorted.length} {sorted.length === 1 ? "result" : "results"}
            </span>
          </div>

          {/* Alphabet nav */}
          <div className="mt-3 flex flex-wrap gap-0.5">
            {ALPHABET.map((letter) => {
              const available = availableInitials.has(letter);
              return (
                <button
                  key={letter}
                  disabled={!available}
                  onClick={() =>
                    setActiveLetter((prev) => (prev === letter ? "" : letter))
                  }
                  className={cn(
                    "h-10 w-10 rounded text-base font-medium transition-colors",
                    !available && "text-muted-foreground/30 cursor-default",
                    available &&
                      activeLetter !== letter &&
                      "text-muted-foreground hover:bg-muted hover:text-brand-navy",
                    activeLetter === letter &&
                      "bg-brand-navy text-white"
                  )}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {sorted.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sorted.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                filteredMembers={sorted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
