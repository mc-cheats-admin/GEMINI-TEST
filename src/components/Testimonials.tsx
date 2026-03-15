import React, { useEffect, useRef, useState } from 'react';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+アカサタナハマヤラワ';

const DecipherText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsIntersecting(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;
    
    let iteration = 0;
    let rafId: number;
    
    const animate = () => {
      setDisplayText(text.split('').map((letter, index) => {
        if (index < iteration) return letter;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if (iteration >= text.length) {
        cancelAnimationFrame(rafId);
        return;
      }
      
      iteration += 1 / 3;
      rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isIntersecting, text]);

  return <span ref={ref}>{displayText || text.replace(/./g, '-')}</span>;
};

export const Testimonials = () => {
  return (
    <section className="py-32 min-h-screen flex flex-col items-center justify-center relative z-10">
      <div className="container mx-auto px-6 max-w-4xl text-center space-y-16">
        <h2 className="text-4xl font-display font-bold text-[var(--color-neon-pink)]">
          <DecipherText text="СЕКРЕТНЫЕ ДАННЫЕ" />
        </h2>
        <p className="text-2xl md:text-4xl font-mono leading-relaxed">
          <DecipherText text="«Они создали не просто сайт. Они создали портал в другое измерение. Код чист, как слеза единорога, а производительность нарушает законы физики.»" />
        </p>
        <div className="text-right text-[var(--color-neon-blue)] font-mono">
          <DecipherText text="-- Анонимный Архитектор" />
        </div>
      </div>
    </section>
  );
};
