import React, { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const panels = [
  { id: 'quantum', title: 'Квантовые вычисления', color: 'var(--color-neon-blue)', desc: 'Преодолевая границы классической физики.' },
  { id: 'neural', title: 'Нейронные сети', color: 'var(--color-neon-pink)', desc: 'Искусственный интеллект, который учится и эволюционирует.' },
  { id: 'blockchain', title: 'Блокчейн', color: 'var(--color-neon-green)', desc: 'Децентрализованное доверие и неизменность данных.' },
  { id: 'ar', title: 'Дополненная реальность', color: 'var(--color-neon-gold)', desc: 'Слияние цифрового и физического миров.' },
  { id: 'space', title: 'Космос', color: 'var(--color-neon-blue)', desc: 'Бесконечные горизонты цифровых открытий.' },
];

export const Technologies = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.1 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress based on how much of the container has been scrolled through
      const totalScrollable = height - windowHeight;
      const scrolled = -top;
      
      let progress = scrolled / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="технологии" ref={containerRef} className="relative h-[500vh] z-10">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center bg-black/50 backdrop-blur-sm">
        
        <div 
          className="flex h-full w-[500vw] transition-transform duration-100 ease-out"
          style={{ transform: `translateX(-${scrollProgress * 400}vw)` }}
        >
          {panels.map((panel, index) => (
            <div key={panel.id} className="w-screen h-full flex flex-col items-center justify-center p-12 relative flex-shrink-0">
              
              {/* Background Glow */}
              <div 
                className="absolute inset-0 opacity-20 blur-[100px] transition-opacity duration-1000"
                style={{ background: `radial-gradient(circle at center, ${panel.color}, transparent 70%)` }}
              ></div>

              <div className="relative z-10 text-center max-w-4xl">
                <h3 
                  className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-8 uppercase"
                  style={{ color: panel.color, textShadow: `0 0 20px ${panel.color}` }}
                >
                  {panel.title}
                </h3>
                <p className="text-2xl md:text-4xl font-sans font-light text-white/80 leading-relaxed">
                  {panel.desc}
                </p>
              </div>

              {/* Visualizations based on panel.id */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-30">
                {panel.id === 'quantum' && (
                  <div className="relative w-96 h-96 animate-spin" style={{ animationDuration: '20s' }}>
                    <div className="absolute inset-0 border border-[var(--color-neon-blue)] rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-10 border border-[var(--color-neon-blue)] rounded-full animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}></div>
                    <div className="absolute inset-20 border border-[var(--color-neon-blue)] rounded-full animate-spin" style={{ animationDuration: '5s' }}></div>
                  </div>
                )}
                {panel.id === 'neural' && (
                  <div className="grid grid-cols-5 gap-4 opacity-50">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className="w-4 h-4 rounded-full bg-[var(--color-neon-pink)] animate-pulse" style={{ animationDelay: `${Math.random() * 2}s` }}></div>
                    ))}
                  </div>
                )}
                {panel.id === 'blockchain' && (
                  <div className="flex space-x-4 opacity-50">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-24 h-24 border-2 border-[var(--color-neon-green)] flex items-center justify-center text-[var(--color-neon-green)] font-mono text-xs animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                        {Math.random().toString(36).substring(2, 8)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--color-neon-blue)] via-[var(--color-neon-pink)] to-[var(--color-neon-green)] transition-all duration-100 ease-out"
            style={{ width: `${scrollProgress * 100}%` }}
          ></div>
        </div>

        {/* Vertical Nav Dots */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
          {panels.map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${Math.round(scrollProgress * 4) === i ? 'bg-white scale-150 shadow-[0_0_10px_white]' : 'bg-white/30'}`}
            ></div>
          ))}
        </div>

      </div>
    </section>
  );
};
