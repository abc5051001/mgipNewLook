import React, { useEffect, useRef } from 'react';
import './DescriptionCard.css';
import { useNavigate } from "react-router-dom";
const DescriptionCard = ({ title, description, gridItems }) => {
  const textRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('slide-in');
            obs.unobserve(entry.target); // Stop observing after animation
          }
        });
      },
      { threshold: 0.5 } // Triggers when 50% of the target is visible
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = '/contact'; 
    navigate(path);
  }

  return (
    <div className="card-container">
      <div ref={textRef} className="text-section">
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={routeChange}>CONTACT US</button>
      </div>
      <div ref={gridRef} className="grid-section">
        {gridItems.map((item, index) => (
          <div key={index} className="grid-item">
            <span className="checkmark">
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                <path d="M19 22h-19v-19h19v2h-1v-1h-17v17h17v-9.502h1v10.502zm5-19.315l-14.966 15.872-5.558-6.557.762-.648 4.833 5.707 14.201-15.059.728.685z"/>
              </svg>
            </span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DescriptionCard;
