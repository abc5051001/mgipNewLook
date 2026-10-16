import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import Reveal from './Reveal';
import HeroLinework from './HeroLinework';
import copy from '../../content/firm-copy.json';
import { officeImage, officeSrcSet } from '../../lib/images';

export default function ContactHero() {
  const { hero, details } = copy.contact;
  return <section className="mg-contact-hero mg-inner-hero" aria-labelledby="contact-title">
    <HeroLinework variant="location"/>
    <div className="mg-shell mg-contact-hero-grid mg-inner-hero-grid">
      <Reveal className="mg-contact-hero-copy mg-inner-hero-copy">
        <span className="mg-eyebrow">{hero.eyebrow}</span>
        <h1 id="contact-title">{hero.title}</h1>
        <p>{hero.subtitle}</p>
        <div className="mg-contact-hero-actions"><a className="mg-button mg-button-dark" href="#contact-form">Send a Message<ArrowDown size={17}/></a><a className="mg-text-link" href={details[1].href}>{details[1].lines[0]}<ArrowUpRight size={16}/></a></div>
      </Reveal>
      <Reveal className="mg-contact-hero-office" delay={.1}>
        <img src={officeImage} srcSet={officeSrcSet} sizes="(max-width: 720px) calc(100vw - 40px), 45vw" alt="The firm's brick office building and hanging Muncy, Geissler, Olds & Lowe sign in Alexandria" width="5796" height="3870"/>
        <svg className="mg-office-linework" viewBox="0 0 600 420" fill="none" aria-hidden="true" preserveAspectRatio="none"><path d="M22 86V22H86M514 22H578V86M578 334V398H514M86 398H22V334"/><path d="M36 36H564V384H36Z"/><path d="M14 210H30M570 210H586M300 14V30M300 390V406"/></svg>
        <a className="mg-contact-hero-address" href="#contact-office"><MapPin size={20} strokeWidth={1.4} aria-hidden="true"/><span><small>{details[0].label}</small>{details[0].lines.map(line => <span key={line}>{line}</span>)}</span><ArrowDown size={18}/></a>
      </Reveal>
    </div>
  </section>;
}
