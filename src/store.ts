import { engine } from './engine/Engine';
import { scrollEngine } from './engine/ScrollEngine';
import { lerp } from './utils/math';

export const state = {
  scroll: { y: 0, target: 0, velocity: 0, limit: 0 },
  mouse: { x: 0, y: 0, targetX: 0, targetY: 0, velocity: 0, isHovering: false },
  viewport: { w: window.innerWidth, h: window.innerHeight }
};

window.addEventListener('mousemove', (e) => {
  state.mouse.targetX = e.clientX;
  state.mouse.targetY = e.clientY;
  const target = e.target as HTMLElement;
  state.mouse.isHovering = !!target.closest('.interactive, a, button, .cursor-pointer');
});

window.addEventListener('resize', () => {
  state.viewport.w = window.innerWidth;
  state.viewport.h = window.innerHeight;
});

engine.register({
  update: () => {
    state.scroll.y = scrollEngine.y;
    state.scroll.target = scrollEngine.targetY;
    state.scroll.velocity = scrollEngine.velocity;
    state.scroll.limit = scrollEngine.limit;

    const prevMouseX = state.mouse.x;
    const prevMouseY = state.mouse.y;
    state.mouse.x = lerp(state.mouse.x, state.mouse.targetX, 0.15);
    state.mouse.y = lerp(state.mouse.y, state.mouse.targetY, 0.15);
    
    const dx = state.mouse.x - prevMouseX;
    const dy = state.mouse.y - prevMouseY;
    state.mouse.velocity = Math.sqrt(dx * dx + dy * dy);
  }
});
