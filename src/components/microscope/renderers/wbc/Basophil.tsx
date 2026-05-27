/**
 * Basophil renderer — dense dark blue-purple granules obscuring bilobed nucleus.
 *
 * Ref: round cell almost entirely covered by DENSE DARK BLUE-PURPLE
 * granules. Granules so dense they nearly obscure the bilobed nucleus.
 * Appears as a dark blue-purple ball. Nucleus barely visible beneath.
 */

import { createRng, irregularCellPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Basophil({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(4.8 + rng() * 0.6);

  // Very dense, large dark blue-purple granules — fill almost entire cell
  const granules: { gx: number; gy: number; gr: number; o: number }[] = [];
  for (let i = 0; i < 70; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 0.3);
    granules.push({
      gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d),
      gr: n(0.3 + rng() * 0.25), // large granules
      o: n(0.5 + rng() * 0.35),  // high opacity — dense
    });
  }

  // Bilobed nucleus barely visible beneath granules
  const sep = n(0.5 + rng() * 0.4);
  const lobeR = n(1.2 + rng() * 0.3);
  const lobe1 = irregularCellPath(rng, lobeR, 8, 0.25);
  const lobe2 = irregularCellPath(rng, lobeR, 8, 0.25);

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      <circle r={r} fill="url(#basophil-cyto)" opacity={0.4} filter="url(#cyto-tex)" />

      {/* Nucleus underneath — barely visible */}
      <g filter="url(#wbc-soft)">
        <g transform={`translate(${n(-sep)},0)`}>
          <path d={lobe1} fill={stain.nucleusFill} opacity={0.5} />
        </g>
        <g transform={`translate(${n(sep)},0)`}>
          <path d={lobe2} fill={stain.nucleusFill} opacity={0.5} />
        </g>
      </g>

      {/* Dense dark blue-purple granules ON TOP — obscure nucleus */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={stain.basophilGranule} opacity={g.o} />
      ))}
    </g>
  );
}
