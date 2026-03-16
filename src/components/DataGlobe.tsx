import React, { useEffect, useRef } from 'react';
import { engine } from '../engine/Engine';
import { state } from '../store';

export const DataGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isHovering: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    
    let width = 0;
    let height = 0;
    const points: { x: number, y: number, z: number, ox: number, oy: number, oz: number, vx: number, vy: number, vz: number }[] = [];
    
    const initPoints = () => {
      points.length = 0;
      const numPoints = 1000;
      const radius = Math.min(width, height) * 0.3;
      
      for (let i = 0; i < numPoints; i++) {
        const phi = Math.acos(-1 + (2 * i) / numPoints);
        const theta = Math.sqrt(numPoints * Math.PI) * phi;
        
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        
        points.push({ x, y, z, ox: x, oy: y, oz: z, vx: 0, vy: 0, vz: 0 });
      }
    };

    let initialTop = 0;
    const updateRect = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      initPoints();

      let el: HTMLElement | null = parent;
      let top = 0;
      while (el && el.id !== 'scroll-container') {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement;
      }
      initialTop = top;
    };
    updateRect();
    const ro = new ResizeObserver(updateRect);
    ro.observe(canvas.parentElement!);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left - width / 2;
      mouseRef.current.y = e.clientY - rect.top - height / 2;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', () => mouseRef.current.isHovering = true);
    canvas.addEventListener('mouseleave', () => mouseRef.current.isHovering = false);

    let time = 0;
    const module = {
      update: (dt: number) => {
        const currentY = initialTop - state.scroll.y;
        if (currentY > window.innerHeight || currentY < -height) return;

        time += dt * 0.001;
        ctx.clearRect(0, 0, width, height);
        
        const cx = width / 2;
        const cy = height / 2;
        
        const rotX = time * 0.2;
        const rotY = time * 0.3;

        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

        ctx.fillStyle = 'rgba(0, 243, 255, 0.8)';

        points.forEach(p => {
          // Gravity to mouse
          if (mouseRef.current.isHovering) {
            const dx = mouseRef.current.x - p.x;
            const dy = mouseRef.current.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
              p.vx += (dx / dist) * 0.5;
              p.vy += (dy / dist) * 0.5;
            }
          }
          
          // Spring back
          p.vx += (p.ox - p.x) * 0.05;
          p.vy += (p.oy - p.y) * 0.05;
          p.vz += (p.oz - p.z) * 0.05;
          
          p.vx *= 0.9;
          p.vy *= 0.9;
          p.vz *= 0.9;
          
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Rotate
          const x1 = p.x * cosY - p.z * sinY;
          const z1 = p.z * cosY + p.x * sinY;
          const y2 = p.y * cosX - z1 * sinX;
          const z2 = z1 * cosX + p.y * sinX;

          const scale = 400 / (400 + z2);
          const px = cx + x1 * scale;
          const py = cy + y2 * scale;

          if (z2 > -200) {
            ctx.beginPath();
            ctx.arc(px, py, 1.5 * scale, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    };
    engine.register(module);
    
    return () => {
      engine.unregister(module);
      ro.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', () => mouseRef.current.isHovering = true);
      canvas.removeEventListener('mouseleave', () => mouseRef.current.isHovering = false);
    };
  }, []);

  return (
    <section className="h-screen relative flex items-center justify-center">
      <div className="absolute inset-0 w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="relative z-10 pointer-events-none text-center">
        <h2 className="text-5xl font-display font-black text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">DATA MATRIX</h2>
        <p className="font-mono text-[var(--color-neon-blue)] mt-4 opacity-80">INTERACT TO DISRUPT</p>
      </div>
    </section>
  );
};
