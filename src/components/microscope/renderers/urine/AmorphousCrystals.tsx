/**
 * Amorphous crystals — dense granular cluster with no defined shape.
 * Amorphous urates (acidic, pink-brown) or phosphates (alkaline, white-grey).
 * Ref: Image 53 — irregular granular mass.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function AmorphousCrystals({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const isUrate = rng() > 0.5; // acidic = urates (brown), alkaline = phosphates (grey)
  const clusterR = n(4 + rng() * 4);
  const opacity = n(0.15 + rng() * 0.15);
  const color = isUrate ? "#907050" : "#a0a098";

  // Dense granular particles in irregular cluster
  const particleCount = 30 + Math.floor(rng() * 40);
  const particles = Array.from({ length: particleCount }, () => {
    // Distribute within irregular cluster shape
    const angle = rng() * Math.PI * 2;
    const dist = rng() * clusterR * (0.3 + rng() * 0.7);
    return {
      px: n(Math.cos(angle) * dist + (rng() - 0.5) * 1.5),
      py: n(Math.sin(angle) * dist + (rng() - 0.5) * 1.5),
      pr: n(0.1 + rng() * 0.25),
      po: n(opacity * (0.5 + rng() * 0.8)),
    };
  });

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Faint cluster background */}
      <circle r={n(clusterR * 0.7)} fill={color} opacity={n(opacity * 0.2)} />
      {/* Individual granules */}
      {particles.map((p, i) => (
        <circle key={i} cx={p.px} cy={p.py} r={p.pr} fill={color} opacity={p.po} />
      ))}
    </g>
  );
}
