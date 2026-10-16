import { lazy, Suspense, useRef } from 'react';
import { useInView } from 'motion/react';
import './service-art/service-art.css';
const Drafting=lazy(()=>import('./drafting/DraftingFigure'));
const Stamp=lazy(()=>import('./service-art/StampFigure'));
const Writing=lazy(()=>import('./service-art/WritingFigure'));
export default function ServiceArtwork({type}){
  const ref = useRef(null);
  const nearby = useInView(ref, { once: true, margin: '200px' });
  return <div ref={ref}><Suspense fallback={<div className="mg-machine-placeholder" aria-hidden="true"/>}>{nearby ? (type==='patent'?<Drafting compact/>:type==='trademark'?<Stamp/>:<Writing/>) : <div className="mg-machine-placeholder" aria-hidden="true"/>}</Suspense></div>;
}
