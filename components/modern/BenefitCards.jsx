import { Globe2, MapPin, Cpu, Gauge, ShieldCheck, Languages } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useAnimate, useInView } from 'motion/react';
import Reveal from './Reveal';
import useReducedMotion from './useReducedMotion';

const icons = [Globe2, MapPin, Cpu, Gauge, ShieldCheck, Languages];
function BenefitCard({feature,index}){
  const Icon=icons[index];
  const [scope,animate]=useAnimate();
  const visible=useInView(scope,{amount:.25});
  const reduced=useReducedMotion();
  const playback=useRef(null);
  const angle=index===1?-18:index===3?-35:0;
  const replay=useCallback(()=>{
    if(reduced||!scope.current)return;
    playback.current?.stop();
    playback.current=animate(scope.current,{rotate:[angle,angle+24,angle],scale:[1,1.16,1],opacity:[.2,.42,.2]},{duration:1.6,ease:[.22,1,.36,1]});
  },[reduced,scope,animate,angle]);
  useEffect(()=>{
    if(visible)replay();
    return()=>playback.current?.stop();
  },[visible,replay]);
  return <Reveal className={`mg-benefit-card mg-benefit-${index}`} delay={(index % 3) * .06}>
      <div className="mg-benefit-top"><span className="mg-eyebrow">0{index + 1}</span><Icon size={30} strokeWidth={1.2} aria-hidden="true"/></div>
      <div ref={scope} className="mg-benefit-decoration" style={{'--benefit-angle':`${angle}deg`}} aria-hidden="true"><i/><i/><i/></div>
      <div className="mg-benefit-copy"><h3>{feature.title}</h3><p>{feature.description}</p></div>
      <button type="button" className="mg-benefit-replay" aria-label={`Replay illustration for ${feature.title}`} onPointerEnter={event=>{if(event.pointerType!=='touch')replay();}} onFocus={replay} onClick={replay}/>
    </Reveal>;
}

export default function BenefitCards({ features }) {
  return <div className="mg-benefit-grid">{features.map((feature,index)=><BenefitCard key={feature.title} feature={feature} index={index}/>)}</div>;
}
