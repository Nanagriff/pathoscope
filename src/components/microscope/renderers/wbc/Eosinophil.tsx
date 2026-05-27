/**
 * Eosinophil renderer — bilobed nucleus with large pink-magenta granules.
 *
 * Ref: bilobed dark purple nucleus. Cytoplasm PACKED with large,
 * bright pink-magenta-orange refractile granules. Granules are
 * larger and more prominent than neutrophil granules. Nucleus
 * is clearly bilobed with thin bridge.
 */

import { createRng, irregularCellPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Eosinophil({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(5.0 + rng() * 0.8);
  const sep = n(1.4 + rng() * 0.6); // clearly separated bilobed
  const lobeR = n(1.2 + rng() * 0.4);
  const lobe1 = irregularCellPath(rng, lobeR, 8, 0.3);
  const lobe2 = irregularCellPath(rng, lobeR, 8, 0.3);

  // Dense pink-magenta granules packed everywhere
  const [gR, gG, gB] = stain.eosinophilGranule;
  const granules: { gx: number; gy: number; gr: number; o: number; hue: string }[] = [];
  for (let i = 0; i < 80; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 0.3);
    granules.push({
      gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d),
      gr: n(0.28 + rng() * 0.18),
      o: n(0.3 + rng() * 0.4),
      hue: `rgb(${gR + Math.floor((rng() - 0.5) * 40)},${gG + Math.floor((rng() - 0.5) * 30)},${gB})`,
    });
  }

  const lobeRot = n(rng() * 25 - 12);
  // Curved bridge between lobes
  const bridgeCurve = n((rng() - 0.5) * 1.5);
  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}
      <circle r={r} fill="url(#eosinophil-cyto)" opacity={0.65} filter="url(#cyto-tex)" />

      {/* Dense pink-magenta granules */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={g.hue} opacity={g.o} />
      ))}

      {/* Very dark bilobed nucleus — clearly separated */}
      <g filter="url(#wbc-soft)">
        <g transform={`translate(${n(-sep)},0) rotate(${lobeRot},0,0)`}>
          <path d={lobe1} fill={stain.nucleusFill} opacity={0.92} filter="url(#nucleus-tex)" />
        </g>
        <g transform={`translate(${n(sep)},0) rotate(${n(-lobeRot)},0,0)`}>
          <path d={lobe2} fill={stain.nucleusFill} opacity={0.92} filter="url(#nucleus-tex)" />
        </g>
        {/* Curved bridge */}
        <path d={`M${n(-sep + lobeR * 0.3)},0 Q0,${bridgeCurve} ${n(sep - lobeR * 0.3)},0`}
          fill="none" stroke={stain.nucleusFill} strokeWidth="0.3" opacity={0.85} />
      </g>
    </g>
  );
}
