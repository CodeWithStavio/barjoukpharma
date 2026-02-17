'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function TextReveal({ text, className = '', delay = 0, stagger = 0.05 }: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <div ref={ref} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              className="inline-block"
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={isVisible ? { 
                opacity: 1, 
                y: 0, 
                rotateX: 0 
              } : {}}
              transition={{
                duration: 0.5,
                delay: delay + (wordIndex * words.length + charIndex) * stagger,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {char}
            </motion.span>
          ))}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </div>
  );
}

// Word-by-word reveal variant
export function WordReveal({ text, className = '', delay = 0, stagger = 0.1 }: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <div ref={ref} className={`${className} flex flex-wrap`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={isVisible ? { 
            opacity: 1, 
            y: 0,
            filter: 'blur(0px)'
          } : {}}
          transition={{
            duration: 0.5,
            delay: delay + index * stagger,
            ease: 'easeOut',
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}