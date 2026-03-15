import React, { useEffect, useState, useRef } from 'react';
import { state } from '../store';

interface MenuItem {
  label: string;
  action: () => void;
  icon?: string;
}

export function CustomContextMenu() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      
      const x = Math.min(e.clientX, window.innerWidth - 220);
      const y = Math.min(e.clientY, window.innerHeight - 200);
      
      setPosition({ x, y });
      setVisible(true);
    };

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    const handleScroll = () => {
      setVisible(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const menuItems: MenuItem[] = [
    {
      label: 'Скопировать ссылку',
      icon: '🔗',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        setVisible(false);
      }
    },
    {
      label: state.audio.enabled ? 'Выключить звук' : 'Включить звук',
      icon: state.audio.enabled ? '🔇' : '🔊',
      action: () => {
        state.audio.enabled = !state.audio.enabled;
        setVisible(false);
      }
    },
    {
      label: 'Назад',
      icon: '←',
      action: () => {
        window.history.back();
        setVisible(false);
      }
    }
  ];

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[10000] pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        animation: 'contextMenuAppear 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <div className="glass-panel rounded-lg overflow-hidden min-w-[200px] shadow-2xl border border-white/20"
           style={{ filter: 'url(#liquid-glass)' }}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full px-4 py-3 text-left text-white/90 hover:bg-white/10 transition-all duration-200 flex items-center gap-3 cursor-pointer interactive"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              borderBottom: index < menuItems.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      
      <style>{`
        @keyframes contextMenuAppear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}