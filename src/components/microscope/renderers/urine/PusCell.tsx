/**
 * Pus cell (WBC) in urine sediment — unstained wet prep.
 *
 * Round, ~10-15 µm. Granular grey cytoplasm with DARK granulations
 * visible throughout. Multi-lobed nucleus faintly visible.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function PusCell({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const r = n(1.8 + rng() * 0.5);
  const opacity = n(0.38 + rng() * 0.15);

  // Dark granulations — more numerous and darker than before
  const granules = Array.from({ length: 15 + Math.floor(rng() * 10) }, () => ({
    gx: n((rng() - 0.5) * r * 1.2),
    gy: n((rng() - 0.5) * r * 1.2),
    gr: n(0.1 + rng() * 0.12),
    go: n(0.20 + rng() * 0.15), // darker
  }));

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Cell body — grey, translucent */}
      <circle r={r} fill="#8a9080" opacity={opacity} />
      <circle r={r} fill="none" stroke="#606850" strokeWidth={0.1} opacity={0.35} />
      {/* Dark granulations throughout */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill="#3a4030" opacity={g.go} />
      ))}
      {/* Faint multi-lobed nuclear shadow */}
      <circle r={n(r * 0.5)} fill="#505840" opacity={0.18} />
      <circle cx={n(r * 0.15)} cy={n(-r * 0.1)} r={n(r * 0.3)} fill="#505840" opacity={0.12} />
    </g>
  );
}
