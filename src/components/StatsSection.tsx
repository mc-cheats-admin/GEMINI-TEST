import React, { useRef, useEffect } from 'react';
import { engine } from '../engine/Engine';
import { state } from '../store';

const stats = [
  { value: 99.9, label: 'UPTIME', suffix: '%' },
  { value: 1.2, label: 'LATENCY', suffix: 'ms' },
  { value: 840, label: 'NODES', suffix: 'k' },
  { value: 10, label: 'EXAFLOPS', suffix: '+' },
];

export const StatsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<HTMLDivElement[]>([]);
  const currentValues = useRef(stats.map(() => 0));

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
      update: (dt: number) => {
        if (!containerRef.current) return;
        const currentY = initialTop - state.scroll.y;
        
        // If visible, animate numbers
        if (currentY > -500 && currentY < window.innerHeight + 500) {
          numbersRef.current.forEach((el, i) => {
            if (!el) return;
            const target = stats[i].value;
            const current = currentValues.current[i];
            
            if (Math.abs(target - current) < 0.01) {
              currentValues.current[i] = target;
            } else {
              currentValues.current[i] += (target - current) * 0.05;
            }
            
            // Format number
            let displayValue: number | string = currentValues.current[i];
            if (target % 1 === 0) {
              displayValue = Math.round(displayValue);
            } else {
              displayValue = displayValue.toFixed(1);
            }
            
            const strValue = displayValue.toString();
            if (el.innerText !== strValue) {
              el.innerText = strValue;
            }
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
    <section ref={containerRef} className="py-24 relative z-content border-y border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl md:text-7xl font-display font-black text-white mb-2 flex justify-center items-baseline">
                <span ref={el => numbersRef.current[i] = el!}>0</span>
                <span className="text-2xl md:text-4xl text-[var(--color-neon-blue)] ml-1">{s.suffix}</span>
              </div>
              <div className="text-white/50 font-mono text-sm uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
