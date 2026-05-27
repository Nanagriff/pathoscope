/**
 * RBC in urine — unstained wet prep.
 * Small (~7μm), pale/ghost-like biconcave disc or crenated sphere.
 * Some appear as ghost cells (very faint) in dilute/alkaline urine.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function UrineRBC({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const r = n(1.0 + rng() * 0.3);
  const isGhost = rng() < 0.2; // 20% ghost cells
  const isCrenated = !isGhost && rng() < 0.3; // 30% crenated
  const opacity = isGhost ? n(0.1 + rng() * 0.08) : n(0.3 + rng() * 0.15);

  if (isCrenated) {
    // Spiky crenated RBC
    const spikes = 8 + Math.floor(rng() * 4);
    let d = "";
    for (let i = 0; i < spikes; i++) {
      const angle = (i / spikes) * Math.PI * 2;
      const outerR = r * (1 + 0.2 + rng() * 0.15);
      const innerR = r * (0.85 + rng() * 0.1);
      const ox = n(Math.cos(angle) * outerR);
      const oy = n(Math.sin(angle) * outerR);
      const midAngle = angle + Math.PI / spikes;
      const ix = n(Math.cos(midAngle) * innerR);
      const iy = n(Math.sin(midAngle) * innerR);
      d += `${i === 0 ? "M" : "L"}${ox},${oy}L${ix},${iy}`;
    }
    d += "Z";
    return (
      <g transform={`translate(${x},${y})`}>
        <path d={d} fill="#a0a890" opacity={opacity} />
      </g>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={r} fill={isGhost ? "#c0c8b8" : "#98a088"} opacity={opacity} />
      {/* Central pallor — faint */}
      {!isGhost && <circle r={n(r * 0.3)} fill="#c8d0c0" opacity={0.2} />}
    </g>
  );
}
