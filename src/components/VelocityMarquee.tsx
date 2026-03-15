import React, { useEffect, useRef } from 'react';
import { state } from '../store';

interface VelocityMarqueeProps {
  text: string;
}

export const VelocityMarquee: React.FC<VelocityMarqueeProps> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLDivElement>(null);
  const textRef2 = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const directionRef = useRef(1);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      if (!textRef1.current || !textRef2.current) return;

      const scrollVel = state.scrollVelocity || 0;
      const absVel = Math.abs(scrollVel);
      
      // Определяем направление на основе знака scrollVelocity
      if (scrollVel < -0.5) {
        directionRef.current = -1; // Скролл вверх - текст вправо
      } else if (scrollVel > 0.5) {
        directionRef.current = 1; // Скролл вниз - текст влево
      }

      // Базовая скорость + бонус от скорости скролла
      const baseSpeed = 0.3;
      const velocityMultiplier = Math.min(absVel * 2, 5);
      const speed = (baseSpeed + velocityMultiplier) * directionRef.current;

      positionRef.current += speed;

      // Получаем ширину одного текстового блока
      const textWidth = textRef1.current.offsetWidth;

      // Сброс позиции для бесконечного цикла
      if (directionRef.current > 0 && positionRef.current <= -textWidth) {
        positionRef.current = 0;
      } else if (directionRef.current < 0 && positionRef.current >= 0) {
        positionRef.current = -textWidth;
      }

      // Применяем трансформацию
      textRef1.current.style.transform = `translateX(${positionRef.current}px)`;
      textRef2.current.style.transform = `translateX(${positionRef.current + textWidth}px)`;

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center"
      style={{ 
        backgroundColor: 'transparent',
        zIndex: 10
      }}
    >
      <div className="absolute inset-0 flex items-center whitespace-nowrap">
        <div 
          ref={textRef1}
          className="velocity-marquee-text"
          style={{
            fontSize: 'clamp(8rem, 20vw, 24rem)',
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            WebkitTextStroke: '2px rgba(255, 255, 255, 0.8)',
            WebkitTextFillColor: 'transparent',
            textStroke: '2px rgba(255, 255, 255, 0.8)',
            color: 'transparent',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            willChange: 'transform',
            filter: 'drop-shadow(0 0 30px rgba(0, 243, 255, 0.3))',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          {text.repeat(3)}
        </div>
        <div 
          ref={textRef2}
          className="velocity-marquee-text"
          style={{
            fontSize: 'clamp(8rem, 20vw, 24rem)',
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            WebkitTextStroke: '2px rgba(255, 255, 255, 0.8)',
            WebkitTextFillColor: 'transparent',
            textStroke: '2px rgba(255, 255, 255, 0.8)',
            color: 'transparent',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            willChange: 'transform',
            filter: 'drop-shadow(0 0 30px rgba(0, 243, 255, 0.3))',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          {text.repeat(3)}
        </div>
      </div>
    </section>
  );
};