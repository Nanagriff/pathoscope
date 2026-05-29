/**
 * Schistosoma haematobium egg — oval with terminal spine.
 *
 * 100-170 µm × 40-70 µm. In wet prep: grey shell, dense internal
 * contents. The terminal spine is SHORT and emerges naturally from
 * the tapered end of the egg — it is part of the body, not a
 * separate attachment. The spine is the KEY diagnostic feature.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number }

export function SchistosomaEgg({ x, y, seed }: Props) {
  const rng = createRng(seed);
  const rx = n(5.5 + rng() * 2);
  const ry = n(rx * (0.38 + rng() * 0.08));
  const rot = n(rng() * 360);

  // Prominent terminal spine
  const spineLen = n(rx * (0.25 + rng() * 0.1));

  // Single egg outline WITH integrated spine — one continuous shape
  // The egg tapers at the right end into the spine tip
  const nPts = 24;
  const pts: [number, number][] = [];
  for (let i = 0; i < nPts; i++) {
    const t = i / nPts;
    const angle = t * Math.PI * 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // Base ellipse with taper toward spine end
    let localRx = rx;
    let localRy = ry;

    // Taper the right side (cosA > 0) into the spine
    if (cosA > 0.2) {
      const taper = (cosA - 0.2) / 0.8; // 0→1 as we approach spine end
      localRy *= (1 - taper * 0.6); // narrow vertically
      localRx += taper * spineLen * 0.5; // extend horizontally into spine
    }

    // Slight organic wobble
    localRx += (rng() - 0.5) * 0.3;
    localRy += (rng() - 0.5) * 0.15;

    pts.push([cosA * localRx, sinA * localRy]);
  }

  // Add the spine tip point between the points near angle=0
  // Find the rightmost extent and add a spike
  const spikeTipX = n(rx + spineLen);

  // Build smooth path with Catmull-Rom, inserting spike tip
  let shellPath = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < nPts; i++) {
    const p0 = pts[(i - 1 + nPts) % nPts];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % nPts];
    const p3 = pts[(i + 2) % nPts];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    shellPath += `C${cp1x.toFixed(2)},${cp1y.toFixed(2)},${cp2x.toFixed(2)},${cp2y.toFixed(2)},${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  shellPath += "Z";

  // Dense internal contents — miracidium
  const masses: { mx: number; my: number; mrx: number; mry: number; mo: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * 0.55;
    masses.push({
      mx: n(Math.cos(a) * rx * d * 0.6),
      my: n(Math.sin(a) * ry * d * 0.8),
      mrx: n(rx * 0.1 + rng() * rx * 0.12),
      mry: n(ry * 0.12 + rng() * ry * 0.18),
      mo: n(0.2 + rng() * 0.15),
    });
  }

  // Fine granular fill
  const granules: { gx: number; gy: number; gr: number; go: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * 0.7;
    granules.push({
      gx: n(Math.cos(a) * rx * d * 0.7),
      gy: n(Math.sin(a) * ry * d * 0.85),
      gr: n(0.08 + rng() * 0.15),
      go: n(0.1 + rng() * 0.1),
    });
  }

  // Lighter cleared areas
  const clearings: { cx: number; cy: number; cr: number }[] = [];
  for (let i = 0; i < 4; i++) {
    clearings.push({
      cx: n((rng() - 0.5) * rx * 0.6),
      cy: n((rng() - 0.5) * ry * 0.5),
      cr: n(rx * 0.04 + rng() * rx * 0.06),
    });
  }

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Egg body + integrated spine — one shape */}
      <path d={shellPath} fill="#a0a098" opacity={0.8} />
      <path d={shellPath} fill="none" stroke="#606058" strokeWidth={0.1} opacity={0.5} />

      {/* Dense internal masses */}
      {masses.map((m, i) => (
        <ellipse key={`m${i}`} cx={m.mx} cy={m.my} rx={m.mrx} ry={m.mry}
          fill="#484840" opacity={m.mo} />
      ))}

      {/* Fine granular texture */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill="#404038" opacity={g.go} />
      ))}

      {/* Lighter clearings */}
      {clearings.map((c, i) => (
        <circle key={`cl${i}`} cx={c.cx} cy={c.cy} r={c.cr}
          fill="rgba(180,180,175,0.12)" />
      ))}

      {/* Prominent terminal spine — clearly visible, tapers from body */}
      <polygon
        points={`${n(rx * 0.92)},${n(-ry * 0.12)} ${spikeTipX},0 ${n(rx * 0.92)},${n(ry * 0.12)}`}
        fill="#888880" opacity={0.6} />
      <line x1={n(rx * 0.92)} y1={0} x2={spikeTipX} y2={0}
        stroke="#585850" strokeWidth={0.08} opacity={0.5} />
    </g>
  );
}
