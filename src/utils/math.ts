export const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;
export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
export const map = (val: number, inMin: number, inMax: number, outMin: number, outMax: number) => ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
