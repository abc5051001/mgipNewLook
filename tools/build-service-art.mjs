import { writeFileSync } from 'node:fs';
import { createMachine, k, G } from './service-art-kit.mjs';
import { STAMP_TRAVEL, WRITING } from '../components/modern/service-art/models.mjs';

function stamp() {
  const bed={x:-130,y:-85,w:260,d:170,r:7};
  const M=createMachine({bounds:bed,z0:-19,z1:98,moves:{head:[0,0,-STAMP_TRAVEL]},azimuth:48,elevation:32});
  const {P,put,screws,feet}=M;
  feet(bed);
  put('bed',bed,-12,12,{bevel:1.4,detail:(plan,top)=>k.lineSvg(k.planOutline(k.insetPlan(plan,4),top,P),{tone:'faint'})});
  for(const side of [-1,1]) {
    const x=side<0?-100:76;
    put(`guide.mount.${side}`,{x,y:-34,w:24,d:68,r:3},0,6,{tone:'mid'});
    screws(`mount.screw.${side}`,[[side<0?-96:96,-27],[side<0?-96:96,-9],[side<0?-96:96,9],[side<0?-96:96,27]],6);
    put(`guide.column.${side}`,{x:side<0?-89:76,y:-26,w:13,d:52,r:1},6,84,{tone:'mid'});
    put(`guide.trim.${side}`,{x:side<0?-93:89,y:-27,w:4,d:54,r:1},6,78,{tone:'lo'});
    put(`guide.cap.${side}`,{x:side<0?-93:72,y:-29,w:21,d:58,r:2},90,3,{tone:'hi'});
    screws(`guide.cap.screw.${side}`,[[side<0?-82.5:82.5,-22],[side<0?-82.5:82.5,22]],93);
    for(const y of [-26,17])put(`carriage.shoe.${side}.${y}`,{x:side<0?-76:68,y,w:8,d:9,r:1},44,12,{group:'head',tone:'hi'});
  }
  put('head.platen',{x:-68,y:-20,w:136,d:40,r:2},46,8,{group:'head',tone:'hi',bevel:.8});
  put('head.die-backing',{x:-32,y:-23,w:64,d:46,r:2},42,4,{group:'head',tone:'mid'});
  put('head.rubber-die',{x:-31,y:-22,w:62,d:44,r:2},34,8,{group:'head',tone:'hi',lit:true,bevel:.4});
  for(const x of [-35,29])put(`grip.post.${x}`,{x,y:-3,w:6,d:6,r:1},54,15,{group:'head',tone:'mid'});
  put('grip.bar',{x:-35,y:-4,w:70,d:8,r:2},69,7,{group:'head',tone:'hi',bevel:.7});
  screws('grip.screw',[[-31,0],[31,0]],76,'head');
  screws('head.screw',[[-56,-9],[56,9]],54,'head');
  put('label.support',{x:-50,y:-35,w:100,d:70,r:3},0,2,{tone:'lo'});
  const star=[[0,-17],[5,-5],[17,0],[5,5],[0,17],[-5,5],[-17,0],[-5,-5]];
  const starPath=k.pathOf(star.map(([x,y])=>k.iso([x,y,2.25],P)),true);
  const rules=[k.lineOnTop([-23,24],[23,24],2.25,P),k.lineOnTop([-16,28],[16,28],2.25,P)].join('');
  const markType=k.faceTextSvg(k.topMatrix([20,-12],2.25,P),'\u2122',{size:10,tone:'hi'});
  put('label.paper',{x:-45,y:-30,w:90,d:60,r:1},2,.2,{tone:'lo',bevel:0,inner:`<g data-stamp-mark opacity="0">${k.lineSvg(starPath,{tone:'hi'})}${markType}${k.lineSvg(rules,{tone:'lo',free:true})}</g>`});
  for(const [index,[x,y]] of [[-44,-29],[37,-29],[-44,24],[37,24]].entries()) {
    put(`label.clip.${index}`,{x,y,w:7,d:5,r:1},2.2,1.4,{tone:'mid',bevel:.2});
    screws(`label.clip.screw.${index}`,[[x+3.5,y+2.5]],3.6);
  }
  const ruler={x:-100,y:71,w:200,d:5,r:.5};
  const ticks=k.topTicks(-95,95,5,5,71,1,[2,3.5],P);
  put('bed.ruler',ruler,0,1,{tone:'lo',bevel:0,inner:k.lineSvg(ticks.minor,{tone:'lo'})+k.lineSvg(ticks.major,{tone:'mid'})});
  return M.finish({halo:bed,output:'stamp.json',label:'An isometric label-stamping press with guide columns, a moving hand grip and a die that leaves a distinctive emblem on paper.'});
}

function writing() {
  const bed={x:-140,y:-88,w:280,d:176,r:8};
  const M=createMachine({bounds:{x:-194,y:-92,w:388,d:184,r:0},z0:-19,z1:116,moves:{carriage:[-80,0,0]},initial:{carriage:[40,0,0]},azimuth:45,elevation:30});
  const {P,put,round,screws,feet}=M;
  feet(bed);
  put('case.base',bed,-12,12,{bevel:1.5,detail:(plan,top)=>k.lineSvg(k.planOutline(k.insetPlan(plan,4),top,P),{tone:'faint'})});
  put('case.rear',{x:-125,y:-75,w:250,d:58,r:5},0,32,{tone:'mid',bevel:1});
  put('case.keyboard',{x:-125,y:-13,w:250,d:89,r:5},0,10,{tone:'mid',bevel:1});
  [10,9,7].forEach((count,row)=>Array.from({length:count},(_,index)=>{
    const x=(index-(count-1)/2)*21-7,y=-6+row*21;
    put(`key.${row}.${index}`,{x,y,w:14,d:12,r:2},10,5,{tone:'hi',bevel:.5,detail:(plan,top)=>k.dotsSvg([k.iso([plan.x+7,plan.y+6,top],P)],{size:.55,tone:'mid'})});
  }));
  put('key.space',{x:-44,y:59,w:88,d:11,r:2},10,5,{tone:'hi',bevel:.5});
  const rail={x:-174,y:-67,w:348,d:7,r:1};
  put('carriage.guide',rail,32,4,{tone:'mid',bevel:.3});
  for(const x of [-174,168])put(`carriage.stop.${x}`,{x,y:-67,w:6,d:7,r:1},36,7,{tone:'hi'});
  put('carriage.bridge',{x:-104,y:-67,w:208,d:17,r:1},36,4,{group:'carriage',tone:'hi'});
  put('carriage.paper-rest',{x:-83,y:-53.5,w:166,d:3,r:1},40,72,{group:'carriage',tone:'mid',bevel:.3});
  const initial=40;
  const heading=k.faceTextSvg(k.sideMatrix([initial,-49.95],101,P,'left'),'\u00a9',{size:10,tone:'hi',anchor:'middle'});
  const printLines=[80,74,68,62].map((z,index)=>k.segment([initial-48,-49.95,z],[initial+(index%2?28:48),-49.95,z],P)).join('');
  const glyphs=[...WRITING].map((letter,index)=>`<text data-writing-glyph="${index}" class="iso-face-text" data-tone="hi" opacity="0" transform="${k.sideMatrix([initial-40+index*80/(WRITING.length-1),-49.95],88,P,'left')}" font-size="7">${letter}</text>`).join('');
  const ink=`${heading}${k.lineSvg(printLines,{tone:'faint',free:true})}${glyphs}`;
  put('carriage.paper',{x:-78,y:-50.5,w:156,d:.5,r:0},44,64,{group:'carriage',tone:'hi',lit:true,bevel:0,inner:ink});
  for(const x of [-104,94])put(`platen.bearing.${x}`,{x,y:-52,w:10,d:20,r:1},40,16,{group:'carriage',tone:'mid'});
  round('platen.roller',[-94,-42,48],[1,0,0],188,8,{group:'carriage',tone:'mid'});
  for(const side of [-1,1]) {
    round(`platen.knob-stem.${side}`,[side*104,-42,48],[side,0,0],4,2,{group:'carriage',tone:'mid'});
    round(`platen.knob.${side}`,[side*108,-42,48],[side,0,0],5,6,{group:'carriage',tone:'hi',detail:F=>k.lineSvg(G.ribsOf(F,0,5,6,24,P,{seams:true}),{tone:'lo'})});
  }
  put('typing.guide',{x:-8,y:-33,w:16,d:10,r:1},32,10,{tone:'hi'});
  put('case.label',{x:-20,y:78,w:40,d:7,r:1},0,.5,{tone:'lo',bevel:0,detail:(plan,top)=>k.lineSvg([k.lineOnTop([plan.x+5,plan.y+2],[plan.x+35,plan.y+2],top,P),k.lineOnTop([plan.x+10,plan.y+4],[plan.x+30,plan.y+4],top,P)].join(''),{tone:'lo',free:true})});
  screws('case.screw',[[-133,-80],[133,-80],[-133,80],[133,80]],0);
  screws('carriage.fastener',[[-98,-61],[98,-61]],40,'carriage');
  return M.finish({halo:bed,output:'writing.json',label:'An isometric writing machine with a moving paper carriage, platen roller, fine keys and original writing appearing on its page.'});
}

const requested=process.argv.find(value=>value.startsWith('--only='))?.slice(7);
for(const [name,build] of [['stamp',stamp],['writing',writing]]) {
  if(requested&&requested!==name)continue;
  console.log('Building '+name+' service figure');
  const {output,data}=build();
  writeFileSync(new URL('../components/modern/service-art/'+output,import.meta.url),JSON.stringify(data));
  console.log(output+': '+data.partCount+' solids');
}
