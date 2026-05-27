/**
 * Granular cast — cylindrical with granular content.
 * Darker/more visible than hyaline. Coarse or fine granules.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function GranularCast({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const len = n(18 + rng() * 12);
  const w = n(2.8 + rng() * 1.2);
  const rot = n(rng() * 360);
  const halfL = len / 2;
  const halfW = w / 2;
  const isCoarse = rng() > 0.5;
  const opacity = n(0.15 + rng() * 0.1);

  // Granules inside the cast
  const granCount = isCoarse ? 15 + Math.floor(rng() * 10) : 25 + Math.floor(rng() * 15);
  const granules = Array.from({ length: granCount }, () => ({
    gx: n((rng() - 0.5) * len * 0.85),
    gy: n((rng() - 0.5) * w * 0.7),
    gr: n(isCoarse ? 0.2 + rng() * 0.2 : 0.08 + rng() * 0.1),
  }));

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Cast body */}
      <rect x={n(-halfL)} y={n(-halfW)} width={len} height={w} rx={halfW}
        fill="#a0a890" opacity={opacity} stroke="#889078" strokeWidth={0.08} strokeOpacity={0.2} />
      {/* Granules */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill="#707860" opacity={n(0.15 + rng() * 0.15)} />
      ))}
    </g>
  );
}
