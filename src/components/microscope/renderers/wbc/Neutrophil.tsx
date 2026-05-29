/**
 * Neutrophil — mature segmented form (Wright-Giemsa, 100× oil).
 *
 * The nucleus is a CURVED RIBBON (C/S-shaped) pinched into 3-4 segments.
 * Think: "a thick curved sausage constricted several times."
 * NOT: "lobes radiating from a central hub."
 *
 * Cytoplasm: pale pink/lilac, fine barely-visible granulation.
 * Chromatin: coarse, condensed, dark purple clumps.
 */

import { createRng, irregularCellPath, lobulatedNucleusPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Neutrophil({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(6.2 + rng() * 0.8); // ~15 µm
  const lobeCount = 3 + Math.floor(rng() * 2); // 3-4

  // Slightly irregular cell membrane
  const cellPath = irregularCellPath(rng, r, 14, 0.14);

  // Spine-based segmented nucleus — elongated C-shape
  const arcR = n(r * (0.42 + rng() * 0.06));     // larger arc = more elongated C
  const lobeHW = n(r * (0.22 + rng() * 0.04));   // ribbon half-width at lobes
  const constrHW = n(r * (0.02 + rng() * 0.02)); // very thin constrictions
  const nucleusPath = lobulatedNucleusPath(rng, lobeCount, arcR, lobeHW, constrHW);

  // Slight off-center
  const ncx = n((rng() - 0.5) * 0.4);
  const ncy = n((rng() - 0.5) * 0.4);

  // Fine cytoplasmic granules — subtle but present
  const granules: { gx: number; gy: number; gr: number; o: number }[] = [];
  for (let i = 0; i < 800; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 0.4);
    granules.push({
      gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d),
      gr: n(0.04 + rng() * 0.07),
      o: n(0.12 + rng() * 0.18),
    });
  }

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      <path d={cellPath} fill="url(#neutrophil-cyto)" opacity={0.92} filter="url(#cyto-tex)" />

      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={stain.neutrophilGranule} opacity={g.o} />
      ))}

      {/* Nucleus — texture comes from nucleus-tex filter, no extra circles needed */}
      <g transform={`translate(${ncx},${ncy})`} filter="url(#wbc-soft)" opacity={1}>
        <path d={nucleusPath} fill={stain.nucleusFill} filter="url(#nucleus-tex)" />
      </g>
    </g>
  );
}
