/**
 * Enterobius vermicularis egg — pinworm egg (rare urine contaminant).
 *
 * 50-60 µm × 20-30 µm. Flattened on one side (asymmetrical oval /
 * D-shape). Thin smooth colorless shell. Contains a coiled larva
 * visible inside. Usually from perianal contamination.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function EnterobiusEgg({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const rx = n(3.5 + rng() * 1); // ~50-60 µm scaled
  const ry = n(rx * (0.45 + rng() * 0.1)); // flattened oval
  const rot = n(rng() * 360);
  const shellOpacity = n(0.18 + rng() * 0.08);

  // Asymmetric D-shape — one side flat, one side curved
  // Build path: curved top, flat bottom
  const nPts = 12;
  const pts: [number, number][] = [];
  for (let i = 0; i < nPts; i++) {
    const angle = (i / nPts) * Math.PI * 2;
    let radX = rx;
    let radY = ry;
    // Flatten one side
    if (Math.sin(angle) > 0) {
      radY *= (0.7 + rng() * 0.1); // flattened
    }
    pts.push([Math.cos(angle) * radX, Math.sin(angle) * radY]);
  }
  // Catmull-Rom smoothing
  let outline = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < nPts; i++) {
    const p0 = pts[(i - 1 + nPts) % nPts];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % nPts];
    const p3 = pts[(i + 2) % nPts];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    outline += `C${cp1x.toFixed(2)},${cp1y.toFixed(2)},${cp2x.toFixed(2)},${cp2y.toFixed(2)},${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  outline += "Z";

  // Internal coiled larva — C-shaped curve
  const larvaOpacity = n(0.1 + rng() * 0.08);
  const larvaR = n(rx * 0.55);
  const larvaPhase = rng() * Math.PI;
  let larvaPath = "";
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const angle = larvaPhase + t * Math.PI * 1.5;
    const lr = larvaR * (0.3 + t * 0.5);
    const lx = n(Math.cos(angle) * lr * 0.6);
    const ly = n(Math.sin(angle) * lr * 0.4);
    larvaPath += (i === 0 ? "M" : "L") + `${lx},${ly}`;
  }

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Shell — thin, smooth, colorless */}
      <path d={outline} fill="#e0dcd0" opacity={shellOpacity} />
      <path d={outline} fill="none" stroke="#a09880" strokeWidth={0.08} opacity={n(shellOpacity + 0.08)} />

      {/* Internal coiled larva */}
      <path d={larvaPath} fill="none" stroke="#888070" strokeWidth={n(0.15 + rng() * 0.1)}
        opacity={larvaOpacity} strokeLinecap="round" />

      {/* Faint internal granular content */}
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={n((rng() - 0.5) * rx * 0.6)} cy={n((rng() - 0.5) * ry * 0.6)}
          r={n(0.1 + rng() * 0.1)} fill="#908870" opacity={0.06} />
      ))}
    </g>
  );
}
