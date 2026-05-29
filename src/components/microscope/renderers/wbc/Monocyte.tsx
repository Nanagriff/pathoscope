/**
 * Monocyte renderer — kidney-shaped nucleus with grey-blue cytoplasm.
 *
 * Ref (Wright-Giemsa): Largest WBC (15-20 µm). Kidney/horseshoe-shaped
 * purple nucleus with "lacy" less-condensed chromatin pattern.
 * Abundant blue-grey cytoplasm with fine azurophilic granules and
 * occasional vacuoles. Irregular cell membrane.
 */

import { createRng, irregularCellPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Monocyte({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(7.4 + rng() * 0.8); // ~18 µm, largest WBC

  // Irregular cell outline
  const cellPath = irregularCellPath(rng, r, 14, 0.1);

  // Kidney-shaped nucleus dimensions
  const nw = n(2.6 + rng() * 0.5);
  const nh = n(2.0 + rng() * 0.4);
  const indent = n(0.55 + rng() * 0.35);

  // Fine azurophilic granules
  const granules: { gx: number; gy: number; gr: number; o: number }[] = [];
  for (let i = 0; i < 25; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 1.5);
    granules.push({
      gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d),
      gr: n(0.06 + rng() * 0.08),
      o: n(0.08 + rng() * 0.12),
    });
  }

  // Lacy chromatin — more lighter patches than lymphocyte
  const lightPatches: { cx: number; cy: number; r: number; o: number }[] = [];
  for (let i = 0; i < 7; i++) {
    lightPatches.push({
      cx: n((rng() - 0.5) * nw * 1.2), cy: n((rng() - 0.5) * nh * 0.8),
      r: n(0.25 + rng() * 0.4), o: n(0.1 + rng() * 0.12),
    });
  }

  // Cytoplasmic vacuoles (characteristic of monocytes) — always consume same RNG
  const vacuoles: { vx: number; vy: number; vr: number }[] = [];
  const vacuoleCount = Math.floor(rng() * 3); // 0-2 vacuoles
  for (let i = 0; i < 3; i++) {
    const a = rng() * Math.PI * 2;
    const d = r * (0.4 + rng() * 0.3);
    const vr = n(0.15 + rng() * 0.25);
    if (i < vacuoleCount) {
      vacuoles.push({ vx: n(Math.cos(a) * d), vy: n(Math.sin(a) * d), vr });
    }
  }

  const filter = dofFilter(depth);
  const p = (v: number) => v + (rng() - 0.5) * 0.5;

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      {/* Irregular cytoplasm body */}
      <path d={cellPath} fill="url(#monocyte-cyto)" opacity={0.8} filter="url(#cyto-tex)" />

      {/* Fine azurophilic granules */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={stain.monocyteCyto[1]} opacity={g.o} />
      ))}

      {/* Cytoplasmic vacuoles */}
      {vacuoles.map((v, i) => (
        <circle key={`v${i}`} cx={v.vx} cy={v.vy} r={v.vr}
          fill="rgba(255,255,255,0.12)" stroke="rgba(200,200,220,0.08)" strokeWidth="0.05" />
      ))}

      {/* Kidney-shaped nucleus */}
      <g filter="url(#wbc-soft)">
        <path
          d={`M ${-nw} 0 Q ${p(-nw)} ${p(-nh)}, ${p(0)} ${-nh}
              Q ${p(nw)} ${p(-nh)}, ${nw} 0
              Q ${p(nw)} ${p(nh)}, ${p(0)} ${nh * indent}
              Q ${p(-nw)} ${p(nh)}, ${-nw} 0 Z`}
          fill={stain.nucleusFill}
          stroke={stain.nucleusDenseChromatin} strokeWidth="0.1"
          opacity={0.88} filter="url(#nucleus-tex)" />
        {lightPatches.map((lp, i) => (
          <circle key={`lp${i}`} cx={lp.cx} cy={lp.cy} r={lp.r} fill={stain.nucleusParachromatin} opacity={lp.o} />
        ))}
      </g>
    </g>
  );
}
