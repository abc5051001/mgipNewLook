import { useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';
import useReducedMotion from './useReducedMotion';

export default function useArtwork() {
  const ref = useRef(null);
  const visible = useInView(ref, { amount: .15 });
  const reduced = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 130, damping: 24 });
  const rotateY = useSpring(x, { stiffness: 130, damping: 24 });
  const reset = () => { x.set(0); y.set(0); };
  return {
    ref, active: visible && !reduced, style: { rotateX, rotateY },
    handlers: {
      onPointerMove(event) {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(((event.clientX - rect.left) / rect.width - .5) * 14);
        y.set(-((event.clientY - rect.top) / rect.height - .5) * 14);
      },
      onPointerLeave: reset, onBlur: reset,
      onKeyDown(event) {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        if (reduced) return;
        x.set(event.key === 'ArrowLeft' ? -8 : event.key === 'ArrowRight' ? 8 : 0);
        y.set(event.key === 'ArrowUp' ? 8 : event.key === 'ArrowDown' ? -8 : 0);
      },
    },
  };
}
