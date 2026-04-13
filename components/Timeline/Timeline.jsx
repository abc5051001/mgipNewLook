import React, { useState, useEffect, useRef } from 'react';
import './Timeline.css';

const Timeline = ({ data }) => {
  const [displayedItems, setDisplayedItems] = useState([]);
  const isCancelledRef = useRef(false);
  const isProcessingRef = useRef(false);

  // Sort data from lowest date to highest date
  const sortedData = [...data].sort((a, b) => parseInt(a.year) - parseInt(b.year));

  useEffect(() => {
    isCancelledRef.current = false;

    const processYears = async () => {
      if (isProcessingRef.current) return; // Prevent overlapping executions
      isProcessingRef.current = true;

      for (let yearIndex = 0; yearIndex < sortedData.length; yearIndex++) {
        if (isCancelledRef.current) {
          isProcessingRef.current = false;
          return;
        }

        const currentYearData = sortedData[yearIndex];
        const events = currentYearData.events;

        // Initialize displayed items with invisible items
        const items = events.map((event) => ({
          year: currentYearData.year,
          event,
          visible: false,
        }));

        setDisplayedItems(items);

        // Add items one by one
        for (let i = 0; i < items.length; i++) {
          if (isCancelledRef.current) {
            isProcessingRef.current = false;
            return;
          }

          // Make the item visible
          setDisplayedItems((prevItems) =>
            prevItems.map((item, index) =>
              index === i ? { ...item, visible: true } : item
            )
          );

          // Wait 200ms before showing the next item
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        // Wait for the display duration per item (1 second)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Remove items one by one (by hiding them)
        for (let i = 0; i < items.length; i++) {
          if (isCancelledRef.current) {
            isProcessingRef.current = false;
            return;
          }

          // Hide the item
          setDisplayedItems((prevItems) =>
            prevItems.map((item, index) =>
              index === i ? { ...item, visible: false } : item
            )
          );

          // Wait 1000ms before hiding the next item
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        // Wait before moving to the next year
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      isProcessingRef.current = false; // Allow processing to start again if needed

      // Restart the timeline by calling processYears again
      if (!isCancelledRef.current) {
        processYears();
      }
    };

    processYears();

    return () => {
      // Cleanup if the component unmounts
      isCancelledRef.current = true;
    };
  }, [sortedData]);

  return (
    <div className="timeline-container">
      <div className="timeline">
        {displayedItems.map((item, index) => (
          <div
            key={index}
            className={`timeline-item ${item.visible ? 'visible' : ''}`}
          >
            <span className="year">{item.year}: {item.event}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
