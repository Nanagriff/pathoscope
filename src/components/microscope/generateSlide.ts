import {
  CellData,
  CellType,
  SlideConfig,
  StainArtifact,
  GeneratedSlide,
  createRng,
} from "./types";

// ── Cell descriptions (teaching text) ──

const CELL_DESCRIPTIONS: Record<CellType, { label: string; description: string }> = {
  rbc: {
    label: "Normal RBC",
    description:
      "Biconcave disc, ~7 \u00b5m diameter. Central pallor occupies roughly 1/3 of the cell. Normal colour and size.",
  },
  "parasitized-rbc": {
    label: "Parasitized RBC (P. falciparum)",
    description:
      "Ring form: delicate blue-purple ring with 1\u20132 chromatin dots. Cell size is normal (P. falciparum does not enlarge the host RBC). Appliqué forms may be seen at the cell periphery.",
  },
  neutrophil: {
    label: "Neutrophil",
    description:
      "12\u201315 \u00b5m. Multi-lobed nucleus (3\u20135 lobes) connected by thin chromatin bridges. Pale pink cytoplasm with fine neutral granules.",
  },
  eosinophil: {
    label: "Eosinophil",
    description:
      "12\u201317 \u00b5m. Bilobed nucleus connected by thin bridge. Cytoplasm packed with large, refractile orange-red granules.",
  },
  lymphocyte: {
    label: "Lymphocyte",
    description:
      "7\u201310 \u00b5m. Large round-to-oval dark purple nucleus with scant pale blue cytoplasm rim. High nuclear-to-cytoplasmic ratio.",
  },
  basophil: {
    label: "Basophil",
    description:
      "12\u201315 \u00b5m. Rarest WBC (<1%). Bilobed nucleus obscured by dense, large dark blue-purple metachromatic granules. Contains histamine and heparin.",
  },
  monocyte: {
    label: "Monocyte",
    description:
      "15\u201320 \u00b5m (largest WBC). Kidney/horseshoe-shaped nucleus. Abundant blue-gray cytoplasm with fine azurophilic granules and occasional vacuoles.",
  },
  platelet: {
    label: "Platelet",
    description:
      "2\u20134 \u00b5m. Small anucleate fragment with pale hyalomere periphery and dark granulomere centre.",
  },
};

// ── Simple 2D value-noise (low-res, bilinear) ──

function buildNoiseField(rng: () => number, gx: number, gy: number): Float32Array {
  const field = new Float32Array(gx * gy);
  for (let i = 0; i < field.length; i++) field[i] = rng();
  return field;
}

function sampleNoise(
  field: Float32Array,
  gx: number,
  gy: number,
  fx: number,
  fy: number,
): number {
  const x = fx * (gx - 1);
  const y = fy * (gy - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, gx - 1);
  const y1 = Math.min(y0 + 1, gy - 1);
  const tx = x - x0;
  const ty = y - y0;
  const v00 = field[y0 * gx + x0];
  const v10 = field[y0 * gx + x1];
  const v01 = field[y1 * gx + x0];
  const v11 = field[y1 * gx + x1];
  return (v00 * (1 - tx) * (1 - ty) +
    v10 * tx * (1 - ty) +
    v01 * (1 - tx) * ty +
    v11 * tx * ty);
}

// ── Main generator ──

export function generateSlide(config: SlideConfig): GeneratedSlide {
  const {
    width,
    height,
    cellSpacing,
    parasitemia,
    seed,
    smearDirection = 12,
    focusCenter = [0.48, 0.46],
    focusRadius = 120,
  } = config;

  const rng = createRng(seed);
  const cells: CellData[] = [];
  let id = 0;

  // Smear direction in radians
  const smearRad = (smearDirection * Math.PI) / 180;
  const cosS = Math.cos(smearRad);
  const sinS = Math.sin(smearRad);

  // Focus centre in world coords
  const fcx = focusCenter[0] * width;
  const fcy = focusCenter[1] * height;

  // Density noise field (6×5 grid — creates large-scale density variation)
  const NGX = 6;
  const NGY = 5;
  const densityField = buildNoiseField(rng, NGX, NGY);

  // Stain intensity noise (affects color variant selection)
  const stainField = buildNoiseField(rng, 4, 4);

  const cols = Math.floor(width / cellSpacing);
  const rows = Math.floor(height / cellSpacing);
  const mx = (width - (cols - 1) * cellSpacing) / 2;
  const my = (height - (rows - 1) * cellSpacing) / 2;

  // ── Place RBCs with directional jitter and density variation ──

  for (let row = 0; row < rows; row++) {
    const isOddRow = row % 2 === 1;
    const hexOffset = isOddRow ? cellSpacing * 0.5 : 0;

    for (let col = 0; col < cols; col++) {
      const baseX = mx + col * cellSpacing + hexOffset;
      const baseY = my + row * cellSpacing;

      // Sample density noise — high noise = more likely to skip
      const nfx = Math.min(1, Math.max(0, baseX / width));
      const nfy = Math.min(1, Math.max(0, baseY / height));
      const density = sampleNoise(densityField, NGX, NGY, nfx, nfy);
      const skipChance = density < 0.35 ? 0.02 : density > 0.7 ? 0.18 : 0.05;
      if (rng() < skipChance) continue;

      // Directional jitter (elongated along smear axis)
      const localJx = (rng() - 0.5) * cellSpacing * 0.55;
      const localJy = (rng() - 0.5) * cellSpacing * 0.32;
      const jx = localJx * cosS - localJy * sinS;
      const jy = localJx * sinS + localJy * cosS;
      const cx = baseX + jx;
      const cy = baseY + jy;

      if (cx < 2 || cx > width - 2 || cy < 2 || cy > height - 2) continue;

      // Depth (distance from focus centre, with per-cell perturbation)
      const dist = Math.hypot(cx - fcx, cy - fcy);
      const normDist = dist / focusRadius;
      const depth = Math.min(1, Math.max(0, normDist * 0.6 + rng() * 0.25));

      // Cell rotation: bias toward smear direction for ~50% of cells
      const rotation =
        rng() < 0.5
          ? smearDirection + (rng() - 0.5) * 50
          : rng() * 360;

      // Determine cell type
      let type: CellType = "rbc";
      if (rng() < parasitemia) type = "parasitized-rbc";

      // Resolve stage for this slide (single stage per slide)
      const slideStage = (() => {
        if (type !== "parasitized-rbc") return undefined;
        const w = config.stageWeights;
        if (w) {
          const entries = Object.entries(w) as [import("./types").ParasiteStage, number][];
          entries.sort((a, b) => b[1] - a[1]);
          return entries[0]?.[0] ?? "ring";
        }
        return "ring" as import("./types").ParasiteStage;
      })();

      const info = CELL_DESCRIPTIONS[type];
      cells.push({
        id: id++,
        type,
        x: cx,
        y: cy,
        rotation,
        seed: Math.floor(rng() * 1_000_000),
        label: info.label,
        description: info.description,
        depth,
        zIndex: row * cols + col + rng() * 10,
        parasiteStage: slideStage,
        malariaSpecies: type === "parasitized-rbc" ? (config.species ?? "pf") : undefined,
      });
    }
  }

  // ── Partial overlaps: nudge ~12% of adjacent pairs closer ──

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].type !== "rbc" && cells[i].type !== "parasitized-rbc") continue;
    if (rng() > 0.12) continue;

    // Find nearest neighbour
    let bestDist = Infinity;
    let bestJ = -1;
    for (let j = Math.max(0, i - 60); j < Math.min(cells.length, i + 60); j++) {
      if (j === i) continue;
      if (cells[j].type !== "rbc" && cells[j].type !== "parasitized-rbc") continue;
      const dx = cells[j].x - cells[i].x;
      const dy = cells[j].y - cells[i].y;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        bestJ = j;
      }
    }
    if (bestJ >= 0 && bestDist < (cellSpacing * 1.2) ** 2) {
      const pull = 0.15 + rng() * 0.15;
      const dx = cells[bestJ].x - cells[i].x;
      const dy = cells[bestJ].y - cells[i].y;
      cells[i].x += dx * pull;
      cells[i].y += dy * pull;
    }
  }

  // ── Rouleaux clusters: short chains of overlapping RBCs ──

  const rouleauxSeeds = Math.floor(cells.length * 0.008);
  for (let r = 0; r < rouleauxSeeds; r++) {
    const seedIdx = Math.floor(rng() * cells.length);
    const seedCell = cells[seedIdx];
    if (seedCell.type !== "rbc") continue;

    const chainLen = 2 + Math.floor(rng() * 3); // 2-4 in chain
    let prevX = seedCell.x;
    let prevY = seedCell.y;
    let baseZIndex = seedCell.zIndex;

    for (let c = 0; c < chainLen; c++) {
      const stepDist = 4.5 + rng() * 1.5; // tighter than normal spacing
      const nx = prevX + cosS * stepDist + (rng() - 0.5) * 1.5;
      const ny = prevY + sinS * stepDist + (rng() - 0.5) * 1.5;

      if (nx < 2 || nx > width - 2 || ny < 2 || ny > height - 2) break;

      const dist = Math.hypot(nx - fcx, ny - fcy);
      const depth = Math.min(1, Math.max(0, (dist / focusRadius) * 0.6 + rng() * 0.25));

      baseZIndex += 5;
      const info = CELL_DESCRIPTIONS.rbc;
      cells.push({
        id: id++,
        type: "rbc",
        x: nx,
        y: ny,
        rotation: smearDirection + (rng() - 0.5) * 25,
        seed: Math.floor(rng() * 1_000_000),
        label: info.label,
        description: info.description,
        depth,
        zIndex: baseZIndex,
      });
      prevX = nx;
      prevY = ny;
    }
  }

  // ── WBCs — at most 2 different types per field, 4-5 total ──

  const allWbcTypes: CellType[] = ["neutrophil", "lymphocyte", "eosinophil", "monocyte", "basophil"];
  // Pick 2 random WBC types for this field
  const shuffled = allWbcTypes.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const fieldWbcTypes = [shuffled[0], shuffled[1]];

  const wbcPlacements: { type: CellType; wx: number; wy: number }[] = [];
  // Place 4-5 WBCs of these 2 types
  const wbcTotal = 4 + Math.floor(rng() * 2);
  // First one near centre of viewport
  wbcPlacements.push({
    type: fieldWbcTypes[0],
    wx: width * (0.35 + rng() * 0.3),
    wy: height * (0.35 + rng() * 0.3),
  });
  for (let i = 1; i < wbcTotal; i++) {
    wbcPlacements.push({
      type: fieldWbcTypes[i % 2],
      wx: 20 + rng() * (width - 40),
      wy: 20 + rng() * (height - 40),
    });
  }

  for (const { type, wx, wy } of wbcPlacements) {
    const clearRadius = 10;
    for (let j = cells.length - 1; j >= 0; j--) {
      const dx = cells[j].x - wx;
      const dy = cells[j].y - wy;
      if (dx * dx + dy * dy < clearRadius * clearRadius) {
        cells.splice(j, 1);
      }
    }
    const dist = Math.hypot(wx - fcx, wy - fcy);
    const depth = Math.min(1, Math.max(0, (dist / focusRadius) * 0.6 + rng() * 0.2));
    const info = CELL_DESCRIPTIONS[type];
    cells.push({
      id: id++,
      type,
      x: wx,
      y: wy,
      rotation: rng() * 360,
      seed: Math.floor(rng() * 1_000_000),
      label: info.label,
      description: info.description,
      depth,
      zIndex: 9000 + rng() * 100,
    });
  }

  // ── Platelets ──
  // Some free, some deliberately placed ON TOP of RBCs (can mimic parasites)

  const rbcCells = cells.filter((c) => c.type === "rbc");
  const plateletCount = 12 + Math.floor(rng() * 10);
  const overlayCount = 3 + Math.floor(rng() * 3); // 3-5 platelets on RBCs

  // Platelets overlying RBCs
  for (let i = 0; i < overlayCount && i < rbcCells.length; i++) {
    const targetIdx = Math.floor(rng() * rbcCells.length);
    const target = rbcCells[targetIdx];
    // Place platelet slightly off-centre on the RBC
    const offX = (rng() - 0.5) * 3;
    const offY = (rng() - 0.5) * 3;
    const dist = Math.hypot(target.x - fcx, target.y - fcy);
    const info = CELL_DESCRIPTIONS.platelet;
    cells.push({
      id: id++,
      type: "platelet",
      x: target.x + offX,
      y: target.y + offY,
      rotation: rng() * 360,
      seed: Math.floor(rng() * 1_000_000),
      label: info.label,
      description: info.description,
      depth: Math.min(1, Math.max(0, (dist / focusRadius) * 0.6 + rng() * 0.2)),
      zIndex: 10000 + rng() * 100, // above RBCs
    });
  }

  // Free platelets scattered between cells
  for (let i = 0; i < plateletCount; i++) {
    const px = 5 + rng() * (width - 10);
    const py = 5 + rng() * (height - 10);
    const dist = Math.hypot(px - fcx, py - fcy);
    const info = CELL_DESCRIPTIONS.platelet;
    cells.push({
      id: id++,
      type: "platelet",
      x: px,
      y: py,
      rotation: rng() * 360,
      seed: Math.floor(rng() * 1_000_000),
      label: info.label,
      description: info.description,
      depth: Math.min(1, Math.max(0, (dist / focusRadius) * 0.6 + rng() * 0.3)),
      zIndex: 10000 + rng() * 100,
    });
  }

  // ── Sort by zIndex ──
  cells.sort((a, b) => a.zIndex - b.zIndex);

  // ── Stain artifacts ──

  const artifacts: StainArtifact[] = [];

  // Stain precipitate (tiny dark purple dots)
  for (let i = 0; i < 30 + Math.floor(rng() * 20); i++) {
    artifacts.push({
      x: rng() * width,
      y: rng() * height,
      r: 0.15 + rng() * 0.3,
      opacity: 0.2 + rng() * 0.3,
      type: "precipitate",
    });
  }

  // Refractile debris (larger faint bright spots)
  for (let i = 0; i < 3 + Math.floor(rng() * 3); i++) {
    artifacts.push({
      x: rng() * width,
      y: rng() * height,
      r: 1.5 + rng() * 2.5,
      opacity: 0.06 + rng() * 0.08,
      type: "debris",
    });
  }

  // Tiny air bubbles
  for (let i = 0; i < Math.floor(rng() * 3); i++) {
    artifacts.push({
      x: rng() * width,
      y: rng() * height,
      r: 0.8 + rng() * 1.2,
      opacity: 0.04 + rng() * 0.06,
      type: "bubble",
    });
  }

  return { cells, artifacts };
}
