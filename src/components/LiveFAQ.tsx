import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Как работает технология жидкого стекла?",
    answer: "Наша технология использует передовые алгоритмы рендеринга и WebGL шейдеры для создания эффекта преломления света через жидкую среду. Каждый пиксель обрабатывается в реальном времени, создавая уникальный визуальный опыт."
  },
  {
    question: "Какие требования к системе?",
    answer: "Для оптимальной работы рекомендуется современный браузер с поддержкой WebGL 2.0, минимум 8GB RAM и дискретная видеокарта. Мобильные устройства поддерживаются с адаптивным качеством рендеринга."
  },
  {
    question: "Можно ли кастомизировать интерфейс?",
    answer: "Абсолютно. Система предоставляет полный контроль над визуальными параметрами: цветовые схемы, интенсивность эффектов, скорость анимаций и многое другое через API конфигурации."
  },
  {
    question: "Как обрабатываются данные пользователя?",
    answer: "Все данные обрабатываются локально в браузере. Мы используем end-to-end шифрование для любых передаваемых данных. Никакая информация не хранится на серверах без явного согласия пользователя."
  },
  {
    question: "Доступна ли техническая поддержка?",
    answer: "Да, мы предоставляем круглосуточную техническую поддержку через множество каналов: live chat, email, Discord сообщество и приоритетную линию для enterprise клиентов."
  }
];

export function LiveFAQ() {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.2 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setAnimatingIndex(index);
      setTimeout(() => {
        setOpenIndex(index);
        setAnimatingIndex(null);
      }, 300);
    }
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen flex items-center justify-center py-32 px-6"
      style={{ opacity: hasIntersected ? 1 : 0, transition: 'opacity 1s ease' }}
    >
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="faq-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="gooey"
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
          <filter id="faq-liquid">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="3"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="max-w-4xl w-full">
        <h2
          className="text-6xl md:text-8xl font-display font-bold text-center mb-20 liquid-metal-text"
          style={{
            opacity: hasIntersected ? 1 : 0,
            transform: hasIntersected ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          FAQ
        </h2>

        <div className="space-y-0">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            const isAnimating = animatingIndex === index;

            return (
              <div
                key={index}
                className="relative"
                style={{
                  opacity: hasIntersected ? 1 : 0,
                  transform: hasIntersected ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`
                }}
              >
                {/* Gooey Divider Line */}
                {index > 0 && (
                  <div
                    className="relative h-px my-0 overflow-visible"
                    style={{
                      filter: isAnimating ? 'url(#faq-gooey)' : 'none',
                      transition: 'filter 0.3s ease'
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{
                        transform: isAnimating ? 'scaleY(8)' : 'scaleY(1)',
                        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transformOrigin: 'center'
                      }}
                    />
                  </div>
                )}

                {/* Question Button */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full text-left py-8 px-6 group cursor-pointer relative overflow-hidden"
                  style={{
                    background: isOpen
                      ? 'linear-gradient(135deg, rgba(0,243,255,0.05) 0%, rgba(255,0,234,0.05) 100%)'
                      : 'transparent',
                    transition: 'background 0.5s ease'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl md:text-3xl font-sans font-medium text-white/90 group-hover:text-white transition-colors pr-8">
                      {item.question}
                    </h3>
                    <div
                      className="relative w-12 h-12 flex-shrink-0"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    >
                      <div className="absolute inset-0 rounded-full border border-white/30 group-hover:border-white/60 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-white/80 rounded-full" />
                        <div
                          className="absolute w-0.5 h-6 bg-white/80 rounded-full"
                          style={{
                            opacity: isOpen ? 0 : 1,
                            transition: 'opacity 0.3s ease'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,243,255,0.1), transparent 60%)'
                    }}
                  />
                </button>

                {/* Answer Container with Liquid Flow Effect */}
                <div
                  className="overflow-hidden"
                  style={{
                    maxHeight: isOpen ? '500px' : '0px',
                    transition: 'max-height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    filter: isOpen ? 'url(#faq-liquid)' : 'none'
                  }}
                >
                  <div
                    className="px-6 pb-8 pt-2"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(-20px)',
                      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s'
                    }}
                  >
                    <div className="glass-panel p-8 rounded-2xl">
                      <p className="text-lg md:text-xl text-white/70 leading-relaxed font-sans">
                        {item.answer}
                      </p>
                      {/* Liquid Drip Effect */}
                      <div
                        className="mt-6 h-1 rounded-full bg-gradient-to-r from-cyan-400/50 via-pink-400/50 to-transparent"
                        style={{
                          width: isOpen ? '100%' : '0%',
                          transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Decoration */}
        <div
          className="mt-20 flex justify-center"
          style={{
            opacity: hasIntersected ? 1 : 0,
            transition: 'opacity 1.5s ease 1s'
          }}
        >
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}