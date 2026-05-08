import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";

const navLinks = [
  { label: "About", to: "/" },
  { label: "Team", to: "/team" },
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
  const transparent = !scrolled;

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
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex flex-col leading-tight group select-none"
          >
            <span
              className={cn(
                "font-display text-[17px] font-semibold tracking-wide uppercase transition-colors",
                scrolled
                  ? "text-brand-navy group-hover:text-brand-teal"
                  : "text-white group-hover:text-white/80"
              )}
            >
              Muncy, Geissler,
            </span>
            <span
              className={cn(
                "font-display text-[17px] font-semibold tracking-wide uppercase transition-colors",
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
                    "group relative px-4 py-2.5 text-base rounded-md transition-colors duration-150",
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
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile floating card */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-4 right-4 z-50 md:hidden bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ top: scrolled ? "64px" : "80px" }}
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {navLinks.map(({ label, to }, i) => {
                const active =
                  to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
                return (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block py-4 text-sm font-semibold tracking-widest uppercase transition-colors border-b border-black/8",
                        active ? "text-brand-navy" : "text-black/50 hover:text-brand-navy"
                      )}
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-5 space-y-1">
                <p className="text-xs text-muted-foreground">+1 (703) 621-7140</p>
                <p className="text-xs text-muted-foreground">mailroom@mg-ip.com</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
