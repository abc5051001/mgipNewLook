import Reveal from './Reveal';
import HeroLinework from './HeroLinework';
import { lazy, Suspense } from 'react';
import copy from '../../content/firm-copy.json';
const TeamCollaboration=lazy(()=>import('./TeamCollaboration'));

export default function TeamHero() {
  return <section className="mg-team-hero mg-team-hero-connective mg-team-hero-art mg-inner-hero" aria-labelledby="team-title">
    <HeroLinework/>
    <div className="mg-shell mg-inner-hero-grid"><Reveal className="mg-team-hero-copy mg-inner-hero-copy"><span className="mg-eyebrow">{copy.team.eyebrow}</span><h1 id="team-title">{copy.team.title}</h1><p>{copy.team.subtitle}</p></Reveal><Suspense fallback={<div className="mg-team-collaboration mg-art-loading" aria-hidden="true"/>}><TeamCollaboration/></Suspense></div>
  </section>;
}
