import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const Hero = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.5 });
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const target1 = 'ИССЛЕДУЙ';
  const target2 = 'ЦИФРОВУЮ ВСЕЛЕННУЮ';

  useEffect(() => {
    if (!isIntersecting) return;
    let i = 0;
    const interval = setInterval(() => {
      setText1(target1.slice(0, i) + (i < target1.length ? String.fromCharCode(33 + Math.random() * 94) : ''));
      i++;
      if (i > target1.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [isIntersecting]);

  useEffect(() => {
    if (!isIntersecting) return;
    let i = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        setText2(target2.slice(0, i) + (i < target2.length ? String.fromCharCode(33 + Math.random() * 94) : ''));
        i++;
        if (i > target2.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }, 500);
  }, [isIntersecting]);

  return (
    <section ref={ref} id="главная" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="hero-shape"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-light tracking-tighter text-white mb-2 glitch-effect" style={{ animationDuration: '3s' }}>
          {text1}
        </h1>
        <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] via-[var(--color-neon-pink)] to-[var(--color-neon-green)] mb-8">
          {text2}
        </h2>
        
        <p className={`text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-sans font-light leading-relaxed mb-12 transition-all duration-1000 delay-1000 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Погрузитесь в бесконечное пространство цифровых возможностей. 
          Где код становится искусством, а данные формируют новые миры.
        </p>
        
        <button className={`relative px-8 py-4 font-display text-sm tracking-widest uppercase text-white overflow-hidden group transition-all duration-1000 delay-1500 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-blue)] via-[var(--color-neon-pink)] to-[var(--color-neon-blue)] bg-[length:200%_auto] animate-[borderGlow_3s_linear_infinite] opacity-20 group-hover:opacity-100 transition-opacity"></span>
          <span className="absolute inset-[1px] bg-[var(--color-dark-bg)] group-hover:bg-transparent transition-colors duration-300"></span>
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">Начать путешествие</span>
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-50">
        <span className="text-xs font-display tracking-widest mb-2">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>
  );
};
