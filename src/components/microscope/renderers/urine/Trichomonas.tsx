/**
 * Trichomonas vaginalis — pear-shaped flagellated protozoan.
 *
 * 10-20 µm. Pear/teardrop body: broader anterior, tapered posterior.
 * Small eccentric nucleus near anterior end. Granular cytoplasm with
 * vacuoles. 4 SHORT anterior flagella from one pole. Undulating
 * membrane along one lateral edge (key diagnostic feature).
 *
 * Variants: classic pear, rounded, slightly elongated.
 */

import { createRng } from "../../types";

const n = (v: number) => Math.round(v * 1000) / 1000;

interface Props { x: number; y: number; seed: number; animated?: boolean }

export function Trichomonas({ x, y, seed, animated }: Props) {
  const rng = createRng(seed);
  const size = n(2.5 + rng() * 1.5); // ~10-20 µm — similar to pus cell
  const rot = n(rng() * 360);

  // Shape variant: 0=classic pear, 1=rounded, 2=elongated
  const variant = Math.floor(rng() * 3);
  const widthTop = variant === 1 ? size * 0.9 : size * 0.85; // broader anterior
  const widthMid = size * (variant === 2 ? 0.65 : 0.75);
  const widthBot = size * (variant === 2 ? 0.35 : 0.4); // gently rounded posterior (not sharp)
  const bodyH = size * (variant === 2 ? 2.2 : variant === 1 ? 1.5 : 1.8);

  // Pear-shaped body outline — hand-crafted bezier for organic contour
  // Top (anterior) is broad, bottom (posterior) tapers
  const asymX = n((rng() - 0.5) * size * 0.15); // mild asymmetry
  const bodyPath = [
    `M${n(-widthTop * 0.1)},${n(-bodyH * 0.45)}`, // top center (slightly off)
    `C${n(-widthTop * 0.5)},${n(-bodyH * 0.42)},${n(-widthTop * 0.7 + asymX)},${n(-bodyH * 0.15)},${n(-widthMid * 0.8)},${n(0)}`, // left upper
    `C${n(-widthMid * 0.85)},${n(bodyH * 0.15)},${n(-widthBot * 0.9)},${n(bodyH * 0.35)},${n(asymX * 0.5)},${n(bodyH * 0.5)}`, // left lower → tail
    `C${n(widthBot * 0.9)},${n(bodyH * 0.35)},${n(widthMid * 0.85)},${n(bodyH * 0.15)},${n(widthMid * 0.8)},${n(0)}`, // right lower
    `C${n(widthTop * 0.7 - asymX)},${n(-bodyH * 0.15)},${n(widthTop * 0.5)},${n(-bodyH * 0.42)},${n(-widthTop * 0.1)},${n(-bodyH * 0.45)}`, // right upper → close
    "Z",
  ].join(" ");

  // Small eccentric nucleus — near anterior end, NOT central
  const nucX = n((rng() - 0.5) * widthTop * 0.3);
  const nucY = n(-bodyH * 0.32 + (rng() - 0.5) * bodyH * 0.06); // more anterior
  const nucR = n(size * 0.11 + rng() * 0.03); // small — ~11-14% of body size

  // Granular cytoplasm — many fine dots throughout
  const granules: { gx: number; gy: number; gr: number; go: number }[] = [];
  for (let i = 0; i < 35; i++) {
    // Distribute within the pear shape
    const ty = (rng() - 0.4) * bodyH * 0.8; // bias toward center/anterior
    const widthAtY = ty < 0 ? widthTop * (1 - Math.abs(ty) / bodyH) : widthMid * (1 - ty / bodyH) * 0.8;
    const tx = (rng() - 0.5) * widthAtY * 1.2;
    granules.push({
      gx: n(tx), gy: n(ty),
      gr: n(0.04 + rng() * 0.08),
      go: n(0.15 + rng() * 0.2),
    });
  }

  // Vacuoles — foamy/vacuolated appearance typical of Trichomonas
  const vacuoles: { vx: number; vy: number; vr: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const vy = (rng() - 0.3) * bodyH * 0.6;
    const vw = vy < 0 ? widthTop * 0.5 : widthMid * 0.4;
    vacuoles.push({
      vx: n((rng() - 0.5) * vw),
      vy: n(vy),
      vr: n(0.08 + rng() * 0.15),
    });
  }

  // 4 short anterior flagella — sinusoidal whip-like curves
  const flagella: string[] = [];
  for (let i = 0; i < 4; i++) {
    const baseAngle = -Math.PI / 2 + (i - 1.5) * 0.3 + (rng() - 0.5) * 0.25;
    const len = size * (0.5 + rng() * 0.5);
    const sx = n(Math.cos(baseAngle) * widthTop * 0.1);
    const sy = n(-bodyH * 0.43);
    // Perpendicular to flagellum direction for wave offset
    const perpX = -Math.sin(baseAngle);
    const perpY = Math.cos(baseAngle);
    const waveAmp = len * (0.15 + rng() * 0.2);
    const waveFreq = 1.5 + rng() * 1.5;
    const nSegs = 8;
    let path = `M${sx},${sy}`;
    for (let j = 1; j <= nSegs; j++) {
      const t = j / nSegs;
      const along = len * t;
      const wave = Math.sin(t * Math.PI * waveFreq) * waveAmp * t;
      const px = n(sx + Math.cos(baseAngle) * along + perpX * wave);
      const py = n(sy + Math.sin(baseAngle) * along + perpY * wave);
      // Smooth curve segments
      const prevT = (j - 1) / nSegs;
      const prevWave = Math.sin(prevT * Math.PI * waveFreq) * waveAmp * prevT;
      const cpx = n(sx + Math.cos(baseAngle) * len * (prevT + t) / 2 + perpX * (prevWave + wave) / 2 + (rng() - 0.5) * 0.1);
      const cpy = n(sy + Math.sin(baseAngle) * len * (prevT + t) / 2 + perpY * (prevWave + wave) / 2 + (rng() - 0.5) * 0.1);
      path += `Q${cpx},${cpy},${px},${py}`;
    }
    flagella.push(path);
  }

  // Undulating membrane — smooth wavy "folded skirt" along one lateral edge
  const memSide = rng() > 0.5 ? 1 : -1;
  let membranePath = "";
  const memSegs = 12;
  const memPts: [number, number][] = [];
  for (let i = 0; i <= memSegs; i++) {
    const t = i / memSegs;
    const baseY = -bodyH * 0.3 + t * bodyH * 0.7;
    const localW = t < 0.3 ? widthTop * (0.65 + t) : widthMid * (1 - t * 0.6);
    const wave = Math.sin(t * Math.PI * 3.5 + rng() * 0.5) * size * 0.18;
    memPts.push([n(memSide * (localW * 0.7 + wave)), n(baseY)]);
  }
  // Smooth bezier through membrane points
  membranePath = `M${memPts[0][0]},${memPts[0][1]}`;
  for (let i = 0; i < memPts.length - 1; i++) {
    const p0 = memPts[Math.max(0, i - 1)];
    const p1 = memPts[i];
    const p2 = memPts[i + 1];
    const p3 = memPts[Math.min(memPts.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    membranePath += `C${cp1x.toFixed(2)},${cp1y.toFixed(2)},${cp2x.toFixed(2)},${cp2y.toFixed(2)},${p2[0]},${p2[1]}`;
  }

  // Axostyle — thin line from posterior, slightly curved
  const axoLen = n(size * 0.4 + rng() * 0.3);

  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {/* Jerky twitching motility — non-directional, irregular */}
      {animated && (
        <>
          <animateTransform attributeName="transform" type="translate"
            values={`0,0;${n(rng()*0.6-0.3)},${n(rng()*0.4-0.2)};${n(rng()*0.5-0.25)},${n(rng()*0.6-0.3)};0,0;${n(rng()*0.4-0.2)},${n(rng()*0.5-0.25)};0,0`}
            dur={`${0.6 + rng() * 0.4}s`} repeatCount="indefinite" additive="sum" />
          <animateTransform attributeName="transform" type="rotate"
            values={`0;${n(rng()*6-3)};${n(rng()*4-2)};0;${n(rng()*5-2.5)};0`}
            dur={`${0.8 + rng() * 0.5}s`} repeatCount="indefinite" additive="sum" />
        </>
      )}
      {/* Pear-shaped body */}
      <path d={bodyPath} fill="#98988e" opacity={0.5} />
      <path d={bodyPath} fill="none" stroke="#585850" strokeWidth={0.1} opacity={0.5} />

      {/* Granular cytoplasm */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill="#484840" opacity={g.go} />
      ))}

      {/* Subtle vacuoles — lighter spots */}
      {vacuoles.map((v, i) => (
        <circle key={`v${i}`} cx={v.vx} cy={v.vy} r={v.vr}
          fill="rgba(200,200,195,0.2)" />
      ))}

      {/* Small eccentric nucleus near anterior */}
      <circle cx={nucX} cy={nucY} r={nucR} fill="#303028" opacity={0.6} />
      <circle cx={nucX} cy={nucY} r={n(nucR * 0.5)} fill="#202018" opacity={0.4} />

      {/* Undulating membrane — wavy lateral edge */}
      <path d={membranePath} fill="none" stroke="#606058" strokeWidth={0.06} opacity={0.35}
        strokeLinejoin="round" />

      {/* 4 short anterior flagella */}
      {flagella.map((f, i) => (
        <path key={i} d={f} fill="none" stroke="#787870" strokeWidth={0.025} opacity={0.3}
          strokeLinejoin="round" strokeLinecap="round" />
      ))}

      {/* Axostyle — posterior */}
      <path d={`M0,${n(bodyH * 0.48)} Q${n((rng() - 0.5) * 0.4)},${n(bodyH * 0.5 + axoLen * 0.5)} 0,${n(bodyH * 0.48 + axoLen)}`}
        fill="none" stroke="#585850" strokeWidth={0.05} opacity={0.3} />
    </g>
  );
}
