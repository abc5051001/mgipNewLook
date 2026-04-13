import React, { useEffect, useRef } from 'react';
import './Awards.css';
import DescriptionCard from '../DescriptionCard/DescriptionCard';

const AwardCard = React.forwardRef(({ number, description }, ref) => (
  <div className="award-card hidden" ref={ref}>
    <div className="award-number">{number}</div>
    <div className="award-description">{description}</div>
  </div>
));

const Awards = () => {

  const info = {
    title: 'Client Counseling for IP law',
    description: 'We provide legal services to large domestic and foreign corporations and to a wide range of mid-sized and start-up organizations. Our technical, business, and legal experience allows us to assist our clients in obtaining protection for their intellectual property in an efficient and cost-effective manner.',
  };

  const wrapperRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const wrapperObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log('awards-Wrapper is visible');
            cardRefs.current.forEach(card => {
              if (card) {
                console.log('Adding slide-in class to', card);
                card.classList.remove('hidden');
                card.classList.add('slide-in');
              }
            });
            obs.unobserve(entry.target); // Stop observing after the wrapper is visible
          } else {
            console.log('awards-Wrapper is not visible');
          }
        });
      },
      { threshold: 0.5 } // Triggers when 50% of the wrapper is visible
    );

    console.log('Observing wrapper:', wrapperRef.current);
    wrapperObserver.observe(wrapperRef.current);

    return () => {
      console.log('Disconnecting observer');
      wrapperObserver.disconnect();
    };
  }, []);


  return (
    <div className="awards-container">
      <div className="background-image"></div>
      <DescriptionCard
        title={info.title}
        description={info.description}
        gridItems={[
          'We counsel U.S. and international clients.',
          'We counsel clients on all Patent, Trademark.',
          'We protect clients for their intellectual property',
          'We provide service in multiple languages',
          'Attorneys with science and technical background',
          'Located in the DC metro area, 8 minutes from USPTO',
        ]}
      />
      <div className="awards-Wrapper" ref={wrapperRef}>
        <div className="awards-grid">
        </div>
      </div>
    </div>
  );
};

export default Awards;
