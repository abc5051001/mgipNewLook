import React, { useEffect, useRef } from 'react';
import styles from './ButtonCard.module.css';

const ButtonCard = ({ backgroundColor, title, content, buttonText, borderRadius, textColor, url, center }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles['fade-in']);
          observer.disconnect(); // Stop observing once the animation is triggered
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={styles.buttonCard}
      style={{ backgroundColor, borderRadius, color: textColor }}
    >
      <h1 className={styles.buttonTitle} style={{ color: textColor, textAlign: center ? 'center' : 'left' }}>
        {title}
      </h1>
      {Array.isArray(content) ? (
        content.map((text, index) => (
          <p key={index} className={styles.description} style={{ color: textColor, marginBottom: '1em' }}>
            {text}
          </p>
        ))
      ) : (
        <p className={styles.description} style={{ color: textColor }}>
          {content}
        </p>
      )}
      {buttonText && (
        <button
          className={styles.cardButton}
          onClick={() => (window.location.href = url)}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default ButtonCard;
