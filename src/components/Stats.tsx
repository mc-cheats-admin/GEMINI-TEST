import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useMagnetic } from '../hooks/useMagnetic';

const statsData = [
  { value: 500, suffix: '+', label: 'Проектов' },
  { value: 10, suffix: 'M+', label: 'Пользователей' },
  { value: 99.9, suffix: '%', label: 'Uptime' },
  { value: 24, suffix: '/7', label: 'Поддержка' },
];

interface StatItemProps {
  stat: any;
  index: number;
  counts: number[];
  hasIntersected: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ stat, index, counts, hasIntersected }) => {
  const magneticRef = useMagnetic(0.2, 150);

  return (
    <div 
      ref={magneticRef as any}
      className={`flex flex-col items-center justify-center p-8 rounded-2xl premium-glass transition-all duration-1000 ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div className="text-fluid-h2 font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-[var(--color-neon-blue)] mb-4 drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
        {stat.value === 24 ? stat.value : (stat.value % 1 !== 0 ? counts[index].toFixed(1) : Math.floor(counts[index]))}
        {stat.suffix}
      </div>
      <div className="text-sm md:text-base font-sans font-medium tracking-widest text-white/60 uppercase">
        {stat.label}
      </div>
    </div>
  );
};

export const Stats = () => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.5 });
  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    if (!hasIntersected) return;

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCounts(statsData.map((stat, i) => {
        if (stat.value === 24) return 24; // Static for 24/7
        return stat.value * easeProgress;
      }));

      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [hasIntersected]);

  return (
    <section className="py-32 relative z-10 overflow-hidden bg-black/50 backdrop-blur-md border-y border-white/10" ref={ref}>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: 'linear-gradient(var(--color-neon-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-neon-blue) 1px, transparent 1px)',
             backgroundSize: '50px 50px',
             transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
             animation: 'gridMove 20s linear infinite'
           }}>
      </div>
      <style>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 50px; }
        }
      `}</style>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {statsData.map((stat, index) => (
            <StatItem key={index} stat={stat} index={index} counts={counts} hasIntersected={!!hasIntersected} />
          ))}
        </div>
      </div>
    </section>
  );
};
