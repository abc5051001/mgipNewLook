import { useLayoutEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, X } from 'lucide-react';
import TrademarkFigure from './TrademarkFigure';
import RightsFigure from './RightsFigure';
import PatentFigure from './PatentFigure';

export default function ServiceDialog({ service, onClose }) {
  const ref = useRef(null);
  const titleId = useId();
  const art=service.title==='Patent'?<PatentFigure/>:service.title==='Trademark'?<TrademarkFigure/>:service.title==='Copyright'?<RightsFigure/>:null;
  useLayoutEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={ref} className={`mg-service-dialog mg-service-${service.title.toLowerCase()}`} aria-labelledby={titleId} onClose={() => { if (!ref.current?.open) onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) ref.current.close();
  }}>
    <header><span className="mg-eyebrow">Our Services</span><button type="button" onClick={() => ref.current.close()} aria-label="Close service details" autoFocus><X size={22}/></button></header>
    <div className="mg-service-dialog-body"><div className={`mg-service-dialog-intro ${art?'mg-service-dialog-illustrated':''}`}><div><h2 id={titleId}>{service.title}</h2><p>{service.description}</p></div>{art&&<div className="mg-dialog-visual">{art}</div>}</div><div className="mg-service-details">{service.details.map((detail,index) => <section key={detail.heading}><span aria-hidden="true">0{index+1}</span><div><h3>{detail.heading}</h3><p>{detail.body}</p></div></section>)}</div></div>
    <footer><button type="button" className="mg-text-link" onClick={() => ref.current.close()}>Close details</button><Link className="mg-button mg-button-dark" to="/contact">Contact Us<ArrowUpRight size={18}/></Link></footer>
  </dialog>;
}
