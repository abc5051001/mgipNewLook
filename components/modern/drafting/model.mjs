export const DRAWING = [
  [-72, -30], [-42, -30], [-42, -42], [10, -42], [10, -30], [64, -30],
  [64, 30], [10, 30], [10, 42], [-42, 42], [-42, 30], [-72, 30], [-72, -30],
  [-54, -12], [46, -12], [46, 12], [-54, 12], [-54, -12],
];
const lengths = DRAWING.map((point, index) => index ? Math.hypot(point[0] - DRAWING[index - 1][0], point[1] - DRAWING[index - 1][1]) : 0);
export const TOTAL = lengths.reduce((sum, value) => sum + value, 0);
export const clamp = value => Math.max(0, Math.min(1, value));
export function poseAt(progress) {
  let remaining = clamp(progress) * TOTAL;
  const trail = [DRAWING[0]];
  for (let i = 1; i < DRAWING.length; i++) {
    const [a, b] = [DRAWING[i - 1], DRAWING[i]];
    if (remaining <= lengths[i]) {
      const t = remaining / lengths[i];
      const tip = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      return { tip, trail: [...trail, tip], progress: clamp(progress) };
    }
    remaining -= lengths[i];
    trail.push(b);
  }
  return { tip: DRAWING.at(-1), trail, progress: 1 };
}
export function project([x, y, z], camera) {
  return [camera.origin[0] + (x * camera.sinA - y * camera.cosA) * camera.k,
    camera.origin[1] + ((x * camera.cosA + y * camera.sinA) * camera.sinE - z * camera.cosE) * camera.k];
}
export function offset([x, y, z], camera) {
  const point = project([x, y, z], camera);
  return [point[0] - camera.origin[0], point[1] - camera.origin[1]];
}
export const pathOf = points => points.map((point, index) => `${index ? 'L' : 'M'}${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join('');
