import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";

const navLinks = [
  { label: "About", to: "/" },
  { label: "Team", to: "/team" },
  { label: "Blog", to: "/blog" },
  { label: "Careers", to: "/careers" },
  { label: "Contact Us", to: "/contact" },
];

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    // Run once on mount to handle page refresh mid-scroll
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // On the homepage (/) the hero is full-screen dark — use light (white) text until scrolled.
  // On all other pages the content starts below the dark header band — white text is always fine.
  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white shadow-sm py-3 border-b border-border"
            : transparent
            ? "bg-transparent py-5 border-b border-white/20"
            : "bg-brand-navy py-5 border-b border-white/20"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-tight group select-none">
            <span
              className={cn(
                "font-roman text-[15px] font-bold tracking-wide uppercase transition-colors",
                scrolled
                  ? "text-brand-navy group-hover:text-brand-teal"
                  : "text-white group-hover:text-white/80"
              )}
            >
              Muncy, Geissler,
            </span>
            <span
              className={cn(
                "font-roman text-[15px] font-bold tracking-wide uppercase transition-colors",
                scrolled
                  ? "text-brand-navy group-hover:text-brand-teal"
                  : "text-white group-hover:text-white/80"
              )}
            >
              Olds &amp; Lowe, P.C.
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, to }) => {
              const active =
                to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "font-roman group relative px-4 py-2.5 text-sm rounded-md transition-colors duration-150",
                    scrolled
                      ? active
                        ? "text-brand-navy font-semibold"
                        : "font-medium text-foreground/45 hover:text-brand-navy"
                      : active
                        ? "text-white font-semibold"
                        : "font-medium text-white/50 hover:text-white"
                  )}
                >
                  {label}
                  {/* Animated underline — always present; grows left→right for active or on hover */}
                  <span
                    className={cn(
                      "absolute bottom-1 left-3 right-3 h-[2px] rounded-full",
                      "transition-transform duration-300 ease-out origin-left",
                      scrolled ? "bg-brand-teal" : "bg-white",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className={cn(
              "md:hidden p-2 rounded-md transition-colors",
              scrolled
                ? "text-brand-navy hover:bg-muted"
                : "text-white hover:bg-white/10"
            )}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl md:hidden",
          "transform transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="text-sm font-bold text-brand-navy uppercase tracking-wide">Menu</span>
          <button
            className="p-1.5 rounded-md text-muted-foreground hover:text-brand-navy hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map(({ label, to }) => {
            const active =
              to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  active
                    ? "bg-muted text-brand-navy"
                    : "text-muted-foreground hover:bg-muted hover:text-brand-navy"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-6 right-6 space-y-1">
          <p className="text-xs text-muted-foreground">+1 (703) 621-7140</p>
          <p className="text-xs text-muted-foreground">mailroom@mg-ip.com</p>
        </div>
      </div>
    </>
  );
};
