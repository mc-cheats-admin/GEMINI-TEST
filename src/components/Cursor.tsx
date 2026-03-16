import React, { useEffect, useRef } from 'react';
import { state } from '../store';
import { engine } from '../engine/Engine';

export const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const module = {
      update: () => {
        if (cursorRef.current) {
          const scale = state.mouse.isHovering ? 3 : 1;
          cursorRef.current.style.transform = `translate(${state.mouse.x}px, ${state.mouse.y}px) translate(-50%, -50%) scale(${scale})`;
          
          if (state.mouse.isHovering) {
            cursorRef.current.style.mixBlendMode = 'difference';
            cursorRef.current.style.backgroundColor = '#fff';
          } else {
            cursorRef.current.style.mixBlendMode = 'normal';
            cursorRef.current.style.backgroundColor = 'var(--color-neon-blue)';
          }
        }
      }
    };
    engine.register(module);
    return () => engine.unregister(module);
  }, []);

  return (
    <div className="cursor-container">
      <div ref={cursorRef} className="cursor-dot transition-all duration-300 ease-out"></div>
    </div>
  );
};
