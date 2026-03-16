export class CursorManager {
  public x: number = window.innerWidth / 2;
  public y: number = window.innerHeight / 2;

  constructor() {
    window.addEventListener('mousemove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
    });
  }
}
export const cursorManager = new CursorManager();
