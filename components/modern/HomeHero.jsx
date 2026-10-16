import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import useReducedMotion from './useReducedMotion';
import { ArrowDown, ArrowUpRight, ChevronDown } from 'lucide-react';
import copy from '../../content/firm-copy.json';
import { homeImage, homeSrcSet, homeSizes } from '../../lib/images';

export default function HomeHero() {
  const reduced = useReducedMotion();
  return <section className="mg-dc-hero mg-home-photo-hero" aria-labelledby="firm-title">
    <div className="mg-home-photo-background">
      <motion.img className="mg-dc-hero-photo" src={homeImage} srcSet={homeSrcSet} sizes={homeSizes} alt="The Jefferson Memorial in Washington, D.C., framed by cherry blossoms" fetchpriority="high" width="6147" height="3779" initial={reduced?false:{scale:1.025}} animate={{scale:1}} transition={{duration:1.6,ease:[.22,1,.36,1]}}/>
    </div>
    <div className="mg-home-photo-copy"><div>
      <p className="mg-home-photo-eyebrow">{copy.hero.eyebrow}</p>
      <h1 id="firm-title">Muncy, Geissler,{' '}<br/>Olds &amp; Lowe, P.C.</h1>
      <p className="mg-dc-hero-description">{copy.hero.description}</p>
      <div className="mg-home-photo-actions"><a className="mg-button mg-home-primary" href="#about">Learn More<ArrowDown size={17}/></a><Link className="mg-button mg-home-secondary" to="/contact">Contact Us<ArrowUpRight size={17}/></Link></div>
    </div></div>
    <a className="mg-home-scroll" href="#about" aria-label="Scroll to About Our Firm"><span>Scroll</span><ChevronDown size={18}/></a>
  </section>;
}
