/**
 * Schizont — standalone renderer.
 *
 * P. falciparum: 8-24 merozoites, randomly scattered, rarely seen peripherally.
 * P. vivax: 12-24 merozoites in rosette pattern, enlarged RBC.
 * P. malariae: 6-12 merozoites in DAISY HEAD pattern (evenly spaced ring), normal RBC.
 * P. ovale: 8-12 merozoites, compact rosette, oval RBC.
 */

import { createRng } from "../../types";
import { n, type ParasiteStageProps } from "../shared";

export function Schizont({ seed, baseR, stain, isVivax, species }: ParasiteStageProps) {
  const rng = createRng(seed);
  const isMalariae = species === "pm";

  // Species-specific merozoite count
  const mCount = isMalariae
    ? 6 + Math.floor(rng() * 6)  // P. malariae: 6-12 (fewest)
    : isVivax
      ? 12 + Math.floor(rng() * 12) // P. vivax: 12-24
      : 8 + Math.floor(rng() * 14);  // P. falciparum: 8-22

  const mR = n(baseR * (isVivax ? 0.65 : isMalariae ? 0.50 : 0.55));

  const meros = Array.from({ length: mCount }, (_, i) => {
    if (isMalariae) {
      // DAISY HEAD — evenly spaced in a ring around central pigment
      const angle = (i / mCount) * Math.PI * 2 + rng() * 0.15; // very regular spacing
      const dist = mR * (0.7 + rng() * 0.1);
      return { mx: n(Math.cos(angle) * dist), my: n(Math.sin(angle) * dist), mr: n(0.25 + rng() * 0.1), o: n(0.75 + rng() * 0.15) };
    }
    if (isVivax && i < mCount * 0.7) {
      // Rosette — peripheral ring
      const angle = (i / (mCount * 0.7)) * Math.PI * 2 + rng() * 0.3;
      const dist = mR * (0.55 + rng() * 0.25);
      return { mx: n(Math.cos(angle) * dist), my: n(Math.sin(angle) * dist), mr: n(0.22 + rng() * 0.12), o: n(0.7 + rng() * 0.2) };
    }
    // Random scatter
    const a = rng() * Math.PI * 2;
    const d = rng() * mR * (isVivax ? 0.4 : 1);
    return { mx: n(Math.cos(a) * d), my: n(Math.sin(a) * d), mr: n(0.2 + rng() * 0.15), o: n(0.7 + rng() * 0.2) };
  });

  // Central pigment — malariae has a prominent dark central mass
  const pigX = n((rng() - 0.5) * mR * 0.2);
  const pigY = n((rng() - 0.5) * mR * 0.2);
  const pigR = n(isMalariae ? 0.35 + rng() * 0.2 : isVivax ? 0.3 + rng() * 0.2 : 0.25 + rng() * 0.15);

  // Extra scattered pigment (vivax + malariae)
  const extraPig = (isVivax || isMalariae) ? Array.from({ length: 2 + Math.floor(rng() * 2) }, () => ({
    px: n((rng() - 0.5) * mR * 0.4),
    py: n((rng() - 0.5) * mR * 0.4),
    pr: n(0.07 + rng() * 0.05),
  })) : [];

  return (
    <g>
      <circle cx={0} cy={0} r={mR} fill={stain.nucleusParachromatin} opacity={isMalariae ? 0.12 : isVivax ? 0.15 : 0.2} />
      {meros.map((m, i) => (
        <circle key={i} cx={m.mx} cy={m.my} r={m.mr}
          fill={stain.nucleusFill} opacity={m.o} />
      ))}
      <circle cx={pigX} cy={pigY} r={pigR} fill="#1a0c04" opacity={isMalariae ? 0.7 : 0.6} />
      {extraPig.map((p, i) => (
        <circle key={`ep${i}`} cx={p.px} cy={p.py} r={p.pr} fill="#1a0c04" opacity={0.45} />
      ))}
    </g>
  );
}
