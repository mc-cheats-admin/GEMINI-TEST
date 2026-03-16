import React, { useEffect, useRef } from 'react';
import { scrollEngine } from '../engine/ScrollEngine';
import { engine } from '../engine/Engine';

export const ScrollProgressBar = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const module = {
      update: () => {
        if (scrollEngine.limit > 0 && barRef.current) {
          const progress = (scrollEngine.y / scrollEngine.limit) * 100;
          barRef.current.style.width = `${progress}%`;
        }
      }
    };
    engine.register(module);
    return () => engine.unregister(module);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-ui pointer-events-none">
      <div 
        ref={barRef}
        className="h-full bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-purple)] shadow-[0_0_10px_rgba(0,243,255,0.5)]"
        style={{ width: '0%' }}
      />
    </div>
  );
};
