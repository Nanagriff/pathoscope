/**
 * Mucus thread — thin wavy transparent line.
 * Common in urine, often seen drifting slowly.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function MucusThread({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const len = n(15 + rng() * 20);
  const rot = n(rng() * 360);
  const halfL = len / 2;
  const waves = 3 + Math.floor(rng() * 3);

  // Build a wavy path
  let d = `M${n(-halfL)},0`;
  for (let i = 1; i <= waves * 2; i++) {
    const xp = n(-halfL + (i / (waves * 2)) * len);
    const yp = n((i % 2 === 0 ? 1 : -1) * (0.5 + rng() * 0.8));
    d += `Q${n(xp - len / (waves * 4))},${yp},${xp},0`;
  }

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <path d={d} fill="none" stroke="rgba(180,190,175,0.12)" strokeWidth={n(0.3 + rng() * 0.3)} strokeLinecap="round" />
    </g>
  );
}
