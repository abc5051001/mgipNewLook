import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { offset } from '../drafting/model.mjs';
import { clamp, WRITING } from './models.mjs';
import '../drafting/drafting.css';
import './service-art.css';

export default function ServiceMechanism({ kind, art, poseAt }) {
  const anchor=useRef(null), stage=useRef(null), stack=useRef(null), nodes=useRef(new Map());
  const ink=useRef(null), glyphs=useRef([]), kick=useRef(()=>{}), paint=useRef(()=>{}), frame=useRef(0);
  const visible=useInView(anchor,{amount:.15});
  const [reduced,setReduced]=useState(false), [paused,setPaused]=useState(false), [value,setValue]=useState(0);
  const wasReduced=useRef(false);
  const state=useRef({progress:0,target:0,clock:0,idle:0,hover:false,focus:false,order:''});
  const title=kind==='trademark'?'label-stamping press':'writing machine';
  const halfCycle=kind==='trademark'?3.2:4;
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(media.matches);
    update();media.addEventListener('change',update);
    return()=>media.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    const s=state.current;
    let last=0;
    ink.current=stage.current?.querySelector('[data-stamp-mark]');
    glyphs.current=[...stage.current.querySelectorAll('[data-writing-glyph]')];
    const draw=()=>{
      const pose=poseAt(s.progress);
      const ordered=art.parts.map(part=>{
        const world=pose.offsets[part.group] || [0,0,0];
        const [x,y]=offset(world,art.camera);
        nodes.current.get(part.name)?.setAttribute('transform',`translate(${x.toFixed(3)} ${y.toFixed(3)})`);
        const depth=(world[0]*art.camera.cosA+world[1]*art.camera.sinA)*art.camera.cosE+world[2]*art.camera.sinE;
        return {name:part.name,key:part.key+depth};
      }).sort((a,b)=>a.key-b.key);
      const order=ordered.map(part=>part.name).join('|');
      if(s.order!==order&&stack.current){
        const fragment=document.createDocumentFragment();
        for(const item of ordered)fragment.append(nodes.current.get(item.name));
        stack.current.append(fragment);s.order=order;
      }
      ink.current?.setAttribute('opacity',pose.ink.toFixed(4));
      for(const letter of glyphs.current){const index=Number(letter.dataset.writingGlyph);letter.setAttribute('opacity',pose.ink>.001&&pose.ink>=(index/(WRITING.length-1))?'1':'0');}
      stage.current?.setAttribute('data-progress',s.progress.toFixed(4));
      stage.current?.setAttribute('data-ink',pose.ink.toFixed(4));
    };
    paint.current=draw;
    if(reduced&&!wasReduced.current){s.progress=s.target=1;setValue(100);}
    wasReduced.current=reduced;
    const tick=now=>{
      frame.current=0;
      if(!visible||document.hidden)return;
      const dt=last?Math.min((now-last)/1000,1/30):1/60;last=now;
      const touring=!paused&&!reduced&&!s.focus;
      if(touring){s.idle+=dt;if(s.idle>.25){s.clock+=dt;s.target=.5-.5*Math.cos(s.clock*Math.PI/halfCycle);}}
      s.progress=reduced?s.target:s.progress+(s.target-s.progress)*(1-Math.exp(-dt/.18));
      if(Math.abs(s.target-s.progress)<.00001)s.progress=s.target;
      draw();
      if(!reduced&&(touring||s.progress!==s.target))frame.current=requestAnimationFrame(tick);
    };
    const run=()=>{if(!frame.current&&visible&&!document.hidden){last=0;frame.current=requestAnimationFrame(tick);}};
    kick.current=run;
    const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame.current);frame.current=0;}else run();};
    document.addEventListener('visibilitychange',visibility);
    draw();run();
    return()=>{cancelAnimationFrame(frame.current);frame.current=0;document.removeEventListener('visibilitychange',visibility);};
  },[visible,reduced,paused,art,poseAt,halfCycle]);
  function steer(progress){
    const s=state.current;s.target=clamp(progress);s.idle=-.9;
    s.clock=Math.acos(1-2*s.target)*halfCycle/Math.PI;setValue(Math.round(s.target*100));
    if(reduced){s.progress=s.target;paint.current();}else kick.current();
  }
  function toggle(){const s=state.current;s.target=s.progress;s.idle=0;s.clock=Math.acos(1-2*s.progress)*halfCycle/Math.PI;setPaused(current=>!current);}
  return <figure ref={anchor} className={`mg-service-machine mg-${kind}-machine iso`} data-theme="light" data-kind={kind} data-active={visible&&!reduced&&!paused}>
    <figcaption className="sr-only">{art.label}</figcaption>
    <div ref={stage} className="mg-machine-stage" role="slider" tabIndex={0} aria-label={`Explore the ${title}. Use arrow keys to move through its animation.`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-valuetext={`${value}% of the illustration cycle`} onFocus={()=>{state.current.focus=true;steer(state.current.progress);}} onBlur={()=>{state.current.focus=false;kick.current();}} onPointerMove={event=>{
      if(event.pointerType==='touch'&&event.buttons===0)return;
      state.current.hover=true;const box=event.currentTarget.getBoundingClientRect();steer((event.clientX-box.left)/box.width);
    }} onPointerDown={event=>{if(event.pointerType==='touch'){const box=event.currentTarget.getBoundingClientRect();steer((event.clientX-box.left)/box.width);}}} onPointerLeave={()=>{state.current.hover=false;kick.current();}} onPointerCancel={()=>{state.current.hover=false;kick.current();}} onKeyDown={event=>{
      const step=event.shiftKey ? .1 : .025;
      const next=event.key==='Home'?0:event.key==='End'?1:['ArrowRight','ArrowUp'].includes(event.key)?state.current.progress+step:['ArrowLeft','ArrowDown'].includes(event.key)?state.current.progress-step:undefined;
      if(next!==undefined){event.preventDefault();steer(next);}
    }}>
      <svg className="iso-svg" viewBox="0 0 600 390" role="img" aria-label={art.label}><path className="iso-halo" d={art.halo}/><g ref={stack}>{art.parts.map(part=><g key={part.name} ref={node=>{if(node)nodes.current.set(part.name,node);else nodes.current.delete(part.name);}} data-part={part.name} data-group={part.group} dangerouslySetInnerHTML={{__html:part.svg}}/>)}</g></svg>
    </div>
    {!reduced&&<div className="mg-machine-controls"><button type="button" onClick={toggle} aria-label={paused?'Play illustration':'Pause illustration'}>{paused?<Play size={14}/>:<Pause size={14}/>}</button></div>}
  </figure>;
}
