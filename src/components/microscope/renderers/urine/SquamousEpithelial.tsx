/**
 * Squamous epithelial cell — large, flat, irregularly polygonal.
 *
 * ~40-60 µm. Soft irregular polygon (not geometric). Opaque — you
 * should NOT see cells behind it. Large dark nucleus. Dense granular
 * cytoplasmic texture. Defined but organic borders with fold lines.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function SquamousEpithelial({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const r = n(10 + rng() * 6);
  const rot = n(rng() * 360);

  // Irregular soft polygon — many points with Catmull-Rom smoothing
  const nPts = 8 + Math.floor(rng() * 5); // 8-12 sides
  const pts: [number, number][] = [];
  for (let i = 0; i < nPts; i++) {
    const angle = (i / nPts) * Math.PI * 2 + (rng() - 0.5) * 0.4;
    const rad = r * (0.7 + rng() * 0.4);
    pts.push([Math.cos(angle) * rad, Math.sin(angle) * rad]);
  }

  // Catmull-Rom for soft organic edges (not straight geometric lines)
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

  const edgeOpacity = n(0.30 + rng() * 0.12);

  // Nucleus — large and dark
  const nucX = n((rng() - 0.5) * r * 0.2);
  const nucY = n((rng() - 0.5) * r * 0.2);
  const nucR = n(2.0 + rng() * 0.8);

  // Dense cytoplasmic texture
  const granuleCount = 80 + Math.floor(rng() * 50);
  const granules = Array.from({ length: granuleCount }, () => ({
    gx: n((rng() - 0.5) * r * 1.4),
    gy: n((rng() - 0.5) * r * 1.4),
    gr: n(0.08 + rng() * 0.12),
    go: n(0.04 + rng() * 0.05),
  }));

  // Fold lines
  const foldCount = 1 + Math.floor(rng() * 2);
  const folds = Array.from({ length: foldCount }, () => {
    const a = rng() * Math.PI;
    const d = r * (0.3 + rng() * 0.4);
    return { x1: n(Math.cos(a) * -d), y1: n(Math.sin(a) * -d), x2: n(Math.cos(a) * d), y2: n(Math.sin(a) * d) };
  });

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Opaque cell body — NOT see-through */}
      <path d={outline} fill="#d0d4c4" opacity={0.85} />
      {/* Organic border */}
      <path d={outline} fill="none" stroke="#6a7060" strokeWidth={0.2} opacity={edgeOpacity} />

      {/* Cytoplasmic granular texture */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill="#707060" opacity={g.go} />
      ))}

      {/* Fold lines */}
      {folds.map((f, i) => (
        <line key={`f${i}`} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2}
          stroke="#909080" strokeWidth={0.1} opacity={0.12} />
      ))}

      {/* Large dark nucleus */}
      <circle cx={nucX} cy={nucY} r={nucR} fill="#384030" opacity={0.35} />
      <circle cx={nucX} cy={nucY} r={n(nucR * 0.6)} fill="#283020" opacity={0.3} />
    </g>
  );
}
