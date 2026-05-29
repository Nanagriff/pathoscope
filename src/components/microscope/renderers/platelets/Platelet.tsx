/**
 * Platelet — small anucleate fragment (~2-4 µm).
 *
 * Irregular oval/angular shape. Pale lavender hyalomere rim
 * with dense dark purple granulomere cluster in the centre.
 * Refractile — subtle bright edge highlight. No nucleus.
 */

import { createRng } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Platelet({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const baseR = n(0.7 + rng() * 0.4);

  // Irregular asymmetric outline — 6-9 points with varied radii
  const nPts = 6 + Math.floor(rng() * 4);
  const pts: [number, number][] = [];
  const stretchX = n(0.8 + rng() * 0.4); // asymmetric oval/angular
  const stretchY = n(0.7 + rng() * 0.4);
  for (let i = 0; i < nPts; i++) {
    const angle = (i / nPts) * Math.PI * 2 + (rng() - 0.5) * 0.4;
    const wobble = baseR * (0.85 + rng() * 0.3);
    pts.push([Math.cos(angle) * wobble * stretchX, Math.sin(angle) * wobble * stretchY]);
  }

  // Catmull-Rom for smooth-ish but irregular outline
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

  // Granulomere — tightly clustered, overlapping, varied-size granules
  const granuleCount = 6 + Math.floor(rng() * 10);
  const granules: { gx: number; gy: number; gr: number; o: number }[] = [];
  for (let i = 0; i < granuleCount; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * rng() * baseR * 0.35; // squared rng → clusters tightly at centre
    granules.push({
      gx: n(Math.cos(a) * d + (rng() - 0.5) * 0.05),
      gy: n(Math.sin(a) * d + (rng() - 0.5) * 0.05),
      gr: n(0.04 + rng() * 0.1), // varied: some tiny, some larger
      o: n(0.55 + rng() * 0.4),
    });
  }

  // Refractile highlight position
  const hlAngle = rng() * Math.PI * 2;
  const hlX = n(Math.cos(hlAngle) * baseR * 0.5);
  const hlY = n(Math.sin(hlAngle) * baseR * 0.4);

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(baseR + 0.8)} fill="none" stroke="#38bdf8" strokeWidth="0.2" opacity="0.7" />}

      {/* Hyalomere — pale outer zone */}
      <path d={outline} fill={stain.plateletOuter} opacity={0.75} />

      {/* Refractile bright edge highlight */}
      <path d={outline} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.06" />

      {/* Granulomere — dense dark central cluster */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr}
          fill={stain.plateletInner} opacity={g.o} />
      ))}

      {/* Subtle refractile highlight spot */}
      <circle cx={hlX} cy={hlY} r={n(baseR * 0.2)} fill="rgba(255,255,255,0.15)" />
    </g>
  );
}
