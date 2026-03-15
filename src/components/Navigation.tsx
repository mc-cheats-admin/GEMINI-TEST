import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

export const Navigation = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Главная', 'Возможности', 'Технологии', 'Галерея', 'Контакты'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--color-dark-bg)]/80 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="font-display text-2xl font-bold tracking-widest text-white flex group cursor-pointer">
          {'UNIVERSE'.split('').map((char, i) => (
            <span key={i} className="inline-block transition-transform duration-300 group-hover:-translate-y-1" style={{ transitionDelay: `${i * 50}ms` }}>
              {char}
            </span>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, i) => (
            <a key={i} href={`#${link.toLowerCase()}`} className="relative font-sans text-sm tracking-widest text-white/80 hover:text-white transition-colors group">
              {link}
              <span className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-[var(--color-neon-blue)] transition-all duration-300 group-hover:w-full group-hover:left-0 shadow-[0_0_10px_var(--color-neon-blue)]"></span>
            </a>
          ))}
          <button onClick={toggleTheme} className="text-white/80 hover:text-white transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <button className="md:hidden text-white z-50" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center space-y-8">
          {navLinks.map((link, i) => (
            <a 
              key={i} 
              href={`#${link.toLowerCase()}`} 
              className="font-display text-2xl tracking-widest text-white hover:text-[var(--color-neon-blue)] transition-colors"
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: `${i * 100}ms`, opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(20px)' }}
            >
              {link}
            </a>
          ))}
          <button onClick={() => { toggleTheme(); setMenuOpen(false); }} className="text-white mt-8 flex items-center space-x-2">
            {theme === 'dark' ? <><Sun size={24} /> <span>Светлая тема</span></> : <><Moon size={24} /> <span>Тёмная тема</span></>}
          </button>
        </div>
      </div>
    </nav>
  );
};
