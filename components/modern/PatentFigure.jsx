import { motion } from 'motion/react';
import useArtwork from './useArtwork';

export default function PatentFigure(){
  const art=useArtwork();
  return <div ref={art.ref} className="mg-patent-figure mg-live-art" data-active={art.active} role="img" aria-label="A patent drawing showing an exploded mechanical assembly on a drafting sheet. Use arrow keys to explore." tabIndex={0} {...art.handlers}>
    <motion.svg viewBox="0 0 500 380" fill="none" style={art.style} aria-hidden="true">
      <ellipse cx="250" cy="332" rx="119" ry="12" fill="currentColor" opacity=".055"/>
      <g stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M151 74h166l38 39v210H151Z" fill="#dce6ee" strokeOpacity=".3"/>
        <path d="M143 65h166l38 39v210H143Z" fill="#fff"/>
        <path d="M309 65v39h38"/>
        <path d="M165 281h126m-126 12h84" opacity=".35"/>
        <g className="mg-patent-diagram">
          <path d="m187 219 57-33 62 36-57 33Z" fill="#e6edf3"/>
          <path d="m187 219v7l62 36 57-33v-7m-57 33v7" opacity=".7"/>
          <path d="M199 186v27m44-51v30m50-3v28" strokeDasharray="3 5" opacity=".4"/>
          <g className="mg-patent-diagram-top">
            <path d="m187 163 57-33 62 36-57 33Z" fill="#f3f7fa"/>
            <path d="m187 163v7l62 36 57-33v-7m-57 33v7"/>
            <ellipse cx="247" cy="165" rx="23" ry="13" fill="#fff"/>
            <ellipse cx="247" cy="165" rx="12" ry="7" opacity=".55"/>
            <path d="m203 161 9-5m72 10 9 5m-52-31 8 5m-8 40 8 5" opacity=".6"/>
          </g>
          <path d="M194 153h-20v-22m126 68h25v22M237 238h-59v15" opacity=".45"/>
          <circle cx="194" cy="153" r="2" fill="currentColor"/>
          <circle cx="300" cy="199" r="2" fill="currentColor"/>
          <circle cx="237" cy="238" r="2" fill="currentColor"/>
        </g>
      </g>
    </motion.svg>
  </div>;
}
