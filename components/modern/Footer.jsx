import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Pause, Play } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa';
import { lazy, Suspense, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import useReducedMotion from './useReducedMotion';
const FooterPatent=lazy(()=>import('./FooterPatent'));

export default function Footer() {
  const artRef=useRef(null);
  const visible=useInView(artRef,{amount:.15});
  const reduced=useReducedMotion();
  const [paused,setPaused]=useState(false);
  const active=visible&&!reduced&&!paused;
  const geometry = <div ref={artRef} className="mg-footer-geometry mg-footer-patent" data-active={active}>
        <div className="mg-figure">{visible&&<Suspense fallback={null}><FooterPatent active={active}/></Suspense>}</div>
        {!reduced&&<button type="button" className="mg-footer-motion-toggle" onClick={()=>setPaused(value=>!value)} aria-label={paused?'Play footer animation':'Pause footer animation'}>{paused?<Play size={13}/>:<Pause size={13}/>}</button>}
      </div>;
  return <footer className="mg-footer mg-footer-structured"><div className="mg-shell">
    <div className="mg-footer-grid">
      <div className="mg-footer-brand"><Link to="/" className="mg-footer-logo"><img src="/mgip-logo.png" alt="Muncy, Geissler, Olds & Lowe, P.C." width="600" height="150"/></Link>{geometry}</div>
      <nav aria-label="Footer navigation"><h3>Quick Links</h3>{[['About','/'],['Our Team','/team'],['Careers','/careers'],['Contact Us','/contact'],['Disclaimer','/disclaimer']].map(([label,to])=><Link to={to} key={to}>{label}</Link>)}</nav>
      <div className="mg-footer-office"><h3>Get In Touch</h3><p>125 S Royal St<br/>Alexandria, VA 22314</p><a href="tel:+17036217140">+1 (703) 621-7140<ArrowUpRight size={15}/></a></div>
      <div className="mg-footer-connect"><div className="mg-footer-actions"><Link className="mg-button mg-button-light" to="/contact">Contact Us Today<ArrowUpRight size={18}/></Link><Link className="mg-text-link" to="/team">Meet Our Team<ArrowUpRight size={18}/></Link></div><div className="mg-footer-contact-links"><a href="mailto:mailroom@mg-ip.com"><Mail size={18} aria-hidden="true"/><span>mailroom@mg-ip.com</span><ArrowUpRight size={16}/></a><a href="https://www.linkedin.com/company/muncy-geissler-olds-&-lowe/" target="_blank" rel="noopener noreferrer"><FaLinkedinIn size={18} aria-hidden="true"/><span>LinkedIn</span><ArrowUpRight size={16}/></a></div></div>
    </div>
    <div className="mg-footer-bottom"><span>© {new Date().getFullYear()} Muncy, Geissler, Olds &amp; Lowe, P.C. All Rights Reserved.</span><span>Website by CZR AI LLC</span></div>
  </div></footer>;
}
