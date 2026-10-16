import PageHero from './PageHero';
import { Link } from 'react-router-dom';
const clauses=[
  'The information provided on this website is for general informational purposes only and is not intended to be legal advice. Users should consult with a professional attorney before taking any action based on the content provided here.',
  "The use of this website, including any 'Contact' email links, does not establish an attorney-client relationship between Muncy, Geissler, Olds & Lowe, PC and the user.",
  'While we strive to ensure the accuracy of the information on this site, Muncy, Geissler, Olds & Lowe, PC is not responsible for any errors or omissions, nor for any results obtained from the use of this information.',
  'This website may contain links to third-party websites. Muncy, Geissler, Olds & Lowe, PC does not endorse or make any representations regarding the accuracy of information on those third-party sites.',
];
export function Disclaimer(){return <><PageHero eyebrow="Legal" title="Website disclaimer" subtitle="Please read carefully before using this website."/><div className="mg-shell mg-legal mg-section">{clauses.map((text,index)=><section key={text}><span className="mg-eyebrow">0{index+1}</span><p>{text}</p></section>)}<section><span className="mg-eyebrow">05</span><p><Link to="/team/Scott.T">Scott Tulino</Link>{" "}is responsible for ensuring the accuracy of all content on this website.</p></section><p className="mg-legal-question">Have questions? <Link to="/contact">Contact us</Link>.</p></div></>;}
