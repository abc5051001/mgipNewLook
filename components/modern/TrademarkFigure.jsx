import { motion } from 'motion/react';
import useArtwork from './useArtwork';

export default function TrademarkFigure() {
  const art = useArtwork();
  return <div ref={art.ref} data-active={art.active} className="mg-trademark-figure mg-live-art" role="img" aria-label="An animated brand label with a distinctive embossed mark and a moving search lens. Use arrow keys to explore." tabIndex={0} {...art.handlers}>
    <motion.svg viewBox="0 0 500 380" fill="none" style={art.style} aria-hidden="true">
      <ellipse cx="252" cy="309" rx="122" ry="13" fill="currentColor" opacity=".055"/>
      <g className="mg-brand-label" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M149 103h145l68 64v127H149Z" fill="#dce2ed" strokeOpacity=".35"/>
        <path d="M141 94h145l68 64v127H141Z" fill="#fff"/>
        <path d="M153 107h127l61 57v108H153Z" strokeOpacity=".22"/>
        <circle cx="316" cy="147" r="7" fill="#eef1f7"/>
        <path d="M317 147c-1-31 13-67 44-64 33 3 14 47-7 46" strokeOpacity=".5"/>
        <path d="M172 243h127m-127 12h86" strokeOpacity=".35"/>
        <g transform="translate(236 184)">
          <path d="M0-37C10-15 15-10 37 0 15 10 10 15 0 37-10 15-15 10-37 0-15-10-10-15 0-37Z" fill="#e3e0ef" strokeOpacity=".45"/>
          <path className="mg-brand-trace" d="M0-37C10-15 15-10 37 0 15 10 10 15 0 37-10 15-15 10-37 0-15-10-10-15 0-37Z" pathLength="1"/>
          <path d="m-14 0 14-14L14 0 0 14Z" fill="#fff"/>
        </g>
      </g>
      <g className="mg-brand-lens" stroke="currentColor" strokeWidth="1.3">
        <path d="m174 236-34 35" strokeWidth="7" strokeLinecap="round"/>
        <circle cx="197" cy="211" r="34" fill="#f4f5fa" fillOpacity=".78"/>
        <circle cx="197" cy="211" r="27" strokeOpacity=".35"/>
        <path d="M181 207a17 17 0 0 1 16-13" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      </g>
    </motion.svg>
  </div>;
}
