import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';
import useReducedMotion from './useReducedMotion';

export default function CountUpStat({ value, label }) {
  const ref = useRef(null);
  const visible = useInView(ref, { amount: .4 });
  const reduced = useReducedMotion();
  const target = Number.parseInt(value, 10);
  const suffix = value.replace(String(target), '');
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (reduced) return;
    if (!visible) { setCount(0); return; }
    const controls = animate(0, target, {
      duration: 1.8, ease: [.22, 1, .36, 1],
      onUpdate: current => setCount(Math.round(current)),
    });
    return () => controls.stop();
  }, [visible, reduced, target]);
  return <div ref={ref} className="mg-stat"><strong><span className="sr-only">{value}</span><span aria-hidden="true">{reduced ? target : count}{suffix}</span></strong><span>{label}</span></div>;
}
