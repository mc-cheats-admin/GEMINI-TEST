import React from 'react';

export const Marquee = ({ text, reverse = false }: { text: string, reverse?: boolean }) => {
  return (
    <div className="relative w-full overflow-hidden bg-white/5 border-y border-white/10 py-4 z-10 backdrop-blur-sm">
      <div className={`flex whitespace-nowrap ${reverse ? 'animate-[marquee-reverse_20s_linear_infinite]' : 'animate-[marquee_20s_linear_infinite]'}`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="text-4xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white/20 to-white/5 px-8 uppercase tracking-widest">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
