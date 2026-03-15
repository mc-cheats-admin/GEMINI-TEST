import React, { useEffect, useState } from 'react';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('Инициализация квантового ядра...');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 5 + 1;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);

      if (currentProgress < 30) setText('Инициализация квантового ядра...');
      else if (currentProgress < 60) setText('Загрузка нейронных сетей...');
      else if (currentProgress < 90) setText('Синхронизация измерений...');
      else setText('Вселенная готова');

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onComplete, 1000);
        }, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[var(--color-neon-blue)] animate-spin" style={{ animationDuration: '2s' }}></div>
        <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-[var(--color-neon-pink)] animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-4 rounded-full border-t-2 border-l-2 border-[var(--color-neon-green)] animate-spin" style={{ animationDuration: '1s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white,0_0_20px_var(--color-neon-blue)] animate-pulse"></div>
        </div>
      </div>
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-pink)] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 font-display text-sm tracking-widest text-white glitch-effect">
        {text}
      </div>
    </div>
  );
};
