import { useId } from 'react';

export default function HeroLinework({ variant = 'connections' }) {
  const id = useId();
  if (variant === 'statistics') return <svg className="mg-hero-linework mg-stat-linework" viewBox="0 0 1200 220" fill="none" preserveAspectRatio="none" aria-hidden="true">
    <g stroke="#8da8bb" strokeWidth=".85" opacity=".3">
      {Array.from({length:12},(_,index)=><path key={index} d={`M-40 ${-35+index*27}L220 ${-60+index*25}L430 ${-10+index*24}L650 ${-45+index*23}L880 ${-5+index*25}L1240 ${-55+index*29}`}/>)}
      {[80,260,440,620,800,980,1160,1340].map(x=><path key={x} d={`M${x} 0L${x-170} 220`}/>)}
    </g>
  </svg>;
  return <svg className={`mg-hero-linework ${variant === 'connections' ? 'mg-team-linework' : ''}`} viewBox="0 0 1500 400" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" x2="1500"><stop stopColor="#87a8bb" stopOpacity=".10"/><stop offset=".4" stopColor="#87a8bb" stopOpacity=".07"/><stop offset="1" stopColor="#87a8bb" stopOpacity=".48"/></linearGradient></defs>
    <g stroke={`url(#${id})`} strokeWidth=".8">
      {variant === 'connections' && <>{[66,166,266,366].map(y=><path key={y} d={`M0 ${y}H1500`}/>)}{Array.from({length:16},(_,index)=>index*100-50).map((x,index)=><g key={x}><path d={`M${x} 0V400M${x} 66l100 100-100 100 100 100`}/>{[66,166,266,366].map(y=><circle key={y} cx={x+(index%2?0:100)} cy={y} r="5" fill="#edf2f6"/>)}</g>)}</>}
      {variant === 'terrain' && <>{Array.from({length:10},(_,index)=><path key={index} d={`M-80 ${520-index*45}L500 ${330-index*30}L840 ${380-index*40}L1160 ${155-index*24}L1580 ${230-index*36}`}/>)}{[420,640,840,1060,1280,1500].map(x=><path key={x} d={`M${x} 0L${x-240} 400`}/>)}</>}
      {variant === 'location' && <>{[90,160,230,300,370,440].map(r=><circle key={r} cx="1120" cy="210" r={r}/>)}<path d="M0 88H1500M0 310H1500M700 0V400M1120 0V400M690 210H1500"/><path d="M1110 210H1130M1120 200V220"/></>}
    </g>
  </svg>;
}
