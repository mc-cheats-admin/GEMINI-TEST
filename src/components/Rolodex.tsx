import React, { useEffect, useRef } from 'react';
import { state } from '../store';
import { engine } from '../engine/Engine';

const features = [
  { title: 'Нейро-интерфейсы', desc: 'Прямое подключение сознания к цифровой среде.' },
  { title: 'Квантовая защита', desc: 'Абсолютная безопасность данных на уровне субатомных частиц.' },
  { title: 'Мета-пространства', desc: 'Бесконечные виртуальные миры для работы и отдыха.' },
  { title: 'Синтез материи', desc: 'Материализация цифровых объектов в реальном мире.' },
  { title: 'ИИ-Симбиоз', desc: 'Слияние человеческого и искусственного интеллекта.' },
];

export const Rolodex = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  
  const dragState = useRef(features.map(() => ({
    isDragging: false,
    startX: 0, startY: 0,
    offsetX: 0, offsetY: 0,
    vx: 0, vy: 0
  })));

  useEffect(() => {
    let initialTop = 0;
    let initialHeight = 0;

    const updateRect = () => {
      if (!containerRef.current) return;
      // Temporarily remove transform to get true offset if needed, or just use offsetTop
      // Since container is inside #scroll-container, its offsetTop is relative to it.
      // Actually, we can just use the element's offsetTop relative to the document.
      let el: HTMLElement | null = containerRef.current;
      let top = 0;
      while (el && el.id !== 'scroll-container') {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement;
      }
      initialTop = top;
      initialHeight = containerRef.current.offsetHeight;
    };

    // Delay slightly to ensure layout is done
    setTimeout(updateRect, 100);
    window.addEventListener('resize', updateRect);

    const module = {
      update: () => {
        if (!containerRef.current) return;
        
        // Calculate progress using state.scroll.y instead of getBoundingClientRect
        const currentY = initialTop - state.scroll.y;
        const centerY = currentY + initialHeight / 2;
        const progress = (window.innerHeight / 2 - centerY) / window.innerHeight;

        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const ds = dragState.current[i];
          
          if (!ds.isDragging) {
            ds.vx += (0 - ds.offsetX) * 0.05;
            ds.vy += (0 - ds.offsetY) * 0.05;
            ds.vx *= 0.9;
            ds.vy *= 0.9;
            
            ds.offsetX += ds.vx;
            ds.offsetY += ds.vy;
          }

          const offset = i - (features.length - 1) / 2;
          
          let z = -Math.abs(offset) * 200 + progress * 800;
          let y = offset * 120 + progress * 400;
          let rotateX = offset * -15 + progress * 20;
          
          const mouseXNorm = (state.mouse.x / window.innerWidth) * 2 - 1;
          const rotateY = mouseXNorm * 15;

          const finalX = ds.offsetX;
          const finalY = y + ds.offsetY;

          card.style.transform = `translate3d(${finalX}px, ${finalY}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          card.style.opacity = z > 200 ? '0' : z < -800 ? '0' : '1';
        });
      }
    };
    engine.register(module);
    
    return () => {
      engine.unregister(module);
      window.removeEventListener('resize', updateRect);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    const ds = dragState.current[index];
    ds.isDragging = true;
    ds.startX = e.clientX - ds.offsetX;
    ds.startY = e.clientY - ds.offsetY;
    ds.vx = 0;
    ds.vy = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent, index: number) => {
    const ds = dragState.current[index];
    if (!ds.isDragging) return;
    
    const prevX = ds.offsetX;
    const prevY = ds.offsetY;
    
    ds.offsetX = e.clientX - ds.startX;
    ds.offsetY = e.clientY - ds.startY;
    
    ds.vx = ds.offsetX - prevX;
    ds.vy = ds.offsetY - prevY;
  };

  const handlePointerUp = (e: React.PointerEvent, index: number) => {
    const ds = dragState.current[index];
    ds.isDragging = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <section className="h-[150vh] relative" style={{ perspective: '1000px' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden" ref={containerRef}>
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <div className="text-[20vw] font-display font-black leading-none tracking-tighter liquid-metal-text">01</div>
        </div>
        <div className="relative w-full max-w-md h-96 transform-style-3d z-10">
          {features.map((f, i) => (
            <div 
              key={i}
              ref={el => cardsRef.current[i] = el!}
              onPointerDown={(e) => handlePointerDown(e, i)}
              onPointerMove={(e) => handlePointerMove(e, i)}
              onPointerUp={(e) => handlePointerUp(e, i)}
              onPointerCancel={(e) => handlePointerUp(e, i)}
              className="absolute inset-0 bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-center items-center text-center will-change-transform cursor-grab active:cursor-grabbing shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              style={{ transformOrigin: 'center center -500px', touchAction: 'none' }}
            >
              <h3 className="text-2xl font-display font-bold text-white mb-4 pointer-events-none">{f.title}</h3>
              <p className="text-white/70 font-sans pointer-events-none">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
