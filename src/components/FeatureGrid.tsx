import React, { useRef, useEffect } from 'react';
import { engine } from '../engine/Engine';
import { state } from '../store';

const features = [
  { id: '01', title: 'NEURAL LINK', desc: 'Direct brain-to-machine interface with zero latency.' },
  { id: '02', title: 'QUANTUM COMPUTE', desc: 'Processing power that transcends classical physics.' },
  { id: '03', title: 'HOLOGRAPHIC UI', desc: 'Interfaces that exist in physical space.' },
  { id: '04', title: 'SYNTHETIC DNA', desc: 'Data storage in biological molecules.' },
  { id: '05', title: 'DARK MATTER CORE', desc: 'Infinite energy from the void.' },
  { id: '06', title: 'TIME DILATION', desc: 'Manipulate local temporal fields.' },
];

export const FeatureGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let initialTop = 0;
    const updateRect = () => {
      if (!gridRef.current) return;
      let el: HTMLElement | null = gridRef.current;
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
      update: (dt: number, time: number) => {
        if (!gridRef.current) return;
        const currentY = initialTop - state.scroll.y;
        
        // Only animate if somewhat visible
        if (currentY > -1000 && currentY < window.innerHeight + 1000) {
          cardsRef.current.forEach((card, i) => {
            if (!card) return;
            const offset = time * 0.001 + i;
            const y = Math.sin(offset) * 10;
            card.style.transform = `translateY(${y}px)`;
          });
        }
      }
    };
    engine.register(module);
    return () => {
      engine.unregister(module);
      window.removeEventListener('resize', updateRect);
    };
  }, []);

  return (
    <section className="py-24 relative z-content">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-display font-black mb-16 text-center text-white uppercase tracking-tighter">
          SYSTEM <span className="liquid-metal-text">CAPABILITIES</span>
        </h2>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div 
              key={i}
              ref={el => cardsRef.current[i] = el!}
              className="liquid-glass p-8 rounded-2xl group hover:border-[var(--color-neon-blue)] transition-colors duration-500 will-change-transform"
            >
              <div className="text-5xl font-mono font-black text-white/10 mb-6 group-hover:text-[var(--color-neon-blue)] transition-colors duration-500">
                {f.id}
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-4 uppercase tracking-widest">
                {f.title}
              </h3>
              <p className="text-white/60 font-sans leading-relaxed">
                {f.desc}
              </p>
              <div className="mt-8 h-1 w-0 bg-[var(--color-neon-blue)] group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
