import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Contact = () => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.2 });
  const [formState, setFormState] = useState({ name: '', email: '', subject: 'design', message: '' });
  const [errors, setErrors] = useState({ name: false, email: false, message: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors = {
      name: formState.name.length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email),
      message: formState.message.length < 10
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormState({ name: '', email: '', subject: 'design', message: '' });
        }, 3000);
      }, 2000);
    }
  };

  return (
    <section id="контакты" className="py-32 relative z-10" ref={ref}>
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-20">
          <h2 className={`text-4xl md:text-6xl font-display font-bold tracking-widest mb-6 transition-all duration-1000 ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <span className="relative inline-block overflow-hidden">
              <span className={`block transition-transform duration-1000 ease-out ${hasIntersected ? 'translate-y-0' : 'translate-y-full'}`}>
                СВЯЗАТЬСЯ С НАМИ
              </span>
              <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-neon-blue)] transition-transform duration-1000 delay-500 ${hasIntersected ? 'translate-x-0' : '-translate-x-full'}`}></span>
            </span>
          </h2>
          <p className="text-white/70 font-sans font-light max-w-2xl mx-auto">
            Готовы начать свой путь в цифровую вселенную? Оставьте сообщение, и наши специалисты свяжутся с вами.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
          
          {/* Form */}
          <div className={`w-full lg:w-2/3 glass-panel p-8 md:p-12 rounded-3xl transition-all duration-1000 delay-300 ${hasIntersected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`input-group ${errors.name ? 'shake' : ''}`}>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                  />
                  <label htmlFor="name">Ваше имя</label>
                  <div className="absolute bottom-0 left-0 h-[1px] bg-[var(--color-neon-blue)] w-0 transition-all duration-500 peer-focus:w-full"></div>
                </div>
                
                <div className={`input-group ${errors.email ? 'shake' : ''}`}>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                  />
                  <label htmlFor="email">Email адрес</label>
                  <div className="absolute bottom-0 left-0 h-[1px] bg-[var(--color-neon-blue)] w-0 transition-all duration-500 peer-focus:w-full"></div>
                </div>
              </div>

              <div className="input-group mb-8">
                <select 
                  id="subject" 
                  className="w-full bg-transparent border-b border-white/30 text-white py-3 outline-none focus:border-[var(--color-neon-blue)] transition-colors appearance-none cursor-pointer"
                  value={formState.subject}
                  onChange={(e) => setFormState({...formState, subject: e.target.value})}
                >
                  <option value="design" className="bg-[var(--color-dark-bg)]">Дизайн интерфейсов</option>
                  <option value="dev" className="bg-[var(--color-dark-bg)]">Разработка системы</option>
                  <option value="3d" className="bg-[var(--color-dark-bg)]">3D моделирование</option>
                  <option value="other" className="bg-[var(--color-dark-bg)]">Другой вопрос</option>
                </select>
                <div className="absolute right-0 top-4 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              <div className={`input-group ${errors.message ? 'shake' : ''}`}>
                <textarea 
                  id="message" 
                  rows={4} 
                  required 
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                ></textarea>
                <label htmlFor="message">Ваше сообщение</label>
                <div className="absolute bottom-[30px] left-0 h-[1px] bg-[var(--color-neon-blue)] w-0 transition-all duration-500 peer-focus:w-full"></div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || isSuccess}
                className={`relative overflow-hidden flex items-center justify-center font-display font-bold tracking-widest uppercase transition-all duration-500 ${
                  isSuccess ? 'w-16 h-16 rounded-full bg-green-500 text-white' : 
                  isSubmitting ? 'w-16 h-16 rounded-full bg-transparent border-2 border-[var(--color-neon-blue)]' : 
                  'w-full md:w-auto px-12 py-4 rounded-lg bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-pink)] text-white hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]'
                }`}
              >
                {isSuccess ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-[scale-in_0.3s_ease-out]"><path d="M20 6 9 17l-5-5"/></svg>
                ) : isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="relative z-10">Отправить запрос</span>
                )}
                
                {!isSuccess && !isSubmitting && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-pink)] to-[var(--color-neon-blue)] opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className={`w-full lg:w-1/3 flex flex-col justify-between transition-all duration-1000 delay-500 ${hasIntersected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="space-y-10">
              <div className="flex items-start space-x-6 group">
                <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-[var(--color-neon-blue)]/20 group-hover:border-[var(--color-neon-blue)] transition-all duration-300">
                  <Mail className="text-[var(--color-neon-blue)] group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-sm font-display tracking-widest text-white/50 uppercase mb-1">Email</h4>
                  <a href="mailto:hello@universe.digital" className="text-xl font-sans text-white hover:text-[var(--color-neon-blue)] transition-colors">hello@universe.digital</a>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-[var(--color-neon-pink)]/20 group-hover:border-[var(--color-neon-pink)] transition-all duration-300">
                  <Phone className="text-[var(--color-neon-pink)] group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-sm font-display tracking-widest text-white/50 uppercase mb-1">Телефон</h4>
                  <a href="tel:+1234567890" className="text-xl font-sans text-white hover:text-[var(--color-neon-pink)] transition-colors">+1 (234) 567-890</a>
                </div>
              </div>

              <div className="flex items-start space-x-6 group">
                <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-[var(--color-neon-green)]/20 group-hover:border-[var(--color-neon-green)] transition-all duration-300">
                  <MapPin className="text-[var(--color-neon-green)] group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-sm font-display tracking-widest text-white/50 uppercase mb-1">Офис</h4>
                  <p className="text-xl font-sans text-white">Кибер-сити, Сектор 7, Уровень 42</p>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h4 className="text-sm font-display tracking-widest text-white/50 uppercase mb-6">Социальные сети</h4>
              <div className="flex space-x-4">
                {['TW', 'IN', 'GH', 'DB'].map((social, i) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-display font-bold text-white hover:bg-white hover:text-black hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)] transition-all duration-300"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
