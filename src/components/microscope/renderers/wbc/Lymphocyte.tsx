/**
 * Lymphocyte — small cell, enormous dark nucleus.
 *
 * ~10 µm (barely larger than an RBC). The nucleus fills 85-90% of the
 * cell — a single large, round, VERY dark purple mass with dense
 * condensed chromatin. Only a thin crescent of pale blue cytoplasm
 * is visible at one edge. No granules visible.
 *
 * This is the SMALLEST WBC type on the slide.
 */

import { createRng, irregularCellPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Lymphocyte({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(4.2 + rng() * 0.6); // ~10 µm — small, barely bigger than RBC

  // Slightly irregular cell outline
  const cellPath = irregularCellPath(rng, r, 14, 0.12);

  // Massive nucleus — 85-90% of cell radius
  const nucleusR = n(r * (0.85 + rng() * 0.05));
  // Offset toward one side so cytoplasm crescent is visible on the opposite edge
  const nx = n((rng() - 0.3) * 0.5);
  const ny = n((rng() - 0.3) * 0.5);
  const nucleusPath = irregularCellPath(rng, nucleusR, 12, 0.1);

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      {/* Thin cytoplasm rim — pale blue-lavender */}
      <path d={cellPath} fill="url(#lymphocyte-cyto)" opacity={0.9} filter="url(#cyto-tex)" />

      {/* Enormous dark nucleus */}
      <g transform={`translate(${nx},${ny})`} filter="url(#wbc-soft)">
        <path d={nucleusPath} fill={stain.nucleusFill} opacity={1} filter="url(#nucleus-tex)" />
      </g>
    </g>
  );
}
