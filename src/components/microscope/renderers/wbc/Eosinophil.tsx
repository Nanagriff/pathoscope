/**
 * Eosinophil — bilobed nucleus with large orange-red granules.
 *
 * Spine-based ribbon pinched once to create a bilobed (dumbbell) shape.
 * Large bright eosinophilic granules fill the cytoplasm.
 */

import { createRng, irregularCellPath, lobulatedNucleusPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function Eosinophil({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(5.6 + rng() * 0.6); // ~13 µm — eosinophil slightly smaller than neutrophil

  const cellPath = irregularCellPath(rng, r, 14, 0.14);

  // Bilobed: spine ribbon pinched once (deep constriction)
  const arcR = n(r * (0.34 + rng() * 0.06));
  const lobeHW = n(r * (0.20 + rng() * 0.04));
  const constrHW = n(r * (0.04 + rng() * 0.02)); // very narrow bridge
  const nucleusPath = lobulatedNucleusPath(rng, 2, arcR, lobeHW, constrHW);

  const ncx = n((rng() - 0.5) * 0.3);
  const ncy = n((rng() - 0.5) * 0.3);
  const nrot = n(rng() * 360);

  // Fine pink eosinophilic granules — same density as neutrophil
  const [gR, gG, gB] = stain.eosinophilGranule;
  const granules: { gx: number; gy: number; gr: number; o: number; hue: string }[] = [];
  for (let i = 0; i < 1000; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 0.4);
    granules.push({
      gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d),
      gr: n(0.03 + rng() * 0.04),
      o: n(0.08 + rng() * 0.10),
      hue: `rgb(${gR + Math.floor((rng() - 0.5) * 30)},${gG + Math.floor((rng() - 0.5) * 20)},${gB + Math.floor((rng() - 0.5) * 15)})`,
    });
  }
  // Scattered deep purple granules among the pink
  for (let i = 0; i < 100; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 0.4);
    granules.push({
      gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d),
      gr: n(0.04 + rng() * 0.07),
      o: n(0.08 + rng() * 0.10),
      hue: stain.neutrophilGranule,
    });
  }

  const chromatin: { cx: number; cy: number; cr: number; o: number; light: boolean }[] = [];
  for (let i = 0; i < 10; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (arcR + lobeHW * 0.5);
    chromatin.push({
      cx: n(Math.cos(a) * d), cy: n(Math.sin(a) * d),
      cr: n(0.25 + rng() * 0.4),
      o: n(0.15 + rng() * 0.2),
      light: rng() > 0.55,
    });
  }

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      <path d={cellPath} fill="url(#eosinophil-cyto)" opacity={0.8} filter="url(#cyto-tex)" />

      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={g.hue} opacity={g.o} />
      ))}

      <g transform={`translate(${ncx},${ncy}) rotate(${nrot})`} filter="url(#wbc-soft)" opacity={0.92}>
        <path d={nucleusPath} fill={stain.nucleusFill} filter="url(#nucleus-tex)" />
        {chromatin.map((c, i) => (
          <circle key={`ch${i}`} cx={c.cx} cy={c.cy} r={c.cr}
            fill={c.light ? stain.nucleusParachromatin : stain.nucleusDenseChromatin}
            opacity={c.o} />
        ))}
      </g>
    </g>
  );
}
