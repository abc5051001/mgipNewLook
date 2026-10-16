import { Relay, Terrain } from '@lucasmarkes/hairline/react';
import useReducedMotion from './useReducedMotion';
import RightsFigure from './RightsFigure';
import TrademarkFigure from './TrademarkFigure';

const figures = { relay: Relay, terrain: Terrain };
export default function Figure({ type = 'relay', dark = false }) {
  const reduced = useReducedMotion();
  if(type === 'rights') return <RightsFigure/>;
  if(type === 'trademark') return <TrademarkFigure/>;
  const Component = figures[type] || Relay;
  return <div className={`mg-figure ${dark ? 'mg-figure-dark' : ''}`}><Component theme={dark ? 'dark' : 'light'} intensity={reduced ? 0 : .65} play={!reduced} label={type === 'relay' ? 'An interactive network connecting each stage of an idea' : 'An interactive technical landscape. Move your pointer or use the arrow keys.'}/></div>;
}
