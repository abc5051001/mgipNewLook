import { ArrowUpRight, Plus } from 'lucide-react';
import PageHero from './PageHero';
import { CareersArtwork } from './HeroArtwork';
import copy from '../../content/firm-copy.json';
const recruiting='https://recruiting.paylocity.com/recruiting/jobs/All/5847c0ea-c9f8-4ed7-8865-cbd0d03e3e2d/Muncy-Geissler-Olds-Lowe-PC';

export function Careers() {
  const content = copy.careers;
  return <>
    <PageHero {...content.hero} art={<CareersArtwork/>}/>
    <section className="mg-shell mg-section mg-careers-grid"><div>
      <h2>{content.title}</h2>{content.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
      <div className="mg-career-principles">{content.perks.map(perk=><div key={perk.title}><Plus size={18}/><div><h3>{perk.title}</h3><p>{perk.desc}</p></div></div>)}</div>
    </div><div className="mg-careers-panel">
      <span className="mg-eyebrow">{content.openTitle}</span><h2>{content.openTitle}</h2><p>{content.openDescription}</p>
      <a href={recruiting} target="_blank" rel="noopener noreferrer" className="mg-button mg-button-dark">View Current Openings<ArrowUpRight size={18}/></a><small>Visit our recruiting portal for the latest opportunities and application details.</small>
    </div></section>
  </>;
}
