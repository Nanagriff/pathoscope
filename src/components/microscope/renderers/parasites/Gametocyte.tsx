/**
 * Gametocyte (sexual stage) — standalone renderer.
 *
 * P. falciparum: banana/crescent shape (PATHOGNOMONIC).
 *   - Some show Laveran's bib — a faint arc of residual RBC membrane
 *     draped over one side of the gametocyte, like a vestment/bib.
 *     This occurs when the gametocyte distorts the RBC so much that
 *     the membrane remnant is visible as a pale crescent hugging the parasite.
 *
 * P. vivax/ovale/malariae: ROUND/OVAL, fills the (enlarged) RBC.
 */

import { createRng, irregularCellPath } from "../../types";
import { n, type ParasiteStageProps } from "../shared";

export function Gametocyte({ seed, baseR, stain, isVivax, forceBib }: ParasiteStageProps) {
  const rng = createRng(seed);

  if (isVivax) {
    // ── P. vivax/ovale/malariae gametocyte: ROUND/OVAL ──
    const gR = n(baseR * 0.65 + rng() * 0.15);
    const outline = irregularCellPath(rng, gR, 10, 0.12);
    const chromR = n(gR * 0.3 + rng() * 0.1);
    const chromX = n((rng() - 0.5) * gR * 0.3);
    const chromY = n((rng() - 0.5) * gR * 0.3);

    const pigmentCount = 6 + Math.floor(rng() * 5);
    const pigments = Array.from({ length: pigmentCount }, () => ({
      px: n((rng() - 0.5) * gR * 0.8),
      py: n((rng() - 0.5) * gR * 0.8),
      pr: n(0.06 + rng() * 0.05),
    }));

    return (
      <g>
        <path d={outline} fill={stain.nucleusParachromatin} opacity={0.35} />
        <circle cx={chromX} cy={chromY} r={chromR}
          fill={stain.chromatinPrimary} opacity={0.65} />
        {pigments.map((p, i) => (
          <circle key={i} cx={p.px} cy={p.py} r={p.pr} fill="#1a0c04" opacity={0.5} />
        ))}
      </g>
    );
  }

  // ── P. falciparum gametocyte: BANANA/CRESCENT ──
  const gLen = n(baseR * 1.4 + rng() * 0.6);
  const gW = n(0.8 + rng() * 0.3);
  const gCurve = n(0.4 + rng() * 0.3);
  const halfL = gLen / 2;
  const rot = n(rng() * 360);

  // Banana shape
  const gd = `M${n(-halfL)},0 C${n(-halfL * 0.6)},${n(-gW - gCurve)},${n(halfL * 0.6)},${n(-gW - gCurve)},${n(halfL)},0 C${n(halfL * 0.6)},${n(gW * 0.4 + gCurve * 0.2)},${n(-halfL * 0.6)},${n(gW * 0.4 + gCurve * 0.2)},${n(-halfL)},0 Z`;

  const chromX = n((rng() - 0.5) * halfL * 0.3);
  const chromY = n(-gW * 0.3);
  const pigmentCount = 3 + Math.floor(rng() * 3);
  const pigments = Array.from({ length: pigmentCount }, () => ({
    px: n((rng() - 0.5) * gLen * 0.6),
    py: n(-gW * 0.2 + (rng() - 0.5) * gW * 0.3),
    pr: n(0.06 + rng() * 0.04),
  }));

  // ── Laveran's bib — ~30% of P. falciparum gametocytes show this ──
  // A faint arc of residual RBC membrane draped over one side
  const showBib = forceBib || rng() < 0.3;
  const bibSide = rng() > 0.5 ? 1 : -1; // which side of the crescent
  const bibR = n(halfL * 0.8 + rng() * 0.3);
  const bibOffY = n(bibSide * (gW * 0.3 + gCurve * 0.4));
  // Bib arc — a thin crescent hugging the convex side of the gametocyte
  const bibArcStart = n(-halfL * 0.7);
  const bibArcEnd = n(halfL * 0.7);
  const bibCurveY = n(bibOffY + bibSide * (1.2 + rng() * 0.5));

  return (
    <g transform={`rotate(${rot})`}>
      {/* Laveran's bib — faint RBC membrane remnant */}
      {showBib && (
        <path
          d={`M${bibArcStart},${bibOffY} Q0,${bibCurveY},${bibArcEnd},${bibOffY}`}
          fill="none"
          stroke={stain.rbcGradients[0][3]}
          strokeWidth={n(0.3 + rng() * 0.2)}
          strokeOpacity={0.2 + rng() * 0.1}
          strokeLinecap="round"
        />
      )}

      {/* Banana-shaped parasite body */}
      <path d={gd} fill={stain.nucleusFill} opacity={0.7} />
      <path d={gd} fill={stain.nucleusParachromatin} opacity={0.2} />

      {/* Chromatin mass */}
      <circle cx={chromX} cy={chromY} r={n(0.3 + rng() * 0.15)}
        fill={stain.chromatinPrimary} opacity={0.7} />

      {/* Hemozoin pigment granules */}
      {pigments.map((p, i) => (
        <circle key={i} cx={p.px} cy={p.py} r={p.pr} fill="#1a0c04" opacity={0.5} />
      ))}
    </g>
  );
}
