import { useEffect, useId, useRef, useState } from 'react';
import { Plus } from 'lucide-react';

export default function MembershipInfo({ label, information }) {
  const [open, setOpen] = useState(false);
  const container = useRef(null), pinned = useRef(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = event => {
      if (!container.current?.contains(event.target)) {
        pinned.current = false;
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  if (!information) return <li className="mg-membership-plain">{label}</li>;

  return <li ref={container} className="mg-membership" data-open={open}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setOpen(true); }}
    onPointerLeave={() => { if (!pinned.current && !container.current.contains(document.activeElement)) setOpen(false); }}
    onFocus={() => setOpen(true)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { pinned.current = false; setOpen(false); } }}
    onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); pinned.current = false; setOpen(false); } }}>
    <button type="button" aria-expanded={open} aria-controls={id} aria-describedby={open ? id : undefined}
      onClick={() => { pinned.current = !pinned.current; setOpen(pinned.current); }}>
      <span><strong>{label}</strong>{information.name !== label && <span className="mg-membership-name">{information.name}</span>}</span>
      <Plus size={17} aria-hidden="true"/>
    </button>
    <div id={id} className="mg-membership-explanation" role="tooltip" hidden={!open}>
      <p>{information.description}</p>
    </div>
  </li>;
}
