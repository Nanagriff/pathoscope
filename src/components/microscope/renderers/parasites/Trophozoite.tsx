/**
 * Trophozoite (mature feeding stage) — standalone renderer.
 *
 * P. falciparum: compact, rarely seen peripherally.
 * P. vivax: large amoeboid, fills enlarged RBC.
 * P. malariae: BAND FORM — stretches across the RBC as a transverse bar (pathognomonic).
 * P. ovale: compact, similar to vivax but smaller.
 */

import { createRng, irregularCellPath } from "../../types";
import { n, type ParasiteStageProps } from "../shared";

export function Trophozoite({ seed, baseR, stain, isVivax, species }: ParasiteStageProps) {
  const rng = createRng(seed);
  const isMalariae = species === "pm";

  if (isMalariae) {
    // ── P. malariae BAND FORM — pathognomonic ──
    // A transverse bar of cytoplasm stretching across the full RBC diameter
    const bandW = n(baseR * 1.4 + rng() * 0.4); // width across cell
    const bandH = n(0.8 + rng() * 0.4); // thickness of band
    const halfW = bandW / 2;
    const rot = n(rng() * 360); // random orientation
    const chromR = n(0.3 + rng() * 0.15);
    const chromX = n((rng() - 0.5) * halfW * 0.3);

    // Pigment along the band
    const pigmentCount = 3 + Math.floor(rng() * 3);
    const pigments = Array.from({ length: pigmentCount }, () => ({
      px: n((rng() - 0.5) * bandW * 0.7),
      py: n((rng() - 0.5) * bandH * 0.4),
      pr: n(0.07 + rng() * 0.05),
    }));

    // Band shape — slightly irregular rectangle
    const d = `M${n(-halfW)},${n(-bandH / 2)} Q${n(-halfW * 0.3)},${n(-bandH / 2 - rng() * 0.2)},0,${n(-bandH / 2)} Q${n(halfW * 0.3)},${n(-bandH / 2 + rng() * 0.15)},${n(halfW)},${n(-bandH / 2 + rng() * 0.1)} L${n(halfW)},${n(bandH / 2 - rng() * 0.1)} Q${n(halfW * 0.3)},${n(bandH / 2 + rng() * 0.15)},0,${n(bandH / 2)} Q${n(-halfW * 0.3)},${n(bandH / 2 - rng() * 0.2)},${n(-halfW)},${n(bandH / 2)} Z`;

    return (
      <g transform={`rotate(${rot})`}>
        <path d={d} fill={stain.nucleusParachromatin} opacity={0.4} />
        {/* Chromatin mass — central */}
        <circle cx={chromX} cy={0} r={chromR} fill={stain.chromatinPrimary} opacity={0.7} />
        {/* Hemozoin pigment along band */}
        {pigments.map((p, i) => (
          <circle key={i} cx={p.px} cy={p.py} r={p.pr} fill="#1a0c04" opacity={0.55} />
        ))}
      </g>
    );
  }

  // ── P. vivax: large amoeboid / P. falciparum: compact / P. ovale: intermediate ──
  const tScale = isVivax ? 0.6 : 0.45;
  const tWobble = isVivax ? 0.55 : 0.4;
  const tR = n(baseR * tScale + rng() * 0.2);
  const tPath = irregularCellPath(rng, tR, isVivax ? 12 : 8, tWobble);
  const chromR = n(tR * 0.25 + rng() * 0.1);
  const chromX = n((rng() - 0.5) * tR * 0.4);
  const chromY = n((rng() - 0.5) * tR * 0.4);
  const pigmentCount = (isVivax ? 4 : 2) + Math.floor(rng() * 3);

  const pigments = Array.from({ length: pigmentCount }, () => ({
    px: n((rng() - 0.5) * tR * 0.7),
    py: n((rng() - 0.5) * tR * 0.7),
    pr: n(0.06 + rng() * 0.05),
  }));

  return (
    <g>
      <path d={tPath} fill={stain.nucleusParachromatin} opacity={isVivax ? 0.35 : 0.45} />
      <circle cx={chromX} cy={chromY} r={chromR}
        fill={stain.chromatinPrimary} opacity={0.7} />
      {pigments.map((p, i) => (
        <circle key={i} cx={p.px} cy={p.py} r={p.pr} fill="#1a0c04" opacity={0.5} />
      ))}
    </g>
  );
}
