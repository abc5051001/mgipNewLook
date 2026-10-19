import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import Reveal from './Reveal';
import ServiceArtwork from './ServiceArtwork';
import copy from '../../content/firm-copy.json';
import { teamMembers } from '../../lib/team';
import CountUpStat from './CountUpStat';
import BenefitCards from './BenefitCards';
import PhotoHero from './photo-hero/PhotoHero';
const ServiceDialog = lazy(() => import('./ServiceDialog'));

const figureTypes = ['patent', 'trademark', 'copyright'];
const everyone = [...teamMembers].sort((a,b) => a.name==='Mascot'?1:b.name==='Mascot'?-1:(a.lastName||a.name).localeCompare(b.lastName||b.name));

export default function Home() {
  const [practice, setPractice] = useState(0);
  const [milestone, setMilestone] = useState(0);
  const [detail, setDetail] = useState(null);
  const selected = copy.services[practice];

  function movePractice(event, index) {
    const next = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : undefined;
    if (next === undefined) return;
    event.preventDefault();
    setPractice(next);
    event.currentTarget.parentElement.children[next].focus();
  }

  return <>
    <PhotoHero/>

    <section className="mg-section mg-shell mg-about-original" id="about">
      <Reveal className="mg-about-grid"><div><span className="mg-eyebrow">{copy.about.eyebrow}</span><h2>Advancing Innovation{' '}<br/><span>Through IP Excellence</span></h2></div><p>{copy.about.description}</p></Reveal>
      <Reveal className="mg-original-stats" delay={.08}>{copy.stats.map(stat=><CountUpStat key={stat.label} {...stat}/>)}</Reveal>
    </section>

    <section className="mg-section mg-shell mg-expertise-original" id="expertise">
      <Reveal className="mg-section-heading"><span className="mg-eyebrow">What We Do</span><div><h2>Our Services</h2></div></Reveal>
      <Reveal className="mg-service-content" delay={.08}><div className="mg-practice-tabs" role="tablist" aria-label="Practice areas">{copy.services.map((service,index)=><button key={service.title} id={`practice-tab-${index}`} role="tab" aria-selected={index===practice} aria-controls="practice-panel" tabIndex={index===practice?0:-1} onClick={()=>setPractice(index)} onKeyDown={event=>movePractice(event,index)}><span>0{index+1}</span>{service.title}<ArrowUpRight size={20}/></button>)}</div>
      <div className={`mg-practice-panel mg-service-preview mg-service-${selected.title.toLowerCase()}`} id="practice-panel" role="tabpanel" aria-labelledby={`practice-tab-${practice}`} tabIndex={0}>
        <div className="mg-practice-copy"><h3>{selected.title}</h3><p>{selected.description}</p><button type="button" className="mg-button mg-button-dark" onClick={()=>setDetail(selected)} aria-label={`Read more about ${selected.title}`} aria-haspopup="dialog">Read more<ArrowUpRight size={18}/></button></div>
        <div className="mg-practice-art"><ServiceArtwork key={practice} type={figureTypes[practice]}/></div>
      </div></Reveal>
    </section>
    {detail&&<Suspense fallback={null}><ServiceDialog service={detail} onClose={()=>setDetail(null)}/></Suspense>}

    <section className="mg-benefits-section"><div className="mg-shell">
      <Reveal className="mg-section-heading"><span className="mg-eyebrow">Why MG-IP</span><div><h2>Built for{' '}<br/><span>Exceptional Results</span></h2></div></Reveal>
      <BenefitCards features={copy.features}/>
    </div></section>

    <section className="mg-section mg-shell"><Reveal className="mg-section-heading"><span className="mg-eyebrow">Our Professionals</span><div><h2>Meet the Team</h2><Link className="mg-text-link" to="/team">Meet Our Team<ArrowUpRight size={18}/></Link></div></Reveal><Reveal className="mg-collective-mosaic" aria-label="Our entire team, in alphabetical order" delay={.08}>{everyone.map(member=><Link to={`/team/${member.id}`} key={member.id} aria-label={`View ${member.name}'s biography`}><img src={member.photo} alt={member.name} loading="lazy" width="340" height="464"/><span>{member.name}</span></Link>)}</Reveal></section>

    <section className="mg-section mg-shell mg-history"><Reveal className="mg-section-heading"><span className="mg-eyebrow">Our History</span><div><h2>Our Milestones</h2></div></Reveal><Reveal className="mg-history-layout" delay={.08}>
      <div className="mg-history-year" aria-hidden="true">{copy.milestones[milestone<0?0:milestone].year}</div>
      <div>{copy.milestones.map((item,index)=><div className="mg-history-item" key={item.year}><h3><button aria-expanded={milestone===index} aria-controls={`history-${index}`} onClick={()=>setMilestone(milestone===index?-1:index)}><span>{item.year}</span>{item.title}{milestone===index?<Minus size={18}/>:<Plus size={18}/>}</button></h3><div id={`history-${index}`} hidden={milestone!==index}><ul>{item.events.map(event=><li key={event}>{event}</li>)}</ul></div></div>)}</div>
    </Reveal></section>
  </>;
}
