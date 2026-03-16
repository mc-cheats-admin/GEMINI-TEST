import React, { useEffect, useRef } from 'react';
import { state } from '../store';
import { engine } from '../engine/Engine';

const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

export const SpiralTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let initialTop = 0;

    const updateRect = () => {
      if (!containerRef.current) return;
      let el: HTMLElement | null = containerRef.current;
      let top = 0;
      while (el && el.id !== 'scroll-container') {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement;
      }
      initialTop = top;
    };

    setTimeout(updateRect, 100);
    window.addEventListener('resize', updateRect);

    const module = {
      update: () => {
        if (!containerRef.current) return;
        
        const currentY = initialTop - state.scroll.y;
        const progress = -currentY / window.innerHeight;

        itemsRef.current.forEach((item, i) => {
          if (!item) return;
          
          const t = i - progress * 2;
          
          const radius = 300 + t * 50;
          const angle = t * Math.PI;
          
          const x = Math.sin(angle) * radius;
          const y = t * 200;
          const z = Math.cos(angle) * radius - t * 500;

          item.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
          
          const opacity = z > 200 ? 0 : z < -2000 ? 0 : 1 - Math.abs(t) * 0.2;
          item.style.opacity = `${Math.max(0, opacity)}`;
          
          if (Math.abs(t) < 0.5) {
            item.style.color = 'var(--color-neon-blue)';
            item.style.textShadow = '0 0 20px var(--color-neon-blue)';
          } else {
            item.style.color = 'rgba(255,255,255,0.5)';
            item.style.textShadow = 'none';
          }
        });
      }
    };
    engine.register(module);
    
    return () => {
      engine.unregister(module);
      window.removeEventListener('resize', updateRect);
    };
  }, []);

  return (
    <section className="h-[250vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center transform-style-3d">
          {years.map((year, i) => (
            <div 
              key={i}
              ref={el => itemsRef.current[i] = el!}
              className="absolute text-6xl md:text-9xl font-display font-black will-change-transform transition-colors duration-300"
            >
              {year}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
