import { useEffect, useRef } from 'react';
import { scrollEngine } from '../utils/scrollEngine';

interface ScrollEngineProps {
  children: React.ReactNode;
}

export const ScrollEngine = ({ children }: ScrollEngineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      scrollEngine.init(containerRef.current);
    }

    return () => {
      scrollEngine.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} id="scroll-container">
      {children}
    </div>
  );
};