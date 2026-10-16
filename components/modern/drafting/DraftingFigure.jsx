import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import art from './art.json';
import { clamp, poseAt, project, offset, pathOf } from './model.mjs';
import './drafting.css';

const rest = poseAt(0).tip;

export default function DraftingFigure({ compact=false }) {
  const anchor = useRef(null), stage = useRef(null), parts = useRef(new Map()), stack = useRef(null), readout = useRef(null);
  const visible = useInView(anchor, { amount: .15 });
  const [reduced, setReduced] = useState(false);
  const wasReduced = useRef(false);
  const [paused, setPaused] = useState(false);
  const [accessibleValue, setAccessibleValue] = useState(0);
  const frame = useRef(0), kick = useRef(() => {}), paint = useRef(() => {});
  const state = useRef({ progress: 0, target: 0, clock: 0, idle: 0, hover: false, focus: false, order: '' });

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const s = state.current;
    let last = 0;
    const draw = () => {
      const pose = poseAt(s.progress);
      const delta = [pose.tip[0] - rest[0], pose.tip[1] - rest[1], 0];
      const items = art.parts.map(part => {
        const world = part.group === 'base' ? [0, 0, 0] : part.group === 'bridge' ? [delta[0], 0, 0] : delta;
        const [x, y] = offset(world, art.camera);
        parts.current.get(part.name)?.setAttribute('transform', `translate(${x.toFixed(3)} ${y.toFixed(3)})`);
        return { name: part.name, key: part.key + (world[0] * art.camera.cosA + world[1] * art.camera.sinA) * art.camera.cosE };
      }).sort((a, b) => a.key - b.key);
      const order = items.map(item => item.name).join('|');
      if (order !== s.order && stack.current) {
        const fragment = document.createDocumentFragment();
        for (const item of items) fragment.append(parts.current.get(item.name));
        stack.current.append(fragment);
        s.order = order;
      }
      stage.current?.querySelector('[data-drafting-ink]')?.setAttribute('d', pathOf(pose.trail.map(([x,y]) => project([x,y,.65], art.camera))));
      if (readout.current) readout.current.textContent = `${Math.round(s.progress * 100)}% drawn`;
      stage.current?.setAttribute('data-progress', s.progress.toFixed(4));
    };
    paint.current = draw;
    if (reduced && !wasReduced.current) {
      s.progress = s.target = 1;
      setAccessibleValue(100);
    }
    wasReduced.current = reduced;
    const tick = now => {
      frame.current = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min((now - last) / 1000, 1/30) : 1/60;
      last = now;
      const touring = !paused && !reduced && !s.focus;
      if (touring) {
        s.idle += dt;
        if (s.idle > .25) { s.clock += dt; s.target = .5 - .5 * Math.cos(s.clock * Math.PI / 5); }
      }
      s.progress = reduced ? s.target : s.progress + (s.target - s.progress) * (1 - Math.exp(-dt / .18));
      if (Math.abs(s.target - s.progress) < .00001) s.progress = s.target;
      draw();
      if (!reduced && (touring || s.progress !== s.target)) frame.current = requestAnimationFrame(tick);
    };
    const run = () => { if (!frame.current && visible && !document.hidden) { last = 0; frame.current = requestAnimationFrame(tick); } };
    kick.current = run;
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame.current); frame.current = 0; }
      else run();
    };
    document.addEventListener('visibilitychange', visibility);
    draw();
    run();
    return () => { cancelAnimationFrame(frame.current); frame.current = 0; document.removeEventListener('visibilitychange', visibility); };
  }, [visible, reduced, paused]);

  function steer(value) {
    const s = state.current;
    s.target = clamp(value);
    s.idle = -.9;
    // Resume the idle tour from the same location rather than jumping back to zero.
    s.clock = Math.acos(1 - 2 * s.target) * 5 / Math.PI;
    setAccessibleValue(Math.round(s.target * 100));
    if (reduced) { s.progress = s.target; paint.current(); }
    else kick.current();
  }
  function toggle() {
    state.current.target = state.current.progress;
    state.current.idle = 0;
    state.current.clock = Math.acos(1 - 2 * state.current.progress) * 5 / Math.PI;
    setPaused(value => !value);
  }
  return <figure ref={anchor} className={`mg-collaboration-art mg-drafting-figure iso ${compact?'mg-service-machine mg-patent-machine':''}`} data-kind={compact?'patent':undefined} data-theme="light" data-active={visible && !reduced && !paused}>
    <figcaption className={compact?'sr-only':'mg-drafting-top'}>{compact?'A technical drawing traced by a precise drafting instrument.':<><span>Fig. 01</span><span>Technical Innovation</span></>}</figcaption>
    <div ref={stage} className="mg-drafting-stage" role="slider" tabIndex={0} aria-label="Explore the drafting instrument. Arrow keys move the pen along the drawing." aria-valuemin={0} aria-valuemax={100} aria-valuenow={accessibleValue} aria-valuetext={`${accessibleValue}% of the drawing`} onFocus={() => { state.current.focus = true; steer(state.current.progress); }} onBlur={() => {state.current.focus = false; kick.current();}} onPointerMove={event => {
      if (event.pointerType === 'touch' && event.buttons === 0) return;
      state.current.hover = true;
      const box = event.currentTarget.getBoundingClientRect();
      steer((event.clientX - box.left) / box.width);
    }} onPointerDown={event => {
      if (event.pointerType !== 'touch') return;
      const box = event.currentTarget.getBoundingClientRect();
      steer((event.clientX - box.left) / box.width);
    }} onPointerLeave={() => {state.current.hover = false; kick.current();}} onPointerCancel={() => {state.current.hover = false; kick.current();}} onKeyDown={event => {
      const step = event.shiftKey ? .1 : .025;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : ['ArrowRight','ArrowUp'].includes(event.key) ? state.current.progress + step : ['ArrowLeft','ArrowDown'].includes(event.key) ? state.current.progress - step : undefined;
      if (next !== undefined) { event.preventDefault(); steer(next); }
    }}>
      <svg className="iso-svg" viewBox="0 0 600 390" role="img" aria-label="An isometric drafting instrument with twin guide rails, a moving crossbeam, a stylus and a technical drawing on a sheet of paper.">
        <path className="iso-halo" d={art.halo}/>
        <g ref={stack}>{art.parts.map(part => <g key={part.name} ref={node => {if(node)parts.current.set(part.name,node);else parts.current.delete(part.name);}} data-part={part.name} data-group={part.group} dangerouslySetInnerHTML={{__html:part.svg}}/>)}</g>
      </svg>
    </div>
    <div className={compact?'mg-machine-controls':'mg-drafting-bottom'}>{!compact&&<span>Move to explore <span aria-hidden="true">↔</span></span>}<div><span ref={readout} className={compact?'sr-only':undefined} data-readout aria-hidden="true">0% drawn</span>{!reduced && <button type="button" onClick={toggle} aria-label={paused?'Play illustration':'Pause illustration'}>{paused?<Play size={14}/>:<Pause size={14}/>}</button>}</div></div>
  </figure>;
}
