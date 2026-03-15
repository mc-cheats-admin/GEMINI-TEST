import React, { useEffect, useRef } from 'react';
import { state } from '../store';

const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

export const SpiralTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let rafId: number;
    const update = () => {
      if (!containerRef.current || !sectionRef.current) return;
      
      // Получаем реальную позицию секции с учетом виртуального скролла
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Вычисляем progress относительно текущей позиции скролла из state
      const scrollY = state.scroll.y;
      const sectionStart = sectionTop - viewportHeight;
      const sectionEnd = sectionTop + sectionHeight;
      const scrollRange = sectionEnd - sectionStart;
      
      // Progress от 0 до 1 когда секция проходит через viewport
      let progress = (scrollY - sectionStart) / scrollRange;
      progress = Math.max(0, Math.min(1, progress));

      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        
        // Нормализуем индекс относительно центра массива
        const normalizedIndex = i / (years.length - 1);
        
        // Вычисляем позицию элемента в спирали
        // t определяет положение элемента относительно текущего progress
        const t = normalizedIndex - progress * 2;
        
        // Параметры спирали
        const baseRadius = 300;
        const radiusGrowth = 50;
        const radius = baseRadius + t * radiusGrowth;
        const angle = t * Math.PI * 1.5; // Увеличиваем количество витков
        
        // 3D координаты спирали
        const x = Math.sin(angle) * radius;
        const y = t * 200;
        const z = Math.cos(angle) * radius - t * 500;

        // Применяем трансформацию
        item.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        
        // Вычисляем opacity с улучшенной видимостью
        // Элементы видны в диапазоне z от -2000 до 400
        let opacity = 1;
        if (z > 400) {
          opacity = 0;
        } else if (z < -2000) {
          opacity = 0;
        } else if (z > 200) {
          // Плавное затухание спереди
          opacity = 1 - (z - 200) / 200;
        } else if (z < -1500) {
          // Плавное затухание сзади
          opacity = 1 - Math.abs(z + 1500) / 500;
        } else {
          // В центральной зоне применяем мягкое затухание по t
          opacity = 1 - Math.abs(t) * 0.15;
        }
        
        item.style.opacity = `${Math.max(0, Math.min(1, opacity))}`;
        
        // Подсветка активного элемента (ближайшего к центру)
        if (Math.abs(t) < 0.3) {
          item.style.color = 'var(--color-neon-blue)';
          item.style.textShadow = '0 0 20px var(--color-neon-blue), 0 0 40px var(--color-neon-blue)';
          item.style.filter = 'brightness(1.2)';
        } else if (Math.abs(t) < 0.6) {
          // Переходная зона
          const fade = (0.6 - Math.abs(t)) / 0.3;
          item.style.color = `rgba(0, 243, 255, ${fade})`;
          item.style.textShadow = `0 0 ${20 * fade}px var(--color-neon-blue)`;
          item.style.filter = `brightness(${1 + 0.2 * fade})`;
        } else {
          item.style.color = 'rgba(255,255,255,0.5)';
          item.style.textShadow = 'none';
          item.style.filter = 'brightness(1)';
        }
        
        // Добавляем pointer-events только для видимых элементов
        item.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
      });

      rafId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section ref={sectionRef} className="h-[250vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden" style={{ perspective: '1200px' }}>
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center transform-style-3d">
          {years.map((year, i) => (
            <div 
              key={i}
              ref={el => itemsRef.current[i] = el!}
              className="absolute text-6xl md:text-9xl font-display font-black will-change-transform transition-colors duration-300"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              {year}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};