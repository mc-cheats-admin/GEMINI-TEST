import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[var(--color-dark-bg)] pt-20 pb-10 border-t border-white/10 overflow-hidden">
      
      {/* Animated Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white/5 animate-[wave_10s_linear_infinite]"></path>
        </svg>
      </div>
      <style>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-16">
          
          <div className="mb-10 md:mb-0 text-center md:text-left">
            <div className="font-display text-4xl font-black tracking-widest text-white mb-4 glitch-effect" style={{ animationDuration: '5s' }}>
              UNIVERSE
            </div>
            <p className="text-white/50 font-sans font-light max-w-xs">
              Исследуйте границы возможного вместе с нами.
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-10 md:gap-20">
            <div>
              <h4 className="font-display text-sm tracking-widest text-white uppercase mb-6">Навигация</h4>
              <ul className="space-y-4">
                {['Главная', 'Возможности', 'Технологии', 'Галерея'].map(link => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-white/70 hover:text-[var(--color-neon-blue)] font-sans transition-colors relative group">
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-neon-blue)] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-display text-sm tracking-widest text-white uppercase mb-6">Правовая инфо</h4>
              <ul className="space-y-4">
                {['Политика конфиденциальности', 'Условия использования', 'Cookies'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-white/70 hover:text-[var(--color-neon-pink)] font-sans transition-colors relative group">
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-neon-pink)] transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-white/40 font-sans text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Digital Universe. Все права защищены.
          </p>
          
          <p className="text-white/40 font-sans text-sm flex items-center">
            Сделано с <span className="mx-2 text-red-500 animate-pulse">❤️</span> и кодом
          </p>
        </div>
      </div>

      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[var(--color-neon-blue)] hover:text-black hover:shadow-[0_0_20px_var(--color-neon-blue)] transition-all duration-300 z-50 group"
      >
        <ArrowUp className="group-hover:-translate-y-1 transition-transform" />
      </button>

    </footer>
  );
};
