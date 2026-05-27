/**
 * Hyaline cast — transparent cylindrical structure.
 * Very faint, easy to miss. Requires reduced light/phase contrast.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function HyalineCast({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const len = n(20 + rng() * 15);
  const w = n(2.5 + rng() * 1);
  const rot = n(rng() * 360);
  const halfL = len / 2;
  const halfW = w / 2;
  // Slight curve
  const curve = n((rng() - 0.5) * 3);

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Nearly transparent cylinder */}
      <path d={`M${n(-halfL)},${n(-halfW)} Q0,${n(-halfW + curve)},${n(halfL)},${n(-halfW)} L${n(halfL)},${n(halfW)} Q0,${n(halfW + curve)},${n(-halfL)},${n(halfW)} Z`}
        fill="rgba(180,190,200,0.04)" stroke="rgba(160,170,180,0.12)" strokeWidth={0.08} />
      {/* Rounded ends */}
      <ellipse cx={n(-halfL)} cy={0} rx={n(halfW)} ry={n(halfW)} fill="rgba(180,190,200,0.03)" />
      <ellipse cx={n(halfL)} cy={0} rx={n(halfW)} ry={n(halfW)} fill="rgba(180,190,200,0.03)" />
    </g>
  );
}
