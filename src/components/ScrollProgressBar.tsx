import React, { useEffect, useRef } from 'react';
import { state } from '../store';

export const ScrollProgressBar: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropRef = useRef({
    y: 0,
    velocity: 0,
    targetY: 0,
    gravity: 0.5,
    bounce: 0.6,
    trail: [] as { x: number; y: number; opacity: number }[]
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = 4;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let rafId: number;
    const animate = () => {
      const progress = state.scroll.limit > 0 ? state.scroll.y / state.scroll.limit : 0;
      const drop = dropRef.current;

      drop.targetY = progress * canvas.height;

      const distance = drop.targetY - drop.y;
      drop.velocity += drop.gravity;
      drop.velocity += distance * 0.02;
      drop.y += drop.velocity;

      if (drop.y > canvas.height) {
        drop.y = canvas.height;
        drop.velocity *= -drop.bounce;
      }
      if (drop.y < 0) {
        drop.y = 0;
        drop.velocity *= -drop.bounce;
      }

      drop.velocity *= 0.95;

      drop.trail.unshift({ x: 2, y: drop.y, opacity: 1 });
      if (drop.trail.length > 15) drop.trail.pop();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(2, 0);
      ctx.lineTo(2, canvas.height);
      ctx.stroke();

      drop.trail.forEach((point, i) => {
        point.opacity *= 0.92;
        const size = 3 - i * 0.15;
        ctx.fillStyle = `rgba(0, 243, 255, ${point.opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      const gradient = ctx.createRadialGradient(2, drop.y, 0, 2, drop.y, 8);
      gradient.addColorStop(0, 'rgba(0, 243, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(0, 243, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(0, 243, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(2, drop.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f3ff';
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(2, drop.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed left-0 top-0 pointer-events-none"
      style={{ zIndex: 100 }}
    />
  );
};