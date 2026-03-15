import React, { useEffect, useRef } from 'react';
import { state } from './store';
import { WebGLBackground } from './components/WebGLBackground';
import { ScrollEngine } from './components/ScrollEngine';
import { CustomContextMenu } from './components/CustomContextMenu';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Cursor } from './components/Cursor';
import { Hero } from './components/Hero';
import { Rolodex } from './components/Rolodex';
import { Cylinder } from './components/Cylinder';
import { Gallery } from './components/Gallery';
import { SpiralTimeline } from './components/SpiralTimeline';
import { Testimonials } from './components/Testimonials';
import { Tesseract } from './components/Tesseract';
import { HUD } from './components/HUD';
import { Marquee } from './components/Marquee';
import { FloatingElements } from './components/FloatingElements';
import { VelocityMarquee } from './components/VelocityMarquee';
import { DataGlobe } from './components/DataGlobe';
import { LiquidPricing } from './components/LiquidPricing';
import { LiveFAQ } from './components/LiveFAQ';

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollEngineRef = useRef<any>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    // Initialize Scroll Engine
    if (scrollRef.current) {
      try {
        scrollEngineRef.current = new ScrollEngine(scrollRef.current);
      } catch (error) {
        console.error('ScrollEngine initialization failed:', error);
      }
    }

    const handleResize = () => {
      state.viewport.w = window.innerWidth;
      state.viewport.h = window.innerHeight;
      if (scrollRef.current) {
        state.scroll.limit = Math.max(0, scrollRef.current.scrollHeight - window.innerHeight);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      state.mouse.targetX = e.clientX;
      state.mouse.targetY = e.clientY;
      
      const target = e.target as HTMLElement;
      state.mouse.isHovering = !!target.closest('.interactive, a, button, .cursor-pointer');
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    setTimeout(handleResize, 100);

    // Main Render Loop - Single RAF
    let rafId: number;
    const mainLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      state.deltaTime = deltaTime;

      // Update scroll engine
      if (scrollEngineRef.current) {
        try {
          scrollEngineRef.current.update(deltaTime);
        } catch (error) {
          console.error('ScrollEngine update failed:', error);
        }
      }

      // Update mouse lerp
      const prevMouseX = state.mouse.x;
      const prevMouseY = state.mouse.y;
      state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.15;
      state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.15;
      
      const dx = state.mouse.x - prevMouseX;
      const dy = state.mouse.y - prevMouseY;
      state.mouse.velocity = Math.sqrt(dx * dx + dy * dy);

      rafId = requestAnimationFrame(mainLoop);
    };
    mainLoop(performance.now());

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      if (scrollEngineRef.current) {
        try {
          scrollEngineRef.current.destroy();
        } catch (error) {
          console.error('ScrollEngine destroy failed:', error);
        }
      }
    };
  }, []);

  return (
    <>
      <WebGLBackground />
      <FloatingElements />
      <div className="noise"></div>
      <HUD />
      <ScrollProgressBar />
      <CustomContextMenu />
      
      <svg className="gooey-filter">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
          <filter id="liquid-glass">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="20" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <Cursor />

      <div id="scroll-container" ref={scrollRef}>
        <Hero />
        <Marquee text="LIQUID METAL • NEURAL INTERFACE • QUANTUM CORE • " />
        <Rolodex />
        <VelocityMarquee text="VELOCITY • KINETIC • MOTION • " />
        <Marquee text="SYSTEM OVERRIDE • DATA STREAM • VIRTUAL REALITY • " reverse />
        <Cylinder />
        <DataGlobe />
        <Gallery />
        <Marquee text="TIME DILATION • CHRONOS PROTOCOL • EVENT HORIZON • " />
        <SpiralTimeline />
        <LiquidPricing />
        <Testimonials />
        <LiveFAQ />
        <Tesseract />
      </div>
    </>
  );
}