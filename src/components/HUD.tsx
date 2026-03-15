import React, { useEffect, useState } from 'react';

export const HUD = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')}`);
    };
    const interval = setInterval(updateTime, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-difference">
      {/* Borders */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-white/30"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-white/30"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-white/30"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-white/30"></div>

      {/* Top Info */}
      <div className="absolute top-6 left-24 font-mono text-[10px] text-white/50 tracking-widest uppercase">
        SYS.CORE.V9 <br/>
        STATUS: ONLINE
      </div>
      <div className="absolute top-6 right-24 font-mono text-[10px] text-white/50 tracking-widest text-right">
        {time} <br/>
        LAT: 47.6062° N, LON: 122.3321° W
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-6 left-24 font-mono text-[10px] text-white/50 tracking-widest">
        MEM: 0x8F3A2B <br/>
        CPU: 12%
      </div>
      <div className="absolute bottom-6 right-24 font-mono text-[10px] text-white/50 tracking-widest text-right">
        SCROLL VELOCITY: AUTO <br/>
        LIQUID CHROME: ACTIVE
      </div>

      {/* Scanning Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-[scan_8s_linear_infinite]"></div>
    </div>
  );
};
