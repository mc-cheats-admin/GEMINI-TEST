import React, { useRef, useEffect } from 'react';
import { engine } from '../engine/Engine';
import { state } from '../store';

export const InteractiveMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let initialTop = 0;

    const resize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      let el: HTMLElement | null = containerRef.current;
      let top = 0;
      while (el && el.id !== 'scroll-container') {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement;
      }
      initialTop = top;
    };

    window.addEventListener('resize', resize);
    setTimeout(resize, 100);

    const points: { x: number, y: number, z: number, baseZ: number }[] = [];
    const cols = 20;
    const rows = 20;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        points.push({
          x: (i / (cols - 1)) * 2 - 1,
          y: (j / (rows - 1)) * 2 - 1,
          z: 0,
          baseZ: Math.random() * 0.2
        });
      }
    }

    const module = {
      update: (dt: number, time: number) => {
        if (!containerRef.current) return;
        const currentY = initialTop - state.scroll.y;
        
        // Only render if visible
        if (currentY > window.innerHeight || currentY < -height) return;

        ctx.clearRect(0, 0, width, height);
        
        const mouseX = (state.mouse.x / window.innerWidth) * 2 - 1;
        const mouseY = ((state.mouse.y - currentY) / height) * 2 - 1;

        ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        points.forEach((p, i) => {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          p.z = p.baseZ + Math.sin(time * 0.002 + p.x * 5 + p.y * 5) * 0.1;
          if (dist < 0.5) {
            p.z -= (0.5 - dist) * 0.5;
          }

          // Project 3D to 2D
          const perspective = 800;
          const z = p.z * 200 + 400;
          const scale = perspective / (perspective + z);
          
          const screenX = width / 2 + p.x * width * 0.4 * scale;
          const screenY = height / 2 + p.y * height * 0.4 * scale + (currentY * 0.2); // Parallax

          // Draw lines to neighbors
          if (i % rows !== rows - 1) {
            const p2 = points[i + 1];
            const z2 = p2.z * 200 + 400;
            const scale2 = perspective / (perspective + z2);
            const screenX2 = width / 2 + p2.x * width * 0.4 * scale2;
            const screenY2 = height / 2 + p2.y * height * 0.4 * scale2 + (currentY * 0.2);
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(screenX2, screenY2);
          }
          if (i < points.length - rows) {
            const p2 = points[i + rows];
            const z2 = p2.z * 200 + 400;
            const scale2 = perspective / (perspective + z2);
            const screenX2 = width / 2 + p2.x * width * 0.4 * scale2;
            const screenY2 = height / 2 + p2.y * height * 0.4 * scale2 + (currentY * 0.2);
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(screenX2, screenY2);
          }
        });
        ctx.stroke();

        // Draw points
        points.forEach((p, i) => {
          const perspective = 800;
          const z = p.z * 200 + 400;
          const scale = perspective / (perspective + z);
          const screenX = width / 2 + p.x * width * 0.4 * scale;
          const screenY = height / 2 + p.y * height * 0.4 * scale + (currentY * 0.2);

          ctx.beginPath();
          ctx.arc(screenX, screenY, 2 * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 243, 255, ${0.1 + scale * 0.5})`;
          ctx.fill();
        });
      }
    };

    engine.register(module);
    return () => {
      engine.unregister(module);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section ref={containerRef} className="h-screen relative z-content overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-5xl md:text-8xl font-display font-black text-white/10 uppercase tracking-tighter mix-blend-overlay">
          TOPOLOGY
        </h2>
      </div>
    </section>
  );
};
