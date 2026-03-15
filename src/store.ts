export const state = {
  scroll: { y: 0, target: 0, velocity: 0, limit: 0 },
  mouse: { x: 0, y: 0, targetX: 0, targetY: 0, velocity: 0, isHovering: false },
  viewport: { w: window.innerWidth, h: window.innerHeight },
  audio: { enabled: false, context: null as AudioContext | null },
  webgl: { 
    canvas: null as HTMLCanvasElement | null, 
    gl: null as WebGLRenderingContext | null, 
    program: null as WebGLProgram | null 
  },
  scrollVelocity: 0,
  deltaTime: 0
};