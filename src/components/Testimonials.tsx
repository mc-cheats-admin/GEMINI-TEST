import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const testimonials = [
  { id: 1, name: 'Алексей Смирнов', role: 'CEO, TechNova', text: 'Это не просто сайт, это погружение в будущее. Уровень интерактивности и внимания к деталям поражает воображение.', avatar: 'from-blue-400 to-indigo-600' },
  { id: 2, name: 'Елена Ковалева', role: 'Lead Designer, ArtSpace', text: 'Потрясающая работа с цветом и типографикой. Анимации плавные, а общая атмосфера заставляет возвращаться снова и снова.', avatar: 'from-pink-400 to-rose-600' },
  { id: 3, name: 'Дмитрий Волков', role: 'CTO, DataCorp', text: 'Техническая реализация на высшем уровне. Оптимизация canvas-анимаций и 3D-эффектов без потери производительности — это мастерство.', avatar: 'from-green-400 to-emerald-600' },
  { id: 4, name: 'Анна Иванова', role: 'Product Manager, Innovate', text: 'Пользовательский опыт просто невероятный. Каждое взаимодействие продумано, каждый клик доставляет удовольствие.', avatar: 'from-yellow-400 to-orange-600' },
  { id: 5, name: 'Максим Петров', role: 'Freelance Developer', text: 'Вдохновляющий проект. Я изучал исходный код, чтобы понять, как реализованы эти потрясающие эффекты.', avatar: 'from-purple-400 to-fuchsia-600' },
];

export const Testimonials = () => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  return (
    <section id="отзывы" className="py-32 relative z-10 overflow-hidden" ref={ref}>
      {/* Hypnotic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full border border-[var(--color-neon-blue)] animate-ping"
            style={{ 
              width: `${(i + 1) * 10}vw`, 
              height: `${(i + 1) * 10}vw`, 
              animationDuration: `${10 + i * 2}s`,
              animationDelay: `${i * 0.5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className={`text-4xl md:text-6xl font-display font-bold tracking-widest mb-6 transition-all duration-1000 ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            ОТЗЫВЫ
            <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-pink)] mx-auto mt-4 rounded-full"></div>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative perspective-1000">
          
          <div className="relative h-96 flex items-center justify-center">
            {testimonials.map((testimonial, index) => {
              const isActive = index === currentIndex;
              const isPrev = index === (currentIndex - 1 + testimonials.length) % testimonials.length;
              const isNext = index === (currentIndex + 1) % testimonials.length;

              let transform = 'translateZ(-500px) rotateY(0deg) scale(0.5)';
              let opacity = 0;
              let zIndex = 0;

              if (isActive) {
                transform = 'translateZ(0) rotateY(0deg) scale(1)';
                opacity = 1;
                zIndex = 10;
              } else if (isPrev) {
                transform = 'translateZ(-200px) rotateY(45deg) translateX(-50%) scale(0.8)';
                opacity = 0.3;
                zIndex = 5;
              } else if (isNext) {
                transform = 'translateZ(-200px) rotateY(-45deg) translateX(50%) scale(0.8)';
                opacity = 0.3;
                zIndex = 5;
              }

              return (
                <div 
                  key={testimonial.id}
                  className="absolute w-full max-w-2xl glass-panel p-10 rounded-3xl transition-all duration-500 ease-out flex flex-col items-center text-center"
                  style={{ transform, opacity, zIndex, transformStyle: 'preserve-3d' }}
                >
                  <div className="text-6xl text-[var(--color-neon-blue)] opacity-50 font-serif absolute top-4 left-8">"</div>
                  
                  <p className="text-xl md:text-2xl font-sans font-light leading-relaxed text-white mb-8 relative z-10">
                    {testimonial.text}
                  </p>
                  
                  <div className="flex items-center flex-col">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${testimonial.avatar} mb-4 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-1000`}></div>
                    <h4 className="text-lg font-display font-bold text-white tracking-wider">{testimonial.name}</h4>
                    <p className="text-sm font-sans text-[var(--color-neon-blue)] uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center mt-12 space-x-4">
            <button onClick={prevSlide} className="p-3 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors backdrop-blur-md border border-white/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-[var(--color-neon-blue)] shadow-[0_0_10px_var(--color-neon-blue)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                ></button>
              ))}
            </div>

            <button onClick={nextSlide} className="p-3 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors backdrop-blur-md border border-white/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
