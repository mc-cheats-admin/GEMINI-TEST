import { lerp } from '../utils/math';
import { engine } from './Engine';

export class ScrollEngine {
  public y: number = 0;
  public targetY: number = 0;
  public velocity: number = 0;
  public limit: number = 0;
  private container: HTMLElement | null = null;
  private touchStartY: number = 0;

  constructor() {
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    document.body.style.overflow = 'hidden';
  }

  setContainer(el: HTMLElement) {
    this.container = el;
    this.updateLimit();
    new ResizeObserver(() => this.updateLimit()).observe(document.body);
    if (this.container) {
      new ResizeObserver(() => this.updateLimit()).observe(this.container);
    }
  }

  updateLimit() {
    if (this.container) {
      this.limit = Math.max(0, this.container.scrollHeight - window.innerHeight);
    }
  }

  onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.targetY += e.deltaY;
    this.targetY = Math.max(0, Math.min(this.targetY, this.limit));
  }

  onTouchStart = (e: TouchEvent) => {
    this.touchStartY = e.touches[0].clientY;
  }

  onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const delta = this.touchStartY - touchY;
    this.targetY += delta * 2;
    this.targetY = Math.max(0, Math.min(this.targetY, this.limit));
    this.touchStartY = touchY;
  }

  update(dt: number) {
    const prevY = this.y;
    this.y = lerp(this.y, this.targetY, 0.08);
    this.velocity = this.y - prevY;

    if (this.container) {
      const skew = this.velocity * 0.02;
      const clampedSkew = Math.max(-5, Math.min(5, skew));
      this.container.style.transform = `translate3d(0, -${this.y}px, 0) skewY(${clampedSkew}deg)`;
    }
  }
}
export const scrollEngine = new ScrollEngine();
engine.register(scrollEngine);
