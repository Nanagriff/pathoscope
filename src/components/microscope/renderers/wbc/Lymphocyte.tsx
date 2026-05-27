/**
 * Lymphocyte renderer — large dense round nucleus with thin cytoplasm rim.
 *
 * Ref: LARGE dense round dark purple nucleus that fills most of
 * the cell. Very thin rim of pale blue-purple cytoplasm visible.
 * High nuclear:cytoplasmic ratio. Nucleus has visible chromatin
 * clumping. No visible granules.
 */

import { createRng, irregularCellPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Lymphocyte({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(3.8 + rng() * 0.8);
  const nucleusR = n(r * (0.78 + rng() * 0.1)); // very high N:C ratio
  const nx = n((rng() - 0.5) * 0.3);
  const ny = n((rng() - 0.5) * 0.3);
  const nucleusPath = irregularCellPath(rng, nucleusR, 10, 0.15);

  // Dense chromatin clumps — condensed chromatin pattern
  const clumps: { cx: number; cy: number; cr: number; o: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * nucleusR * 0.55;
    clumps.push({
      cx: n(Math.cos(a) * d), cy: n(Math.sin(a) * d),
      cr: n(0.25 + rng() * 0.4), o: n(0.15 + rng() * 0.2),
    });
  }

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      {/* Deep purple cytoplasm rim */}
      <circle r={r} fill="url(#lymphocyte-cyto)" opacity={0.65} filter="url(#cyto-tex)" />

      {/* Very dark dense round nucleus */}
      <g transform={`translate(${nx},${ny})`} filter="url(#wbc-soft)">
        <path d={nucleusPath} fill={stain.nucleusFill} opacity={0.92} filter="url(#nucleus-tex)" />
        {/* Chromatin clumps */}
        {clumps.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.cr} fill={stain.nucleusDenseChromatin} opacity={c.o} />
        ))}
      </g>
    </g>
  );
}
