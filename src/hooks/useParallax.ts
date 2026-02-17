'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

interface ParallaxOptions {
  speed?: number;
  offset?: number;
  minWidth?: number;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {}
): [RefObject<T | null>, number] {
  const { speed = 0.5, offset = 0, minWidth = 768 } = options;
  const ref = useRef<T>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current || window.innerWidth < minWidth) return;

      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calculate if element is in viewport
      const elementBottom = elementTop + elementHeight;
      const viewportTop = scrollY;
      const viewportBottom = scrollY + windowHeight;

      if (elementBottom > viewportTop && elementTop < viewportBottom) {
        // Element is in viewport
        const scrollProgress = (scrollY - elementTop + windowHeight) / (windowHeight + elementHeight);
        const parallaxValue = -(scrollProgress * 100 * speed) + offset;
        
        setParallaxOffset(parallaxValue);
      }
    };

    // Initial calculation
    handleScroll();

    // Throttled scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [speed, offset, minWidth]);

  return [ref, parallaxOffset];
}

// Hook for mouse parallax effect
export function useMouseParallax<T extends HTMLElement = HTMLDivElement>(
  strength: number = 0.05
): [RefObject<T | null>, { x: number; y: number }] {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const element = ref.current;
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setOffset({ x: deltaX, y: deltaY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength]);

  return [ref, offset];
}

// Hook for layered parallax sections
export function useLayeredParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  const getLayerStyle = (layerIndex: number) => {
    const speed = (layerIndex + 1) * 0.2;
    return {
      transform: `translateY(${scrollY * speed}px)`,
      willChange: 'transform',
    };
  };

  return { scrollY, getLayerStyle };
}