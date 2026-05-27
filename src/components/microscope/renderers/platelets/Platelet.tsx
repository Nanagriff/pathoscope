/**
 * Platelet renderer — small elliptical body with inner granule zone.
 */

import { createRng } from "../../types";
import { dofFilter, type CellProps } from "../shared";

export function Platelet({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const rx = 0.9 + rng() * 0.5;
  const ry = rx * (0.75 + rng() * 0.4);
  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={rx + 0.8} fill="none" stroke="#38bdf8" strokeWidth="0.3" opacity="0.7" />}
      <ellipse rx={rx} ry={ry} fill={stain.plateletOuter} opacity={0.7} />
      <ellipse rx={rx * 0.5} ry={ry * 0.5} fill={stain.plateletInner} opacity={0.55} />
    </g>
  );
}
