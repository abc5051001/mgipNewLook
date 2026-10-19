import { Component, Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import PropTypes from 'prop-types';
import { useInView } from 'motion/react';
import useReducedMotion from './useReducedMotion';
import * as THREE from 'three';
function BlueprintFallback() {
  return <svg viewBox="0 0 600 500" className="mg-blueprint-fallback" fill="none" aria-hidden="true">{[0, 1, 2].map(i => <g key={i} transform={`translate(0 ${i * 80})`}><path d="M110 150 300 55 490 150 300 245Z"/><path d="M110 150v14l190 95 190-95v-14M300 245v14"/></g>)}<path d="M300 55v350M110 150v175M490 150v175" strokeDasharray="4 7"/><circle cx="300" cy="245" r="9"/></svg>;
}
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <BlueprintFallback/> : this.props.children; }
}
function Structure({ reduced }) {
  const root = useRef();
  const signal = useRef();
  const box = useMemo(() => new THREE.BoxGeometry(3.3, .065, 2.4), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(box), [box]);
  useEffect(() => () => { box.dispose(); edges.dispose(); }, [box, edges]);
  useFrame(({ pointer, clock }, delta) => {
    if (reduced || !root.current) return;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -.55 + pointer.x * .22, 3, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, .35 - pointer.y * .1, 3, delta);
    root.current.position.y = Math.sin(clock.elapsedTime * .45) * .04;
    if (signal.current) signal.current.position.y = ((clock.elapsedTime * .32) % 2.2) - 1.1;
  });
  return <group ref={root} rotation={[.35, -.55, 0]}>{[-1.1, 0, 1.1].map((height, index) => <group key={height} position={[0, height, 0]}><mesh geometry={box}><meshBasicMaterial color="#5c8391" transparent opacity={.035 + index * .025}/></mesh><lineSegments geometry={edges}><lineBasicMaterial color={index === 1 ? '#447f92' : '#70858d'} transparent opacity={.75}/></lineSegments>{[-1, 1].flatMap(x => [-1, 1].map(z => <mesh key={`${x}-${z}`} position={[x * 1.35, .055, z * .9]}><boxGeometry args={[.17, .025, .17]}/><meshBasicMaterial color="#6c959b"/></mesh>))}<mesh><boxGeometry args={[.65, .11, .65]}/><meshBasicMaterial color="#547e89" wireframe/></mesh></group>)}{[-1, 1].flatMap(x => [-1, 1].map(z => <mesh key={`${x}-${z}`} position={[x * 1.35, 0, z * .9]}><cylinderGeometry args={[.007, .007, 2.2, 6]}/><meshBasicMaterial color="#9eafb2" transparent opacity={.5}/></mesh>))}<mesh ref={signal}><sphereGeometry args={[.055, 12, 12]}/><meshBasicMaterial color="#3d8fa1"/></mesh></group>;
}
function CareerStructure({ reduced }) {
  const root = useRef();
  const signal = useRef();
  const box = useMemo(() => new THREE.BoxGeometry(1.25, .22, 1.25), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(box), [box]);
  const path = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.4, -.55, .72), new THREE.Vector3(-.7, -.55, .72),
    new THREE.Vector3(-.65, .1, .72), new THREE.Vector3(.65, .1, .72),
    new THREE.Vector3(.7, .75, .72), new THREE.Vector3(1.4, .75, .72),
  ]), []);
  const line = useMemo(() => new THREE.BufferGeometry().setFromPoints(path.getPoints(80)), [path]);
  useEffect(() => () => { box.dispose(); edges.dispose(); line.dispose(); }, [box,edges,line]);
  useFrame(({ pointer, clock }, delta) => {
    if(reduced || !root.current)return;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -.4 + pointer.x * .2, 3, delta);
    if(signal.current)signal.current.position.copy(path.getPoint((clock.elapsedTime * .12) % 1));
  });
  return <group ref={root} rotation={[.18,-.4,0]} scale={1.3}>
    {[-1,0,1].map(step=><group key={step} position={[step*1.4,step*.65,0]}>
      <mesh geometry={box}><meshBasicMaterial color="#91aabd" transparent opacity={.12}/></mesh>
      <lineSegments geometry={edges}><lineBasicMaterial color="#628197"/></lineSegments>
      <mesh position={[0,.62,0]}><sphereGeometry args={[.15,16,12]}/><meshBasicMaterial color="#54758c" transparent opacity={.7}/></mesh>
      <mesh position={[0,.3,0]}><cylinderGeometry args={[.17,.24,.34,8,1,true]}/><meshBasicMaterial color="#54758c" wireframe transparent opacity={.45}/></mesh>
    </group>)}
    <line geometry={line}><lineBasicMaterial color="#7a96aa" transparent opacity={.65}/></line>
    <mesh ref={signal}><sphereGeometry args={[.047,12,12]}/><meshBasicMaterial color="#356e99"/></mesh>
  </group>;
}

export default function BlueprintScene({ career = false }) {
  const host = useRef(null);
  const active = useInView(host, { margin: '80px' });
  const reduced = useReducedMotion();
  return <div ref={host} className="mg-blueprint" aria-hidden="true"><SceneBoundary><Suspense fallback={<BlueprintFallback/>}><Canvas camera={{ position: career?[4.2,2.8,6]:[4.8,3.4,6.5], fov: career?35:38 }} dpr={[1, 1.5]} frameloop={active && !reduced ? 'always' : 'demand'} gl={{ antialias: true, alpha: true }} fallback={<BlueprintFallback/>}>{career?<CareerStructure reduced={reduced}/>:<Structure reduced={reduced}/>}</Canvas></Suspense></SceneBoundary></div>;
}

SceneBoundary.propTypes = { children: PropTypes.node };
Structure.propTypes = { reduced: PropTypes.bool.isRequired };
CareerStructure.propTypes = { reduced: PropTypes.bool.isRequired };
BlueprintScene.propTypes = { career: PropTypes.bool };
