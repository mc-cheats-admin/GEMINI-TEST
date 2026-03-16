import React, { useEffect, useRef } from 'react';
import { engine } from './engine/Engine';
import { scrollEngine } from './engine/ScrollEngine';
import { LiquidBackground } from './components/LiquidBackground';
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
import { CodeSnippet } from './components/CodeSnippet';
import { StatsSection } from './components/StatsSection';
import { InteractiveMap } from './components/InteractiveMap';
import { FeatureGrid } from './components/FeatureGrid';
import { AccordionFAQ } from './components/AccordionFAQ';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { CustomContextMenu } from './components/CustomContextMenu';
import { audioManager } from './engine/AudioManager';

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollEngine.setContainer(scrollRef.current);
    }

    const handleInteraction = () => {
      audioManager.init();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    const handleMouseMove = (e: MouseEvent) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    engine.start();

    return () => {
      engine.stop();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <LiquidBackground />
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
          <filter id="liquid-glass-filter" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <Cursor />

      <div id="scroll-container" ref={scrollRef} className="will-change-transform">
        <Hero />
        <VelocityMarquee text="LIQUID METAL • NEURAL INTERFACE • QUANTUM CORE • " />
        <FeatureGrid />
        <Rolodex />
        <DataGlobe />
        <InteractiveMap />
        <VelocityMarquee text="SYSTEM OVERRIDE • DATA STREAM • VIRTUAL REALITY • " />
        <Cylinder />
        <StatsSection />
        <Gallery />
        <CodeSnippet />
        <LiquidPricing />
        <SpiralTimeline />
        <AccordionFAQ />
        <Testimonials />
        <Tesseract />
      </div>
    </>
  );
}
