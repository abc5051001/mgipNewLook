import { useRef } from "react";
import Hero from "../Hero/Hero";
import InfoSection from "../InfoSection/InfoSection";

export const About = () => {
  const infoSectionRef = useRef(null);

  const scrollToInfoSection = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="overflow-hidden">
      <Hero onLearnMoreClick={scrollToInfoSection} />
      <div ref={infoSectionRef}>
        <InfoSection />
      </div>
    </div>
  );
};

export default About;
