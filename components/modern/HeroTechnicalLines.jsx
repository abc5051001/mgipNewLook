import { useRef, useState } from 'react';
import { useInView } from 'motion/react';
import useReducedMotion from './useReducedMotion';
import { Pause, Play } from 'lucide-react';

function gearPath(teeth, root, tip) {
  const points = Array.from({ length: teeth * 4 }, (_, index) => {
    const angle = index / (teeth * 4) * Math.PI * 2;
    const radius = index % 4 === 1 || index % 4 === 2 ? tip : root;
    return `${(Math.cos(angle) * radius).toFixed(2)},${(Math.sin(angle) * radius).toFixed(2)}`;
  });
  return `M${points.join('L')}Z`;
}

const mainGear = gearPath(18, 54, 60);
const smallGear = gearPath(12, 34, 40);

export default function HeroTechnicalLines() {
  const ref = useRef(null);
  const visible = useInView(ref, { amount: .12 });
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return <div ref={ref} className="mg-hero-technical" data-active={visible && !reduced && !paused}>
    <svg className="mg-home-linework" viewBox="0 0 1600 660" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <g className="mg-hero-frame"><path d="M32 112V24H132M1468 24H1568V112M1568 548V636H1468M132 636H32V548"/><path d="M44 124V36H144M1456 36H1556V124M1556 536V624H1456M144 624H44V536"/><path d="M696 636H1440M696 624H1440"/></g>
      <g className="mg-hero-circuit"><path d="M696 624H1016L1040 600H1200M1440 36H1270L1246 60H1160"/><circle cx="1200" cy="600" r="3"/><circle cx="1160" cy="60" r="3"/></g>
      <g className="mg-hero-signal"><path pathLength="100" d="M696 624H1016L1040 600H1200"/><path pathLength="100" d="M1440 36H1270L1246 60H1160"/></g>
    </svg>
    <svg className="mg-hero-gears" viewBox="0 0 220 220" fill="none" aria-hidden="true">
      <path className="mg-hero-gear-datum" d="M8 78H156M82 4V152M156 88V181M110 134H201M20 186H199M20 181V191M199 181V191"/>
      <g transform="translate(82 78)">
        <g className="mg-hero-bearing"><circle r="73"/><path d="M-68 0H68M0-68V68"/></g>
        <g className="mg-hero-cog-main"><path d={mainGear}/><circle r="41"/><circle r="12"/><path d="M12 0H41M-6 10.4L-20.5 35.5M-6-10.4L-20.5-35.5"/><circle cx="29" cy="0" r="3"/></g>
      </g>
      <g transform="translate(156 134)"><g className="mg-hero-cog-small"><path d={smallGear}/><circle r="24"/><circle r="8"/><path d="M8 0H24M-8 0H-24M0 8V24M0-8V-24"/></g></g>
    </svg>
    {!reduced && <button type="button" className="mg-hero-motion-toggle" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play hero line animation' : 'Pause hero line animation'}>{paused ? <Play size={14}/> : <Pause size={14}/>}</button>}
  </div>;
}
