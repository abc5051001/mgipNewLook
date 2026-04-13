import React from 'react';
import './StickyBox.css'; // Import the CSS for styling

const StickyBox = ({ title, description }) => {
  return (
    <div className="sticky-box">
      <h2 className="sticky-title">{title}</h2>
      <div className="sticky-description">
        {typeof description === 'string' ? <p>{description}</p> : description}
      </div>
    </div>
  );
};

export default StickyBox;