import { writeFileSync } from 'node:fs';
import * as k from './anatomy/iso-kit.mjs';
import * as A from './anatomy/audit.mjs';
import { poseAt, DRAWING } from '../components/modern/drafting/model.mjs';

const bed = { x: -140, y: -96, w: 280, d: 192, r: 7 };
const P = k.fitProjection(k.boxCorners(bed, -19, 52), 600, 390, { pad: 48, azimuth: 48, elevation: 35 });
const camera = { ...k.cameraOf(P), origin: P.origin };
const L = k.lineSvg;
let count = 0;
let runtimeBase = null;

function build(progress) {
  const { tip: [tx, ty] } = poseAt(progress);
  const bx = tx - 24;
  const R = A.recorder(P);
  const parts = [];
  const put = (name, plan, z, h, { group = 'base', tone = 'mid', inner = '', lit = false, bevel = .5 } = {}) => {
    const actual = { ...plan, x: plan.x + (group === 'base' ? 0 : bx), y: plan.y + (group === 'pen' ? ty : 0) };
    const shape = R.solid(A.slab(actual, z, h, { name, owner: name, ground: name.startsWith('foot.') }, 5));
    const paths = k.slabOf(actual, z, h, P, 5, bevel);
    const svg = k.solidSvg(paths, { tone, lit, inner });
    const item = R.put({ name, piece: name, at: [actual.x + actual.w / 2, actual.y + actual.d / 2, z + h / 2], svg, shapes: [shape] });
    parts.push({ name, group, svg, key: item.key });
  };
  const screws = (name, points, z, group = 'base') => points.forEach(([x, y], index) => {
    // Small screw heads sit flush on the host top; the slot is printed on their top face.
    const xx = x + (group === 'base' ? 0 : bx), yy = y + (group === 'pen' ? ty : 0);
    put(`${name}.${index}`, { x: x - 1.2, y: y - 1.2, w: 2.4, d: 2.4, r: .6 }, z, .7, { group, tone: 'lo', bevel: .15,
      inner: L(k.lineOnTop([xx - .7, yy], [xx + .7, yy], z + .7, P), { tone: 'mid', free: true }) });
  });

  for (const [index, [x, y]] of [[-124,-80],[108,-80],[-124,64],[108,64]].entries()) {
    put(`foot.pad.${index}`, { x, y, w:16, d:16, r:3 }, -19, 3, { tone:'lo' });
    put(`foot.block.${index}`, { x:x+1, y:y+1, w:14, d:14, r:2 }, -16, 4, { tone:'lo' });
  }
  put('bed', bed, -12, 12, { bevel:1.4, inner:L(k.planOutline(k.insetPlan(bed,4),0,P),{tone:'faint'}) });
  put('paper.support', { x:-105,y:-63,w:210,d:126,r:2 },0,.4,{tone:'lo',bevel:.1});
  const paper = {x:-100,y:-58,w:200,d:116,r:.5};
  const diagram = k.pathOf(DRAWING.map(([x,y])=>k.iso([x,y,.65],P)));
  put('paper',paper,.4,.2,{tone:'lo',bevel:0,inner:L(diagram,{tone:'faint',free:true})+'<path data-drafting-ink class="iso-line" data-tone="hi" data-free="" d=""/>'});
  for(const [i,[x,y]] of [[-99,-57],[91,-57],[-99,51],[91,51]].entries()) {
    put(`paper.clamp.${i}`,{x,y,w:8,d:6,r:1},.6,1.4,{tone:'mid',bevel:.2});
    screws(`paper.screw.${i}`,[[x+4,y+3]],2);
  }
  for(const y of [-87,77]) {
    put(`guide.${y}`,{x:-132,y,w:264,d:10,r:1},0,7,{tone:'mid',bevel:.4});
    for(const x of [-132,126])put(`guide.stop.${x}.${y}`,{x,y,w:6,d:10,r:1},7,10,{tone:'mid'});
    // Mounting screws sit on the outer end zones, outside the carriage travel.
    screws(`guide.screw.${y}`,[[-121,y+5],[106,y+5],[121,y+5]],7);
  }
  const strip={x:-120,y:90,w:240,d:4,r:.3};
  const ticks=k.topTicks(-115,115,5,5,90,1,[1.8,3],P);
  put('bed.ruler',strip,0,1,{tone:'lo',bevel:0,inner:L(ticks.minor,{tone:'lo'})+L(ticks.major,{tone:'mid'})});
  for(const y of [-87,77]) {
    for(const x of [-11,3])put(`shoe.${x}.${y}`,{x,y,w:8,d:10,r:1},7,6,{group:'bridge',tone:'hi'});
    put(`bracket.${y}`,{x:-10,y,w:20,d:10,r:1},13,18,{group:'bridge'});
  }
  // The beam touches both bracket tops, leaving the paper and all pen travel clear below it.
  put('bridge.beam',{x:-10,y:-87,w:20,d:174,r:1.2},31,8,{group:'bridge',tone:'hi',bevel:.6});
  for(const y of [-87,81]) {
    put(`bridge.end.${y}`,{x:-10,y,w:20,d:6,r:1},39,2,{group:'bridge',tone:'mid'});
    screws(`bridge.screw.${y}`,[[-6,y+3],[6,y+3]],41,'bridge');
  }
  const ruler={x:-7,y:-77,w:4,d:154,r:.3};
  const rulerTicks=Array.from({length:30},(_,i)=>k.lineOnTop([bx-3,-72+i*5],[bx-(i%5===0?6.5:5),-72+i*5],39.6,P)).join('');
  put('bridge.ruler',ruler,39,.6,{group:'bridge',tone:'lo',bevel:0,inner:L(rulerTicks,{tone:'mid'})});
  put('pen.mount',{x:10,y:-9,w:10,d:18,r:1},31,8,{group:'pen',tone:'hi'});
  put('pen.collar',{x:20,y:-4,w:8,d:8,r:1},31,8,{group:'pen',tone:'hi',lit:true});
  put('pen.cartridge',{x:22,y:-2,w:4,d:4,r:.6},7,24,{group:'pen',tone:'hi',lit:true,bevel:.2});
  put('pen.cap',{x:22,y:-2,w:4,d:4,r:.6},39,9,{group:'pen',tone:'hi',lit:true,bevel:.2});
  put('pen.shank',{x:23.2,y:-.8,w:1.6,d:1.6,r:.2},3.6,3.4,{group:'pen',tone:'hi',lit:true,bevel:.1});
  put('pen.nib',{x:23.7,y:-.3,w:.6,d:.6,r:.1},.6,3,{group:'pen',tone:'hi',lit:true,bevel:0});
  screws('pen.clamp',[[15,-6],[15,6]],39,'pen');
  put('control.case',{x:-135,y:-59,w:24,d:118,r:3},0,14,{tone:'mid',bevel:.8});
  put('control.cover',{x:-133,y:-57,w:20,d:114,r:2},14,1,{tone:'lo',bevel:.2});
  // Closed slots are recess outlines, not unfinished lines.
  const vents=Array.from({length:6},(_,i)=>k.planOutline({x:-130,y:-44+i*6,w:14,d:2,r:.8},15,P)).join('');
  put('control.plate',{x:-131,y:-48,w:16,d:44,r:1},15,.5,{tone:'lo',bevel:0,inner:L(vents,{tone:'lo'})});
  screws('control.screw',[[-123,-52],[-123,50]],15);

  A.settle(R,P);
  if (runtimeBase) {
    // Verify the same live depth ordering used in the browser, not a newly solved
    // order that could hide an ordering fault in a moving pose.
    const restTip = poseAt(0).tip;
    for (const item of R.items) {
      const original = runtimeBase.find(part => part.name === item.name);
      const dx = original.group === 'base' ? 0 : tx - restTip[0];
      const dy = original.group === 'pen' ? ty - restTip[1] : 0;
      item.key = original.key + (dx * camera.cosA + dy * camera.sinA) * camera.cosE;
    }
  }
  R.items.sort((a,b)=>a.key-b.key);
  if(process.argv.includes('--audit'))A.auditOrExit(R,P);
  count=parts.length;
  return {R,parts: R.items.map(item=>({...parts.find(part=>part.name===item.name),key:item.key}))};
}

const result=build(0);
runtimeBase = result.parts;
const data={width:600,height:390,camera,parts:result.parts,halo:k.haloOf(bed,-19,10,P),partCount:count};
writeFileSync(new URL('../components/modern/drafting/art.json',import.meta.url),JSON.stringify(data));
if(process.argv.includes('--audit')) {
  for(const progress of [.25,.5,.75,1]) {console.log('Travel pose '+progress);build(progress);}
}
console.log('Generated drafting instrument: '+count+' solids.');
