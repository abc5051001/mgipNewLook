import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import useReducedMotion from './useReducedMotion';

const links = [['About', '/'], ['Team', '/team'], ['Careers', '/careers'], ['Contact Us', '/contact']];
const MotionNavLink = motion.create(NavLink);

function DesktopNavLink({ label, to }) {
  const reduced = useReducedMotion();
  return <MotionNavLink className="mg-nav-link" to={to} end={to === '/'} initial="rest" animate="rest" whileHover="engaged" whileFocus="engaged">
    {({ isActive }) => <>{label}<motion.span className="mg-nav-underline" aria-hidden="true"
      variants={{ rest: { scaleX: isActive ? 1 : 0 }, engaged: { scaleX: 1 } }}
      transition={{ duration: reduced ? 0 : .3, ease: [.16, 1, .3, 1] }}/></>}
  </MotionNavLink>;
}

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef(null);
  const toggle = useRef(null);
  const reduced = useReducedMotion();
  const location = useLocation();
  const home = location.pathname === '/';
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', value => setScrolled(value > 48));
  useEffect(() => { setOpen(false); setScrolled(window.scrollY > 48); }, [location.key]);
  useEffect(() => {
    if (!open) return;
    const dismiss = event => {
      if (event.type === 'keydown') {
        if (event.key !== 'Escape') return;
        setOpen(false);
        toggle.current?.focus();
      } else if (!header.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 721px)');
    const resize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', dismiss);
    desktop.addEventListener('change', resize);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', dismiss);
      desktop.removeEventListener('change', resize);
    };
  }, [open]);
  return <>
    <a className="mg-skip" href="#main-content">Skip to content</a>
    <header ref={header} className={`mg-header mg-header-classic${home ? ' mg-header-home' : ''}`} data-scrolled={scrolled} data-menu-open={open} onBlurCapture={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}><div className="mg-shell mg-nav-inner">
      <Link to="/" className="mg-logo" aria-label="MG-IP home">
        <span className="mg-wordmark">Muncy, Geissler,<br/>Olds &amp; Lowe, P.C.</span>
      </Link>
      <nav className="mg-nav" aria-label="Main navigation">{links.map(([label, to]) => <DesktopNavLink label={label} to={to} key={to}/>)}</nav>
      <button ref={toggle} type="button" className="mg-menu-button" onClick={() => setOpen(value => !value)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-controls="mobile-navigation" aria-expanded={open}><span className="mg-menu-line"/><span className="mg-menu-line"/><span className="mg-menu-line"/></button>
    </div>
      <motion.div id="mobile-navigation" className="mg-mobile-dropdown" initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: reduced ? 0 : .28, ease: [.22, 1, .36, 1] }} inert={open ? undefined : ''} aria-hidden={!open}>
        <nav className="mg-shell mg-mobile-nav" aria-label="Mobile navigation">{links.map(([label, to], i) => <NavLink to={to} end={to === '/'} key={to} onClick={() => setOpen(false)}><span aria-hidden="true">0{i + 1}</span>{label}<ArrowUpRight size={18} aria-hidden="true"/></NavLink>)}</nav>
      </motion.div>
    </header>
  </>;
}
