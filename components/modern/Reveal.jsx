import { motion } from 'motion/react';
import useReducedMotion from './useReducedMotion';
export default function Reveal({ children, className = '', delay = 0, ...props }) {
  const reduced = useReducedMotion();
  return <motion.div {...props} data-reveal className={className} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: .12, margin:'0px 0px -48px 0px' }} transition={{ duration: .65, delay: reduced ? 0 : delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
