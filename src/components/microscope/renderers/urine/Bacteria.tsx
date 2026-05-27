/**
 * Bacteria in urine — tiny rods or cocci.
 * Very small, grey, often in clusters. Motile rods jitter.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number; animated?: boolean }

export function Bacteria({ x, y, seed, animated }: Props) {
  const rng = createRng(seed);
  const isRod = rng() > 0.4;
  const rot = n(rng() * 360);
  const opacity = n(0.25 + rng() * 0.2);

  // Jitter animation ID for motile bacteria
  const jitterDur = n(0.3 + rng() * 0.4);
  const jitterX = n((rng() - 0.5) * 0.5);
  const jitterY = n((rng() - 0.5) * 0.5);

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {animated && (
        <animateTransform attributeName="transform" type="translate"
          values={`${x} ${y};${n(x+jitterX)} ${n(y+jitterY)};${n(x-jitterX*0.5)} ${n(y-jitterY*0.3)};${x} ${y}`}
          dur={`${jitterDur}s`} repeatCount="indefinite" additive="replace" />
      )}
      {isRod ? (
        // Rod-shaped bacterium
        <rect x={-0.4} y={-0.12} width={0.8} height={0.24} rx={0.12}
          fill="#707868" opacity={opacity} />
      ) : (
        // Coccus
        <circle r={0.15} fill="#707868" opacity={opacity} />
      )}
    </g>
  );
}
