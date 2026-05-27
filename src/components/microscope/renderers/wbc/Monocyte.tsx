/**
 * Monocyte renderer — kidney-shaped nucleus with grey-blue cytoplasm.
 */

import { createRng } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Monocyte({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(6.0 + rng() * 0.8);
  const nw = n(2.5 + rng() * 0.5);
  const nh = n(2.0 + rng() * 0.4);
  const indent = n(0.55 + rng() * 0.35);

  const granules: { gx: number; gy: number; gr: number; o: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 1.5);
    granules.push({ gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d), gr: n(0.08 + rng() * 0.08), o: n(0.08 + rng() * 0.1) });
  }

  const lightPatches: { cx: number; cy: number; r: number; o: number }[] = [];
  for (let i = 0; i < 5; i++) {
    lightPatches.push({
      cx: n((rng() - 0.5) * nw * 1.2), cy: n((rng() - 0.5) * nh * 0.8),
      r: n(0.3 + rng() * 0.4), o: n(0.08 + rng() * 0.1),
    });
  }

  const filter = dofFilter(depth);
  const p = (v: number) => v + (rng() - 0.5) * 0.5;

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={r + 1.5} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}
      <circle r={r} fill="url(#monocyte-cyto)" opacity={0.65} filter="url(#cyto-tex)" />
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={stain.monocyteCyto[1]} opacity={g.o} />
      ))}
      <g filter="url(#wbc-soft)">
        <path
          d={`M ${-nw} 0 Q ${p(-nw)} ${p(-nh)}, ${p(0)} ${-nh}
              Q ${p(nw)} ${p(-nh)}, ${nw} 0
              Q ${p(nw)} ${p(nh)}, ${p(0)} ${nh * indent}
              Q ${p(-nw)} ${p(nh)}, ${-nw} 0 Z`}
          fill={stain.nucleusFill} opacity={0.90} filter="url(#nucleus-tex)" />
        {lightPatches.map((lp, i) => (
          <circle key={`lp${i}`} cx={lp.cx} cy={lp.cy} r={lp.r} fill={stain.nucleusParachromatin} opacity={lp.o} />
        ))}
      </g>
    </g>
  );
}
