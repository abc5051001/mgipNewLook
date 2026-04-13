import React, { useRef, useEffect, useState } from 'react';
import './ContentBox.css'; // Make sure to create a corresponding CSS file

export const ContentBox = ({ content, onClick }) => {
  const [contentHeight, setContentHeight] = useState('auto');
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > contentRef.current.clientHeight) {
      setContentHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [content]); // This effect should run every time content changes

  return (
    <div className="content-box-container" style={{ height: contentHeight }} onClick={onClick}>
      <div className="content-box" ref={contentRef}>
        {content}
      </div>
    </div>
  );
};
