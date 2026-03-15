import React, { useEffect, useRef, useState } from 'react';
import { state } from '../store';
import { AudioManager } from '../utils/audio';

export const Tesseract = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shardsRef = useRef<HTMLDivElement[]>([]);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const prevHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    audioManagerRef.current = new AudioManager();

    return () => {
      if (audioManagerRef.current) {
        audioManagerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    let rafId: number;
    let time = 0;
    
    const update = () => {
      time += 0.01;
      
      shardsRef.current.forEach((shard, i) => {
        if (!shard) return;
        
        const angle = (i / 20) * Math.PI * 2;
        const radius = isHovered ? 300 : 50 + Math.sin(time + i) * 10;
        
        const x = Math.sin(angle) * radius;
        const y = Math.cos(angle) * radius;
        const z = Math.sin(time * 2 + i) * radius;
        
        const rotX = time * 50 + i * 20;
        const rotY = time * 30 + i * 10;

        shard.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        
        if (isHovered) {
          shard.style.opacity = '0.2';
          shard.style.backgroundColor = 'var(--color-neon-pink)';
        } else {
          shard.style.opacity = '0.8';
          shard.style.backgroundColor = 'var(--color-neon-blue)';
        }
      });

      rafId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(rafId);
  }, [isHovered]);

  useEffect(() => {
    if (isHovered && !prevHoveredRef.current && audioManagerRef.current) {
      audioManagerRef.current.playHoverSound();
    }
    prevHoveredRef.current = isHovered;
  }, [isHovered]);

  return (
    <section className="h-screen flex items-center justify-center relative z-10 overflow-hidden">
      <div 
        ref={containerRef}
        className="relative w-96 h-96 flex items-center justify-center transform-style-3d cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ perspective: '1000px' }}
      >
        <div className={`absolute w-16 h-16 bg-white rounded-full shadow-[0_0_50px_white] transition-all duration-500 ${isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-50'}`}></div>
        
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            ref={el => shardsRef.current[i] = el!}
            className="absolute w-12 h-12 transition-all duration-1000 ease-out"
            style={{ 
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              backdropFilter: 'blur(5px)'
            }}
          ></div>
        ))}
        
        <div className={`absolute text-2xl font-display font-bold text-white transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          СИНГУЛЯРНОСТЬ ДОСТИГНУТА
        </div>
      </div>
    </section>
  );
};