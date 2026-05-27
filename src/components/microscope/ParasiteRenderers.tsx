/**
 * Stage-specific parasite SVG renderers.
 *
 * P. falciparum stages:
 *  - Ring: small delicate ring (already in CellRenderers as ParasitizedRBC for thin film)
 *  - Trophozoite: larger, irregular, with malaria pigment (hemozoin)
 *  - Schizont: round structure packed with merozoite dots
 *  - Gametocyte: distinctive banana/crescent shape (pathognomonic)
 *
 * These renderers are for FREE parasites (thick film — no host RBC).
 * For thin film, parasites are embedded inside ParasitizedRBC in CellRenderers.
 */

import { createRng, irregularCellPath } from "./types";
import type { StainProfile } from "./stainProfiles";

const n = (v: number) => Math.round(v * 10000) / 10000;

interface ParasiteProps {
  x: number;
  y: number;
  rotation: number;
  seed: number;
  stain: StainProfile;
}

// ── Free Ring Form (thick film) ──
// Small dark purple dot/arc — no host RBC

export function FreeRing({ x, y, rotation, seed, stain }: ParasiteProps) {
  const rng = createRng(seed);
  const r = n(0.8 + rng() * 0.4);
  const dotR = n(0.3 + rng() * 0.15);
  const arcAngle = rng() * Math.PI * 2;
  const dotX = n(Math.cos(arcAngle) * r * 0.5);
  const dotY = n(Math.sin(arcAngle) * r * 0.5);

  // Faint ring arc
  const hasArc = rng() > 0.3;
  const arcStart = n(arcAngle + 0.5);
  const arcEnd = n(arcStart + 2 + rng() * 2);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      {/* Chromatin dot — most visible part */}
      <circle cx={dotX} cy={dotY} r={dotR} fill={stain.chromatinPrimary} opacity={0.85} />
      {/* Faint ring cytoplasm */}
      {hasArc && (
        <circle cx={0} cy={0} r={r} fill="none"
          stroke={stain.parasiteRingStroke} strokeWidth={n(0.15 + rng() * 0.1)}
          strokeOpacity={0.5} strokeDasharray={`${n(arcEnd - arcStart)} ${n(6.28 - (arcEnd - arcStart))}`}
          strokeDashoffset={n(-arcStart)} />
      )}
    </g>
  );
}

// ── Free Trophozoite (thick film) ──
// Larger irregular purple structure with hemozoin pigment granules

export function FreeTrophozoite({ x, y, rotation, seed, stain }: ParasiteProps) {
  const rng = createRng(seed);
  const r = n(1.2 + rng() * 0.6);
  const outline = irregularCellPath(rng, r, 8, 0.35);

  // Hemozoin (malaria pigment) — small dark brown-black dots
  const pigment: { px: number; py: number; pr: number }[] = [];
  for (let i = 0; i < 3 + Math.floor(rng() * 3); i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * r * 0.5;
    pigment.push({ px: n(Math.cos(a) * d), py: n(Math.sin(a) * d), pr: n(0.1 + rng() * 0.08) });
  }

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      {/* Main body — dark purple, irregular */}
      <path d={outline} fill={stain.nucleusFill} opacity={0.75} />
      <path d={outline} fill={stain.nucleusParachromatin} opacity={0.2} />
      {/* Chromatin mass */}
      <circle cx={n((rng() - 0.5) * r * 0.4)} cy={n((rng() - 0.5) * r * 0.4)}
        r={n(r * 0.35)} fill={stain.chromatinPrimary} opacity={0.7} />
      {/* Hemozoin pigment granules — dark brown */}
      {pigment.map((p, i) => (
        <circle key={i} cx={p.px} cy={p.py} r={p.pr} fill="#2a1808" opacity={0.7} />
      ))}
    </g>
  );
}

// ── Free Schizont (thick film) ──
// Round structure packed with merozoite dots (6-24 depending on species)

export function FreeSchizont({ x, y, rotation, seed, stain }: ParasiteProps) {
  const rng = createRng(seed);
  const r = n(1.8 + rng() * 0.8);
  const outline = irregularCellPath(rng, r, 10, 0.2);
  const merozoiteCount = 8 + Math.floor(rng() * 16); // 8-24

  // Merozoites — small dark dots arranged inside
  const merozoites: { mx: number; my: number; mr: number }[] = [];
  for (let i = 0; i < merozoiteCount; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * r * 0.75;
    merozoites.push({ mx: n(Math.cos(a) * d), my: n(Math.sin(a) * d), mr: n(0.15 + rng() * 0.1) });
  }

  // Central pigment mass
  const pigX = n((rng() - 0.5) * r * 0.3);
  const pigY = n((rng() - 0.5) * r * 0.3);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      {/* Schizont body */}
      <path d={outline} fill={stain.nucleusParachromatin} opacity={0.5} />
      {/* Merozoite dots */}
      {merozoites.map((m, i) => (
        <circle key={i} cx={m.mx} cy={m.my} r={m.mr} fill={stain.nucleusFill} opacity={0.8} />
      ))}
      {/* Central pigment clump */}
      <circle cx={pigX} cy={pigY} r={n(r * 0.15)} fill="#201008" opacity={0.65} />
    </g>
  );
}

// ── P. falciparum Gametocyte (banana/crescent) ──
// Pathognomonic — distinctive elongated crescent shape

export function FreeGametocyte({ x, y, rotation, seed, stain }: ParasiteProps) {
  const rng = createRng(seed);
  const length = n(4.0 + rng() * 1.5); // long banana shape
  const width = n(1.2 + rng() * 0.4);
  const curve = n(0.3 + rng() * 0.3); // how curved the banana is

  // Banana shape via cubic bezier
  const halfL = length / 2;
  const d = `M${n(-halfL)},0 C${n(-halfL * 0.6)},${n(-width - curve)},${n(halfL * 0.6)},${n(-width - curve)},${n(halfL)},0 C${n(halfL * 0.6)},${n(width * 0.5 + curve * 0.3)},${n(-halfL * 0.6)},${n(width * 0.5 + curve * 0.3)},${n(-halfL)},0 Z`;

  // Chromatin mass (usually central/eccentric)
  const chromX = n((rng() - 0.5) * halfL * 0.5);
  const chromY = n((rng() - 0.5) * width * 0.3 - width * 0.2);
  const chromR = n(0.35 + rng() * 0.2);

  // Pigment granules scattered along length
  const pigment: { px: number; py: number; pr: number }[] = [];
  for (let i = 0; i < 4 + Math.floor(rng() * 4); i++) {
    pigment.push({
      px: n((rng() - 0.5) * length * 0.7),
      py: n((rng() - 0.5) * width * 0.4 - width * 0.15),
      pr: n(0.08 + rng() * 0.06),
    });
  }

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      {/* Banana-shaped body — dark purple */}
      <path d={d} fill={stain.nucleusFill} opacity={0.7} />
      <path d={d} fill={stain.nucleusParachromatin} opacity={0.25} />
      {/* Chromatin mass */}
      <circle cx={chromX} cy={chromY} r={chromR} fill={stain.chromatinPrimary} opacity={0.75} />
      {/* Hemozoin pigment */}
      {pigment.map((p, i) => (
        <circle key={i} cx={p.px} cy={p.py} r={p.pr} fill="#1a0c04" opacity={0.6} />
      ))}
    </g>
  );
}
