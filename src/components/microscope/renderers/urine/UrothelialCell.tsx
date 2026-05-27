/**
 * Urothelial (transitional) epithelial cell.
 * Medium size (~30-40μm), round/oval/pear-shaped, sometimes caudate (tailed).
 * From bladder, ureters, renal pelvis. Granular cytoplasm.
 * Ref: Image 50 — clusters, round/oval/pear shapes, visible nucleus.
 */

import { createRng, irregularCellPath } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function UrothelialCell({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const r = n(5 + rng() * 3); // 5-8 units — medium, smaller than squamous
  const isCaudate = rng() < 0.3; // 30% have a tail
  const rot = n(rng() * 360);
  const bodyOpacity = n(0.12 + rng() * 0.08);

  // Round/oval outline — smoother than squamous
  const outline = irregularCellPath(rng, r, 10, 0.12);

  // Nucleus — larger relative to cell than squamous (lower N:C ratio than squamous but still visible)
  const nucX = n((rng() - 0.5) * r * 0.2);
  const nucY = n((rng() - 0.5) * r * 0.2);
  const nucR = n(r * 0.25 + rng() * 0.1);

  // Cytoplasmic granularity
  const granules = Array.from({ length: 12 + Math.floor(rng() * 8) }, () => ({
    gx: n((rng() - 0.5) * r * 1.3),
    gy: n((rng() - 0.5) * r * 1.3),
    gr: n(0.1 + rng() * 0.12),
    go: n(0.04 + rng() * 0.05),
  }));

  // Caudate tail
  const tailAngle = rng() * Math.PI * 2;
  const tailLen = n(r * (0.8 + rng() * 0.5));
  const tailEndX = n(Math.cos(tailAngle) * (r + tailLen));
  const tailEndY = n(Math.sin(tailAngle) * (r + tailLen));
  const tailStartX = n(Math.cos(tailAngle) * r * 0.7);
  const tailStartY = n(Math.sin(tailAngle) * r * 0.7);

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Cell body — rounder than squamous */}
      <path d={outline} fill="#b0b4a4" opacity={bodyOpacity} />
      <path d={outline} fill="none" stroke="#889078" strokeWidth={0.1} opacity={n(bodyOpacity + 0.06)} />

      {/* Caudate tail */}
      {isCaudate && (
        <path d={`M${tailStartX},${tailStartY} Q${n((tailStartX + tailEndX) / 2 + (rng() - 0.5) * 2)},${n((tailStartY + tailEndY) / 2 + (rng() - 0.5) * 2)},${tailEndX},${tailEndY}`}
          fill="none" stroke="#a0a490" strokeWidth={n(0.4 + rng() * 0.3)} strokeOpacity={bodyOpacity} strokeLinecap="round" />
      )}

      {/* Granularity */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill="#707868" opacity={g.go} />
      ))}

      {/* Nucleus — rounder and more prominent than squamous */}
      <circle cx={nucX} cy={nucY} r={nucR} fill="#586050" opacity={0.2} />
      <circle cx={nucX} cy={nucY} r={n(nucR * 0.5)} fill="#404840" opacity={0.15} />
    </g>
  );
}
