import React, { useEffect, useRef } from 'react';
import { state } from '../store';
import { engine } from '../engine/Engine';

const tech = ['React', 'WebGL', 'Canvas', 'Node.js', 'WebGPU', 'Rust', 'WASM', 'GLSL'];

export const Cylinder = () => {
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

        const radius = 400;
        const total = tech.length;
        
        itemsRef.current.forEach((item, i) => {
          if (!item) return;
          const angle = (i / total) * Math.PI * 2 + progress * 2;
          
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;
          
          const rotateY = (angle * 180) / Math.PI;

          item.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${rotateY}deg)`;
          
          const normalizedZ = (z + radius) / (radius * 2);
          const blur = (1 - normalizedZ) * 10;
          item.style.filter = `blur(${blur}px)`;
          item.style.opacity = `${0.2 + normalizedZ * 0.8}`;
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
    <section className="h-[200vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-black/50" style={{ perspective: '1200px' }}>
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center transform-style-3d">
          {tech.map((t, i) => (
            <div 
              key={i}
              ref={el => itemsRef.current[i] = el!}
              className="absolute w-64 h-32 bg-white/5 flex items-center justify-center text-3xl font-display font-bold text-white/90 rounded-xl border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)] will-change-transform"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
