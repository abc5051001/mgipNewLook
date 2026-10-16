import { useRef, useState } from 'react';
import { CollaborationDrawing } from './TechnicalDrawing';
import { useInView } from 'motion/react';
import useReducedMotion from './useReducedMotion';
import { Pause, Play } from 'lucide-react';

export default function TeamCollaboration() {
  const ref=useRef(null);
  const visible=useInView(ref,{amount:.15});
  const reduced=useReducedMotion();
  const [paused,setPaused]=useState(false);
  const active=visible&&!reduced&&!paused;
  return <figure ref={ref} className="mg-team-collaboration" data-active={active}>
    <div className="mg-figure"><CollaborationDrawing/></div>
    <figcaption><span>Connected expertise.</span>{!reduced&&<button type="button" aria-label={paused?'Play team illustration':'Pause team illustration'} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button>}</figcaption>
  </figure>;
}
