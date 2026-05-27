/**
 * Clue cell — squamous epithelial cell covered with bacteria on surface.
 * The cell edge appears fuzzy/stippled due to adherent bacteria.
 * Pathognomonic for bacterial vaginosis (Gardnerella).
 */

import { createRng, irregularCellPath } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function ClueCell({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const r = n(10 + rng() * 5);
  const outline = irregularCellPath(rng, r, 10, 0.2);
  const rot = n(rng() * 360);
  const opacity = n(0.12 + rng() * 0.06);

  // Nucleus
  const nucX = n((rng() - 0.5) * r * 0.2);
  const nucY = n((rng() - 0.5) * r * 0.2);

  // Dense bacteria covering the cell surface — KEY feature
  // Bacteria are concentrated at the edges, making the border fuzzy
  const bacteriaCount = 60 + Math.floor(rng() * 40);
  const bacteria = Array.from({ length: bacteriaCount }, () => {
    const angle = rng() * Math.PI * 2;
    // Concentrate bacteria near and beyond the cell edge
    const dist = r * (0.6 + rng() * 0.6); // some inside, many at edge and beyond
    return {
      bx: n(Math.cos(angle) * dist + (rng() - 0.5) * 1),
      by: n(Math.sin(angle) * dist + (rng() - 0.5) * 1),
      br: n(0.08 + rng() * 0.08),
      bo: n(0.12 + rng() * 0.15),
    };
  });

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Cell body — pale, similar to squamous */}
      <path d={outline} fill="#b0b8a0" opacity={opacity} />

      {/* Dense bacteria covering surface — makes edge fuzzy/stippled */}
      {bacteria.map((b, i) => (
        <circle key={i} cx={b.bx} cy={b.by} r={b.br} fill="#606850" opacity={b.bo} />
      ))}

      {/* Faint nucleus visible through bacteria */}
      <circle cx={nucX} cy={nucY} r={n(1.0 + rng() * 0.3)} fill="#506048" opacity={0.12} />
    </g>
  );
}
