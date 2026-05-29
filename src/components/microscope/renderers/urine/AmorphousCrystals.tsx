/**
 * Amorphous crystals — dense granular chain/streak.
 *
 * Amorphous urates (acidic, pink-brown) or phosphates (alkaline, grey).
 * Always appear as MANY tiny granules arranged in long chain-like
 * streaks or bands — not isolated round clusters. The granules
 * follow a curved path creating a chain/river formation.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function AmorphousCrystals({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const isUrate = rng() > 0.5;
  const color = isUrate ? "#907050" : "#a0a098";
  const baseOpacity = n(0.18 + rng() * 0.12);

  // Chain spine — a curved path that the granules follow
  const chainLen = n(15 + rng() * 20); // long chain
  const chainWidth = n(1.5 + rng() * 2); // width of the band
  const rot = n(rng() * 360);

  // Generate spine as a gently curving path
  const nSpinePts = 6 + Math.floor(rng() * 4);
  const spine: [number, number][] = [];
  for (let i = 0; i <= nSpinePts; i++) {
    const t = i / nSpinePts;
    const sx = (t - 0.5) * chainLen;
    const sy = Math.sin(t * Math.PI * (1 + rng() * 1.5)) * chainLen * 0.12 + (rng() - 0.5) * 1.5;
    spine.push([n(sx), n(sy)]);
  }

  // Dense granules distributed along the spine
  const particleCount = 80 + Math.floor(rng() * 60);
  const particles: { px: number; py: number; pr: number; po: number }[] = [];
  for (let i = 0; i < particleCount; i++) {
    // Pick a random position along the spine
    const t = rng();
    const idx = Math.min(nSpinePts - 1, Math.floor(t * nSpinePts));
    const frac = t * nSpinePts - idx;
    const p0 = spine[idx];
    const p1 = spine[Math.min(nSpinePts, idx + 1)];
    // Interpolate along spine
    const cx = p0[0] + (p1[0] - p0[0]) * frac;
    const cy = p0[1] + (p1[1] - p0[1]) * frac;
    // Spread perpendicular to spine
    const spread = (rng() - 0.5) * chainWidth;
    // Tangent direction
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    particles.push({
      px: n(cx + nx * spread + (rng() - 0.5) * 0.5),
      py: n(cy + ny * spread + (rng() - 0.5) * 0.5),
      pr: n(0.08 + rng() * 0.2),
      po: n(baseOpacity * (0.5 + rng() * 0.8)),
    });
  }

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {particles.map((p, i) => (
        <circle key={i} cx={p.px} cy={p.py} r={p.pr} fill={color} opacity={p.po} />
      ))}
    </g>
  );
}
