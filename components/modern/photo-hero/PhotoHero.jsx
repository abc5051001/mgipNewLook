import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import useReducedMotion from '../useReducedMotion';
import Reveal from '../Reveal';
import copy from '../../../content/firm-copy.json';
import { homeImage, homeSrcSet, homeSizes, portraitMedia, portraitSrcSet } from '../../../lib/images';
import './photo-hero.css';
import ReactBitsCursorGrid from './tech/ReactBitsCursorGrid';

const titleLines=[['Muncy,','Geissler,'],['Olds','&','Lowe,','P.C.']];
const descriptionParts=copy.hero.description.split(/(Washington, D\.C\. Metro Area|Engineering, Science, and Legal Expertise)/);
const descriptionHighlights=descriptionParts.filter((_,index)=>index%2).map(text=>{
  const start=copy.hero.description.indexOf(text);
  return {start,end:start+text.length};
});
const descriptionWords=[...copy.hero.description.matchAll(/\S+(\s*)/g)].map(match=>({
  word:match[0].trimEnd(),space:match[1],
  emphasized:descriptionHighlights.some(({start,end})=>match.index>=start&&match.index<end),
}));
const textViewport={once:false,amount:.12,margin:'-88px 0px -32px 0px'};

// Square cells follow the site's technical artwork; copy stays above the effect.
function SquareField() {
  const reduced=useReducedMotion();
  const ref=useRef(null);
  const inView=useInView(ref,{amount:.1});
  const [pageVisible,setPageVisible]=useState(true);
  useEffect(()=>{
    const update=()=>setPageVisible(!document.hidden);
    update();document.addEventListener('visibilitychange',update);
    return()=>document.removeEventListener('visibilitychange',update);
  },[]);
  const active=inView&&pageVisible;
  return <div ref={ref} className="mh-square-field" aria-hidden="true" data-active={active}>
    <ReactBitsCursorGrid cellSize={72} color="#ddf3ff" gridColor="#b4d1e1"
      radius={190} holdTime={180} fadeDuration={950} lineWidth={1.1}
      maxOpacity={.72} fillOpacity={.09} gridOpacity={.035} spotlight={.45}
      cellRadius={0} cellGap={0} gridStyle="lines" highlight="area" edgeFade={.14}
      clickPulse={false} ambient={reduced?0:.015} intro={!reduced} dpr={1.5}
      interactive={!reduced} paused={!active||reduced}/>
  </div>;
}

export default function PhotoHero() {
  const reduced=useReducedMotion();
  const [titleSettled,setTitleSettled]=useState(reduced);
  const [descriptionSettled,setDescriptionSettled]=useState(reduced);
  const [enhanced,setEnhanced]=useState(false);
  useEffect(()=>setEnhanced(true),[]);
  const lightPhoto=event=>{
    if(reduced||event.pointerType!=='mouse'||!window.matchMedia('(hover: hover) and (pointer: fine)').matches)return;
    const hero=event.currentTarget,rect=hero.getBoundingClientRect();
    hero.style.setProperty('--mh-pointer-x',`${event.clientX-rect.left}px`);
    hero.style.setProperty('--mh-pointer-y',`${event.clientY-rect.top}px`);
    hero.dataset.cursorActive='true';
  };
  const titleWord={
    hidden:{y:'-115%',opacity:0,transition:{duration:0}},
    visible:index=>({y:'0%',opacity:1,transition:{duration:reduced?0:.85,delay:reduced?0:.2+index*.085,ease:[.16,1,.3,1]}}),
  };
  const descriptionWord={
    hidden:titleWord.hidden,
    visible:index=>({y:'0%',opacity:1,transition:{duration:reduced?0:.85,delay:reduced?0:.15+index*.035,ease:[.16,1,.3,1]}}),
  };

  return <section className="mg-dc-hero mg-home-photo-hero mh-hero mh-editorial" aria-labelledby="motion-firm-title" data-enhanced={enhanced}
    onPointerMove={lightPhoto} onPointerLeave={event=>{event.currentTarget.dataset.cursorActive='false';}}>
      <picture className="mg-home-photo-background mh-poster">
        <source media={portraitMedia} srcSet={portraitSrcSet} sizes="100vw"/>
        <img className="mg-dc-hero-photo" src={homeImage} srcSet={homeSrcSet} sizes={homeSizes} alt="The Jefferson Memorial in Washington, D.C., framed by cherry blossoms" width="6147" height="3779" fetchpriority="high"/>
      </picture>
      <picture className="mg-home-photo-background mh-cursor-photo" aria-hidden="true">
        <source media={portraitMedia} srcSet={portraitSrcSet} sizes="100vw"/>
        <img className="mg-dc-hero-photo" src={homeImage} srcSet={homeSrcSet} sizes={homeSizes} alt="" width="6147" height="3779"/>
      </picture>
      <SquareField/>
      <div className="mg-shell mh-context"><div>
        <motion.p className="mh-context-description" initial={reduced?false:'hidden'} animate={reduced?'visible':undefined} whileInView={reduced?undefined:'visible'} viewport={textViewport} onViewportLeave={reduced?undefined:()=>setDescriptionSettled(false)} data-settled={reduced||descriptionSettled}>
          <span className="mh-description-accessible">{copy.hero.description}</span>
          <span className="mh-description-text" aria-hidden="true">{descriptionWords.map(({word,space,emphasized},index)=><Fragment key={index}><span className="mh-word-mask"><motion.span className={`mh-description-word${emphasized?' mh-description-emphasis':''}`} custom={index} variants={descriptionWord} onAnimationComplete={index===descriptionWords.length-1?definition=>{if(definition==='visible')setDescriptionSettled(true);}:undefined}>{word}</motion.span></span>{space}</Fragment>)}</span>
        </motion.p>
      </div></div>
      <div className="mg-shell mh-intro">
        <motion.p className="mh-eyebrow" initial={reduced?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={textViewport} transition={{duration:reduced?0:.65,delay:reduced?0:.05,ease:[.22,1,.36,1]}}>{copy.hero.eyebrow}</motion.p>
        <motion.h1 id="motion-firm-title" aria-label="Muncy, Geissler, Olds & Lowe, P.C." initial={reduced?false:'hidden'} animate={reduced?'visible':undefined} whileInView={reduced?undefined:'visible'} viewport={textViewport} onViewportLeave={reduced?undefined:()=>setTitleSettled(false)} data-settled={reduced||titleSettled}>
          {titleLines.map((line,lineIndex)=><span className="mh-title-line" aria-hidden="true" key={lineIndex}>{line.map((word,wordIndex)=>{
            const index=wordIndex+(lineIndex===0?0:titleLines[0].length);
            return <Fragment key={word}><span className="mh-word-mask"><motion.span className="mh-title-word" custom={index} variants={titleWord} onAnimationComplete={index===5?definition=>{if(definition==='visible')setTitleSettled(true);}:undefined}>{word}</motion.span></span>{wordIndex<line.length-1?' ':null}</Fragment>;
          })}</span>)}
        </motion.h1>
        <motion.p className="mh-disciplines" initial={reduced?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={textViewport} transition={{duration:reduced?0:.65,delay:reduced?0:.2,ease:[.22,1,.36,1]}}>Engineering<span aria-hidden="true">/</span>Science<span aria-hidden="true">/</span>Law</motion.p>
      </div>
      <div className="mg-shell mh-bottom">
        <Reveal className="mh-actions" delay={.12}><Link className="mg-button mg-home-primary" to="/contact"><span>Contact Us</span><span className="mh-action-arrow"><ArrowUpRight size={17}/></span></Link><a href="#about" className="mh-contact">Learn More<ArrowDown size={17}/></a></Reveal>
      </div>
    </section>;
}
