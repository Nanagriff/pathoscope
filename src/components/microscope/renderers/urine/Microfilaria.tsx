/**
 * Microfilaria — larval nematode in urine/blood.
 *
 * 200-300 µm long, very thin thread-like. Sinusoidal body with
 * tapered tail. May be sheathed or unsheathed. Internal nuclei
 * visible as a row of dots. Graceful undulating motility.
 * Differential: Wuchereria bancrofti, Brugia malayi, etc.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number; animated?: boolean }

export function Microfilaria({ x, y, seed, animated }: Props) {
  const rng = createRng(seed);
  const length = n(25 + rng() * 15); // 25-40 units (~200-300 µm)
  const thickness = n(0.3 + rng() * 0.15);
  const rot = n(rng() * 360);
  const opacity = n(0.2 + rng() * 0.1);

  // Sinusoidal body path
  const nPts = 16;
  const amplitude = n(1.5 + rng() * 1.5);
  const freq = n(2 + rng() * 1);
  const phase = rng() * Math.PI * 2;
  let bodyPath = "";
  for (let i = 0; i <= nPts; i++) {
    const t = i / nPts;
    const px = n(-length / 2 + t * length);
    // Taper at both ends
    const taper = Math.sin(t * Math.PI);
    const py = n(Math.sin(t * freq * Math.PI * 2 + phase) * amplitude * taper);
    bodyPath += (i === 0 ? "M" : "L") + `${px},${py}`;
  }

  // Internal nuclei — row of dots along the body
  const nuclei: { nx: number; ny: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = 0.1 + (i / 20) * 0.8;
    const px = -length / 2 + t * length;
    const taper = Math.sin(t * Math.PI);
    const py = Math.sin(t * freq * Math.PI * 2 + phase) * amplitude * taper;
    nuclei.push({ nx: n(px), ny: n(py) });
  }

  // Sheath (present in ~60% — extends slightly beyond body)
  const hasSheath = rng() > 0.4;
  const sheathExtra = n(length * 0.05);

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {animated && (
        <animateTransform attributeName="transform" type="translate"
          values={`${x},${y};${x + 0.8},${y - 0.4};${x - 0.5},${y + 0.6};${x},${y}`}
          dur={`${3 + rng() * 2}s`} repeatCount="indefinite" additive="sum" />
      )}

      {/* Sheath — faint tube extending beyond body */}
      {hasSheath && (
        <line x1={n(-length / 2 - sheathExtra)} y1={0} x2={n(length / 2 + sheathExtra)} y2={0}
          stroke="#a0a890" strokeWidth={n(thickness * 3)} opacity={0.06} strokeLinecap="round" />
      )}

      {/* Body — sinusoidal thread */}
      <path d={bodyPath} fill="none" stroke="#687060" strokeWidth={thickness}
        opacity={opacity} strokeLinecap="round" />

      {/* Internal nuclear column — faint dots */}
      {nuclei.map((nc, i) => (
        <circle key={i} cx={nc.nx} cy={nc.ny} r={n(thickness * 0.5)}
          fill="#505840" opacity={0.12} />
      ))}

      {/* Head — slightly rounded anterior end */}
      <circle cx={n(-length / 2)} cy={n(Math.sin(phase) * amplitude * 0.1)} r={n(thickness * 1.2)}
        fill="#687060" opacity={n(opacity * 0.8)} />
    </g>
  );
}
