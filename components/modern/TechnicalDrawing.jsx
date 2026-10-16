// Shared isometric projection keeps the two original drawings in the Careers family.
export const iso=(x,y,z=0)=>[200+(x-y)*Math.sqrt(3)/2,190+(x+y)/2-z];
export const plan=(radius,count=6,offset=Math.PI/6)=>Array.from({length:count},(_,index)=>{
  const angle=offset+index*Math.PI*2/count;
  return [radius*Math.cos(angle),radius*Math.sin(angle)];
});
export const isoPath=(points,z=0,close=false)=>points.map(([x,y],index)=>`${index?'L':'M'}${iso(x,y,z).map(value=>value.toFixed(2)).join(' ')}`).join(' ')+(close?'Z':'');
export const ringPath=(radius,z)=>isoPath(plan(radius,64,0),z,true);
export const rectangle=(x,y,width,depth,bevel=2)=>[[x+bevel,y],[x+width-bevel,y],[x+width,y+bevel],[x+width,y+depth-bevel],[x+width-bevel,y+depth],[x+bevel,y+depth],[x,y+depth-bevel],[x,y+bevel]];

export function IsoPlate({outline,z,depth=5,hole=0,cutouts=[],children}) {
  const visible=new Set(outline.flatMap(([x,y],index)=>{
    const [nextX,nextY]=outline[(index+1)%outline.length];
    return nextY-y-(nextX-x)>0?[index]:[];
  }));
  const faces=outline.flatMap(([x,y],index)=>{
    if(!visible.has(index))return [];
    const [nextX,nextY]=outline[(index+1)%outline.length];
    return [<path key={index} className="mg-iso-side" d={`M${iso(x,y,z-depth)}L${iso(nextX,nextY,z-depth)}L${iso(nextX,nextY,z)}L${iso(x,y,z)}Z`}/>];
  });
  // A continuous side wall keeps circular parts smooth rather than faceted.
  let wall=null;
  if(outline.length>16){
    let index=[...visible].find(value=>!visible.has((value-1+outline.length)%outline.length));
    const front=[outline[index]];
    for(let count=0;count<outline.length&&visible.has(index);count++){
      index=(index+1)%outline.length;front.push(outline[index]);
    }
    const contour=[...front.map(([x,y])=>iso(x,y,z)),...[...front].reverse().map(([x,y])=>iso(x,y,z-depth))];
    wall=<path className="mg-iso-side" d={contour.map((point,index)=>`${index?'L':'M'}${point}`).join('')+'Z'}/>;
  }
  return <g>{wall||faces}<path className="mg-iso-top" fillRule="evenodd" d={isoPath(outline,z,true)+(hole?ringPath(hole,z):'')+cutouts.map(points=>isoPath(points,z,true)).join('')}/>{children}</g>;
}

export function RadialDetail({radius,inner,z,count=6}) {
  return <g className="mg-iso-detail">{Array.from({length:count},(_,index)=>{
    const angle=index*Math.PI*2/count;
    const point=r=>[r*Math.cos(angle),r*Math.sin(angle)];
    return <path key={index} d={isoPath([point(inner),point(radius)],z)}/>;
  })}</g>;
}

const expertiseClusters=[
  {tiles:[[-110,-18],[-110,18],[-74,-18]],route:[[0,0],[-46,0],[-46,-18],[-110,-18],[-110,18]]},
  {tiles:[[18,-110],[-18,-110],[18,-74]],route:[[0,0],[0,-46],[18,-46],[18,-110],[-18,-110]]},
  {tiles:[[110,18],[110,-18],[74,18]],route:[[0,0],[46,0],[46,18],[110,18],[110,-18]]},
  {tiles:[[-18,110],[18,110],[-18,74]],route:[[0,0],[0,46],[-18,46],[-18,110],[18,110]]}
];
export function CollaborationDrawing() {
  return <svg className="mg-team-network" viewBox="0 0 400 320" fill="none" role="img" aria-label="An open network of twelve thin diamond tiles connects to a central tile. The tiles lift gently at different times as lights travel between the four groups.">
    <g transform="translate(0 -28)">
    <g className="mg-team-circuit">{expertiseClusters.map(({route},index)=><g key={index}>
      <path className="mg-team-connections" d={isoPath(route)}/>
      <path className="mg-team-signal" pathLength="100" style={{'--signal-delay':`${-index*.55}s`}} d={isoPath(route)}/>
    </g>)}</g>
    {expertiseClusters.flatMap(({tiles})=>tiles).sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])).map(([x,y],index)=>{
      const [px,py]=iso(x,y);
      return <g key={index} transform={`translate(${px-200} ${py-190})`}>
        <g className="mg-team-module mg-team-tile" style={{'--module-delay':`${-index*.29}s`}}>
          <IsoPlate outline={rectangle(-11,-9,22,18,1)} z={4} depth={2}>
            <path className="mg-iso-detail" d={isoPath(rectangle(-7,-5,14,10,.5),4.2,true)}/>
          </IsoPlate>
        </g>
      </g>;
    })}
    <g className="mg-team-module mg-team-hub" style={{'--module-delay':'-.4s','--module-lift':'-4px'}}>
      <IsoPlate outline={rectangle(-22,-18,44,36,2)} z={5} depth={3}/>
      <IsoPlate outline={rectangle(-16,-12,32,24,1)} z={7} depth={2}>
        <path className="mg-iso-detail" d={isoPath(rectangle(-12,-8,24,16,.5),7.2,true)}/>
      </IsoPlate>
    </g>
    </g>
  </svg>;
}

export function PatentAssemblyDrawing({active}) {
  const corners=[[-73,-50],[73,-50],[-73,50],[73,50]];
  const coolerVents=Array.from({length:5},(_,index)=>rectangle(-29,-24+index*11,58,4,.5));
  const hoodVents=Array.from({length:7},(_,index)=>rectangle(-49,-36+index*11,98,4,.5));
  const travel=(x,y,z)=>({'--part-x':`${(x-y)*Math.sqrt(3)/2}px`,'--part-y':`${(x+y)/2-z}px`});
  const chips=[{x:-61,y:-38,w:18,d:16},{x:-61,y:0,w:18,d:18},{x:12,y:-42,w:18,d:14},{x:-20,y:-18,w:40,d:36,cpu:true}];
  const chipPositions=[[70,264],[135,280],[330,264],[230,280]];
  return <svg className="mg-patent-assembly" viewBox="0 0 400 320" fill="none" role="img" aria-label="A vented protective hood lifts off a CPU and motherboard assembly. The processor, supporting chips, memory modules, expansion slots and cooler separate, then build back together before the hood closes." data-active={active}>
    <g transform="translate(28 44) scale(.86)">
    <g className="mg-patent-guides">{corners.map(([x,y],index)=><path key={index} d={`M${iso(x,y,-18)}L${iso(x,y,108)}`}/>)}</g>
    <IsoPlate outline={rectangle(-83,-60,166,120,5)} z={-18} depth={7}><path className="mg-iso-detail" d={isoPath(rectangle(-77,-54,154,108,3),-17.8,true)}/></IsoPlate>
    <g className="mg-patent-layer mg-patent-board" style={travel(-25,25,6)}>
      <IsoPlate outline={rectangle(-76,-54,152,108,3)} z={-9} depth={3}/>
      <g className="mg-iso-detail">
        {[-1,1].flatMap(side=>[-12,-4,4,12].map((y,index)=><path key={`${side}-${index}`} d={isoPath([[side*25,y],[side*32,y],[side*39,y+8],[side*46,y+8]],-8.8)}/>))}
        {[-12,-4,4,12].map((x,index)=><path key={index} d={isoPath([[x,-23],[x,-30],[x+8,-38],[x+8,-48]],-8.8)}/>)}
        <path d={isoPath([[-66,26],[-36,26],[-29,19],[-29,-5]],-8.8)+isoPath([[-66,36],[-33,36],[-26,29],[22,29]],-8.8)}/>
      </g>
      <g className="mg-patent-socket"><IsoPlate outline={rectangle(-25,-23,50,46,1)} z={-6} depth={3}/><path className="mg-iso-detail" d={isoPath(rectangle(-22,-20,44,40,0),-5.8,true)}/></g>
      {chips.map(({x,y,w,d,cpu},index)=>{
        const [cx,cy]=iso(x+w/2,y+d/2);
        // Fan the CPU and supporting chips clear of the motherboard and cooler.
        const [targetX,targetY]=chipPositions[index];
        return <g className={`mg-patent-layer mg-patent-component${cpu?' mg-patent-cpu':''}`} key={index} style={{'--part-x':`${targetX-cx+50*Math.sqrt(3)/2}px`,'--part-y':`${targetY-cy+6}px`}}>
        <IsoPlate outline={rectangle(x,y,w,d,1)} z={0} depth={6}/>
        <path className="mg-iso-detail" d={isoPath(rectangle(x+4,y+4,w-8,d-8,.5),.2,true)}/>
        {Array.from({length:cpu?8:4},(_,pin)=>{
          const offset=3+pin*(w-6)/(cpu?7:3);
          return <path className="mg-iso-detail" key={pin} d={isoPath([[x+offset,y-3],[x+offset,y]],-4)+isoPath([[x+offset,y+d],[x+offset,y+d+3]],-4)}/>;
        })}
        {cpu&&<path className="mg-iso-detail" d={isoPath([[x+5,y+8],[x+5,y+5],[x+8,y+5]],.3)}/>}
        </g>;})}
    </g>
    {corners.map(([x,y],index)=><g className="mg-patent-layer mg-patent-component" key={`post-${index}`} style={travel(Math.sign(x)*23,Math.sign(y)*23,12)}><g transform={`translate(${iso(x,y)[0]-200} ${iso(x,y)[1]-190})`}><IsoPlate outline={plan(4,24,0)} z={12} depth={24} hole={1.7}/></g></g>)}
    {[47,62].map((x,index)=><g className="mg-patent-layer mg-patent-component mg-patent-memory" key={x} style={travel(32+index*18,-12,24+index*12)}>
      <IsoPlate outline={rectangle(x,-36,4,72,.5)} z={14} depth={23}/>
      {[-28,-10,8,26].map(y=><path key={y} className="mg-iso-detail" d={`M${iso(x+4,y,9)}L${iso(x+4,y+10,9)}L${iso(x+4,y+10,-2)}L${iso(x+4,y,-2)}Z`}/>)}
      <path className="mg-iso-detail" d={isoPath([[x,-30],[x,30]],-7)}/>
    </g>)}
    <g className="mg-patent-layer mg-patent-thermal" style={{'--part-x':'92px','--part-y':'-37px'}}>
      <IsoPlate outline={rectangle(-36,-30,72,60,3)} z={8} depth={8}/>
      {Array.from({length:5},(_,index)=><g className="mg-patent-layer mg-patent-thermal" key={index} style={travel(0,(index-2)*5,5+index*2)}><IsoPlate outline={rectangle(-32,-24+index*11,64,4,.5)} z={22} depth={14}/></g>)}
      <IsoPlate outline={rectangle(-40,-34,80,68,3)} z={26} depth={4} cutouts={coolerVents}/>
    </g>
    {[27,41].map((y,index)=><g className="mg-patent-layer mg-patent-rail" key={y} style={travel(-28-index*12,24+index*10,-4)}><IsoPlate outline={rectangle(-60,y,90,5,.5)} z={-2} depth={6}/><path className="mg-iso-detail" d={isoPath([[-55,y+2.5],[23,y+2.5]],-1.8)}/></g>)}
    <g className="mg-patent-layer mg-patent-cover mg-patent-hood" style={{'--part-x':'-43px','--part-y':'-95px'}}>
      <IsoPlate outline={rectangle(-83,-60,166,120,5)} z={37} depth={6} cutouts={hoodVents}><path className="mg-iso-detail" d={isoPath(rectangle(-77,-54,154,108,3),37.2,true)}/></IsoPlate>
      {corners.map(([x,y],index)=><path className="mg-iso-detail" key={index} d={isoPath(plan(2.5,24,0).map(([px,py])=>[px+x,py+y]),37.2,true)}/>)}
    </g>
    {corners.map(([x,y],index)=><g className="mg-patent-layer mg-patent-fastener" key={index} style={travel(Math.sign(x)*12,Math.sign(y)*12,90)}><g transform={`translate(${iso(x,y)[0]-200} ${iso(x,y)[1]-190})`}><IsoPlate outline={plan(1.6,24,0)} z={40} depth={7}/><IsoPlate outline={plan(3.5,24,0)} z={42} depth={2}/><path className="mg-iso-detail" d={isoPath([[-2,0],[2,0]],42.2)}/></g></g>)}
    </g>
  </svg>;
}
