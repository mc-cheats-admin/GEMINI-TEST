import React, { useEffect, useRef, useState } from 'react';
import { state } from '../store';

interface PricingTier {
  name: string;
  price: string;
  features: string[];
  color: string;
  glowColor: string;
}

const tiers: PricingTier[] = [
  {
    name: 'STARTER',
    price: '₽2,999',
    features: ['Neural Interface', 'Basic Protocols', '10GB Storage', 'Email Support'],
    color: '#00f3ff',
    glowColor: 'rgba(0, 243, 255, 0.3)'
  },
  {
    name: 'PRO',
    price: '₽9,999',
    features: ['Advanced Neural Link', 'Quantum Protocols', '100GB Storage', 'Priority Support', 'API Access'],
    color: '#ff00ea',
    glowColor: 'rgba(255, 0, 234, 0.3)'
  },
  {
    name: 'ENTERPRISE',
    price: '₽29,999',
    features: ['Full Neural Integration', 'Unlimited Protocols', 'Unlimited Storage', '24/7 Support', 'Custom API', 'Dedicated Server'],
    color: '#00ff66',
    glowColor: 'rgba(0, 255, 102, 0.3)'
  }
];

export const LiquidPricing = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let rafId: number;
    const updateMousePosition = () => {
      cardRefs.current.forEach((card, index) => {
        if (card && hoveredTier === index) {
          const rect = card.getBoundingClientRect();
          const x = ((state.mouse.x - rect.left) / rect.width) * 100;
          const y = ((state.mouse.y - rect.top) / rect.height) * 100;
          card.style.setProperty('--mouse-x', `${x}%`);
          card.style.setProperty('--mouse-y', `${y}%`);
        }
      });
      rafId = requestAnimationFrame(updateMousePosition);
    };
    updateMousePosition();
    return () => cancelAnimationFrame(rafId);
  }, [hoveredTier]);

  const handleSelect = (index: number) => {
    setSelectedTier(index);
    setTimeout(() => setSelectedTier(null), 2000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-8 opacity-0 transition-opacity duration-1000"
      style={{ willChange: 'opacity' }}
    >
      <style>{`
        .visible { opacity: 1 !important; }
        
        .pricing-card {
          position: relative;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          --mouse-x: 50%;
          --mouse-y: 50%;
        }
        
        .pricing-card:hover {
          transform: translateY(-20px) scale(1.05);
          filter: url('#liquid-glass');
        }
        
        .pricing-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            var(--glow-color) 0%,
            transparent 60%
          );
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: -1;
        }
        
        .pricing-card:hover::before {
          opacity: 1;
        }
        
        .pricing-card.melting {
          animation: melt 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes melt {
          0% { filter: url('#liquid-glass'); transform: scale(1); }
          50% { filter: url('#liquid-glass'); transform: scale(0.95) translateY(10px); }
          100% { filter: none; transform: scale(1) translateY(0); }
        }
        
        .neon-text {
          text-shadow: 
            0 0 10px currentColor,
            0 0 20px currentColor,
            0 0 40px currentColor,
            0 0 80px currentColor;
          animation: neon-flicker 3s infinite alternate;
        }
        
        @keyframes neon-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .pulse-button {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .pulse-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, var(--btn-color) 0%, transparent 70%);
          opacity: 0;
          animation: pulse-ring 2s infinite;
        }
        
        .pulse-button:hover {
          transform: scale(1.1);
          box-shadow: 0 0 30px var(--btn-color);
        }
        
        .pulse-button.selected {
          animation: suck-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes suck-in {
          0% { transform: scale(1); }
          50% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .checkmark {
          animation: checkmark-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes checkmark-pop {
          0% { transform: scale(0) rotate(-45deg); }
          50% { transform: scale(1.2) rotate(-45deg); }
          100% { transform: scale(1) rotate(-45deg); }
        }
      `}</style>

      <div className="max-w-7xl w-full">
        <h2 className="text-6xl md:text-8xl font-display font-bold text-center mb-20 liquid-metal-text">
          PRICING MATRIX
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`pricing-card glass-panel rounded-3xl p-8 cursor-pointer interactive ${
                hoveredTier === index ? 'melting' : ''
              }`}
              style={{
                '--glow-color': tier.glowColor,
                '--btn-color': tier.color
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredTier(index)}
              onMouseLeave={() => setHoveredTier(null)}
            >
              <div className="text-center mb-8">
                <h3
                  className="text-3xl font-bold mb-4 neon-text"
                  style={{ color: tier.color }}
                >
                  {tier.name}
                </h3>
                <div className="text-6xl font-display font-bold mb-2">
                  {tier.price}
                </div>
                <div className="text-sm opacity-60">per month</div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, fIndex) => (
                  <li
                    key={fIndex}
                    className="flex items-center gap-3 text-sm"
                    style={{
                      animation: `fade-in-up 0.5s ease ${fIndex * 0.1}s both`
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tier.color, boxShadow: `0 0 10px ${tier.color}` }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`pulse-button w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  selectedTier === index ? 'selected' : ''
                }`}
                style={{
                  backgroundColor: `${tier.color}20`,
                  border: `2px solid ${tier.color}`,
                  color: tier.color
                }}
                onClick={() => handleSelect(index)}
              >
                {selectedTier === index ? (
                  <span className="checkmark inline-block">✓</span>
                ) : (
                  'SELECT PLAN'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};