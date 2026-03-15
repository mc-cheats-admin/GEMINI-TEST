import React, { useEffect, useRef } from 'react';
import { state } from '../store';

export const FloatingElements = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let rafId: number;
    let time = 0;
    const update = () => {
      time += 0.005;
      elementsRef.current.forEach((el, i) => {
        if (!el) return;
        const offset = i * 100;
        const speed = (i % 3 + 1) * 0.5;
        
        const y = Math.sin(time * speed + offset) * 100 - state.scroll.y * (speed * 0.2);
        const x = Math.cos(time * speed * 0.8 + offset) * 100;
        const rotX = time * 20 * speed + offset;
        const rotY = time * 30 * speed + offset;

        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
      rafId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" style={{ perspective: '1000px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i}
          ref={el => elementsRef.current[i] = el!}
          className={`absolute will-change-transform ${i % 2 === 0 ? 'glass-panel' : 'bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]'}`}
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            borderRadius: i % 3 === 0 ? '50%' : '10px',
            opacity: 0.3
          }}
        ></div>
      ))}
    </div>
  );
};
