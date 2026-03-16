import React, { useEffect, useRef } from 'react';
import { state } from '../store';
import { engine } from '../engine/Engine';

export const FloatingElements = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let time = 0;
    const module = {
      update: (dt: number) => {
        time += dt * 0.005;
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
      }
    };
    engine.register(module);
    return () => engine.unregister(module);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" style={{ perspective: '1000px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i}
          ref={el => elementsRef.current[i] = el!}
          className={`absolute will-change-transform ${i % 2 === 0 ? 'bg-white/5 border border-white/10' : 'bg-[var(--color-neon-blue)]/5 border border-[var(--color-neon-blue)]/20 shadow-[0_0_15px_rgba(0,243,255,0.1)]'}`}
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
