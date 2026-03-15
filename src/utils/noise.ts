export function createNoise3D() {
  function hash(x: number, y: number, z: number) {
    const h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return h - Math.floor(h);
  }
  function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
  function smoothstep(t: number) { return t * t * (3 - 2 * t); }
  return function noise3D(x: number, y: number, z: number) {
    const x0 = Math.floor(x); const y0 = Math.floor(y); const z0 = Math.floor(z);
    const x1 = x0 + 1; const y1 = y0 + 1; const z1 = z0 + 1;
    const sx = smoothstep(x - x0); const sy = smoothstep(y - y0); const sz = smoothstep(z - z0);
    const c000 = hash(x0, y0, z0); const c100 = hash(x1, y0, z0);
    const c010 = hash(x0, y1, z0); const c110 = hash(x1, y1, z0);
    const c001 = hash(x0, y0, z1); const c101 = hash(x1, y0, z1);
    const c011 = hash(x0, y1, z1); const c111 = hash(x1, y1, z1);
    const nx00 = lerp(c000, c100, sx); const nx01 = lerp(c001, c101, sx);
    const nx10 = lerp(c010, c110, sx); const nx11 = lerp(c011, c111, sx);
    const nxy0 = lerp(nx00, nx10, sy); const nxy1 = lerp(nx01, nx11, sy);
    return lerp(nxy0, nxy1, sz) * 2 - 1;
  };
}
