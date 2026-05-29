/**
 * Urothelial (transitional) epithelial cell.
 *
 * Medium size (~30-40 µm). Shape varies: round, oval, pear-shaped, or
 * slightly caudate (tailed). Softer contours than squamous — rounded
 * polygon, NOT perfect pentagon/hexagon. Dense granular cytoplasm.
 * Prominent central nucleus. From bladder, ureters, renal pelvis.
 */

import { createRng, irregularCellPath } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function UrothelialCell({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const r = n(5 + rng() * 3); // 5-8 units
  const rot = n(rng() * 360);

  // Shape variety: round, oval, pear-shaped, or caudate
  const shapeRoll = rng();
  const isCaudate = shapeRoll < 0.2;
  const isPear = shapeRoll >= 0.2 && shapeRoll < 0.45;
  const isOval = shapeRoll >= 0.45 && shapeRoll < 0.7;
  // else round

  // Soft contours — use irregularCellPath with moderate wobble (not angular polygons)
  const stretchX = isOval ? n(0.75 + rng() * 0.1) : isPear ? n(0.85 + rng() * 0.1) : n(0.9 + rng() * 0.15);
  const stretchY = n(2 - stretchX);
  const outline = irregularCellPath(rng, r, 10, 0.15);

  const bodyOpacity = n(0.15 + rng() * 0.08); // denser cytoplasm

  // Pear distortion — shift bottom half outward
  const pearBulge = isPear ? n(r * 0.3 + rng() * r * 0.2) : 0;

  // Nucleus — prominent, central
  const nucX = n((rng() - 0.5) * r * 0.15);
  const nucY = n((rng() - 0.5) * r * 0.15 + (isPear ? -r * 0.1 : 0));
  const nucR = n(r * 0.25 + rng() * 0.12);

  // Denser cytoplasmic granularity
  const granules = Array.from({ length: 20 + Math.floor(rng() * 15) }, () => ({
    gx: n((rng() - 0.5) * r * 1.3),
    gy: n((rng() - 0.5) * r * 1.3),
    gr: n(0.08 + rng() * 0.12),
    go: n(0.05 + rng() * 0.06),
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
      {/* Cell body — soft contour, stretched for shape variety */}
      <g transform={`scale(${stretchX},${stretchY})`}>
        <path d={outline} fill="#b0b4a4" opacity={bodyOpacity} />
        <path d={outline} fill="none" stroke="#788068" strokeWidth={0.12} opacity={n(bodyOpacity + 0.10)} />

        {/* Cytoplasmic granularity — denser */}
        {granules.map((g, i) => (
          <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill="#687060" opacity={g.go} />
        ))}
      </g>

      {/* Pear bulge — extra lobe at one end */}
      {isPear && (
        <ellipse cx={0} cy={n(r * stretchY * 0.6)} rx={n(r * 0.5)} ry={n(pearBulge)}
          fill="#b0b4a4" opacity={n(bodyOpacity * 0.8)} stroke="#788068" strokeWidth={0.08} strokeOpacity={0.12} />
      )}

      {/* Caudate tail */}
      {isCaudate && (
        <path d={`M${tailStartX},${tailStartY} Q${n((tailStartX + tailEndX) / 2 + (rng() - 0.5) * 2)},${n((tailStartY + tailEndY) / 2 + (rng() - 0.5) * 2)},${tailEndX},${tailEndY}`}
          fill="none" stroke="#a0a490" strokeWidth={n(0.3 + rng() * 0.3)} strokeOpacity={bodyOpacity} strokeLinecap="round" />
      )}

      {/* Prominent nucleus */}
      <circle cx={nucX} cy={nucY} r={nucR} fill="#4a5440" opacity={0.25} />
      <circle cx={nucX} cy={nucY} r={n(nucR * 0.55)} fill="#384030" opacity={0.2} />
    </g>
  );
}
