/**
 * Neutrophil renderer — multilobed nucleus with fine purple granules.
 *
 * Ref: 2-4 chunky S/C-shaped dark lobes connected by thin bridges.
 * Visible pink-purple cytoplasm with fine PURPLE granules throughout.
 * Nucleus ~40-50% of cell. Lobes very dark, almost black.
 */

import { createRng, irregularCellPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Neutrophil({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(5.0 + rng() * 0.8);
  const lobeCount = 2 + Math.floor(rng() * 2); // 2-3 lobes

  // Lobes clearly separated — spaced apart with cytoplasm visible between them
  const lobes: { path: string; cx: number; cy: number }[] = [];
  const baseAngle = rng() * Math.PI * 2;
  for (let i = 0; i < lobeCount; i++) {
    const angle = baseAngle + (i / lobeCount) * Math.PI * 2 + (rng() - 0.5) * 0.4;
    const dist = n(1.5 + rng() * 0.8); // spread apart so lobes are distinct
    const lobeR = n(1.2 + rng() * 0.4);
    lobes.push({
      path: irregularCellPath(rng, lobeR, 8, 0.3),
      cx: n(Math.cos(angle) * dist),
      cy: n(Math.sin(angle) * dist),
    });
  }

  // Dense dark purple-pink granules — packed inside cytoplasm
  const granules: { gx: number; gy: number; gr: number; o: number }[] = [];
  for (let i = 0; i < 80; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 0.3);
    granules.push({ gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d), gr: n(0.12 + rng() * 0.16), o: n(0.2 + rng() * 0.28) });
  }

  // Curved bridge control points between lobes
  const bridges: { x1: number; y1: number; cpx: number; cpy: number; x2: number; y2: number }[] = [];
  for (let i = 1; i < lobes.length; i++) {
    const prev = lobes[i - 1];
    const curr = lobes[i];
    const mx = (prev.cx + curr.cx) / 2;
    const my = (prev.cy + curr.cy) / 2;
    // Perpendicular offset for curve
    const dx = curr.cx - prev.cx;
    const dy = curr.cy - prev.cy;
    const curveOff = n((rng() - 0.5) * 1.2);
    bridges.push({
      x1: prev.cx, y1: prev.cy,
      cpx: n(mx + -dy * 0.3 + curveOff), cpy: n(my + dx * 0.3 + curveOff),
      x2: curr.cx, y2: curr.cy,
    });
  }

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      {/* Deep purple cytoplasm */}
      <circle r={r} fill="url(#neutrophil-cyto)" opacity={0.7} filter="url(#cyto-tex)" />

      {/* Dense dark purple-pink granules */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={stain.neutrophilGranule} opacity={g.o} />
      ))}

      {/* Very dark nuclear lobes — clearly separated */}
      <g filter="url(#wbc-soft)">
        {lobes.map((l, i) => (
          <g key={i} transform={`translate(${l.cx},${l.cy})`}>
            <path d={l.path} fill={stain.nucleusFill} opacity={0.92} filter="url(#nucleus-tex)" />
          </g>
        ))}
        {/* Curved chromatin bridges */}
        {bridges.map((b, i) => (
          <path key={i}
            d={`M${b.x1},${b.y1} Q${b.cpx},${b.cpy} ${b.x2},${b.y2}`}
            fill="none" stroke={stain.nucleusFill} strokeWidth="0.3" opacity={0.88} />
        ))}
      </g>
    </g>
  );
}
