/**
 * Ammonium biurate crystal — "thorny apple" / "hedgehog".
 * Dark brown sphere with radiating spicules/spines.
 * Found in alkaline urine, old specimens.
 * Ref: Image 55 — dark spheres with spiny projections.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function AmmoniumBiurate({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const bodyR = n(1.2 + rng() * 0.8);
  const rot = n(rng() * 360);
  const opacity = n(0.35 + rng() * 0.2);
  const spikeCount = 6 + Math.floor(rng() * 6);

  // Dark brown body
  const bodyColor = `rgba(${80 + Math.floor(rng() * 30)},${60 + Math.floor(rng() * 20)},${30 + Math.floor(rng() * 20)},1)`;

  // Radiating spicules
  const spikes = Array.from({ length: spikeCount }, (_, i) => {
    const angle = (i / spikeCount) * Math.PI * 2 + (rng() - 0.5) * 0.4;
    const len = n(bodyR * (0.6 + rng() * 0.8));
    return {
      x1: n(Math.cos(angle) * bodyR * 0.8),
      y1: n(Math.sin(angle) * bodyR * 0.8),
      x2: n(Math.cos(angle) * (bodyR + len)),
      y2: n(Math.sin(angle) * (bodyR + len)),
    };
  });

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Spicules — radiating spines */}
      {spikes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={bodyColor} strokeWidth={n(0.12 + rng() * 0.08)} opacity={opacity} strokeLinecap="round" />
      ))}
      {/* Dark brown spherical body */}
      <circle r={bodyR} fill={bodyColor} opacity={opacity} />
      {/* Highlight spot */}
      <circle cx={n(-bodyR * 0.2)} cy={n(-bodyR * 0.2)} r={n(bodyR * 0.25)}
        fill="rgba(200,180,140,0.15)" />
    </g>
  );
}
