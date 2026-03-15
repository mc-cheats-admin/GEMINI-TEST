import React, { useEffect, useRef } from 'react';
import { state } from '../store';

interface Point3D {
  x: number;
  y: number;
  z: number;
  originalX: number;
  originalY: number;
  originalZ: number;
  vx: number;
  vy: number;
  vz: number;
}

export const DataGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point3D[]>([]);
  const rotationRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const POINT_COUNT = 2000;
    const RADIUS = 200;
    const ROTATION_SPEED = 0.0005;
    const GRAVITY_STRENGTH = 0.3;
    const RETURN_FORCE = 0.05;
    const DAMPING = 0.95;

    // Generate sphere points using Fibonacci sphere algorithm
    const generateSphere = () => {
      const points: Point3D[] = [];
      const phi = Math.PI * (3 - Math.sqrt(5));

      for (let i = 0; i < POINT_COUNT; i++) {
        const y = 1 - (i / (POINT_COUNT - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        points.push({
          x: x * RADIUS,
          y: y * RADIUS,
          z: z * RADIUS,
          originalX: x * RADIUS,
          originalY: y * RADIUS,
          originalZ: z * RADIUS,
          vx: 0,
          vy: 0,
          vz: 0
        });
      }

      return points;
    };

    pointsRef.current = generateSphere();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener('resize', resize);

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(container);

    // Mouse hover detection
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      isHoveringRef.current = 
        mouseX >= 0 && mouseX <= rect.width && 
        mouseY >= 0 && mouseY <= rect.height;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    let animationId: number;
    const render = () => {
      if (!isVisibleRef.current) {
        animationId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Auto rotation
      rotationRef.current.y += ROTATION_SPEED * 60 * state.deltaTime;

      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);

      // Get mouse position relative to canvas
      const rect = canvas.getBoundingClientRect();
      const mouseX = state.mouse.x - rect.left;
      const mouseY = state.mouse.y - rect.top;

      // Sort points by Z for proper depth rendering
      const projectedPoints = pointsRef.current.map((point) => {
        // Apply gravity to cursor if hovering
        if (isHoveringRef.current) {
          const dx = mouseX - centerX;
          const dy = mouseY - centerY;
          
          // Project point to 2D first to calculate distance
          let rotatedX = point.x * cosY - point.z * sinY;
          let rotatedZ = point.x * sinY + point.z * cosY;
          let rotatedY = point.y * cosX - rotatedZ * sinX;
          
          const screenX = centerX + rotatedX;
          const screenY = centerY + rotatedY;
          
          const distX = dx - (screenX - centerX);
          const distY = dy - (screenY - centerY);
          const distance = Math.sqrt(distX * distX + distY * distY);
          
          if (distance < 150) {
            const force = (1 - distance / 150) * GRAVITY_STRENGTH;
            point.vx += distX * force * 0.01;
            point.vy += distY * force * 0.01;
          }
        }

        // Return force to original position
        point.vx += (point.originalX - point.x) * RETURN_FORCE;
        point.vy += (point.originalY - point.y) * RETURN_FORCE;
        point.vz += (point.originalZ - point.z) * RETURN_FORCE;

        // Apply velocity
        point.x += point.vx;
        point.y += point.vy;
        point.z += point.vz;

        // Damping
        point.vx *= DAMPING;
        point.vy *= DAMPING;
        point.vz *= DAMPING;

        // Rotate around Y axis
        let rotatedX = point.x * cosY - point.z * sinY;
        let rotatedZ = point.x * sinY + point.z * cosY;

        // Rotate around X axis
        let rotatedY = point.y * cosX - rotatedZ * sinX;
        rotatedZ = point.y * sinX + rotatedZ * cosX;

        // Perspective projection
        const perspective = 600;
        const scale = perspective / (perspective + rotatedZ);
        const x2d = centerX + rotatedX * scale;
        const y2d = centerY + rotatedY * scale;

        return { x: x2d, y: y2d, z: rotatedZ, scale };
      });

      projectedPoints.sort((a, b) => a.z - b.z);

      // Draw points
      projectedPoints.forEach(({ x, y, z, scale }) => {
        const size = Math.max(1, 2 * scale);
        const brightness = Math.max(0.2, Math.min(1, (z + RADIUS) / (RADIUS * 2)));
        
        ctx.fillStyle = `rgba(0, 243, 255, ${brightness * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect for closer points
        if (brightness > 0.7) {
          ctx.fillStyle = `rgba(0, 243, 255, ${(brightness - 0.7) * 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ cursor: 'none' }}
        />
      </div>
      
      <div className="relative z-10 text-center pointer-events-none">
        <h2 className="text-6xl md:text-8xl font-display liquid-metal-text mb-6">
          Data Globe
        </h2>
        <p className="text-xl md:text-2xl text-white/60 font-sans max-w-2xl mx-auto px-4">
          Интерактивная матрица данных. Наведите курсор, чтобы исказить гравитацию.
        </p>
      </div>
    </section>
  );
};