import React, { useEffect, useRef, useState } from 'react';
import { engine } from '../engine/Engine';
import { state } from '../store';

const codeLines = [
  "function initializeNeuralLink() {",
  "  const synapse = new QuantumSynapse();",
  "  synapse.connect(brain.cortex);",
  "  ",
  "  while (!synapse.stable) {",
  "    synapse.calibrate(0.001);",
  "    if (synapse.overload) {",
  "      throw new Error('Neural overload detected');",
  "    }",
  "  }",
  "  ",
  "  return synapse.stream();",
  "}"
];

export const CodeSnippet = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<number>(0);

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

    let timeAcc = 0;
    const module = {
      update: (dt: number) => {
        if (!containerRef.current) return;
        const currentY = initialTop - state.scroll.y;
        
        // If visible, animate typing
        if (currentY > -500 && currentY < window.innerHeight) {
          timeAcc += dt;
          if (timeAcc > 100) { // Add a line every 100ms
            timeAcc = 0;
            setVisibleLines(prev => {
              if (prev < codeLines.length) return prev + 1;
              return prev;
            });
          }
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
    <section ref={containerRef} className="py-24 relative z-content">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="liquid-glass rounded-xl overflow-hidden border border-white/20 shadow-2xl">
          <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            <div className="ml-4 text-xs font-mono text-white/40 uppercase tracking-widest">
              system_core.ts
            </div>
          </div>
          <div className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto">
            {codeLines.map((line, i) => (
              <div 
                key={i} 
                className={`transition-all duration-300 ${i < visibleLines ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden'}`}
              >
                <span className="text-white/30 mr-4 select-none">{(i + 1).toString().padStart(2, '0')}</span>
                <span className="text-[var(--color-neon-blue)]">{line}</span>
              </div>
            ))}
            {visibleLines < codeLines.length && (
              <div className="inline-block w-2 h-4 bg-white/80 animate-pulse ml-8"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
