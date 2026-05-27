/**
 * Stain-aware SVG cell renderers for blood film simulation.
 *
 * All renderers accept a StainProfile so the same cell types render
 * with accurate colours under Giemsa (malaria) vs Wright-Giemsa (haematology).
 *
 * Key stain differences:
 *   Giemsa — RBCs paler/grayer, parasite ring BLUE, chromatin RED
 *   Wright-Giemsa — RBCs pinker, parasite ring PURPLE, chromatin MAGENTA
 */

import { createRng, irregularCellPath } from "./types";
import type { StainProfile } from "./stainProfiles";

// ────────────────────────────────────────────
// SVG <defs> — dynamically coloured by stain profile
// ────────────────────────────────────────────

export function SlideDefs({ stain }: { stain: StainProfile }) {
  return (
    <defs>
      {/* ── RBC gradients (8 variants from stain profile) ── */}
      {stain.rbcGradients.map((h, i) => (
        <radialGradient key={i} id={`rbc-grad-${i}`}>
          <stop offset="0%" stopColor={h[0]} />
          <stop offset="22%" stopColor={h[1]} />
          <stop offset="50%" stopColor={h[2]} />
          <stop offset="80%" stopColor={h[3]} />
          <stop offset="100%" stopColor={h[4]} />
        </radialGradient>
      ))}

      {/* ── Parasitized RBC gradient ── */}
      <radialGradient id="rbc-grad-parasitized">
        {stain.parasitizedRbcGradient.map((c, i) => (
          <stop key={i} offset={`${[0, 25, 55, 82, 100][i]}%`} stopColor={c} />
        ))}
      </radialGradient>

      {/* ── Central pallor variants (off-centre) ── */}
      {[
        { cx: "55%", cy: "45%", fx: "55%", fy: "42%" },
        { cx: "42%", cy: "52%", fx: "40%", fy: "54%" },
        { cx: "50%", cy: "40%", fx: "52%", fy: "38%" },
        { cx: "48%", cy: "55%", fx: "46%", fy: "58%" },
        { cx: "58%", cy: "50%", fx: "60%", fy: "48%" },
        { cx: "44%", cy: "44%", fx: "42%", fy: "42%" },
      ].map((v, i) => (
        <radialGradient
          key={i} id={`pallor-${i}`}
          cx={v.cx} cy={v.cy} fx={v.fx} fy={v.fy} r="50%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor={stain.pallorStops[0]} />
          <stop offset="40%" stopColor={stain.pallorStops[1]} />
          <stop offset="75%" stopColor={stain.pallorStops[2]} />
          <stop offset="100%" stopColor={stain.pallorStops[3]} />
        </radialGradient>
      ))}

      {/* ── WBC cytoplasm gradients ── */}
      <radialGradient id="neutrophil-cyto">
        <stop offset="0%" stopColor={stain.neutrophilCyto[0]} />
        <stop offset="100%" stopColor={stain.neutrophilCyto[1]} />
      </radialGradient>
      <radialGradient id="eosinophil-cyto">
        <stop offset="0%" stopColor={stain.eosinophilCyto[0]} />
        <stop offset="100%" stopColor={stain.eosinophilCyto[1]} />
      </radialGradient>
      <radialGradient id="lymphocyte-cyto">
        <stop offset="0%" stopColor={stain.lymphocyteCyto[0]} />
        <stop offset="100%" stopColor={stain.lymphocyteCyto[1]} />
      </radialGradient>
      <radialGradient id="monocyte-cyto">
        <stop offset="0%" stopColor={stain.monocyteCyto[0]} />
        <stop offset="100%" stopColor={stain.monocyteCyto[1]} />
      </radialGradient>
      <radialGradient id="basophil-cyto">
        <stop offset="0%" stopColor={stain.basophilCyto[0]} />
        <stop offset="100%" stopColor={stain.basophilCyto[1]} />
      </radialGradient>

      {/* ═══ FILTERS ═══ */}

      {/* DOF blur tiers */}
      <filter id="dof-slight"><feGaussianBlur stdDeviation="0.3" /></filter>
      <filter id="dof-medium"><feGaussianBlur stdDeviation="0.7" /></filter>
      <filter id="dof-heavy"><feGaussianBlur stdDeviation="1.4" /></filter>

      {/* Background stain texture */}
      <filter id="stain-bg" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed={3} result="noise" />
        <feColorMatrix in="noise" type="matrix"
          values="0 0 0 0 0.99  0 0 0 0 0.96  0 0 0 0 0.95  0 0 0 0.04 0" result="tinted" />
        <feBlend in="SourceGraphic" in2="tinted" mode="multiply" />
      </filter>

      {/* Microscope grain */}
      <filter id="scope-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="2.0" numOctaves="3" seed={13} result="g" />
        <feColorMatrix in="g" type="saturate" values="0" result="bw" />
        <feComponentTransfer in="bw" result="faded">
          <feFuncA type="linear" slope="0.18" intercept="0" />
        </feComponentTransfer>
      </filter>

      {/* Parasite stain diffusion */}
      <filter id="parasite-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="0.4" />
      </filter>

      {/* Vignette */}
      <radialGradient id="vignette-grad" cx="48%" cy="46%" r="52%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="55%" stopColor="transparent" />
        <stop offset="85%" stopColor="rgba(0,0,0,0.06)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
      </radialGradient>

      {/* Illumination */}
      <radialGradient id="illumination" cx="47%" cy="44%" r="58%">
        <stop offset="0%" stopColor="rgba(255,250,240,0.04)" />
        <stop offset="100%" stopColor="rgba(200,208,220,0.04)" />
      </radialGradient>

      {/* ── WBC nucleus texture: fractal noise composited to break smoothness ── */}
      <filter id="nucleus-tex" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed={11} result="nz" />
        <feColorMatrix in="nz" type="saturate" values="0" result="bw" />
        <feBlend in="SourceGraphic" in2="bw" mode="multiply" result="textured" />
        <feComposite in="textured" in2="SourceGraphic" operator="in" />
      </filter>

      {/* ── WBC cytoplasm texture: subtle grain ── */}
      <filter id="cyto-tex" x="-3%" y="-3%" width="106%" height="106%">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed={17} result="cz" />
        <feColorMatrix in="cz" type="saturate" values="0" result="cbw" />
        <feBlend in="SourceGraphic" in2="cbw" mode="soft-light" result="ct" />
        <feComposite in="ct" in2="SourceGraphic" operator="in" />
      </filter>

      {/* ── Parasite stain texture — makes rings look like dyed material, not vectors ── */}
      <filter id="parasite-tex" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" seed={23} result="pn" />
        <feColorMatrix in="pn" type="saturate" values="0" result="pbw" />
        <feBlend in="SourceGraphic" in2="pbw" mode="multiply" result="pt" />
        <feGaussianBlur in="pt" stdDeviation="0.08" result="pblur" />
        <feComposite in="pblur" in2="SourceGraphic" operator="in" />
      </filter>

      {/* ── Chromatin dot texture — organic dense nuclear material ── */}
      <filter id="chromatin-tex" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="2.0" numOctaves="3" seed={29} result="cn" />
        <feColorMatrix in="cn" type="saturate" values="0" result="cbw2" />
        <feBlend in="SourceGraphic" in2="cbw2" mode="multiply" result="ct2" />
        <feGaussianBlur in="ct2" stdDeviation="0.06" result="cblur" />
        <feComposite in="cblur" in2="SourceGraphic" operator="in" />
      </filter>

      {/* ── Slight WBC softening — matches surrounding field focus ── */}
      <filter id="wbc-soft">
        <feGaussianBlur stdDeviation="0.12" />
      </filter>
    </defs>
  );
}

// ────────────────────────────────────────────
// Shared types
// ────────────────────────────────────────────

interface CellProps {
  x: number;
  y: number;
  rotation: number;
  seed: number;
  depth: number;
  stain: StainProfile;
  onClick?: () => void;
  selected?: boolean;
  parasiteStage?: import("./types").ParasiteStage;
  malariaSpecies?: import("./types").MalariaSpecies;
}

/** Round to 4 decimal places — prevents SSR/client hydration mismatch from float precision */
function n(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function dofFilter(depth: number): string | undefined {
  if (depth < 0.55) return undefined;
  if (depth < 0.72) return "url(#dof-slight)";
  if (depth < 0.88) return "url(#dof-medium)";
  return "url(#dof-heavy)";
}

// ────────────────────────────────────────────
// Normal RBC
// ────────────────────────────────────────────

export function NormalRBC({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);

  const sizeRoll = rng();
  const baseR = sizeRoll < 0.06 ? 2.6 + rng() * 0.3
    : sizeRoll > 0.94 ? 3.9 + rng() * 0.3
    : 3.1 + rng() * 0.7;

  const wobble = 0.12 + rng() * 0.14;
  const outline = irregularCellPath(rng, baseR, 10, wobble);
  const gradIdx = Math.floor(rng() * 8);
  const pallorIdx = Math.floor(rng() * 6);
  const pallorScale = n(0.35 + rng() * 0.25);
  const pallorOffX = n((rng() - 0.5) * baseR * 0.25);
  const pallorOffY = n((rng() - 0.5) * baseR * 0.25);
  const opacity = n((0.78 + rng() * 0.18) * (1 - depth * 0.15));
  const strokeW = n(0.06 + rng() * 0.1);
  const pallorRy = n(baseR * pallorScale * (0.82 + rng() * 0.36));
  const pallorOp = n(0.45 + rng() * 0.3);
  const pallorRot = n(rng() * 360);
  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(baseR + 1.2)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}
      <path d={outline} fill={`url(#rbc-grad-${gradIdx})`} opacity={opacity}
        stroke={stain.membraneStroke} strokeWidth={strokeW} strokeOpacity={0.35} />
      <ellipse cx={pallorOffX} cy={pallorOffY}
        rx={n(baseR * pallorScale)} ry={pallorRy}
        fill={`url(#pallor-${pallorIdx})`} opacity={pallorOp}
        transform={`rotate(${pallorRot},${pallorOffX},${pallorOffY})`} />
    </g>
  );
}

// ────────────────────────────────────────────
// Parasitized RBC — stage-aware (ring / trophozoite / schizont / gametocyte)
//
// Ring morphological variants:
//   1. Faint ring — thin irregular arc + prominent chromatin dot
//   2. Dot-only — chromatin dot with barely-visible cytoplasm halo
//   3. Signet ring — clear arc with one chromatin dot
//   4. Headphone — two chromatin dots connected by arc
//   5. Double infection — 2 separate parasites in one RBC
// ────────────────────────────────────────────

/** Build an irregular arc path (NOT a circle) for parasite ring cytoplasm */
function parasiteArc(
  rng: () => number,
  cx: number, cy: number, r: number,
  startAngle: number, arcSpan: number,
): string {
  // More points = smoother organic curve
  const steps = 8 + Math.floor(rng() * 4);
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startAngle + t * arcSpan;
    // Higher wobble (±20%) + slight inward/outward drift along the arc
    const drift = (rng() - 0.5) * 0.4;
    const rVar = r * (1 + drift);
    pts.push([cx + Math.cos(angle) * rVar, cy + Math.sin(angle) * rVar]);
  }
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    // Larger control point offset = more organic wobble
    const cpx = (prev[0] + curr[0]) / 2 + (rng() - 0.5) * r * 0.35;
    const cpy = (prev[1] + curr[1]) / 2 + (rng() - 0.5) * r * 0.35;
    d += `Q${cpx.toFixed(2)},${cpy.toFixed(2)},${curr[0].toFixed(2)},${curr[1].toFixed(2)}`;
  }
  return d;
}

export function ParasitizedRBC({ x, y, rotation, seed, depth, stain, onClick, selected, parasiteStage = "ring", malariaSpecies = "pf" }: CellProps) {
  const rng = createRng(seed);

  // P. vivax: RBC is ENLARGED 1.5-2x. P. falciparum: normal size.
  const isVivax = malariaSpecies === "pv" || malariaSpecies === "po";
  const sizeMultiplier = isVivax ? (1.4 + rng() * 0.3) : 1;
  const baseR = n((3.1 + rng() * 0.6) * sizeMultiplier);

  const wobble = 0.10 + rng() * 0.12;
  const outline = irregularCellPath(rng, baseR, 10, wobble);
  const opacity = n((0.80 + rng() * 0.15) * (1 - depth * 0.12));

  const pallorIdx = Math.floor(rng() * 6);
  const pallorOffX = n((rng() - 0.5) * baseR * 0.2);
  const pallorOffY = n((rng() - 0.5) * baseR * 0.2);

  // Schüffner dots for P. vivax/ovale — fine pink stippling on the RBC
  const schuffnerDots: { sx: number; sy: number }[] = [];
  if (isVivax) {
    const dotCount = 25 + Math.floor(rng() * 20);
    for (let i = 0; i < dotCount; i++) {
      const a = rng() * Math.PI * 2;
      const d = rng() * baseR * 0.85;
      schuffnerDots.push({ sx: n(Math.cos(a) * d), sy: n(Math.sin(a) * d) });
    }
  }

  // Decide morphological variant
  const variant = rng();
  // 0-0.20: dot-only, 0.20-0.55: faint ring, 0.55-0.80: signet, 0.80-0.92: headphone, 0.92-1.0: double
  const isDoubleInfection = variant > 0.92;
  const parasiteCount = isDoubleInfection ? 2 : 1;

  // Generate 1-2 parasites
  interface ParasiteData {
    cx: number; cy: number; r: number;
    arcPath: string | null;
    arcThickMin: number; arcThickMax: number;
    dotX: number; dotY: number; dotR: number;
    dot2X?: number; dot2Y?: number; dot2R?: number;
    hasFaintHalo: boolean;
    arcOpacity: number;
  }

  const parasites: ParasiteData[] = [];
  for (let p = 0; p < parasiteCount; p++) {
    // Vivax: larger, thicker rings. Falciparum: small, delicate.
    const ringR = isVivax ? (1.2 + rng() * 0.6) : (0.7 + rng() * 0.5);
    const rAngle = rng() * Math.PI * 2;
    const rDist = baseR * (0.10 + rng() * 0.20);
    const cx = Math.cos(rAngle) * rDist + (p * (rng() - 0.5) * 2);
    const cy = Math.sin(rAngle) * rDist + (p * (rng() - 0.5) * 2);

    // Chromatin dot — vivax has larger, more prominent dots
    const dotAngle = rng() * Math.PI * 2;
    const dotR = isVivax ? (0.4 + rng() * 0.25) : (0.3 + rng() * 0.2);
    const dotX = cx + Math.cos(dotAngle) * ringR * (0.7 + rng() * 0.3);
    const dotY = cy + Math.sin(dotAngle) * ringR * (0.7 + rng() * 0.3);

    let arcPath: string | null = null;
    // Vivax: thicker ring strokes, higher opacity
    let arcThickMin = isVivax ? 0.3 : 0.15;
    let arcThickMax = isVivax ? 0.6 : 0.35;
    let arcOpacity = isVivax ? 0.8 : 0.7;
    let hasFaintHalo = false;
    let dot2X: number | undefined;
    let dot2Y: number | undefined;
    let dot2R: number | undefined;

    const pVariant = p === 0 ? variant : rng(); // second parasite gets own variant

    if (pVariant < 0) {
      // Dot-only disabled — teaching tool, parasites must always be clearly visible
      hasFaintHalo = true;
      arcOpacity = 0;
    } else if (pVariant < 0.55) {
      // Faint ring: partial arc (120-200°)
      const arcSpan = (2.1 + rng() * 1.4);
      const arcStart = dotAngle + Math.PI * 0.3;
      arcPath = parasiteArc(rng, cx, cy, ringR, arcStart, arcSpan);
      arcThickMin = isVivax ? 0.25 : 0.12;
      arcThickMax = isVivax ? 0.4 : 0.25;
      arcOpacity = isVivax ? 0.55 : 0.4 + rng() * 0.2;
    } else if (pVariant < 0.85) {
      // Signet ring: larger arc (200-300°)
      const arcSpan = (3.5 + rng() * 1.7);
      const arcStart = dotAngle + Math.PI * 0.2;
      arcPath = parasiteArc(rng, cx, cy, ringR, arcStart, arcSpan);
      arcThickMin = isVivax ? 0.25 : 0.15;
      arcThickMax = isVivax ? 0.45 : 0.35;
      arcOpacity = isVivax ? 0.6 : 0.5 + rng() * 0.2;
    } else {
      // Headphone: arc with two dots
      const arcSpan = (3.0 + rng() * 2.0);
      const arcStart = dotAngle + Math.PI * 0.15;
      arcPath = parasiteArc(rng, cx, cy, ringR, arcStart, arcSpan);
      arcThickMin = isVivax ? 0.2 : 0.12;
      arcThickMax = isVivax ? 0.4 : 0.3;
      arcOpacity = isVivax ? 0.55 : 0.45 + rng() * 0.15;
      const d2Angle = dotAngle + Math.PI * (0.6 + rng() * 0.8);
      dot2R = dotR * (0.7 + rng() * 0.3);
      dot2X = cx + Math.cos(d2Angle) * ringR * (0.7 + rng() * 0.3);
      dot2Y = cy + Math.sin(d2Angle) * ringR * (0.7 + rng() * 0.3);
    }

    parasites.push({
      cx, cy, r: ringR, arcPath,
      arcThickMin, arcThickMax,
      dotX, dotY, dotR,
      dot2X, dot2Y, dot2R,
      hasFaintHalo, arcOpacity,
    });
  }

  const clipId = `prbc-${seed}`;
  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={baseR + 1.2} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}
      <clipPath id={clipId}><path d={outline} /></clipPath>

      {/* RBC body */}
      <path d={outline} fill="url(#rbc-grad-parasitized)" opacity={opacity}
        stroke={stain.membraneStroke} strokeWidth="0.08" strokeOpacity={0.3} />
      <ellipse cx={pallorOffX} cy={pallorOffY}
        rx={baseR * 0.38} ry={baseR * 0.34}
        fill={`url(#pallor-${pallorIdx})`} opacity={0.4} />

      {/* Schüffner dots — P. vivax/ovale only */}
      {schuffnerDots.map((d, i) => (
        <circle key={`sd${i}`} cx={d.sx} cy={d.sy} r={0.12}
          fill="#c88898" opacity={0.3} />
      ))}

      {/* Parasite internal morphology — clipped to RBC outline */}
      <g clipPath={`url(#${clipId})`}>
        {parasiteStage === "schizont" ? (() => {
          // Schizont: cluster of merozoite dots + central pigment
          const mCount = 8 + Math.floor(rng() * 14); // 8-22 merozoites
          const mR = n(baseR * 0.55); // cluster radius
          const meros: { mx: number; my: number; mr: number }[] = [];
          for (let i = 0; i < mCount; i++) {
            const a = rng() * Math.PI * 2;
            const d = rng() * mR;
            meros.push({ mx: n(Math.cos(a) * d), my: n(Math.sin(a) * d), mr: n(0.2 + rng() * 0.15) });
          }
          const pigX = n((rng() - 0.5) * mR * 0.3);
          const pigY = n((rng() - 0.5) * mR * 0.3);
          return (
            <g>
              {/* Faint schizont body */}
              <circle cx={0} cy={0} r={mR} fill={stain.nucleusParachromatin} opacity={0.2} />
              {/* Merozoite dots */}
              {meros.map((m, i) => (
                <circle key={i} cx={m.mx} cy={m.my} r={m.mr}
                  fill={stain.nucleusFill} opacity={n(0.7 + rng() * 0.2)} />
              ))}
              {/* Central hemozoin pigment */}
              <circle cx={pigX} cy={pigY} r={n(0.25 + rng() * 0.15)}
                fill="#1a0c04" opacity={0.6} />
            </g>
          );
        })() : parasiteStage === "gametocyte" ? (() => {
          // Gametocyte: banana/crescent shape inside the RBC
          const gLen = n(baseR * 1.4 + rng() * 0.6);
          const gW = n(0.8 + rng() * 0.3);
          const gCurve = n(0.4 + rng() * 0.3);
          const halfL = gLen / 2;
          const gd = `M${n(-halfL)},0 C${n(-halfL * 0.6)},${n(-gW - gCurve)},${n(halfL * 0.6)},${n(-gW - gCurve)},${n(halfL)},0 C${n(halfL * 0.6)},${n(gW * 0.4 + gCurve * 0.2)},${n(-halfL * 0.6)},${n(gW * 0.4 + gCurve * 0.2)},${n(-halfL)},0 Z`;
          const chromX = n((rng() - 0.5) * halfL * 0.3);
          const chromY = n(-gW * 0.3);
          return (
            <g transform={`rotate(${n(rng() * 360)})`}>
              <path d={gd} fill={stain.nucleusFill} opacity={0.7} />
              <path d={gd} fill={stain.nucleusParachromatin} opacity={0.2} />
              {/* Chromatin */}
              <circle cx={chromX} cy={chromY} r={n(0.3 + rng() * 0.15)}
                fill={stain.chromatinPrimary} opacity={0.7} />
              {/* Pigment granules */}
              {Array.from({ length: 3 + Math.floor(rng() * 3) }, (_, i) => (
                <circle key={i} cx={n((rng() - 0.5) * gLen * 0.6)} cy={n(-gW * 0.2 + (rng() - 0.5) * gW * 0.3)}
                  r={n(0.06 + rng() * 0.04)} fill="#1a0c04" opacity={0.5} />
              ))}
            </g>
          );
        })() : parasiteStage === "trophozoite" ? (() => {
          // Trophozoite: P. vivax = large amoeboid, P. falciparum = compact
          const tScale = isVivax ? 0.6 : 0.45;
          const tWobble = isVivax ? 0.55 : 0.4; // more irregular for vivax
          const tR = n(baseR * tScale + rng() * 0.2);
          const tPath = irregularCellPath(rng, tR, isVivax ? 12 : 8, tWobble);
          const chromR = n(tR * 0.25 + rng() * 0.1);
          const chromX = n((rng() - 0.5) * tR * 0.4);
          const chromY = n((rng() - 0.5) * tR * 0.4);
          return (
            <g>
              <path d={tPath} fill={stain.nucleusParachromatin} opacity={isVivax ? 0.35 : 0.45} />
              <circle cx={chromX} cy={chromY} r={chromR}
                fill={stain.chromatinPrimary} opacity={0.7} />
              {/* Hemozoin pigment — more for vivax */}
              {Array.from({ length: (isVivax ? 4 : 2) + Math.floor(rng() * 3) }, (_, i) => (
                <circle key={i} cx={n((rng() - 0.5) * tR * 0.7)} cy={n((rng() - 0.5) * tR * 0.7)}
                  r={n(0.06 + rng() * 0.05)} fill="#1a0c04" opacity={0.5} />
              ))}
            </g>
          );
        })() : (
          // Ring form (default) — existing ring renderer
          parasites.map((par, pi) => {
            const dotRy = n(par.dotR * (0.7 + rng() * 0.5));
            const dotRot = n(rng() * 360);
            const dotOp = n(0.85 + rng() * 0.1);
            const innerDotCx = n(par.dotX + (rng() - 0.5) * par.dotR * 0.4);
            const innerDotCy = n(par.dotY + (rng() - 0.5) * par.dotR * 0.4);
            const arcStrokeW = n(par.arcThickMin + rng() * (par.arcThickMax - par.arcThickMin));
            const diffStrokeW = n(0.6 + rng() * 0.4);
            const dot2Ry = par.dot2R !== undefined ? n(par.dot2R * (0.7 + rng() * 0.5)) : 0;
            const dot2Rot = n(rng() * 360);
            const dot2Op = n(0.80 + rng() * 0.1);
            const inner2Cx = par.dot2X !== undefined ? n(par.dot2X + (rng() - 0.5) * (par.dot2R ?? 0) * 0.4) : 0;
            const inner2Cy = par.dot2Y !== undefined ? n(par.dot2Y + (rng() - 0.5) * (par.dot2R ?? 0) * 0.4) : 0;
            return (
              <g key={pi}>
                {/* Ring arc — layered strokes, NO blur, texture only */}
                {par.arcPath && (<>
                  {/* Wider faint stain spread */}
                  <path d={par.arcPath} fill="none" stroke={stain.parasiteRingStroke}
                    strokeWidth={n(arcStrokeW * 1.8)} strokeOpacity={n(par.arcOpacity * 0.3)} strokeLinecap="round" />
                  {/* Core ring — textured */}
                  <path d={par.arcPath} fill="none" stroke={stain.parasiteRingStroke}
                    strokeWidth={arcStrokeW} strokeOpacity={par.arcOpacity} strokeLinecap="round"
                    filter="url(#parasite-tex)" />
                </>)}

                {/* Chromatin dot — NO blur, textured */}
                <ellipse cx={n(par.dotX)} cy={n(par.dotY)} rx={n(par.dotR * 1.15)} ry={n(dotRy * 1.15)}
                  transform={`rotate(${dotRot},${n(par.dotX)},${n(par.dotY)})`}
                  fill={stain.chromatinPrimary} opacity={n(dotOp * 0.4)} />
                <ellipse cx={n(par.dotX)} cy={n(par.dotY)} rx={n(par.dotR)} ry={dotRy}
                  transform={`rotate(${dotRot},${n(par.dotX)},${n(par.dotY)})`}
                  fill={stain.chromatinPrimary} opacity={dotOp} filter="url(#chromatin-tex)" />
                <circle cx={innerDotCx} cy={innerDotCy} r={n(par.dotR * 0.35)}
                  fill={stain.nucleusDenseChromatin} opacity={0.6} />

                {/* Second dot */}
                {par.dot2X !== undefined && par.dot2R !== undefined && (<>
                  <ellipse cx={n(par.dot2X)} cy={n(par.dot2Y!)} rx={n(par.dot2R * 1.1)} ry={n(dot2Ry * 1.1)}
                    transform={`rotate(${dot2Rot},${n(par.dot2X)},${n(par.dot2Y!)})`}
                    fill={stain.chromatinPrimary} opacity={n(dot2Op * 0.35)} />
                  <ellipse cx={n(par.dot2X)} cy={n(par.dot2Y!)} rx={n(par.dot2R)} ry={dot2Ry}
                    transform={`rotate(${dot2Rot},${n(par.dot2X)},${n(par.dot2Y!)})`}
                    fill={stain.chromatinPrimary} opacity={dot2Op} filter="url(#chromatin-tex)" />
                  <circle cx={inner2Cx} cy={inner2Cy} r={n((par.dot2R ?? 0) * 0.3)}
                    fill={stain.nucleusDenseChromatin} opacity={0.5} />
                </>)}
              </g>
            );
          })
        )}
      </g>
    </g>
  );
}

// ────────────────────────────────────────────
// Neutrophil
//
// Ref: 2-4 chunky S/C-shaped dark lobes connected by thin bridges.
// Visible pink-purple cytoplasm with fine PURPLE granules throughout.
// Nucleus ~40-50% of cell. Lobes very dark, almost black.
// ────────────────────────────────────────────

export function Neutrophil({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(5.0 + rng() * 0.8);
  const lobeCount = 2 + Math.floor(rng() * 2); // 2-3 lobes

  // Lobes clearly separated — spaced apart with cytoplasm visible between them
  const lobes: { path: string; cx: number; cy: number }[] = [];
  const baseAngle = rng() * Math.PI * 2;
  for (let i = 0; i < lobeCount; i++) {
    const angle = baseAngle + (i / lobeCount) * Math.PI * 2 + (rng() - 0.5) * 0.4;
    const dist = n(1.5 + rng() * 0.8); // spread apart so lobes are distinct
    const lobeR = n(1.2 + rng() * 0.4);
    lobes.push({
      path: irregularCellPath(rng, lobeR, 8, 0.3),
      cx: n(Math.cos(angle) * dist),
      cy: n(Math.sin(angle) * dist),
    });
  }

  // Dense dark purple-pink granules — packed inside cytoplasm
  const granules: { gx: number; gy: number; gr: number; o: number }[] = [];
  for (let i = 0; i < 80; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 0.3);
    granules.push({ gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d), gr: n(0.12 + rng() * 0.16), o: n(0.2 + rng() * 0.28) });
  }

  // Curved bridge control points between lobes
  const bridges: { x1: number; y1: number; cpx: number; cpy: number; x2: number; y2: number }[] = [];
  for (let i = 1; i < lobes.length; i++) {
    const prev = lobes[i - 1];
    const curr = lobes[i];
    const mx = (prev.cx + curr.cx) / 2;
    const my = (prev.cy + curr.cy) / 2;
    // Perpendicular offset for curve
    const dx = curr.cx - prev.cx;
    const dy = curr.cy - prev.cy;
    const curveOff = n((rng() - 0.5) * 1.2);
    bridges.push({
      x1: prev.cx, y1: prev.cy,
      cpx: n(mx + -dy * 0.3 + curveOff), cpy: n(my + dx * 0.3 + curveOff),
      x2: curr.cx, y2: curr.cy,
    });
  }

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      {/* Deep purple cytoplasm */}
      <circle r={r} fill="url(#neutrophil-cyto)" opacity={0.7} filter="url(#cyto-tex)" />

      {/* Dense dark purple-pink granules */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={stain.neutrophilGranule} opacity={g.o} />
      ))}

      {/* Very dark nuclear lobes — clearly separated */}
      <g filter="url(#wbc-soft)">
        {lobes.map((l, i) => (
          <g key={i} transform={`translate(${l.cx},${l.cy})`}>
            <path d={l.path} fill={stain.nucleusFill} opacity={0.92} filter="url(#nucleus-tex)" />
          </g>
        ))}
        {/* Curved chromatin bridges */}
        {bridges.map((b, i) => (
          <path key={i}
            d={`M${b.x1},${b.y1} Q${b.cpx},${b.cpy} ${b.x2},${b.y2}`}
            fill="none" stroke={stain.nucleusFill} strokeWidth="0.3" opacity={0.88} />
        ))}
      </g>
    </g>
  );
}

// ────────────────────────────────────────────
// Eosinophil
//
// Ref: bilobed dark purple nucleus. Cytoplasm PACKED with large,
// bright pink-magenta-orange refractile granules. Granules are
// larger and more prominent than neutrophil granules. Nucleus
// is clearly bilobed with thin bridge.
// ────────────────────────────────────────────

export function Eosinophil({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(5.0 + rng() * 0.8);
  const sep = n(1.4 + rng() * 0.6); // clearly separated bilobed
  const lobeR = n(1.2 + rng() * 0.4);
  const lobe1 = irregularCellPath(rng, lobeR, 8, 0.3);
  const lobe2 = irregularCellPath(rng, lobeR, 8, 0.3);

  // Dense pink-magenta granules packed everywhere
  const [gR, gG, gB] = stain.eosinophilGranule;
  const granules: { gx: number; gy: number; gr: number; o: number; hue: string }[] = [];
  for (let i = 0; i < 80; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 0.3);
    granules.push({
      gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d),
      gr: n(0.28 + rng() * 0.18),
      o: n(0.3 + rng() * 0.4),
      hue: `rgb(${gR + Math.floor((rng() - 0.5) * 40)},${gG + Math.floor((rng() - 0.5) * 30)},${gB})`,
    });
  }

  const lobeRot = n(rng() * 25 - 12);
  // Curved bridge between lobes
  const bridgeCurve = n((rng() - 0.5) * 1.5);
  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}
      <circle r={r} fill="url(#eosinophil-cyto)" opacity={0.65} filter="url(#cyto-tex)" />

      {/* Dense pink-magenta granules */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={g.hue} opacity={g.o} />
      ))}

      {/* Very dark bilobed nucleus — clearly separated */}
      <g filter="url(#wbc-soft)">
        <g transform={`translate(${n(-sep)},0) rotate(${lobeRot},0,0)`}>
          <path d={lobe1} fill={stain.nucleusFill} opacity={0.92} filter="url(#nucleus-tex)" />
        </g>
        <g transform={`translate(${n(sep)},0) rotate(${n(-lobeRot)},0,0)`}>
          <path d={lobe2} fill={stain.nucleusFill} opacity={0.92} filter="url(#nucleus-tex)" />
        </g>
        {/* Curved bridge */}
        <path d={`M${n(-sep + lobeR * 0.3)},0 Q0,${bridgeCurve} ${n(sep - lobeR * 0.3)},0`}
          fill="none" stroke={stain.nucleusFill} strokeWidth="0.3" opacity={0.85} />
      </g>
    </g>
  );
}

// ────────────────────────────────────────────
// Basophil
//
// Ref: round cell almost entirely covered by DENSE DARK BLUE-PURPLE
// granules. Granules so dense they nearly obscure the bilobed nucleus.
// Appears as a dark blue-purple ball. Nucleus barely visible beneath.
// ────────────────────────────────────────────

export function Basophil({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(4.8 + rng() * 0.6);

  // Very dense, large dark blue-purple granules — fill almost entire cell
  const granules: { gx: number; gy: number; gr: number; o: number }[] = [];
  for (let i = 0; i < 70; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 0.3);
    granules.push({
      gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d),
      gr: n(0.3 + rng() * 0.25), // large granules
      o: n(0.5 + rng() * 0.35),  // high opacity — dense
    });
  }

  // Bilobed nucleus barely visible beneath granules
  const sep = n(0.5 + rng() * 0.4);
  const lobeR = n(1.2 + rng() * 0.3);
  const lobe1 = irregularCellPath(rng, lobeR, 8, 0.25);
  const lobe2 = irregularCellPath(rng, lobeR, 8, 0.25);

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      <circle r={r} fill="url(#basophil-cyto)" opacity={0.4} filter="url(#cyto-tex)" />

      {/* Nucleus underneath — barely visible */}
      <g filter="url(#wbc-soft)">
        <g transform={`translate(${n(-sep)},0)`}>
          <path d={lobe1} fill={stain.nucleusFill} opacity={0.5} />
        </g>
        <g transform={`translate(${n(sep)},0)`}>
          <path d={lobe2} fill={stain.nucleusFill} opacity={0.5} />
        </g>
      </g>

      {/* Dense dark blue-purple granules ON TOP — obscure nucleus */}
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={stain.basophilGranule} opacity={g.o} />
      ))}
    </g>
  );
}

// ────────────────────────────────────────────
// Lymphocyte
//
// Ref: LARGE dense round dark purple nucleus that fills most of
// the cell. Very thin rim of pale blue-purple cytoplasm visible.
// High nuclear:cytoplasmic ratio. Nucleus has visible chromatin
// clumping. No visible granules.
// ────────────────────────────────────────────

export function Lymphocyte({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(3.8 + rng() * 0.8);
  const nucleusR = n(r * (0.78 + rng() * 0.1)); // very high N:C ratio
  const nx = n((rng() - 0.5) * 0.3);
  const ny = n((rng() - 0.5) * 0.3);
  const nucleusPath = irregularCellPath(rng, nucleusR, 10, 0.15);

  // Dense chromatin clumps — condensed chromatin pattern
  const clumps: { cx: number; cy: number; cr: number; o: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * nucleusR * 0.55;
    clumps.push({
      cx: n(Math.cos(a) * d), cy: n(Math.sin(a) * d),
      cr: n(0.25 + rng() * 0.4), o: n(0.15 + rng() * 0.2),
    });
  }

  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(r + 1.5)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}

      {/* Deep purple cytoplasm rim */}
      <circle r={r} fill="url(#lymphocyte-cyto)" opacity={0.65} filter="url(#cyto-tex)" />

      {/* Very dark dense round nucleus */}
      <g transform={`translate(${nx},${ny})`} filter="url(#wbc-soft)">
        <path d={nucleusPath} fill={stain.nucleusFill} opacity={0.92} filter="url(#nucleus-tex)" />
        {/* Chromatin clumps */}
        {clumps.map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.cr} fill={stain.nucleusDenseChromatin} opacity={c.o} />
        ))}
      </g>
    </g>
  );
}

// ────────────────────────────────────────────
// Monocyte
// ────────────────────────────────────────────

export function Monocyte({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const r = n(6.0 + rng() * 0.8);
  const nw = n(2.5 + rng() * 0.5);
  const nh = n(2.0 + rng() * 0.4);
  const indent = n(0.55 + rng() * 0.35);

  const granules: { gx: number; gy: number; gr: number; o: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const a = rng() * Math.PI * 2;
    const d = rng() * (r - 1.5);
    granules.push({ gx: n(Math.cos(a) * d), gy: n(Math.sin(a) * d), gr: n(0.08 + rng() * 0.08), o: n(0.08 + rng() * 0.1) });
  }

  const lightPatches: { cx: number; cy: number; r: number; o: number }[] = [];
  for (let i = 0; i < 5; i++) {
    lightPatches.push({
      cx: n((rng() - 0.5) * nw * 1.2), cy: n((rng() - 0.5) * nh * 0.8),
      r: n(0.3 + rng() * 0.4), o: n(0.08 + rng() * 0.1),
    });
  }

  const filter = dofFilter(depth);
  const p = (v: number) => v + (rng() - 0.5) * 0.5;

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={r + 1.5} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}
      <circle r={r} fill="url(#monocyte-cyto)" opacity={0.65} filter="url(#cyto-tex)" />
      {granules.map((g, i) => (
        <circle key={i} cx={g.gx} cy={g.gy} r={g.gr} fill={stain.monocyteCyto[1]} opacity={g.o} />
      ))}
      <g filter="url(#wbc-soft)">
        <path
          d={`M ${-nw} 0 Q ${p(-nw)} ${p(-nh)}, ${p(0)} ${-nh}
              Q ${p(nw)} ${p(-nh)}, ${nw} 0
              Q ${p(nw)} ${p(nh)}, ${p(0)} ${nh * indent}
              Q ${p(-nw)} ${p(nh)}, ${-nw} 0 Z`}
          fill={stain.nucleusFill} opacity={0.90} filter="url(#nucleus-tex)" />
        {lightPatches.map((lp, i) => (
          <circle key={`lp${i}`} cx={lp.cx} cy={lp.cy} r={lp.r} fill={stain.nucleusParachromatin} opacity={lp.o} />
        ))}
      </g>
    </g>
  );
}

// ────────────────────────────────────────────
// Platelet
// ────────────────────────────────────────────

export function Platelet({ x, y, rotation, seed, depth, stain, onClick, selected }: CellProps) {
  const rng = createRng(seed);
  const rx = 0.9 + rng() * 0.5;
  const ry = rx * (0.75 + rng() * 0.4);
  const filter = dofFilter(depth);

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={rx + 0.8} fill="none" stroke="#38bdf8" strokeWidth="0.3" opacity="0.7" />}
      <ellipse rx={rx} ry={ry} fill={stain.plateletOuter} opacity={0.7} />
      <ellipse rx={rx * 0.5} ry={ry * 0.5} fill={stain.plateletInner} opacity={0.55} />
    </g>
  );
}
