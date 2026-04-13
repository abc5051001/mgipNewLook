import React, { useState, useEffect } from 'react';

const RotatingText = () => {
  const disciplines = ['Engineering', 'Law', 'Technology', 'Science']; // add actual disciplines here
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(75); // Typing speed

  useEffect(() => {
    const handleTyping = () => {
      const currentDiscipline = disciplines[loopIndex % disciplines.length];

      if (isDeleting) {
        setCurrentText((prev) => prev.substring(0, 0));
        setTypingSpeed(75); // Faster when deleting
      } else {
        // Add characters
        setCurrentText((prev) => currentDiscipline.substring(0, prev.length + 1));
        setTypingSpeed(150); // Normal typing speed
      }

      if (!isDeleting && currentText === currentDiscipline) {
        setTimeout(() => setIsDeleting(true), 1000);
      }

      if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setLoopIndex(loopIndex + 1);
      }
    };

    const typingTimer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(typingTimer);
  }, [currentText, isDeleting, loopIndex, typingSpeed]);

  return (
    <span className="typing-text">
      {currentText}
      <span className="cursor">|</span>
    </span>
  );
};

export default RotatingText;
