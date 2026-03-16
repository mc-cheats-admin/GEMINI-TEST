export const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};
export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
