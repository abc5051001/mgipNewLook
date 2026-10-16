import { motion } from 'motion/react';
import { lazy, Suspense } from 'react';
import useArtwork from './useArtwork';
const CareersTerrain = lazy(() => import('./CareersTerrain'));

// Every point has the same size and connections; there is no central or featured person.
const rows = [7, 9, 11, 9, 7];
const points = rows.flatMap((count, row) => Array.from({ length: count }, (_, col) => ({
  x: 250 + (col - (count - 1) / 2) * 38, y: 76 + row * 43,
})));
const edges = points.flatMap((point, i) => points.slice(i + 1).filter(other => {
  const distance = Math.hypot(point.x - other.x, point.y - other.y);
  return distance > 0 && distance < 49;
}).map(other => ({ a: point, b: other })));

export function PeopleArtwork() {
  const art = useArtwork();
  return <div ref={art.ref} className="mg-peer-art mg-live-art" data-active={art.active} role="img" aria-label="A connected field of equal-sized points representing the whole team, with no hierarchy. Move your pointer or use arrow keys to explore." tabIndex={0} {...art.handlers}>
    <motion.svg viewBox="0 0 500 340" fill="none" style={art.style} aria-hidden="true">
      <g className="mg-peer-weave" stroke="currentColor" strokeWidth=".8" opacity=".25">{edges.map((edge, i) => <path key={i} d={'M'+edge.a.x+' '+edge.a.y+'L'+edge.b.x+' '+edge.b.y}/>)}</g>
      <g className="mg-peer-points">{points.map((point, i) => <g key={i} className="mg-peer-point" style={{ '--pulse-delay': (Math.floor(i / 9) * -.7)+'s' }}>
        <circle cx={point.x} cy={point.y} r="9" fill="var(--mg-paper)" stroke="currentColor"/>
        <circle cx={point.x} cy={point.y} r="2.2" fill="currentColor"/>
      </g>)}</g>
      <g stroke="currentColor" opacity=".35"><path d="M36 31h428M36 309h428M36 26v10m428-10v10M36 304v10m428-10v10"/></g>
    </motion.svg>
  </div>;
}

export function CareersArtwork() {
  return <Suspense fallback={<div style={{aspectRatio:'600 / 390'}} aria-hidden="true"/>}><CareersTerrain/></Suspense>;
}
