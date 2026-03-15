import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useTilt } from '../hooks/useTilt';

const events = [
  { year: '2018', title: 'Зарождение идеи', desc: 'Первые концепты цифровой вселенной и формирование ядра команды.' },
  { year: '2019', title: 'Альфа-версия', desc: 'Запуск закрытого тестирования базовых алгоритмов и нейросетей.' },
  { year: '2021', title: 'Квантовый скачок', desc: 'Интеграция квантовых вычислений для ускорения обработки данных в 1000 раз.' },
  { year: '2023', title: 'Глобальная сеть', desc: 'Выход на международный уровень, миллион активных узлов.' },
  { year: '2024', title: 'Мета-интеграция', desc: 'Полное слияние с дополненной реальностью и запуск метавселенной.' },
  { year: '2025', title: 'Сингулярность', desc: 'Достижение самообучающегося ИИ, превосходящего человеческий интеллект.' },
];

interface TimelineItemProps {
  event: any;
  index: number;
  scrollProgress: number;
  isLeft: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event, index, scrollProgress, isLeft }) => {
  const tiltRef = useTilt(5);
  const itemProgress = index / (events.length - 1);
  const isActive = scrollProgress >= itemProgress - 0.1;

  return (
    <div 
      className={`relative flex items-center justify-between md:justify-normal w-full mb-16 md:mb-24 ${isLeft ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Node */}
      <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[var(--color-dark-bg)] border-2 border-white/30 -translate-x-1/2 z-10 transition-all duration-500 flex items-center justify-center">
        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-[var(--color-neon-green)] scale-150 shadow-[0_0_10px_var(--color-neon-green)]' : 'bg-transparent'}`}></div>
      </div>

      {/* Content */}
      <div className="w-full pl-12 md:pl-0 md:w-5/12 perspective-1000">
        <div 
          ref={tiltRef as any}
          className={`premium-glass p-6 rounded-2xl transition-all duration-700 ${isActive ? 'opacity-100 translate-x-0' : `opacity-0 ${isLeft ? 'md:-translate-x-20' : 'md:translate-x-20'} translate-x-10`}`}
        >
          <div className="font-mono text-xl md:text-2xl text-[var(--color-neon-green)] mb-2 drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
            &gt; {event.year}_
          </div>
          <h3 className="text-fluid-h3 font-display font-bold text-white mb-3">{event.title}</h3>
          <p className="text-fluid-p text-white/70 font-sans font-light leading-relaxed">{event.desc}</p>
        </div>
      </div>
      
      {/* Empty space for the other side on desktop */}
      <div className="hidden md:block w-5/12"></div>
    </div>
  );
};

export const Timeline = () => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.1 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const { top, height } = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress of the timeline line
      const progress = (windowHeight / 2 - top) / height;
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return (
    <section id="история" className="py-32 relative z-10" ref={ref}>
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-24">
          <h2 className={`text-fluid-h2 font-display font-bold tracking-widest mb-6 transition-all duration-1000 ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            ИСТОРИЯ
            <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-neon-green)] to-[var(--color-neon-blue)] mx-auto mt-4 rounded-full"></div>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2 rounded-full"></div>
          <div 
            className="absolute left-4 md:left-1/2 top-0 w-1 bg-gradient-to-b from-[var(--color-neon-green)] to-[var(--color-neon-blue)] -translate-x-1/2 rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_var(--color-neon-green)]"
            style={{ height: `${scrollProgress * 100}%` }}
          ></div>

          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <TimelineItem key={index} event={event} index={index} scrollProgress={scrollProgress} isLeft={isLeft} />
            );
          })}
        </div>

      </div>
    </section>
  );
};
