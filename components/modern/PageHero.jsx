import Reveal from './Reveal';
import HeroLinework from './HeroLinework';

export default function PageHero({ eyebrow, title, subtitle, art }) {
  return <section className={`mg-page-hero mg-inner-hero ${art ? 'mg-page-hero-art' : ''}`}>{art && <HeroLinework variant="terrain"/>}<div className="mg-shell mg-page-hero-grid mg-inner-hero-grid">
    <Reveal className="mg-page-copy mg-inner-hero-copy"><div className="mg-page-index"><span className="mg-eyebrow">{eyebrow}</span></div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</Reveal>
    {art && <div className="mg-page-art">{art}</div>}
  </div></section>;
}
