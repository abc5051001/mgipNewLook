import React, { useState } from 'react';
import styles from './SixCardColors.module.css';
import { FadeIn } from '../FadeIn';

const SixCardColors = ({ data, colors, languages }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className={styles.sixCardColors}>
        <FadeIn>
        <div className={styles.gridContainer}>
        {data.map((item, index) => (
          <div
            key={index}
            className={styles.gridItem}
            style={{
              backgroundColor: colors[index % colors.length],
            }}
            onMouseEnter={index === data.length - 1 ? handleMouseEnter : null}
            onMouseLeave={index === data.length - 1 ? handleMouseLeave : null}
          >
            {item.icon && (
              <div className={styles.iconWrapper}>
                {React.createElement(item.icon, { size: 50 })}
              </div>
            )}
            {item.title && <h3>{item.title}</h3>}
            {item.description && <p>{item.description}</p>}

            {/* Add tooltip on the last grid item */}
            {index === data.length - 1 && showTooltip && (
              <div className={styles.tooltip}>
                <strong>Languages</strong>
                <ul>
                  {languages.map((language, idx) => (
                    <li key={idx}>{language}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
        </FadeIn>

    </div>
  );
};

export default SixCardColors;
