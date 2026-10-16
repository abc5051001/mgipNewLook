import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import useReducedMotion from './useReducedMotion';
import { teamMembers } from '../../lib/team';
import { displayTitle, sortMembers } from './Team';
import MembershipInfo from './MembershipInfo';
import HeroLinework from './HeroLinework';
const labels={bar:'Bar admissions',education:'Education',memberships:'Professional memberships',experience:'Experience',field:'Areas of focus'};
const sectionLabel=key=>labels[key]||displayTitle(key.replace(/([A-Z])/g,' $1'));

function BiographyContent({type,items,membershipsData}) {
  if(type==='experience')return <div className="mg-bio-prose">{items.map((text,index)=><p key={index}>{text}</p>)}</div>;
  if(type==='memberships')return <ul className="mg-memberships mg-membership-list">{items.map((text,index)=><MembershipInfo key={index} label={text} information={membershipsData?.[text]}/>)}</ul>;
  let column=0;
  return <ul className={`mg-bio-record-grid${['bar','education'].includes(type)?' mg-bio-credentials':''}`}>{items.map((text,index)=>{
    const wide=text.length>80||(column===0&&(index===items.length-1||items[index+1].length>80));
    column=wide?0:1-column;
    return <li className={wide?'mg-bio-record-wide':undefined} key={index}>{text}</li>;
  })}</ul>;
}

function BiographySection({section,membershipsData}) {
  const reduced=useReducedMotion();
  const {key,items,text}=section;
  return <motion.section className={`mg-bio-section mg-bio-${key}`} id={`bio-${key}`} data-reveal
    initial={reduced?false:{opacity:0,y:12}} whileInView={{opacity:1,y:0}}
    viewport={{once:true,amount:.03}} transition={{duration:reduced?0:.45,ease:[.22,1,.36,1]}}>
    <div className="mg-bio-heading"><h2>{sectionLabel(key)}</h2></div>
    <div className="mg-bio-content">{items?<BiographyContent type={key} items={items} membershipsData={membershipsData}/>:<div className="mg-bio-prose"><p>{text}</p></div>}</div>
  </motion.section>;
}

export default function BioPage({membershipsData}) {
  const {id}=useParams();
  const location=useLocation();
  const member=teamMembers.find(item=>String(item.id)===id);
  if(!member)return <Navigate to="/notfound" replace/>;
  const list=location.state?.filteredMembers||sortMembers(teamMembers);
  const index=list.findIndex(item=>item.id===member.id);
  const keys=[...new Set(['bar','education','memberships','field',...Object.keys(member)])].filter(key=>key!=='experience'&&Array.isArray(member[key])&&member[key].length);
  const scalarKeys=Object.keys(member).filter(key=>!['id','name','firstName','middleName','lastName','email','phone','title','photo','experience'].includes(key)&&!Array.isArray(member[key])&&typeof member[key]==='string'&&member[key]);
  const experience=Array.isArray(member.experience)
    ? (member.experience.length?[{key:'experience',items:member.experience}]:[])
    : (typeof member.experience==='string'&&member.experience?[{key:'experience',text:member.experience}]:[]);
  const sections=[...keys.map(key=>({key,items:member[key]})),...scalarKeys.map(key=>({key,text:member[key]})),...experience];
  return <>
    <section className="mg-profile-intro mg-shell"><HeroLinework variant="terrain"/><Link className="mg-text-link" to="/team"><ArrowLeft size={15}/>All people</Link><span className="mg-eyebrow">Our people / {displayTitle(member.title)}</span><h1>{member.name}</h1></section>
    <div className="mg-shell mg-profile-layout">
      <aside className="mg-profile-aside">
        <img src={member.photo} alt={member.name} width="340" height="464"/>
        <div className="mg-profile-contact"><span className="mg-eyebrow">Connect directly</span>{member.email&&<a href={`mailto:${member.email}`}><Mail size={15}/>{member.email}<ArrowUpRight size={14}/></a>}{member.phone&&<a href={`tel:${member.phone.replace(/\s*x\s*/i,';ext=').replace(/[()\s-]/g,'')}`}><Phone size={15}/>{member.phone}</a>}</div>
        <nav className="mg-profile-index" aria-label="Biography sections"><span className="mg-eyebrow">On this page</span>{sections.map(({key})=><a key={key} href={`#bio-${key}`}>{sectionLabel(key)}<ArrowUpRight size={13}/></a>)}</nav>
      </aside>
      <article className="mg-profile-body">
        {sections.map(section=><BiographySection section={section} membershipsData={membershipsData} key={`${member.id}-${section.key}`}/>)}
        {!sections.length&&<p>For more information about {member.name}, please contact the firm.</p>}
        <nav className="mg-profile-next" aria-label="More team profiles">{index>0&&<Link to={`/team/${list[index-1].id}`} state={{filteredMembers:list}}><ArrowLeft size={18}/><span><small>Previous profile</small>{list[index-1].name}</span></Link>}{index>=0&&index<list.length-1&&<Link to={`/team/${list[index+1].id}`} state={{filteredMembers:list}}><span><small>Next profile</small>{list[index+1].name}</span><ArrowRight size={18}/></Link>}</nav>
      </article>
    </div>
  </>;
}
