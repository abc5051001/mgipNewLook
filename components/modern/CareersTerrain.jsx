import { useRef, useState } from 'react';
import { Terrain } from '@lucasmarkes/hairline/react';
import { useInView } from 'motion/react';
import useReducedMotion from './useReducedMotion';
import { Pause, Play } from 'lucide-react';

export default function CareersTerrain() {
  const ref=useRef(null);
  const visible=useInView(ref,{amount:.15});
  const reduced=useReducedMotion();
  const [paused,setPaused]=useState(false);
  const active=visible&&!reduced&&!paused;
  return <figure ref={ref} className="mg-careers-terrain" data-active={active}>
    <div className="mg-figure"><Terrain theme="light" intensity={.8} play={active} label="A rising technical landscape representing paths for professional growth."/></div>
    <figcaption><span>Build your next chapter.</span>{!reduced&&<button type="button" onClick={()=>setPaused(value=>!value)} aria-label={paused?'Play career illustration':'Pause career illustration'}>{paused?<Play size={14}/>:<Pause size={14}/>}</button>}</figcaption>
  </figure>;
}
