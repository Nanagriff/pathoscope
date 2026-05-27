/**
 * Uric acid crystal — yellow-brown rhomboid/diamond/barrel shape.
 * Found in acidic urine. Various shapes: rhomboid, rosette, barrel.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function UricAcidCrystal({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const variant = rng();
  const rot = n(rng() * 360);
  const size = n(2 + rng() * 2);
  const opacity = n(0.25 + rng() * 0.2);
  const fill = `rgba(${160 + Math.floor(rng() * 40)},${120 + Math.floor(rng() * 30)},${40 + Math.floor(rng() * 30)},1)`;

  if (variant < 0.5) {
    // Rhomboid/diamond
    const w = size;
    const h = n(size * (0.6 + rng() * 0.4));
    return (
      <g transform={`translate(${x},${y}) rotate(${rot})`}>
        <path d={`M0,${n(-h)} L${n(w)},0 L0,${n(h)} L${n(-w)},0 Z`}
          fill={fill} opacity={opacity} stroke={fill} strokeWidth={0.06} strokeOpacity={n(opacity + 0.1)} />
      </g>
    );
  }
  // Barrel/rectangular
  const w = n(size * 0.7);
  const h = size;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <rect x={n(-w)} y={n(-h)} width={n(w * 2)} height={n(h * 2)} rx={n(w * 0.2)}
        fill={fill} opacity={opacity} stroke={fill} strokeWidth={0.06} strokeOpacity={n(opacity + 0.1)} />
    </g>
  );
}
