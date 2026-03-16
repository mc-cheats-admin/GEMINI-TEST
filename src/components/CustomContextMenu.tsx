import React, { useEffect, useState } from 'react';

export const CustomContextMenu = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => setVisible(false);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="fixed z-ui bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-2 min-w-[200px] shadow-2xl"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="text-xs font-mono text-white/40 px-3 py-2 uppercase tracking-widest border-b border-white/5 mb-1">
        System Menu
      </div>
      {['Initialize Sequence', 'Purge Cache', 'Analyze Render', 'Exit Protocol'].map((item, i) => (
        <button 
          key={i}
          className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors font-sans"
        >
          {item}
        </button>
      ))}
    </div>
  );
};
