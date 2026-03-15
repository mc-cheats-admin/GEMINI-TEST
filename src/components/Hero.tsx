import React, { useEffect, useRef } from 'react';
import { state } from '../store';

export const Hero = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
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

    setTimeout(() => {
      lettersRef.current.forEach(l => {
        const rect = l.el.getBoundingClientRect();
        l.ox = rect.left + rect.width / 2;
        l.oy = rect.top + rect.height / 2 + state.scroll.y;
      });
    }, 100);

    let rafId: number;
    const update = () => {
      const mx = state.mouse.x;
      const my = state.mouse.y;
      const scrollY = state.scroll.y;

      lettersRef.current.forEach(l => {
        const currentOy = l.oy - scrollY;
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

      rafId = requestAnimationFrame(update);
    };
    update();

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className="h-screen flex items-center justify-center relative">
      <h1 
        ref={textRef} 
        className="text-5xl md:text-8xl lg:text-9xl font-display font-black text-center max-w-6xl mix-blend-difference z-10 liquid-metal-text"
        style={{ lineHeight: '1.1' }}
      >
      </h1>
    </section>
  );
};