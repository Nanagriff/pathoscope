/**
 * Normal RBC renderer — biconcave disc with central pallor.
 *
 * Variable sizes (anisocytosis), irregular shapes (poikilocytosis),
 * occasional elongated/oval forms. Not uniform.
 */

import { createRng, irregularCellPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function NormalRBC({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);

  // Size variation — wider range (microcytes to macrocytes)
  const sizeRoll = rng();
  const baseR = sizeRoll < 0.08 ? 2.2 + rng() * 0.4    // microcyte
    : sizeRoll > 0.92 ? 3.6 + rng() * 0.4               // macrocyte
    : 2.7 + rng() * 0.8;                                  // normocyte (smaller range)

  // Shape variation — higher wobble, occasional stretch
  const wobble = 0.14 + rng() * 0.18;
  const stretchRoll = rng();
  const stretchX = stretchRoll < 0.08 ? n(0.75 + rng() * 0.15) // occasional oval/elongated
    : stretchRoll > 0.95 ? n(1.1 + rng() * 0.15)
    : n(0.92 + rng() * 0.16);                             // slight natural variation
  const stretchY = n(2 - stretchX); // compensate to keep area roughly constant

  const outline = irregularCellPath(rng, baseR, 10, wobble);
  const gradIdx = Math.floor(rng() * 8);
  const pallorIdx = Math.floor(rng() * 6);
  const pallorScale = n(0.35 + rng() * 0.25);
  const pallorOffX = n((rng() - 0.5) * baseR * 0.25);
  const pallorOffY = n((rng() - 0.5) * baseR * 0.25);
  const opacity = n((0.72 + rng() * 0.2) * (1 - depth * 0.15)); // slightly lower base opacity
  const strokeW = n(0.04 + rng() * 0.08);
  const pallorRy = n(baseR * pallorScale * (0.82 + rng() * 0.36));
  const pallorOp = n(0.40 + rng() * 0.3);
  const pallorRot = n(rng() * 360);
  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation}) scale(${stretchX},${stretchY})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(baseR + 1.2)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}
      <path d={outline} fill={`url(#rbc-grad-${gradIdx})`} opacity={opacity}
        stroke={stain.membraneStroke} strokeWidth={strokeW} strokeOpacity={0.3} />
      <ellipse cx={pallorOffX} cy={pallorOffY}
        rx={n(baseR * pallorScale)} ry={pallorRy}
        fill={`url(#pallor-${pallorIdx})`} opacity={pallorOp}
        transform={`rotate(${pallorRot},${pallorOffX},${pallorOffY})`} />
    </g>
  );
}
