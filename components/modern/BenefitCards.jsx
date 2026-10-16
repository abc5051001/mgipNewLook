import { Globe2, MapPin, Cpu, Gauge, ShieldCheck, Languages } from 'lucide-react';
import Reveal from './Reveal';

const icons = [Globe2, MapPin, Cpu, Gauge, ShieldCheck, Languages];
export default function BenefitCards({ features }) {
  return <div className="mg-benefit-grid">{features.map((feature, index) => {
    const Icon = icons[index];
    return <Reveal key={feature.title} className={`mg-benefit-card mg-benefit-${index}`} delay={(index % 3) * .06}>
      <div className="mg-benefit-top"><span className="mg-eyebrow">0{index + 1}</span><Icon size={30} strokeWidth={1.2} aria-hidden="true"/></div>
      <div className="mg-benefit-decoration" aria-hidden="true"><i/><i/><i/></div>
      <div className="mg-benefit-copy"><h3>{feature.title}</h3><p>{feature.description}</p></div>
    </Reveal>;
  })}</div>;
}
