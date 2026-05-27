/**
 * Yeast cell (Candida) — oval with budding.
 * Small, refractile, may show pseudohyphae.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function YeastCell({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const r = n(0.8 + rng() * 0.3);
  const hasBud = rng() > 0.3;
  const budAngle = rng() * Math.PI * 2;
  const budR = n(r * (0.5 + rng() * 0.2));
  const budX = n(Math.cos(budAngle) * (r + budR * 0.5));
  const budY = n(Math.sin(budAngle) * (r + budR * 0.5));
  const opacity = n(0.3 + rng() * 0.2);

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Mother cell */}
      <ellipse rx={r} ry={n(r * (0.85 + rng() * 0.15))} fill="#b0b8a0" opacity={opacity}
        stroke="#909880" strokeWidth={0.06} strokeOpacity={0.3} />
      {/* Bud */}
      {hasBud && (
        <circle cx={budX} cy={budY} r={budR} fill="#b0b8a0" opacity={n(opacity * 0.9)}
          stroke="#909880" strokeWidth={0.05} strokeOpacity={0.25} />
      )}
    </g>
  );
}
