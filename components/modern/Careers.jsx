import { ArrowUpRight, Plus } from 'lucide-react';
import PageHero from './PageHero';
import { CareersArtwork } from './HeroArtwork';
import copy from '../../content/firm-copy.json';
import openings from '../../content/career-openings.json';

export function Careers() {
  const content = copy.careers;
  return <>
    <PageHero {...content.hero} art={<CareersArtwork/>}/>
    <section className="mg-shell mg-section mg-careers-grid"><div>
      <h2>{content.title}</h2>{content.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
      <div className="mg-career-principles">{content.perks.map(perk=><div key={perk.title}><Plus size={18}/><div><h3>{perk.title}</h3><p>{perk.desc}</p></div></div>)}</div>
    </div><div className="mg-careers-panel">
      <span className="mg-eyebrow">{content.openTitle}</span><h2>{content.openTitle}</h2><p>{content.openDescription}</p>
      <ul className="mg-current-openings">{openings.positions.map(position=><li key={position.url}><a href={position.url} target="_blank" rel="noopener noreferrer"><span>{position.title}</span><ArrowUpRight size={18} aria-hidden="true"/><small>{position.location}</small></a></li>)}</ul>
      <a href={openings.source} target="_blank" rel="noopener noreferrer" className="mg-button mg-button-dark">View All Openings<ArrowUpRight size={18}/></a><small>Listings checked October 16, 2026. Visit our recruiting portal for the latest availability.</small>
    </div></section>
  </>;
}
