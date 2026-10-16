import { motion } from 'motion/react';
import useArtwork from './useArtwork';

export default function RightsFigure() {
  const art = useArtwork();
  return <div ref={art.ref} data-active={art.active} className="mg-rights-figure mg-live-art" role="img" aria-label="An animated copyright document with floating pages and a signing seal. Use the arrow keys to tilt the document." tabIndex={0} {...art.handlers}>
    <motion.svg viewBox="0 0 500 380" fill="none" style={art.style} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2">
        <path className="mg-rights-back" d="m133 80 208-21 29 264-208 21Z" opacity=".25"/>
        <path className="mg-rights-middle" d="M132 71h218v264H132Z" fill="var(--mg-white)"/>
        <g className="mg-rights-front">
          <path d="M151 55h165l37 39v222H151Z" fill="var(--mg-white)"/>
          <path d="M316 55v39h37"/>
          <path d="M182 219h139m-139 19h111m-111 19h139m-139 19h79" opacity=".5"/>
          <text x="252" y="179" textAnchor="middle" fontSize="82" fontFamily="Arial, sans-serif" fontWeight="300" fill="currentColor" stroke="none">{'©'}</text>
          <circle cx="323" cy="285" r="16"/>
          <path className="mg-rights-sign" d="m316 285 5 5 10-11" strokeWidth="1.5" pathLength="1"/>
        </g>
        <path d="M175 36v-9m-5 5h10M383 294v12m-6-6h12M107 211h-10m5-5v10" opacity=".4"/>
      </g>
    </motion.svg>
  </div>;
}
