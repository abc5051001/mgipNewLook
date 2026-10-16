import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function ScrollToTop() {
  const { pathname, key, hash } = useLocation();

  useBrowserLayoutEffect(() => {
    if (hash) return;
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
  }, [pathname, key, hash]);

  return null;
}

export default ScrollToTop;
