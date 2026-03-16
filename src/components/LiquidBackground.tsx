import React, { useEffect, useRef } from 'react';
import { WebGLBackground } from '../engine/WebGLBackground';
import { engine } from '../engine/Engine';

export const LiquidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const bg = new WebGLBackground(canvasRef.current);
    
    const module = {
      update: (dt: number, time: number) => {
        bg.update(dt, time);
      }
    };
    
    engine.register(module);
    return () => engine.unregister(module);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-10"
      style={{ filter: 'contrast(1.2)' }}
    />
  );
};
