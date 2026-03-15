import React, { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isText, setIsText] = useState(false);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      
      const isClickable = target.tagName.toLowerCase() === 'a' || 
                          target.tagName.toLowerCase() === 'button' || 
                          target.closest('a') || 
                          target.closest('button');
      
      const isTextNode = target.tagName.toLowerCase() === 'p' || 
                         target.tagName.toLowerCase() === 'h1' || 
                         target.tagName.toLowerCase() === 'h2' || 
                         target.tagName.toLowerCase() === 'h3' || 
                         target.tagName.toLowerCase() === 'span';

      setHovered(!!isClickable);
      setIsText(!!isTextNode && !isClickable);
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null;
  }

  return (
    <div className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${hovered ? 'cursor-hover' : ''} ${isText ? 'cursor-text' : ''}`}>
      <div 
        className="cursor-dot" 
        style={{ left: `${position.x}px`, top: `${position.y}px`, opacity: hovered ? 0 : 1 }}
      />
      <div 
        className="cursor-outline" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${clicked ? 0.8 : 1})`,
          transition: 'transform 0.1s, width 0.2s, height 0.2s, background-color 0.2s'
        }}
      />
    </div>
  );
};
