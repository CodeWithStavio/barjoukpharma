'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export function ImageReveal({ 
  src, 
  alt, 
  className = '', 
  direction = 'up',
  delay = 0 
}: ImageRevealProps) {
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

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 100 };
      case 'down': return { y: -100 };
      case 'left': return { x: 100 };
      case 'right': return { x: -100 };
      default: return { y: 100 };
    }
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-emerald-500 dark:bg-emerald-400 z-10"
        initial={{ scaleX: 1 }}
        animate={isVisible ? { scaleX: 0 } : {}}
        transition={{ duration: 0.8, delay: delay, ease: [0.25, 0.1, 0.25, 1.0] }}
        style={{ transformOrigin: direction === 'left' ? 'left' : 'right' }}
      />
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ 
          ...getInitialPosition(),
          scale: 1.2,
          filter: 'blur(10px)'
        }}
        animate={isVisible ? { 
          x: 0,
          y: 0,
          scale: 1,
          filter: 'blur(0px)'
        } : {}}
        transition={{ 
          duration: 1,
          delay: delay + 0.2,
          ease: [0.25, 0.1, 0.25, 1.0]
        }}
      />
    </div>
  );
}