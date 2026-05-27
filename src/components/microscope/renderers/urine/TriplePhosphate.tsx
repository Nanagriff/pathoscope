/**
 * Triple phosphate crystal (struvite) — "coffin lid" shape.
 * Colourless, 3D prism appearance. Found in alkaline urine.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function TriplePhosphate({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const w = n(3 + rng() * 2);
  const h = n(w * (1.2 + rng() * 0.4));
  const rot = n(rng() * 360);
  const opacity = n(0.2 + rng() * 0.15);
  const lidH = n(h * 0.2);

  // Coffin lid — hexagonal prism shape
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <path d={`M${n(-w/2)},${n(-h/2 + lidH)} L0,${n(-h/2)} L${n(w/2)},${n(-h/2 + lidH)} L${n(w/2)},${n(h/2 - lidH)} L0,${n(h/2)} L${n(-w/2)},${n(h/2 - lidH)} Z`}
        fill="rgba(210,220,228,0.08)" stroke="#98a0a8" strokeWidth={0.1} opacity={opacity} />
    </g>
  );
}
