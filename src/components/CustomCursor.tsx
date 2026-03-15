import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isView, setIsView] = useState(false);

  // Use refs for positions to avoid re-renders
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Update dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for view mode (gallery items)
      if (target.closest('.gallery-item')) {
        setIsView(true);
        setIsHovering(false);
        setIsText(false);
        return;
      }
      setIsView(false);

      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive')
      ) {
        setIsHovering(true);
        setIsText(false);
      } else if (
        target.tagName.toLowerCase() === 'p' ||
        target.tagName.toLowerCase() === 'h1' ||
        target.tagName.toLowerCase() === 'h2' ||
        target.tagName.toLowerCase() === 'h3' ||
        target.tagName.toLowerCase() === 'span'
      ) {
        setIsText(true);
        setIsHovering(false);
      } else {
        setIsHovering(false);
        setIsText(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // Lerp animation loop
    let animationFrameId: number;
    const render = () => {
      // Lerp factor (lower = smoother/slower)
      const lerpFactor = 0.15;
      
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * lerpFactor;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * lerpFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'auto';
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Dot - follows instantly */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference will-change-transform"
        style={{ opacity: isView ? 0 : 1 }}
      />
      
      {/* Outline - follows with lerp */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center will-change-transform transition-[width,height,background-color] duration-300 ease-out ${
          isView 
            ? 'w-24 h-24 bg-white text-black' 
            : isHovering 
              ? 'w-16 h-16 bg-white/20 border border-white' 
              : isText 
                ? 'w-1 h-8 bg-white rounded-sm' 
                : 'w-10 h-10 border border-white'
        }`}
      >
        {isView && <span className="text-xs font-display font-bold tracking-widest">VIEW</span>}
      </div>
    </>
  );
};
