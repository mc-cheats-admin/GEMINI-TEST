import { useEffect, useRef } from 'react';

export function useMagnetic<T extends HTMLElement>(strength: number = 0.4, radius: number = 100) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (distance < radius) {
        const pullX = distanceX * strength;
        const pullY = distanceY * strength;
        el.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
        el.style.transition = 'transform 0.1s ease-out';
      } else {
        el.style.transform = 'translate3d(0px, 0px, 0)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      }
    };

    const handleMouseLeave = () => {
      el.style.transform = 'translate3d(0px, 0px, 0)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, radius]);

  return ref;
}
