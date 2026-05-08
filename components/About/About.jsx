import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../Hero/Hero";
import InfoSection from "../InfoSection/InfoSection";

export const About = () => {
  const infoSectionRef = useRef(null);

  const scrollToInfoSection = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>Muncy, Geissler, Olds & Lowe, P.C. | IP Law Firm</title>
        <meta name="description" content="Muncy, Geissler, Olds & Lowe, P.C. is a full-service intellectual property law firm in Alexandria, VA specializing in Patent, Trademark, and Copyright law." />
        <meta property="og:title" content="Muncy, Geissler, Olds & Lowe, P.C. | IP Law Firm" />
        <meta property="og:description" content="A full-service intellectual property law firm in Alexandria, VA specializing in Patent, Trademark, and Copyright law." />
        <link rel="canonical" href="https://mg-ip.com/" />
      </Helmet>
      <Hero onLearnMoreClick={scrollToInfoSection} />
      <div ref={infoSectionRef}>
        <InfoSection />
      </div>
    </div>
  );
};

export default About;
