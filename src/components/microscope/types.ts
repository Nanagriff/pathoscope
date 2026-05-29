export type CellType =
  | "rbc"
  | "parasitized-rbc"
  | "neutrophil"
  | "eosinophil"
  | "basophil"
  | "lymphocyte"
  | "monocyte"
  | "platelet";

/** Plasmodium species */
export type MalariaSpecies = "pf" | "pv" | "pm" | "po" | "pk";

/** Parasite developmental stage */
export type ParasiteStage = "ring" | "trophozoite" | "schizont" | "gametocyte";

/** Film type */
export type FilmType = "thin" | "thick";

export interface CellData {
  id: number;
  type: CellType;
  x: number;
  y: number;
  rotation: number;
  /** Per-cell random seed — drives size/shape/color variation */
  seed: number;
  /** Label shown on click/hover */
  label: string;
  /** Short teaching description */
  description: string;
  /** Focal plane: 0 = sharp focus, higher = more blurred. Range [0, 1] */
  depth: number;
  /** Z-order for overlap rendering. Higher = drawn later (on top) */
  zIndex: number;
  /** Parasite stage (only for parasitized-rbc) */
  parasiteStage?: ParasiteStage;
  /** Malaria species (only for parasitized-rbc) */
  malariaSpecies?: MalariaSpecies;
}

export interface StainArtifact {
  x: number;
  y: number;
  r: number;
  opacity: number;
  type: "precipitate" | "debris" | "bubble";
}

export interface SlideConfig {
  /** Total slide width in virtual units */
  width: number;
  /** Total slide height in virtual units */
  height: number;
  /** Approximate center-to-center spacing */
  cellSpacing: number;
  /** Fraction of RBCs that are parasitized (0-1) */
  parasitemia: number;
  /** Master seed for deterministic generation */
  seed: number;
  /** Smear flow direction in degrees (0 = left-to-right). Default ~12 */
  smearDirection?: number;
  /** Focus sweet-spot centre as fraction [0-1, 0-1] */
  focusCenter?: [number, number];
  /** Radius (in virtual units) of the sharp-focus zone */
  focusRadius?: number;
  /** Malaria species. Default "pf" */
  species?: MalariaSpecies;
  /** Distribution of parasite stages. Defaults to species-appropriate mix. */
  stageWeights?: Partial<Record<ParasiteStage, number>>;
  /** Film type. Default "thin" */
  filmType?: FilmType;
}

export interface GeneratedSlide {
  cells: CellData[];
  artifacts: StainArtifact[];
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

// ---------- Seeded PRNG (mulberry32) ----------

export function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Irregular cell outline (Catmull-Rom → Bézier) ----------

/**
 * Generate a closed SVG `d` attribute for a wobbly-circle RBC outline.
 * Places `n` control points around a circle, perturbs each radius,
 * then connects them via smooth cubic Bézier (Catmull-Rom conversion).
 */
export function irregularCellPath(
  rng: () => number,
  baseR: number,
  n = 10,
  wobble = 0.18,
): string {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    const r = baseR * (1 + (rng() - 0.5) * wobble);
    pts.push([Math.cos(angle) * r, Math.sin(angle) * r]);
  }
  // Catmull-Rom to cubic Bézier
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${cp1x.toFixed(2)},${cp1y.toFixed(2)},${cp2x.toFixed(2)},${cp2y.toFixed(2)},${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d + "Z";
}

// ---------- Segmented nucleus path (spine-based) ----------

/**
 * Generate a segmented nuclear outline shaped like a curved ribbon
 * that has been pinched into segments.
 *
 * Think: "a thick C-shaped sausage pinched several times."
 *
 * The nucleus is built along a curved SPINE (arc/horseshoe), with
 * variable width: wide at lobe centres, narrow at constrictions.
 * This avoids radial star/flower/pinwheel patterns entirely.
 *
 * @param lobeCount   Number of segments (3-4 for neutrophil, 2 for eosinophil)
 * @param arcR        Radius of the spine arc (distance from cell centre to ribbon centre)
 * @param lobeHW      Half-width of the ribbon at lobe centres
 * @param constrHW    Half-width at constrictions (the pinch)
 */
export function lobulatedNucleusPath(
  rng: () => number,
  lobeCount: number,
  arcR: number,
  lobeHW: number,
  constrHW: number,
  nPts: number = 30,
): string {
  const arcStart = rng() * Math.PI * 2;
  const arcSpan = Math.PI * (1.3 + rng() * 0.4); // longer C-shape: 234°–306°

  // Lobe size hierarchy: one dominant, one small, rest medium
  const amps: number[] = [];
  {
    const raw: number[] = [];
    for (let l = 0; l < lobeCount; l++) raw.push(rng());
    const srt = [...raw].sort((a, b) => b - a);
    for (let l = 0; l < lobeCount; l++) {
      const rank = srt.indexOf(raw[l]);
      amps.push(
        rank === 0 ? 1.05 + rng() * 0.15          // dominant
        : rank === lobeCount - 1 ? 0.6 + rng() * 0.15 // smallest
        : 0.75 + rng() * 0.15,                     // medium
      );
    }
  }

  // ── Build outer and inner edges along the spine arc ──
  const outerPts: [number, number][] = [];
  const innerPts: [number, number][] = [];

  for (let i = 0; i <= nPts; i++) {
    const t = i / nPts;
    const angle = arcStart + t * arcSpan + (rng() - 0.5) * 0.07;
    const rS = arcR + (rng() - 0.5) * 0.18;

    // Width profile — cos² gives lobeCount peaks with constrictions between
    const wFactor = Math.pow(Math.cos(t * (lobeCount - 1) * Math.PI), 2);
    const lobeIdx = Math.min(lobeCount - 1, Math.round(t * (lobeCount - 1)));
    const hw = constrHW + (lobeHW - constrHW) * wFactor * amps[lobeIdx]
             + (rng() - 0.5) * 0.05;

    const c = Math.cos(angle), s = Math.sin(angle);
    outerPts.push([c * (rS + hw), s * (rS + hw)]);
    innerPts.push([c * Math.max(0.15, rS - hw), s * Math.max(0.15, rS - hw)]);
  }

  // ── Rounded caps at each end ──
  function semicap(angle: number, hw: number, fromOuterToInner: boolean): [number, number][] {
    const cx = Math.cos(angle) * arcR, cy = Math.sin(angle) * arcR;
    const nx = Math.cos(angle), ny = Math.sin(angle);
    const tx = -Math.sin(angle), ty = Math.cos(angle);
    const dir = fromOuterToInner ? 1 : -1;
    const cap: [number, number][] = [];
    for (let j = 1; j <= 3; j++) {
      const phi = (j / 4) * Math.PI * dir;
      cap.push([
        cx + (nx * Math.cos(phi) + tx * Math.sin(phi)) * hw,
        cy + (ny * Math.cos(phi) + ty * Math.sin(phi)) * hw,
      ]);
    }
    return cap;
  }

  const endAngle = arcStart + arcSpan;
  const endHW = constrHW + (lobeHW - constrHW) * amps[lobeCount - 1] * 0.7;
  const startHW = constrHW + (lobeHW - constrHW) * amps[0] * 0.7;

  const allPts: [number, number][] = [
    ...outerPts,
    ...semicap(endAngle, endHW, true),
    ...[...innerPts].reverse(),
    ...semicap(arcStart, startHW, false),
  ];

  // ── Catmull-Rom → cubic Bézier ──
  const np = allPts.length;
  let d = `M${allPts[0][0].toFixed(2)},${allPts[0][1].toFixed(2)}`;
  for (let i = 0; i < np; i++) {
    const p0 = allPts[(i - 1 + np) % np];
    const p1 = allPts[i];
    const p2 = allPts[(i + 1) % np];
    const p3 = allPts[(i + 2) % np];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${cp1x.toFixed(2)},${cp1y.toFixed(2)},${cp2x.toFixed(2)},${cp2y.toFixed(2)},${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d + "Z";
}
