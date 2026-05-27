/**
 * Squamous epithelial cell — VERY large, flat polygon.
 * Dense granular/stippled texture throughout cytoplasm (not smooth).
 * Small round dark nucleus. Defined edges. ~40-60μm.
 * Ref: Image 49 — heavy granularity, clear edge outline, grey body.
 */

import { createRng, irregularCellPath } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function SquamousEpithelial({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const r = n(14 + rng() * 8); // 14-22 units — very large
  // Polygon-like outline with angular edges
  const points = 6 + Math.floor(rng() * 4); // 6-9 sided polygon
  const outline = irregularCellPath(rng, r, points, 0.25);
  const rot = n(rng() * 360);
  const bodyOpacity = n(0.1 + rng() * 0.06);
  const edgeOpacity = n(0.18 + rng() * 0.08);

  // Nucleus — small, round, eccentric, dark
  const nucX = n((rng() - 0.5) * r * 0.25);
  const nucY = n((rng() - 0.5) * r * 0.25);
  const nucR = n(1.2 + rng() * 0.5);

  // Dense granular texture — MANY tiny specks throughout (key feature)
  const granuleCount = 40 + Math.floor(rng() * 30);
  const granules = Array.from({ length: granuleCount }, () => ({
    gx: n((rng() - 0.5) * r * 1.5),
    gy: n((rng() - 0.5) * r * 1.5),
    gr: n(0.1 + rng() * 0.15),
    go: n(0.04 + rng() * 0.06),
  }));

  // Fold lines
  const foldCount = Math.floor(rng() * 2);
  const folds = Array.from({ length: foldCount }, () => {
    const a = rng() * Math.PI;
    const d = r * (0.4 + rng() * 0.3);
    return { x1: n(Math.cos(a) * -d), y1: n(Math.sin(a) * -d), x2: n(Math.cos(a) * d), y2: n(Math.sin(a) * d) };
  });

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Cell body — translucent grey with visible texture */}
      <path d={outline} fill="#b8bca8" opacity={bodyOpacity} />
      {/* Defined edge — the most visible part */}
      <path d={outline} fill="none" stroke="#8a9078" strokeWidth={0.15} opacity={edgeOpacity} />

      {/* Dense granular texture throughout cytoplasm */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill="#787868" opacity={g.go} />
      ))}

      {/* Fold lines */}
      {folds.map((f, i) => (
        <line key={`f${i}`} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2}
          stroke="#909080" strokeWidth={0.08} opacity={0.08} />
      ))}

      {/* Small dark nucleus */}
      <circle cx={nucX} cy={nucY} r={nucR} fill="#506048" opacity={0.22} />
      <circle cx={nucX} cy={nucY} r={n(nucR * 0.55)} fill="#3a4834" opacity={0.18} />
    </g>
  );
}
