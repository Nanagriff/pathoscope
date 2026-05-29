/**
 * Triple phosphate crystal (struvite) — 3D "coffin lid" prism.
 *
 * Colourless transparent 3D prismatic crystal. Classic coffin-lid
 * hexagonal shape with visible facets showing depth. Sharp refractile
 * edges. Some appear as elongated prisms, some as wide coffin lids,
 * some tilted showing a 3D parallelogram face.
 *
 * Found in alkaline urine. Associated with UTI (urease-producing organisms).
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function TriplePhosphate({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const w = n(6 + rng() * 6); // large — much bigger than WBCs
  const h = n(w * (1.2 + rng() * 0.8)); // can be quite elongated
  const rot = n(rng() * 360);

  // 3D depth offset — simulates viewing angle
  const depthX = n(w * (0.08 + rng() * 0.12) * (rng() > 0.5 ? 1 : -1));
  const depthY = n(h * (0.06 + rng() * 0.08));

  // Bevel height at top and bottom
  const bevelH = n(h * (0.12 + rng() * 0.1));

  // Front face — classic coffin lid hexagon
  const frontPath = [
    `M${n(-w/2)},${n(-h/2 + bevelH)}`,
    `L0,${n(-h/2)}`,
    `L${n(w/2)},${n(-h/2 + bevelH)}`,
    `L${n(w/2)},${n(h/2 - bevelH)}`,
    `L0,${n(h/2)}`,
    `L${n(-w/2)},${n(h/2 - bevelH)}`,
    "Z",
  ].join(" ");

  // Back face — offset to show 3D depth
  const backPath = [
    `M${n(-w/2 + depthX)},${n(-h/2 + bevelH - depthY)}`,
    `L${n(depthX)},${n(-h/2 - depthY)}`,
    `L${n(w/2 + depthX)},${n(-h/2 + bevelH - depthY)}`,
    `L${n(w/2 + depthX)},${n(h/2 - bevelH - depthY)}`,
    `L${n(depthX)},${n(h/2 - depthY)}`,
    `L${n(-w/2 + depthX)},${n(h/2 - bevelH - depthY)}`,
    "Z",
  ].join(" ");

  // Connecting edges between front and back faces (3D depth lines)
  const edges: [number, number, number, number][] = [
    [-w/2, -h/2 + bevelH, -w/2 + depthX, -h/2 + bevelH - depthY],
    [0, -h/2, depthX, -h/2 - depthY],
    [w/2, -h/2 + bevelH, w/2 + depthX, -h/2 + bevelH - depthY],
    [w/2, h/2 - bevelH, w/2 + depthX, h/2 - bevelH - depthY],
    [0, h/2, depthX, h/2 - depthY],
    [-w/2, h/2 - bevelH, -w/2 + depthX, h/2 - bevelH - depthY],
  ];

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Back face — darker */}
      <path d={backPath} fill="rgba(140,150,160,0.15)" stroke="#606878" strokeWidth={0.08} opacity={0.4} />

      {/* 3D connecting edges — dark side faces */}
      {edges.map((e, i) => (
        <line key={i} x1={n(e[0])} y1={n(e[1])} x2={n(e[2])} y2={n(e[3])}
          stroke="#505868" strokeWidth={0.08} opacity={0.4} />
      ))}

      {/* Side face fills — dark shading on the visible side panels */}
      {depthX > 0 ? (
        <path d={`M${n(w/2)},${n(-h/2 + bevelH)} L${n(w/2 + depthX)},${n(-h/2 + bevelH - depthY)} L${n(w/2 + depthX)},${n(h/2 - bevelH - depthY)} L${n(w/2)},${n(h/2 - bevelH)} Z`}
          fill="rgba(100,110,120,0.18)" stroke="#505868" strokeWidth={0.04} opacity={0.35} />
      ) : (
        <path d={`M${n(-w/2)},${n(-h/2 + bevelH)} L${n(-w/2 + depthX)},${n(-h/2 + bevelH - depthY)} L${n(-w/2 + depthX)},${n(h/2 - bevelH - depthY)} L${n(-w/2)},${n(h/2 - bevelH)} Z`}
          fill="rgba(100,110,120,0.18)" stroke="#505868" strokeWidth={0.04} opacity={0.35} />
      )}

      {/* Front face — main visible surface */}
      <path d={frontPath} fill="rgba(200,208,215,0.08)" />
      <path d={frontPath} fill="none" stroke="#505868" strokeWidth={0.14} opacity={0.55} />

      {/* Top bevel facet — darker shading */}
      <path d={`M${n(-w/2)},${n(-h/2 + bevelH)} L0,${n(-h/2)} L${n(w/2)},${n(-h/2 + bevelH)} L${n(w/2 + depthX)},${n(-h/2 + bevelH - depthY)} L${n(depthX)},${n(-h/2 - depthY)} L${n(-w/2 + depthX)},${n(-h/2 + bevelH - depthY)} Z`}
        fill="rgba(110,120,130,0.15)" stroke="#505868" strokeWidth={0.05} opacity={0.35} />

      {/* Bottom bevel facet — darker shading */}
      <path d={`M${n(-w/2)},${n(h/2 - bevelH)} L0,${n(h/2)} L${n(w/2)},${n(h/2 - bevelH)} L${n(w/2 + depthX)},${n(h/2 - bevelH - depthY)} L${n(depthX)},${n(h/2 - depthY)} L${n(-w/2 + depthX)},${n(h/2 - bevelH - depthY)} Z`}
        fill="rgba(110,120,130,0.12)" stroke="#505868" strokeWidth={0.05} opacity={0.3} />

      {/* Refractile highlight — bright edge on one side */}
      <line x1={n(-w/2)} y1={n(-h/2 + bevelH)} x2={n(-w/2)} y2={n(h/2 - bevelH)}
        stroke="rgba(255,255,255,0.2)" strokeWidth={0.06} />
      <line x1={0} y1={n(-h/2)} x2={n(w/2)} y2={n(-h/2 + bevelH)}
        stroke="rgba(255,255,255,0.12)" strokeWidth={0.04} />
    </g>
  );
}
