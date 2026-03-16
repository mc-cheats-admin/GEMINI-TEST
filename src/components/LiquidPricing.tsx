import React from 'react';

const plans = [
  { name: "BASIC", price: "00", features: ["Core Engine", "60fps Render", "Basic Shaders"] },
  { name: "PRO", price: "99", features: ["Liquid Glass", "Advanced WebGL", "Priority Support"], highlight: true },
  { name: "ENTERPRISE", price: "CUSTOM", features: ["Custom Shaders", "Dedicated Server", "SLA"] }
];

export const LiquidPricing = () => {
  return (
    <section className="py-16 relative z-content">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl md:text-7xl font-display font-black text-center mb-20 text-white">
          ACCESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-blue-500">TIERS</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`relative p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${
                plan.highlight 
                  ? 'border-[var(--color-neon-blue)] bg-black/60 shadow-[0_0_30px_rgba(0,243,255,0.2)]' 
                  : 'border-white/10 bg-black/40 hover:border-white/30'
              } backdrop-blur-xl liquid-glass`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-neon-blue)] text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Recommended
                </div>
              )}
              
              <h3 className="text-2xl font-mono text-white/80 mb-4">{plan.name}</h3>
              <div className="text-6xl font-display font-black text-white mb-8">
                {plan.price !== "CUSTOM" && <span className="text-3xl align-top text-white/50">$</span>}
                {plan.price}
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center text-white/70 font-sans">
                    <svg className="w-5 h-5 mr-3 text-[var(--color-neon-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all ${
                plan.highlight
                  ? 'bg-[var(--color-neon-blue)] text-black hover:bg-white'
                  : 'bg-white/10 text-white hover:bg-white hover:text-black'
              }`}>
                Initialize
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
