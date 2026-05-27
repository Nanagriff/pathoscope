/**
 * Pus cell (WBC) in urine sediment — unstained wet prep.
 * Round, ~10-15μm, granular grey cytoplasm, multi-lobed nucleus faintly visible.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function PusCell({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const r = n(1.8 + rng() * 0.5);
  const opacity = n(0.35 + rng() * 0.15);

  // Granular texture — tiny dots inside
  const granules = Array.from({ length: 6 + Math.floor(rng() * 4) }, () => ({
    gx: n((rng() - 0.5) * r * 1.2),
    gy: n((rng() - 0.5) * r * 1.2),
    gr: n(0.15 + rng() * 0.1),
  }));

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Cell body — grey, translucent */}
      <circle r={r} fill="#8a9080" opacity={opacity} />
      <circle r={r} fill="none" stroke="#707860" strokeWidth={0.08} opacity={0.3} />
      {/* Granular interior */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill="#606850" opacity={0.15} />
      ))}
      {/* Faint nuclear outline */}
      <circle r={n(r * 0.5)} fill="#707860" opacity={0.12} />
    </g>
  );
}
