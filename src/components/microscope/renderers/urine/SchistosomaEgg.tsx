/**
 * Schistosoma haematobium egg — oval with terminal spine.
 *
 * 100-150 µm × 40-60 µm. Golden-brown, thick shell.
 * TERMINAL SPINE is the key diagnostic feature (distinguishes from
 * S. mansoni which has a lateral spine). May contain a visible
 * miracidium inside. Found in urine in bladder schistosomiasis.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function SchistosomaEgg({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const rx = n(6 + rng() * 2);  // ~100-150 µm scaled
  const ry = n(rx * (0.35 + rng() * 0.1)); // oval
  const rot = n(rng() * 360);
  const shellOpacity = n(0.35 + rng() * 0.1);

  // Terminal spine length and position
  const spineLen = n(rx * (0.3 + rng() * 0.15));

  // Miracidium (internal larva) — visible in some eggs
  const hasMiracidium = rng() > 0.4;
  const miracR = n(rx * 0.6);

  // Shell texture — subtle striations
  const striations: { y: number; o: number }[] = [];
  for (let i = 0; i < 6; i++) {
    striations.push({
      y: n((rng() - 0.5) * ry * 1.4),
      o: n(0.06 + rng() * 0.06),
    });
  }

  // Internal granules (yolk cells / vitelline cells)
  const granules: { gx: number; gy: number; gr: number; go: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * rx * 0.5;
    granules.push({
      gx: n(Math.cos(a) * d),
      gy: n(Math.sin(a) * d * (ry / rx)),
      gr: n(0.15 + rng() * 0.2),
      go: n(0.08 + rng() * 0.06),
    });
  }

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Egg shell — golden-brown oval */}
      <ellipse rx={rx} ry={ry} fill="#c4a860" opacity={shellOpacity} />
      <ellipse rx={rx} ry={ry} fill="none" stroke="#8a7840" strokeWidth={0.15} opacity={n(shellOpacity + 0.1)} />

      {/* Inner membrane */}
      <ellipse rx={n(rx * 0.9)} ry={n(ry * 0.85)} fill="none" stroke="#a09050" strokeWidth={0.06} opacity={0.12} />

      {/* Shell striations */}
      {striations.map((s, i) => (
        <line key={i} x1={n(-rx * 0.8)} y1={s.y} x2={n(rx * 0.8)} y2={s.y}
          stroke="#9a8848" strokeWidth={0.04} opacity={s.o} />
      ))}

      {/* Internal granules */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill="#8a7838" opacity={g.go} />
      ))}

      {/* Miracidium — dark oval mass inside */}
      {hasMiracidium && (
        <ellipse cx={0} cy={0} rx={miracR} ry={n(ry * 0.55)}
          fill="#706030" opacity={0.12} />
      )}

      {/* TERMINAL SPINE — key diagnostic feature */}
      <line x1={rx} y1={0} x2={n(rx + spineLen)} y2={0}
        stroke="#7a6838" strokeWidth={0.12} opacity={n(shellOpacity + 0.15)} />
      {/* Spine tip */}
      <circle cx={n(rx + spineLen)} cy={0} r={0.08} fill="#7a6838" opacity={0.4} />
    </g>
  );
}
