/**
 * SVG cell renderers for sickling test under reducing agent (Na2S2O5).
 *
 * Sickling fluid appearance:
 * - Background: pale blue-grey (not pink — no Wright/Giemsa stain)
 * - Cells: olive-green/grey-green (deoxygenated, unstained wet prep)
 * - Central pallor: bright white/clear centre
 * - Sickled cells: various crescent, holly-leaf, and irregular shapes
 *
 * Cell variants for positive sickling test:
 * 1. Normal disc — round with central pallor (some remain unsickled)
 * 2. Crescent/sickle — classic elongated crescent
 * 3. Holly leaf — irregular spiky projections
 * 4. Elongated — stretched oval/boat shape
 * 5. Oat/filament — thin elongated form (severe)
 */

import { createRng, irregularCellPath } from "./types";

const n = (v: number) => Math.round(v * 10000) / 10000;

interface SicklingCellProps {
  x: number;
  y: number;
  rotation: number;
  seed: number;
}

// ── Normal disc (unsickled) under reducing agent ──
export function NormalDisc({ x, y, rotation, seed }: SicklingCellProps) {
  const rng = createRng(seed);
  const r = n(3.2 + rng() * 0.5);
  const wobble = 0.08 + rng() * 0.08;
  const outline = irregularCellPath(rng, r, 10, wobble);
  const opacity = n(0.6 + rng() * 0.15);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      {/* Cell body — olive-green/grey */}
      <path d={outline} fill="#a0a890" opacity={opacity} stroke="#808870" strokeWidth={0.12} strokeOpacity={0.4} />
      {/* Central pallor — white/clear */}
      <circle r={n(r * 0.32)} fill="#d8dce0" opacity={0.7} />
      <circle r={n(r * 0.18)} fill="#e8ecf0" opacity={0.5} />
    </g>
  );
}

// ── Sickle/Crescent cell (drepanocyte) ──
export function SickleCell({ x, y, rotation, seed }: SicklingCellProps) {
  const rng = createRng(seed);
  const len = n(4.5 + rng() * 2);
  const curve = n(1.2 + rng() * 0.8);
  const thickness = n(0.6 + rng() * 0.4);
  const opacity = n(0.55 + rng() * 0.2);
  const halfL = len / 2;

  // Pointed crescent — tapered ends
  const d = `M${n(-halfL)},0 C${n(-halfL * 0.5)},${n(-curve - thickness)},${n(halfL * 0.5)},${n(-curve - thickness)},${n(halfL)},0 C${n(halfL * 0.5)},${n(-curve + thickness * 0.8)},${n(-halfL * 0.5)},${n(-curve + thickness * 0.8)},${n(-halfL)},0 Z`;

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      <path d={d} fill="#7a8068" opacity={opacity} stroke="#606850" strokeWidth={0.1} strokeOpacity={0.5} />
      {/* Darker edge on concave side */}
      <path d={d} fill="#606850" opacity={0.15} />
    </g>
  );
}

// ── Holly leaf cell (irregular spiky projections) ──
export function HollyLeafCell({ x, y, rotation, seed }: SicklingCellProps) {
  const rng = createRng(seed);
  const baseR = n(2.5 + rng() * 1);
  const opacity = n(0.55 + rng() * 0.2);

  // Spiky outline — high wobble with fewer points = spiky
  const points = 6 + Math.floor(rng() * 3);
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    // Alternate between extended spikes and indentations
    const spike = i % 2 === 0 ? (1 + rng() * 0.5) : (0.5 + rng() * 0.3);
    const r = baseR * spike;
    pts.push([n(Math.cos(angle) * r), n(Math.sin(angle) * r)]);
  }

  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < points; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % points];
    const cpx = n((p1[0] + p2[0]) / 2 + (rng() - 0.5) * baseR * 0.3);
    const cpy = n((p1[1] + p2[1]) / 2 + (rng() - 0.5) * baseR * 0.3);
    d += `Q${cpx},${cpy},${p2[0]},${p2[1]}`;
  }
  d += "Z";

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      <path d={d} fill="#6a7058" opacity={opacity} stroke="#505840" strokeWidth={0.1} strokeOpacity={0.4} />
      <path d={d} fill="#505840" opacity={0.1} />
    </g>
  );
}

// ── Elongated/boat cell (stretched oval) ──
export function ElongatedCell({ x, y, rotation, seed }: SicklingCellProps) {
  const rng = createRng(seed);
  const rx = n(3.5 + rng() * 1.5);
  const ry = n(1.0 + rng() * 0.5);
  const opacity = n(0.55 + rng() * 0.2);

  // Slightly irregular ellipse
  const outline = irregularCellPath(rng, rx, 10, 0.15);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`} style={{ transform: `translate(${x}px,${y}px) rotate(${rotation}deg) scaleY(${n(ry / rx)})` }}>
      <path d={outline} fill="#808868" opacity={opacity} stroke="#687050" strokeWidth={0.1} strokeOpacity={0.4} />
    </g>
  );
}

// ── Oat/filament cell (thin, elongated — severe sickling) ──
export function OatCell({ x, y, rotation, seed }: SicklingCellProps) {
  const rng = createRng(seed);
  const len = n(5 + rng() * 2.5);
  const width = n(0.4 + rng() * 0.3);
  const opacity = n(0.5 + rng() * 0.2);
  const halfL = len / 2;
  const bend = n((rng() - 0.5) * 0.8);

  const d = `M${n(-halfL)},0 Q0,${n(-width - bend)},${n(halfL)},0 Q0,${n(width - bend)},${n(-halfL)},0 Z`;

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      <path d={d} fill="#606848" opacity={opacity} stroke="#485038" strokeWidth={0.08} strokeOpacity={0.4} />
    </g>
  );
}
