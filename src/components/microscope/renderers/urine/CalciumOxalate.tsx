/**
 * Calcium oxalate crystal — "envelope" or octahedral shape.
 * Colourless, refractile. Most common crystal in urine.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function CalciumOxalate({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const size = n(1.5 + rng() * 1);
  const rot = n(rng() * 360);
  const opacity = n(0.25 + rng() * 0.15);
  const half = size / 2;

  // Envelope/octahedral shape — two overlapping squares rotated 45°
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Diamond shape with cross inside */}
      <path d={`M0,${n(-size)} L${n(size)},0 L0,${n(size)} L${n(-size)},0 Z`}
        fill="rgba(200,210,220,0.1)" stroke="#a0a8b0" strokeWidth={0.1} opacity={opacity} />
      {/* Cross lines — the "envelope" X pattern */}
      <line x1={n(-half * 0.7)} y1={n(-half * 0.7)} x2={n(half * 0.7)} y2={n(half * 0.7)}
        stroke="#a0a8b0" strokeWidth={0.06} opacity={n(opacity * 0.6)} />
      <line x1={n(half * 0.7)} y1={n(-half * 0.7)} x2={n(-half * 0.7)} y2={n(half * 0.7)}
        stroke="#a0a8b0" strokeWidth={0.06} opacity={n(opacity * 0.6)} />
    </g>
  );
}
