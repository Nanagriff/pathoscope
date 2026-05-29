/**
 * Basophil renderer — dense dark purple granules obscuring bilobed nucleus.
 *
 * Ref: Round cell almost entirely covered by DENSE dark purple
 * metachromatic granules. Bilobed nucleus barely visible beneath.
 * Granules are large and very numerous, nearly filling the cell.
 * Irregular cell membrane. Rarest WBC (<1%).
 */

import { createRng, irregularCellPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Basophil({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(6.2 + rng() * 0.8); // ~15 µm

  // Irregular cell outline
  const cellPath = irregularCellPath(rng, r, 14, 0.1);

  // Bilobed nucleus — large, fills most of cell (obscured by granules)
  const sep = n(1.2 + rng() * 0.5);
  const lr = n(r * (0.35 + rng() * 0.05));
  const lobe1 = irregularCellPath(rng, lr, 10, 0.25);
  const lobe2 = irregularCellPath(rng, lr, 10, 0.25);

  // Dense fine dark purple granules — smaller, fainter, numerous
  const granules: { gx: number; gy: number; gr: number; o: number }[] = [];
  for (let i = 0; i < 1000; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 0.3);
    granules.push({
      gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d),
      gr: n(0.06 + rng() * 0.08),
      o: n(0.15 + rng() * 0.2),
    });
  }

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      {/* Irregular cytoplasm body */}
      <path d={cellPath} fill="url(#basophil-cyto)" opacity={0.5} filter="url(#cyto-tex)" />

      {/* Nucleus — deep purple, clearly visible */}
      <g filter="url(#wbc-soft)">
        <g transform={`translate(${n(-sep)},0)`}>
          <path d={lobe1} fill={stain.nucleusFill} opacity={1} filter="url(#nucleus-tex)" />
        </g>
        <g transform={`translate(${n(sep)},0)`}>
          <path d={lobe2} fill={stain.nucleusFill} opacity={1} filter="url(#nucleus-tex)" />
        </g>
      </g>

      {/* Dense dark purple granules ON TOP — obscure nucleus */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={stain.basophilGranule} opacity={g.o} />
      ))}
    </g>
  );
}
