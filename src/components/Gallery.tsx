import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { X } from 'lucide-react';

const categories = ['Все', 'Дизайн', 'Разработка', '3D', 'Анимация'];

const projects = [
  { id: 1, title: 'Нейро-Интерфейс', category: 'Дизайн', desc: 'Концепт интерфейса прямого подключения мозга к сети.', color: 'from-blue-500 to-purple-600', tags: ['UI/UX', 'Figma', 'Prototyping'] },
  { id: 2, title: 'Квантовый Движок', category: 'Разработка', desc: 'Высокопроизводительный движок для симуляции физики.', color: 'from-green-400 to-cyan-500', tags: ['C++', 'WebAssembly', 'WebGL'] },
  { id: 3, title: 'Голографический Город', category: '3D', desc: 'Модель мегаполиса будущего в реальном времени.', color: 'from-pink-500 to-rose-500', tags: ['Blender', 'Three.js', 'Shaders'] },
  { id: 4, title: 'Поток Данных', category: 'Анимация', desc: 'Визуализация глобальных информационных потоков.', color: 'from-yellow-400 to-orange-500', tags: ['After Effects', 'Lottie', 'SVG'] },
  { id: 5, title: 'Кибер-Щит', category: 'Разработка', desc: 'Система активной защиты от цифровых угроз.', color: 'from-indigo-500 to-blue-600', tags: ['Rust', 'Security', 'AI'] },
  { id: 6, title: 'Синтез Речи', category: 'Анимация', desc: 'Генерация реалистичной мимики по аудио.', color: 'from-teal-400 to-emerald-500', tags: ['Machine Learning', 'Python', 'React'] },
  { id: 7, title: 'Архитектура Сети', category: 'Дизайн', desc: 'Топология децентрализованной паутины.', color: 'from-fuchsia-500 to-pink-600', tags: ['Data Viz', 'D3.js', 'Design'] },
  { id: 8, title: 'Мета-Аватар', category: '3D', desc: 'Создание цифрового двойника высокой точности.', color: 'from-violet-500 to-purple-600', tags: ['Unreal Engine', 'Motion Capture', '3D'] },
];

export const Gallery = () => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState('Все');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = activeCategory === 'Все' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="галерея" className="py-32 relative z-10" ref={ref}>
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-6xl font-display font-bold tracking-widest mb-12 transition-all duration-1000 ${hasIntersected ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            ГАЛЕРЕЯ
            <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-pink)] mx-auto mt-4 rounded-full"></div>
          </h2>

          <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-300 ${hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-sans text-sm tracking-wider transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-[var(--color-neon-blue)] text-black shadow-[0_0_15px_var(--color-neon-blue)]' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,243,255,0.2)] ${hasIntersected ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80 group-hover:scale-110 transition-transform duration-700`}></div>
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-xl font-display font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h3>
                <p className="text-sm font-sans text-white/80 mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">{project.desc}</p>
                <div className="mt-4 flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                  <span className="text-xs font-mono bg-white/20 px-2 py-1 rounded text-white backdrop-blur-sm">Развернуть</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedProject(null)}></div>
          
          <div className="relative w-full max-w-5xl h-[80vh] bg-[var(--color-dark-bg)] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-[fade-in-up_0.4s_ease-out_forwards]">
            
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-[var(--color-neon-pink)] text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X size={24} />
            </button>

            <div className={`w-full md:w-1/2 h-64 md:h-full bg-gradient-to-br ${selectedProject.color} relative`}>
              <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
              {/* Decorative elements in modal image area */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-48 h-48 border border-white rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                <div className="w-32 h-32 border border-white rounded-full absolute animate-spin" style={{ animationDuration: '10s' }}></div>
              </div>
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/5 backdrop-blur-md overflow-y-auto">
              <div className="text-[var(--color-neon-blue)] font-mono text-sm tracking-widest uppercase mb-4">{selectedProject.category}</div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">{selectedProject.title}</h2>
              <p className="text-lg text-white/70 font-sans font-light leading-relaxed mb-8">
                {selectedProject.desc}
                <br/><br/>
                Этот проект демонстрирует передовые подходы в создании цифровых продуктов. 
                Мы использовали инновационные алгоритмы и нестандартные решения для достижения максимальной производительности и визуального качества.
              </p>
              
              <div className="mb-10">
                <h4 className="text-sm font-display tracking-widest text-white/50 uppercase mb-4">Технологии</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-sans text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button className="self-start px-8 py-4 bg-[var(--color-neon-blue)] text-black font-display font-bold tracking-widest uppercase rounded-lg hover:bg-white hover:shadow-[0_0_20px_var(--color-neon-blue)] transition-all duration-300">
                Смотреть проект
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
