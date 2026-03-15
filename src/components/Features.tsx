import React from 'react';
import { Zap, Cpu, Shield, Eye, BarChart, Monitor } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useMouseGlow } from '../hooks/useMouseGlow';
import { useTilt } from '../hooks/useTilt';

const features = [
  { icon: Zap, title: 'Молниеносная скорость', desc: 'Оптимизированные алгоритмы для мгновенного отклика.', color: 'var(--color-neon-blue)' },
  { icon: Cpu, title: 'Нейронные сети', desc: 'ИИ-модели, обучающиеся на лету для адаптации к вашим нуждам.', color: 'var(--color-neon-pink)' },
  { icon: Shield, title: 'Квантовая защита', desc: 'Шифрование нового поколения, недоступное для взлома.', color: 'var(--color-neon-green)' },
  { icon: Eye, title: 'Визуализация данных', desc: 'Превращение сложных массивов в понятные графики.', color: 'var(--color-neon-gold)' },
  { icon: BarChart, title: 'Аналитика', desc: 'Глубокий анализ паттернов поведения пользователей.', color: 'var(--color-neon-blue)' },
  { icon: Monitor, title: 'Адаптивность', desc: 'Идеальное отображение на любых устройствах и экранах.', color: 'var(--color-neon-pink)' },
];

interface FeatureCardProps {
  feature: any;
  index: number;
  hasIntersected: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index, hasIntersected }) => {
  const glowRef = useMouseGlow();
  const tiltRef = useTilt(10);

  return (
    <div 
      ref={(node) => {
        if (glowRef) (glowRef as any).current = node;
        if (tiltRef) (tiltRef as any).current = node;
      }}
      className={`premium-glass mouse-glow p-8 rounded-2xl relative overflow-hidden group transition-all duration-700 ${hasIntersected ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-20 rotate-6'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-neon-blue)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="mb-6 inline-block p-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-300 relative">
        <feature.icon size={32} color={feature.color} className="relative z-10" />
        <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{ backgroundColor: feature.color }}></div>
      </div>
      
      <h3 className="text-fluid-h3 font-display font-semibold mb-4 tracking-wide text-white group-hover:text-[var(--color-neon-blue)] transition-colors duration-300">
        {feature.title}
      </h3>
      
      <p className="text-fluid-p text-white/60 font-sans font-light leading-relaxed group-hover:text-white/80 transition-colors duration-300">
        {feature.desc}
      </p>
      
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--color-neon-blue)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export const Features = () => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section id="возможности" className="py-32 relative z-10" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className={`text-fluid-h2 font-display font-bold tracking-widest mb-6 transition-all duration-1000 ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            ВОЗМОЖНОСТИ
            <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-pink)] mx-auto mt-4 rounded-full"></div>
          </h2>
          <p className={`typewriter text-fluid-p text-white/70 max-w-2xl mx-auto font-sans font-light ${hasIntersected ? 'opacity-100' : 'opacity-0'}`}>
            Раскройте потенциал цифровой эволюции с нашими передовыми инструментами.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} hasIntersected={!!hasIntersected} />
          ))}
        </div>
      </div>
    </section>
  );
};
