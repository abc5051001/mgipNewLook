import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import PageHero from './PageHero';
export default function NotFound(){return <><PageHero eyebrow="404 / Page not found" title={<>A different direction.<br/><span>Let’s find your next step.</span></>} subtitle="This page is unavailable. Explore the firm or get in touch with our team."/><div className="mg-shell mg-section mg-actions"><Link to="/" className="mg-button mg-button-dark"><ArrowLeft size={17}/>Back to the firm</Link><Link to="/contact" className="mg-text-link">Contact MG-IP<ArrowUpRight size={17}/></Link></div></>;}
