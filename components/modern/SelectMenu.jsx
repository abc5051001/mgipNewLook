import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { useId } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import './select-menu.css';

export default function SelectMenu({ id, label, value = '', onChange, onBlur, options, name, buttonRef, disabled = false, variant = 'default' }) {
  const selected = options.find(option => option.value === value) || options[0];
  const valueId = useId();
  return <div className="mg-select-field">
    <Listbox value={value} onChange={onChange} name={name} disabled={disabled}>
      <ListboxButton id={id} ref={buttonRef} onBlur={onBlur} aria-label={label} aria-describedby={valueId} className="mg-select-trigger" data-placeholder={!value}>
        <span id={valueId}>{selected?.label}</span><ChevronDown size={17} aria-hidden="true"/>
      </ListboxButton>
      <ListboxOptions anchor={{ to: 'bottom start', gap: 7, padding: 12 }} portal modal={false} transition className={`mg-select-menu ${variant === 'filter' ? 'mg-select-menu-filter' : ''}`}>
        {options.map(option => <ListboxOption key={option.value} value={option.value} className="mg-select-option">
          {({ selected }) => <><span>{option.label}</span><span className="mg-select-check" aria-hidden="true">{selected && <Check size={16}/>}</span></>}
        </ListboxOption>)}
      </ListboxOptions>
    </Listbox>
  </div>;
}
