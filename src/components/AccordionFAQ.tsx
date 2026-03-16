import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  { q: "WHAT IS THE CORE ENGINE?", a: "A custom-built vanilla JS rendering pipeline prioritizing 60fps performance and WebGL integration over standard DOM manipulation." },
  { q: "HOW DOES LIQUID GLASS WORK?", a: "It utilizes SVG filters (feTurbulence and feDisplacementMap) applied via CSS backdrop-filter to distort underlying elements in real-time." },
  { q: "IS THIS PRODUCTION READY?", a: "Yes. The architecture is designed for high-stress environments, utilizing ResizeObserver, dvh units, and strict z-index hierarchies." },
  { q: "CAN I INTEGRATE WITH REACT?", a: "The core engine runs independently, but exposes hooks and refs for seamless React integration as demonstrated in this architecture." }
];

export const AccordionFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 max-w-4xl mx-auto px-4 relative z-content">
      <h2 className="text-4xl md:text-6xl font-display font-black mb-16 text-white uppercase tracking-tighter">
        SYSTEM <span className="text-[var(--color-neon-blue)]">QUERIES</span>
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className="border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden transition-colors hover:border-[var(--color-neon-blue)]/50 cursor-pointer"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="p-6 flex justify-between items-center">
              <h3 className="font-mono text-lg text-white/90">{faq.q}</h3>
              <div className={`w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-500 ${openIndex === i ? 'rotate-45 bg-white text-black' : 'text-white'}`}>
                +
              </div>
            </div>
            
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="p-6 pt-0 text-white/60 font-sans leading-relaxed border-t border-white/5 mt-2">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};
