import React, { useEffect, useRef } from 'react';
import { scrollEngine } from '../engine/ScrollEngine';
import { engine } from '../engine/Engine';

export const VelocityMarquee = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const direction = useRef(1);

  useEffect(() => {
    const module = {
      update: (dt: number) => {
        if (!containerRef.current) return;
        
        const vel = scrollEngine.velocity;
        if (Math.abs(vel) > 0.1) {
          direction.current = Math.sign(vel);
        }
        
        const speed = 1 + Math.abs(vel) * 0.5;
        position.current += speed * direction.current * (dt * 0.05);
        
        // Wrap around
        if (position.current > 100) position.current -= 100;
        if (position.current < 0) position.current += 100;

        containerRef.current.style.transform = `translate3d(-${position.current}%, 0, 0)`;
      }
    };
    engine.register(module);
    return () => engine.unregister(module);
  }, []);

  return (
    <div className="w-full overflow-hidden py-12 bg-black/30 backdrop-blur-md border-y border-white/5">
      <div ref={containerRef} className="flex whitespace-nowrap will-change-transform" style={{ width: '200%' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-[6vw] font-display font-bold uppercase px-8 text-white/40 tracking-widest w-1/2 flex-shrink-0">
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};
