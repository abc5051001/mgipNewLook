import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, X } from 'lucide-react';
import TeamHero from './TeamHero';
import SelectMenu from './SelectMenu';

export const displayTitle = title => (title || '').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
export const sortMembers = members => [...members].sort((a,b) => a.name==='Mascot'?1:b.name==='Mascot'?-1:(a.lastName||a.name).localeCompare(b.lastName||b.name));
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const initials=member=>[member.firstName,member.middleName,member.lastName].filter(Boolean).map(name=>name.charAt(0).toUpperCase()).join('');

export function Team({ members }) {
  const [search,setSearch]=useState('');
  const [title,setTitle]=useState('');
  const [field,setField]=useState('');
  const [letter,setLetter]=useState('');
  const sorted=useMemo(()=>sortMembers(members),[members]);
  const titles=[...new Set(members.map(member=>member.title).filter(Boolean))].sort();
  const fields=[...new Set(members.flatMap(member=>Array.isArray(member.field)?member.field:[]))].sort();
  const matching=sorted.filter(member=>(!title||member.title===title)&&(!field||member.field?.includes(field))&&[member.name,member.title,...(member.field||[]),...(member.memberships||[])].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  const available=new Set(matching.flatMap(member=>initials(member).split('')));
  const filtered=matching.filter(member=>!letter||initials(member).includes(letter));
  const clearFilters=()=>{setSearch('');setTitle('');setField('');setLetter('');};

  return <>
    <TeamHero/>
    <section className="mg-shell mg-team-section" id="people">
      <div className="mg-team-tools">
        <label className="mg-search"><Search size={19}/><span className="sr-only">Search people by name or expertise</span><input type="search" placeholder="Search name or expertise" value={search} onChange={event=>setSearch(event.target.value)}/></label>
        <SelectMenu variant="filter" label="Filter by role" value={title} onChange={setTitle} options={[{value:'',label:'All roles'},...titles.map(value=>({value,label:displayTitle(value)}))]}/>
        <SelectMenu variant="filter" label="Filter by expertise" value={field} onChange={setField} options={[{value:'',label:'All expertise'},...fields.map(value=>({value,label:value}))]}/>
      </div>
      <div className="mg-results">
        <span role="status">{filtered.length} {filtered.length===1?'profile':'profiles'}{filtered.length!==members.length&&` of ${members.length}`}</span>
        {(search||title||field||letter)&&<button onClick={clearFilters}>Clear filters<X size={13}/></button>}
      </div>
      <div className="mg-alphabet" role="group" aria-label="Filter people by initial">
        <span className="mg-alphabet-label">Browse by initial</span>
        <div className="mg-alphabet-letters">
          <button type="button" aria-label="All initials" aria-pressed={!letter} onClick={()=>setLetter('')}>All</button>
          {alphabet.map(value=><button type="button" key={value} aria-label={`Initial ${value}`} aria-pressed={letter===value} disabled={!available.has(value)&&letter!==value} onClick={()=>setLetter(current=>current===value?'':value)}>{value}</button>)}
        </div>
      </div>
      <div className="mg-team-grid">{filtered.map(member=><Link className="mg-person" to={`/team/${member.id}`} state={{filteredMembers:filtered}} key={member.id}>
        <div className="mg-person-image"><img src={member.photo} alt={member.name} width="340" height="464" loading="lazy"/><span><ArrowUpRight size={20}/></span></div>
        <h2>{member.name}</h2><p>{displayTitle(member.title)}</p><span className="mg-person-bio-link">View biography<ArrowUpRight size={13}/></span>
      </Link>)}</div>
      {!filtered.length&&<div className="mg-empty"><h2>No matching profiles.</h2><p>Try a different name or clear your filters.</p><button className="mg-button mg-button-dark" onClick={clearFilters}>Show everyone</button></div>}
    </section>
  </>;
}
