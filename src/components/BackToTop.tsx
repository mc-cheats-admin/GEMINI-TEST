import React, { useState, useEffect } from 'react';
import { state } from '../store';
import { ChevronUp } from 'lucide-react';

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setVisible(state.scroll.y > 500);
    };
    const interval = setInterval(checkScroll, 100);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    state.scroll.target = 0;
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-[60] p-3 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white/50 hover:text-white hover:border-white/50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
};
