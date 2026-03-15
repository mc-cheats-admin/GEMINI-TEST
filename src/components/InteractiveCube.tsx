import React, { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const InteractiveCube = () => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.5 });
  const [rotation, setRotation] = useState({ x: -20, y: -30 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cubeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    
    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, startPos]);

  // Auto rotation when not dragging
  useEffect(() => {
    if (isDragging) return;
    let animationFrameId: number;
    const animate = () => {
      setRotation(prev => ({ x: prev.x + 0.1, y: prev.y + 0.2 }));
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging]);

  return (
    <section className="py-32 relative z-10 overflow-hidden min-h-screen flex flex-col items-center justify-center" ref={ref}>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 opacity-30" style={{
        background: 'linear-gradient(45deg, var(--color-dark-bg), #1a0b2e, #0b1a2e, var(--color-dark-bg))',
        backgroundSize: '400% 400%',
        animation: 'gradientBg 15s ease infinite'
      }}></div>
      <style>{`
        @keyframes gradientBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-20">
          <h2 className={`text-fluid-h2 font-display font-bold tracking-widest mb-6 transition-all duration-1000 ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            ЯДРО
            <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-neon-gold)] to-[var(--color-neon-pink)] mx-auto mt-4 rounded-full"></div>
          </h2>
          <p className="text-fluid-p text-white/70 font-sans font-light max-w-2xl mx-auto">
            Вращайте куб, чтобы изучить фундаментальные принципы нашей цифровой вселенной.
          </p>
        </div>

        <div 
          className={`scene interactive transition-all duration-1000 delay-300 ${hasIntersected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div 
            ref={cubeRef}
            className="cube" 
            style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
          >
            <div className="cube-face cube-face-front flex-col">
              <span className="text-4xl mb-2">🚀</span>
              <span className="tracking-widest uppercase text-sm">Миссия</span>
            </div>
            <div className="cube-face cube-face-back flex-col">
              <span className="text-4xl mb-2">👁️</span>
              <span className="tracking-widest uppercase text-sm">Видение</span>
            </div>
            <div className="cube-face cube-face-right flex-col">
              <span className="text-4xl mb-2">💎</span>
              <span className="tracking-widest uppercase text-sm">Ценности</span>
            </div>
            <div className="cube-face cube-face-left flex-col">
              <span className="text-4xl mb-2">👥</span>
              <span className="tracking-widest uppercase text-sm">Команда</span>
            </div>
            <div className="cube-face cube-face-top flex-col">
              <span className="text-4xl mb-2">🤝</span>
              <span className="tracking-widest uppercase text-sm">Партнёры</span>
            </div>
            <div className="cube-face cube-face-bottom flex-col">
              <span className="text-4xl mb-2">🔮</span>
              <span className="tracking-widest uppercase text-sm">Будущее</span>
            </div>
          </div>
        </div>

        <div className="mt-20 flex items-center space-x-4 text-white/50 font-sans text-sm animate-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          <span>Тяните для вращения</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>

      </div>
    </section>
  );
};
