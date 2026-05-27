/**
 * Normal RBC renderer — biconcave disc with central pallor.
 */

import { createRng, irregularCellPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";

export function NormalRBC({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);

  const sizeRoll = rng();
  const baseR = sizeRoll < 0.06 ? 2.6 + rng() * 0.3
    : sizeRoll > 0.94 ? 3.9 + rng() * 0.3
    : 3.1 + rng() * 0.7;

  const wobble = 0.12 + rng() * 0.14;
  const outline = irregularCellPath(rng, baseR, 10, wobble);
  const gradIdx = Math.floor(rng() * 8);
  const pallorIdx = Math.floor(rng() * 6);
  const pallorScale = n(0.35 + rng() * 0.25);
  const pallorOffX = n((rng() - 0.5) * baseR * 0.25);
  const pallorOffY = n((rng() - 0.5) * baseR * 0.25);
  const opacity = n((0.78 + rng() * 0.18) * (1 - depth * 0.15));
  const strokeW = n(0.06 + rng() * 0.1);
  const pallorRy = n(baseR * pallorScale * (0.82 + rng() * 0.36));
  const pallorOp = n(0.45 + rng() * 0.3);
  const pallorRot = n(rng() * 360);
  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(baseR + 1.2)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}
      <path d={outline} fill={`url(#rbc-grad-${gradIdx})`} opacity={opacity}
        stroke={stain.membraneStroke} strokeWidth={strokeW} strokeOpacity={0.35} />
      <ellipse cx={pallorOffX} cy={pallorOffY}
        rx={n(baseR * pallorScale)} ry={pallorRy}
        fill={`url(#pallor-${pallorIdx})`} opacity={pallorOp}
        transform={`rotate(${pallorRot},${pallorOffX},${pallorOffY})`} />
    </g>
  );
}
