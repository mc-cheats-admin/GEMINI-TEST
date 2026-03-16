import React, { useState } from 'react';

const projects = [
  { id: 1, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop' },
  { id: 2, img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' },
  { id: 3, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop' },
  { id: 4, img: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop' },
];

export const Gallery = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');

  const openModal = (img: string) => {
    setSelectedImg(img);
    setModalOpen(true);
    document.getElementById('scroll-container')?.classList.add('page-tear');
  };

  const closeModal = () => {
    setModalOpen(false);
    document.getElementById('scroll-container')?.classList.remove('page-tear');
  };

  return (
    <section className="py-16 min-h-screen relative z-10">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-display font-bold mb-16 text-center">ПРОЕКТЫ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map(p => (
            <div 
              key={p.id} 
              className="aspect-video relative overflow-hidden rounded-xl cursor-pointer rgb-split"
              onClick={() => openModal(p.img)}
              style={{ backgroundImage: `url(${p.img})` }}
            >
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
          <img src={selectedImg} alt="Project" className="relative z-10 max-w-4xl w-full rounded-2xl shadow-2xl animate-[scale-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]" />
        </div>
      )}
    </section>
  );
};
