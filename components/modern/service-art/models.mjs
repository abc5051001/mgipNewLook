export const clamp = value => Math.max(0, Math.min(1, value));
const smooth = (from, to, value) => {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};
export const STAMP_TRAVEL = 31.8;
export function stampPose(progress) {
  const p = clamp(progress);
  return { offsets: { head: [0, 0, -STAMP_TRAVEL * Math.sin(Math.PI * p) ** 2] }, ink: smooth(.43, .57, p) };
}
export function writingPose(progress) {
  const p = clamp(progress);
  return { offsets: { carriage: [-80 * p, 0, 0] }, ink: p };
}
export const WRITING = 'ORIGINAL WORK';
