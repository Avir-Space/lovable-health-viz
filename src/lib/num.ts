export const fmt = (v: number, unit = '') =>
  (Math.abs(v) >= 1000 ? `${(v/1000).toFixed(1)}k` : v.toFixed(Number(Math.abs(v) < 10 ? 2 : 0))) + unit;
