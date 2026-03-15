import { state } from '../store';

class ScrollEngineClass {
  private container: HTMLElement | null = null;
  private rafId: number = 0;
  private resizeObserver: ResizeObserver | null = null;
  private lastTime: number = 0;
  private touchStartY: number = 0;

  constructor() {
    this.handleWheel = this.handleWheel.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.update = this.update.bind(this);
  }

  init(container: HTMLElement) {
    this.container = container;
    this.setupEventListeners();
    this.setupResizeObserver();
    this.handleResize();
    this.lastTime = performance.now();
    // this.start();
  }

  private setupEventListeners() {
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    window.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('resize', this.handleResize);
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });

    if (this.container) {
      this.resizeObserver.observe(this.container);
    }
    this.resizeObserver.observe(document.body);
  }

  private handleWheel(e: WheelEvent) {
    e.preventDefault();
    state.scroll.target += e.deltaY;
    state.scroll.target = Math.max(0, Math.min(state.scroll.target, state.scroll.limit));
  }

  private handleTouchStart(e: TouchEvent) {
    this.touchStartY = e.touches[0].clientY;
  }

  private handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const delta = this.touchStartY - touchY;
    state.scroll.target += delta * 2;
    state.scroll.target = Math.max(0, Math.min(state.scroll.target, state.scroll.limit));
    this.touchStartY = touchY;
  }

  private handleResize() {
    state.viewport.w = window.innerWidth;
    state.viewport.h = window.innerHeight;
    
    if (this.container) {
      const contentHeight = this.container.scrollHeight;
      state.scroll.limit = Math.max(0, contentHeight - window.innerHeight);
    }
  }

  update(deltaTime?: number) {
    const currentTime = performance.now();
    const dt = deltaTime || (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    state.deltaTime = dt;

    const prevScrollY = state.scroll.y;
    state.scroll.y += (state.scroll.target - state.scroll.y) * 0.08;
    
    state.scroll.velocity = state.scroll.y - prevScrollY;
    state.scrollVelocity = state.scroll.velocity;

    if (this.container) {
      const skew = state.scroll.velocity * 0.02;
      const clampedSkew = Math.max(-5, Math.min(5, skew));
      this.container.style.transform = `translate3d(0, -${state.scroll.y}px, 0) skewY(${clampedSkew}deg)`;
    }
  }

  start() {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(this.update);
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('resize', this.handleResize);
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  getScrollY(): number {
    return state.scroll.y;
  }

  getScrollVelocity(): number {
    return state.scrollVelocity;
  }

  getScrollProgress(): number {
    if (state.scroll.limit === 0) return 0;
    return state.scroll.y / state.scroll.limit;
  }

  scrollTo(target: number, smooth: boolean = true) {
    if (smooth) {
      state.scroll.target = Math.max(0, Math.min(target, state.scroll.limit));
    } else {
      state.scroll.target = Math.max(0, Math.min(target, state.scroll.limit));
      state.scroll.y = state.scroll.target;
    }
  }

  getElementOffset(element: HTMLElement): { top: number; bottom: number; progress: number } {
    const rect = element.getBoundingClientRect();
    const scrollY = this.getScrollY();
    
    const top = rect.top + scrollY;
    const bottom = top + rect.height;
    
    const viewportCenter = scrollY + window.innerHeight / 2;
    const elementCenter = top + rect.height / 2;
    const distance = viewportCenter - elementCenter;
    const maxDistance = window.innerHeight / 2 + rect.height / 2;
    const progress = 1 - Math.min(Math.abs(distance) / maxDistance, 1);
    
    return { top, bottom, progress };
  }
}

export const scrollEngine = new ScrollEngineClass();
export { ScrollEngineClass as ScrollEngine };