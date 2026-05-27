/**
 * Spermatozoa — oval head with long sinusoidal tail.
 * Head ~3-4μm, tail ~40-50μm. Visible at 40x.
 * The tail should be clearly visible as a long wavy line.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number; animated?: boolean }

export function Spermatozoa({ x, y, seed, animated }: Props) {
  const rng = createRng(seed);
  const rot = n(rng() * 360);
  const headRx = n(0.7 + rng() * 0.2);
  const headRy = n(headRx * 0.6);
  const tailLen = n(10 + rng() * 4); // LONG tail
  const opacity = n(0.3 + rng() * 0.15);

  // Build sinusoidal tail with multiple wave segments
  const segments = 6;
  let tailD = `M${n(headRx * 0.8)},0`;
  for (let i = 1; i <= segments; i++) {
    const xp = n(headRx + (i / segments) * tailLen);
    const yAmp = n(0.6 + rng() * 0.4) * (1 - i / (segments * 1.5)); // amplitude decreases toward tip
    const yDir = i % 2 === 0 ? 1 : -1;
    const cpx = n(headRx + ((i - 0.5) / segments) * tailLen);
    tailD += ` Q${cpx},${n(yDir * yAmp)},${xp},0`;
  }

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Animated tail wiggle */}
      {animated && (
        <animateTransform attributeName="transform" type="translate"
          values={`${x} ${y};${n(x + 0.3)} ${n(y + 0.2)};${n(x - 0.2)} ${n(y - 0.15)};${x} ${y}`}
          dur={`${n(0.5 + rng() * 0.3)}s`} repeatCount="indefinite" additive="replace" />
      )}
      {/* Oval head — dark, visible */}
      <ellipse rx={headRx} ry={headRy} fill="#606858" opacity={n(opacity + 0.15)} />
      {/* Acrosomal cap */}
      <ellipse cx={n(-headRx * 0.25)} rx={n(headRx * 0.45)} ry={n(headRy * 0.85)}
        fill="#4a5040" opacity={n(opacity * 0.5)} />
      {/* Long sinusoidal tail */}
      <path d={tailD} fill="none" stroke="#707868" strokeWidth={0.1} opacity={opacity} strokeLinecap="round" />
    </g>
  );
}
