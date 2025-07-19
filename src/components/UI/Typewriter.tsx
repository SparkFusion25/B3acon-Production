import React from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';

interface TypewriterProps {
  words: string[];
  speed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  loop?: boolean;
  startDelay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  cursorChar?: string;
  showCursor?: boolean;
  cursorClassName?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  words,
  speed = 100,
  deleteSpeed = 50,
  delayBetweenWords = 2000,
  loop = true,
  startDelay = 0,
  className = '',
  prefix = '',
  suffix = '',
  cursorChar = '|',
  showCursor = true,
  cursorClassName = 'animate-pulse text-current'
}) => {
  const { text, isTyping } = useTypewriter(words, {
    speed,
    deleteSpeed,
    delayBetweenWords,
    loop,
    startDelay
  });

  return (
    <span className={className}>
      {prefix}
      <span className="typewriter-text">
        {text}
      </span>
      {showCursor && (
        <span className={`typewriter-cursor ${cursorClassName}`}>
          {cursorChar}
        </span>
      )}
      {suffix}
    </span>
  );
};

export default Typewriter;