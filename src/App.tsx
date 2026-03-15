import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { CanvasBackground } from './components/CanvasBackground';
import { CustomCursor } from './components/CustomCursor';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Technologies } from './components/Technologies';
import { Gallery } from './components/Gallery';
import { Stats } from './components/Stats';
import { Timeline } from './components/Timeline';
import { Testimonials } from './components/Testimonials';
import { InteractiveCube } from './components/InteractiveCube';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [konamiCode, setKonamiCode] = useState<string[]>([]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.classList.toggle('light-theme', newTheme === 'light');
  };

  // Konami Code Logic
  useEffect(() => {
    const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      setKonamiCode(prev => {
        const newCode = [...prev, e.key];
        if (newCode.length > secretCode.length) newCode.shift();
        
        if (newCode.join(',') === secretCode.join(',')) {
          document.body.classList.add('konami-mode');
          setTimeout(() => document.body.classList.remove('konami-mode'), 5000);
          return [];
        }
        return newCode;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <Preloader onComplete={() => setLoading(false)} />
      
      {!loading && (
        <>
          <CustomCursor />
          <CanvasBackground theme={theme} />
          <Navigation theme={theme} toggleTheme={toggleTheme} />
          
          <main>
            <Hero />
            <Features />
            <Technologies />
            <Gallery />
            <Stats />
            <Timeline />
            <Testimonials />
            <InteractiveCube />
            <Contact />
          </main>
          
          <Footer />
        </>
      )}
    </div>
  );
}
