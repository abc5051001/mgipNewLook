import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function ScrollToTop() {
  const { pathname, key, hash, state } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(null);

  useBrowserLayoutEffect(() => {
    const samePage = previousPath.current === pathname;
    previousPath.current = pathname;
    if (hash) return;
    if (samePage && state?.scrollToTop === 'smooth' && navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      return;
    }
    const root=document.documentElement;
    const previous=root.style.scrollBehavior;
    root.style.scrollBehavior='auto';
    const reset=()=>{
      if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    reset();
    // Cancel an in-flight native anchor scroll, including its pending paint.
    let second=0;
    const first=requestAnimationFrame(()=>{
      reset();
      second=requestAnimationFrame(()=>{reset();root.style.scrollBehavior=previous;});
    });
    return()=>{cancelAnimationFrame(first);cancelAnimationFrame(second);root.style.scrollBehavior=previous;};
  }, [pathname, key, hash, state?.scrollToTop, navigationType]);

  return null;
}

export default ScrollToTop;
