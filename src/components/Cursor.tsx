import React, { useEffect, useRef } from 'react';
import { state } from '../store';
import { AudioManager } from '../utils/audio';

export const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const prevHoveringRef = useRef<boolean>(false);

  useEffect(() => {
    audioManagerRef.current = new AudioManager();

    let rafId: number;
    const update = () => {
      if (cursorRef.current) {
        const scale = state.mouse.isHovering ? 3 : 1;
        cursorRef.current.style.transform = `translate(${state.mouse.x}px, ${state.mouse.y}px) translate(-50%, -50%) scale(${scale})`;
        
        if (state.mouse.isHovering) {
          cursorRef.current.style.mixBlendMode = 'difference';
          cursorRef.current.style.backgroundColor = '#fff';
          
          if (!prevHoveringRef.current && audioManagerRef.current) {
            audioManagerRef.current.playHoverSound();
          }
        } else {
          cursorRef.current.style.mixBlendMode = 'normal';
          cursorRef.current.style.backgroundColor = 'var(--color-neon-blue)';
        }
        
        prevHoveringRef.current = state.mouse.isHovering;
      }
      rafId = requestAnimationFrame(update);
    };
    update();

    return () => {
      cancelAnimationFrame(rafId);
      if (audioManagerRef.current) {
        audioManagerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="cursor-container">
      <div ref={cursorRef} className="cursor-dot transition-all duration-300 ease-out"></div>
    </div>
  );
};