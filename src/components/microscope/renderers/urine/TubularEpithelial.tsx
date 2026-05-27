/**
 * Renal tubular epithelial cell (RTE).
 * SMALL (~15-20μm, similar to WBC size), round/oval.
 * KEY FEATURE: intracytoplasmic PIGMENTED GRANULES (golden-brown/amber).
 * Clinically significant — indicates renal tubular damage.
 * Ref: Images 51-52 — small cells with prominent amber granules.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function TubularEpithelial({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const r = n(2.2 + rng() * 0.8); // small — WBC-sized
  const rot = n(rng() * 360);
  const bodyOpacity = n(0.18 + rng() * 0.1);

  // Nucleus — relatively large for cell size
  const nucX = n((rng() - 0.5) * r * 0.3);
  const nucY = n((rng() - 0.5) * r * 0.3);
  const nucR = n(r * 0.3 + rng() * 0.1);

  // PIGMENTED GRANULES — golden-brown/amber (KEY diagnostic feature)
  const granuleCount = 6 + Math.floor(rng() * 8);
  const granules = Array.from({ length: granuleCount }, () => ({
    gx: n((rng() - 0.5) * r * 1.2),
    gy: n((rng() - 0.5) * r * 1.2),
    gr: n(0.12 + rng() * 0.12),
  }));

  // Some cells have more granules (heavily pigmented)
  const isHeavy = rng() < 0.3;
  const extraGranules = isHeavy ? Array.from({ length: 8 + Math.floor(rng() * 6) }, () => ({
    gx: n((rng() - 0.5) * r * 1.0),
    gy: n((rng() - 0.5) * r * 1.0),
    gr: n(0.08 + rng() * 0.1),
  })) : [];

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Cell body — small, grey, slightly granular */}
      <circle r={r} fill="#a8a898" opacity={bodyOpacity} />
      <circle r={r} fill="none" stroke="#888878" strokeWidth={0.08} opacity={n(bodyOpacity * 0.8)} />

      {/* GOLDEN-BROWN PIGMENTED GRANULES — the diagnostic clue */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr}
          fill="#b89030" opacity={n(0.3 + rng() * 0.25)} />
      ))}
      {extraGranules.map((g, i) => (
        <circle key={`e${i}`} cx={g.gx} cy={g.gy} r={g.gr}
          fill="#c8a040" opacity={n(0.25 + rng() * 0.2)} />
      ))}

      {/* Nucleus */}
      <circle cx={nucX} cy={nucY} r={nucR} fill="#586050" opacity={0.2} />
    </g>
  );
}
