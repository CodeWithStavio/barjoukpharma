'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursorType = () => {
      const target = document.elementFromPoint(mousePosition.x, mousePosition.y);
      if (target) {
        const computedStyle = window.getComputedStyle(target);
        const cursor = computedStyle.cursor;
        setIsPointer(
          cursor === 'pointer' || 
          target.tagName === 'BUTTON' || 
          target.tagName === 'A' ||
          target.closest('button') !== null ||
          target.closest('a') !== null
        );
      }
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousemove', updateCursorType);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousemove', updateCursorType);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mousePosition.x, mousePosition.y]);

  if (typeof window === 'undefined') return null;

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
      <AnimatePresence>
        {!isHidden && (
          <>
            {/* Main cursor dot */}
            <motion.div
              className="fixed pointer-events-none z-[100] mix-blend-difference"
              animate={{
                x: mousePosition.x - 4,
                y: mousePosition.y - 4,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                mass: 0.5,
              }}
            >
              <div 
                className={`w-2 h-2 bg-white rounded-full transition-transform duration-200 ${
                  isPointer ? 'scale-150' : 'scale-100'
                }`}
              />
            </motion.div>

            {/* Cursor ring */}
            <motion.div
              className="fixed pointer-events-none z-[99]"
              animate={{
                x: mousePosition.x - 20,
                y: mousePosition.y - 20,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 0.8,
              }}
            >
              <div 
                className={`w-10 h-10 border-2 border-emerald-500/50 dark:border-emerald-400/50 rounded-full transition-all duration-300 ${
                  isPointer ? 'scale-150 border-emerald-500 dark:border-emerald-400' : 'scale-100'
                }`}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}