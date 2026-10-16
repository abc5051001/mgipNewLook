import { useSyncExternalStore } from 'react';

const query='(prefers-reduced-motion: reduce)';
const subscribe=callback=>{
 const media=window.matchMedia(query);
 media.addEventListener('change',callback);
 return()=>media.removeEventListener('change',callback);
};
const snapshot=()=>window.matchMedia(query).matches;
const serverSnapshot=()=>false;

// The first hydration render must match static HTML before applying browser preferences.
export default function useReducedMotion(){return useSyncExternalStore(subscribe,snapshot,serverSnapshot);}
