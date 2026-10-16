import { ArrowUpRight, MapPin, Mail, Phone } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa';
import ContactHero from './ContactHero';
import ContactForm from '../Contact/ContactForm';
import copy from '../../content/firm-copy.json';
const icons=[MapPin,Phone,Mail,FaLinkedinIn];
const mapSource='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12437.201206246542!2d-77.0503829!3d38.8026719!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b64f449e66070f%3A0x112d2d84c8d832f5!2sMuncy%2C%20Geissler%2C%20Olds%20%26%20Lowe%2C%20P.C.!5e0!3m2!1sen!2sus!4v1730179648591!5m2!1sen!2sus';

export default function Contact() {
  return <>
    <ContactHero/>
    <section className="mg-shell mg-contact-layout mg-section"><div className="mg-contact-info" id="contact-office"><h2>Our Office</h2>
      {copy.contact.details.map((detail,index)=>{const Icon=icons[index];return <div className="mg-contact-detail" key={detail.label}><Icon size={20}/><div><span>{detail.label}</span><a href={detail.href} target={detail.external?'_blank':undefined} rel={detail.external?'noopener noreferrer':undefined}>{detail.lines.map(line=><span className="mg-contact-line" key={line}>{line}</span>)}{detail.external&&<ArrowUpRight size={16}/>}</a></div></div>;})}
      <iframe className="mg-office-map" title="Office Location" src={mapSource} width="100%" height="270" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
    </div><div className="mg-contact-form" id="contact-form"><h2>Send a Message</h2><p className="mg-contact-caution">{copy.contact.formDescription}</p><ContactForm/></div></section>
  </>;
}
