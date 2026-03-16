export class Engine {
  private static instance: Engine;
  private modules: any[] = [];
  private rafId: number = 0;
  private lastTime: number = 0;

  private constructor() {}

  static getInstance() {
    if (!Engine.instance) {
      Engine.instance = new Engine();
    }
    return Engine.instance;
  }

  register(module: any) {
    if (!this.modules.includes(module)) {
      this.modules.push(module);
    }
  }

  unregister(module: any) {
    this.modules = this.modules.filter(m => m !== module);
  }

  start() {
    if (this.rafId) return;
    this.lastTime = performance.now();
    const loop = (time: number) => {
      const deltaTime = time - this.lastTime;
      this.lastTime = time;
      this.modules.forEach(m => m.update && m.update(deltaTime, time));
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }
}
export const engine = Engine.getInstance();
