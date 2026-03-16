import React, { useEffect, useRef } from 'react';
import { state } from '../store';
import { engine } from '../engine/Engine';

export const Hero = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<{ el: HTMLSpanElement, x: number, y: number, vx: number, vy: number, ox: number, oy: number }[]>([]);

  useEffect(() => {
    if (!textRef.current) return;
    const text = "ИССЛЕДУЙ ЦИФРОВУЮ ВСЕЛЕННУЮ";
    textRef.current.innerHTML = '';
    lettersRef.current = [];

    text.split('').forEach((char) => {
      if (char === ' ') {
        textRef.current!.appendChild(document.createTextNode(' '));
        return;
      }
      const span = document.createElement('span');
      span.innerText = char;
      span.style.display = 'inline-block';
      span.style.willChange = 'transform';
      textRef.current!.appendChild(span);
      
      lettersRef.current.push({
        el: span, x: 0, y: 0, vx: 0, vy: 0, ox: 0, oy: 0
      });
    });

    let panelCenterX = 0;
    let panelCenterY = 0;

    setTimeout(() => {
      lettersRef.current.forEach(l => {
        const rect = l.el.getBoundingClientRect();
        l.ox = rect.left + rect.width / 2;
        l.oy = rect.top + rect.height / 2;
      });
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        panelCenterX = rect.left + rect.width / 2;
        panelCenterY = rect.top + rect.height / 2;
      }
    }, 100);

    const module = {
      update: () => {
        const mx = state.mouse.x;
        const my = state.mouse.y;

        // Panel tilt effect
        if (panelRef.current && panelCenterX !== 0) {
          const currentPanelY = panelCenterY - state.scroll.y;
          const tiltX = (my - currentPanelY) / 40;
          const tiltY = -(mx - panelCenterX) / 40;
          panelRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
        }

        lettersRef.current.forEach(l => {
          const currentOy = l.oy - state.scroll.y;
          const dx = mx - (l.ox + l.x);
          const dy = my - (currentOy + l.y);
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < 150) {
            const force = (150 - dist) / 150;
            l.vx -= (dx / dist) * force * 5;
            l.vy -= (dy / dist) * force * 5;
          }

          l.vx += (0 - l.x) * 0.1;
          l.vy += (0 - l.y) * 0.1;
          l.vx *= 0.8;
          l.vy *= 0.8;

          l.x += l.vx;
          l.y += l.vy;

          l.el.style.transform = `translate3d(${l.x}px, ${l.y}px, 0)`;
        });
      }
    };
    engine.register(module);
    return () => engine.unregister(module);
  }, []);

  return (
    <section className="h-screen flex items-center justify-center relative px-4">
      <div 
        ref={panelRef}
        className="liquid-glass w-full max-w-7xl aspect-video md:aspect-[21/9] rounded-3xl flex items-center justify-center p-8 md:p-16 will-change-transform"
      >
        <h1 
          ref={textRef} 
          className="text-4xl md:text-7xl lg:text-8xl font-display font-black text-center max-w-5xl z-10 liquid-metal-text"
          style={{ lineHeight: '1.1' }}
        >
        </h1>
      </div>
    </section>
  );
};
