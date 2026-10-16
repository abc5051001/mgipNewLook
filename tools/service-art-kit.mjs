import * as k from './anatomy/iso-kit.mjs';
import * as A from './anatomy/audit.mjs';
import * as G from './anatomy/lathe.mjs';

export { k, A, G };
export function createMachine({ bounds, z0, z1, moves, initial = {}, azimuth = 48, elevation = 35 }) {
  const P = k.fitProjection(k.boxCorners(bounds, z0, z1), 600, 390, { pad:45, azimuth, elevation });
  const R = A.recorder(P);
  const camera = { ...k.cameraOf(P), origin:P.origin };
  const groups = new Map();
  const at = (point, group) => point.map((value,index) => value + (initial[group]?.[index] || 0));
  function put(name, plan, z, height, { group='base', tone='mid', lit=false, inner, detail, bevel=.5, steps=5 } = {}) {
    const [x,y,zz] = at([plan.x,plan.y,z],group);
    const actual = { ...plan, x,y };
    const shape = R.solid(A.slab(actual,zz,height,{name,owner:name,ground:name.startsWith('foot.')},steps));
    const paths = k.slabOf(actual,zz,height,P,steps,bevel);
    const svg = k.solidSvg(paths,{tone,lit,inner:(inner || '') + (detail ? detail(actual,zz+height) : '')});
    R.put({name,piece:group,move:moves[group] || [0,0,0],at:[x+plan.w/2,y+plan.d/2,zz+height/2],svg,shapes:[shape]});
    groups.set(name,group);
  }
  function round(name, origin, axis, length, radius, {group='base',tone='mid',lit=false,detail}={}) {
    const actual = at(origin,group), F = G.frameAlong(actual,axis), profile = [[0,radius],[length,radius]];
    const paths = G.solidOf(profile,F,P,{bevel:.3,steps:36});
    const shape = R.solid(A.solid(F,profile,{name,owner:name}));
    R.put({name,piece:group,move:moves[group] || [0,0,0],at:actual.map((value,index)=>value+axis[index]*length/2),svg:k.solidSvg(paths,{tone,lit,inner:detail?detail(F):''}),shapes:[shape]});
    groups.set(name,group);
  }
  function screws(name, points, z, group='base') {
    points.forEach(([x,y],index)=>put(`${name}.${index}`,{x:x-1.2,y:y-1.2,w:2.4,d:2.4,r:.6},z,.7,{group,tone:'lo',bevel:.15,detail:(plan,top)=>k.lineSvg(k.lineOnTop([plan.x+.5,plan.y+1.2],[plan.x+1.9,plan.y+1.2],top,P),{tone:'mid',free:true})}));
  }
  function feet(plan) {
    k.corners(plan,18).forEach(([x,y],index)=>{
      put(`foot.pad.${index}`,{x:x-8,y:y-8,w:16,d:16,r:3},-19,3,{tone:'lo'});
      put(`foot.block.${index}`,{x:x-7,y:y-7,w:14,d:14,r:2},-16,4,{tone:'lo'});
    });
  }
  function finish({ halo, output, label }) {
    // The solver and browser share the same one-axis movements. Audit intermediate
    // stroke positions as well as both endpoints, using the solved live order.
    A.settle(R,P,{states:[0,.5,1]});
    R.items.sort((a,b)=>a.key-b.key);
    if(process.argv.includes('--audit'))A.auditOrExit(R,P,{frames:[0,.25,.5,.75,1],apart:true});
    return { output,data:{width:600,height:390,camera,label,partCount:R.items.length,halo:k.haloOf(halo,-19,10,P),parts:R.items.map(item=>({name:item.name,group:groups.get(item.name),key:item.key,svg:item.svg}))},recorder:R };
  }
  return {P,R,camera,put,round,screws,feet,finish,at};
}
