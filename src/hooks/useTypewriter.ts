import { useState, useEffect } from 'react';

interface TypewriterOptions {
  speed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  loop?: boolean;
  startDelay?: number;
}

export const useTypewriter = (
  words: string[],
  options: TypewriterOptions = {}
) => {
  const {
    speed = 100,
    deleteSpeed = 50,
    delayBetweenWords = 2000,
    loop = true,
    startDelay = 0
  } = options;

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const timeout = setTimeout(() => {
      setIsTyping(true);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [startDelay, words.length]);

  useEffect(() => {
    if (!isTyping || words.length === 0) return;

    const currentWord = words[currentWordIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          // Finished typing current word
          if (loop || currentWordIndex < words.length - 1) {
            setTimeout(() => setIsDeleting(true), delayBetweenWords);
          }
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting
          setIsDeleting(false);
          if (loop) {
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          } else if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex((prev) => prev + 1);
          }
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timer);
  }, [
    currentText,
    currentWordIndex,
    isDeleting,
    isTyping,
    words,
    speed,
    deleteSpeed,
    delayBetweenWords,
    loop
  ]);

  return {
    text: currentText,
    isTyping: isTyping && currentText.length < words[currentWordIndex]?.length,
    isDeleting,
    currentWordIndex
  };
};

export default useTypewriter;