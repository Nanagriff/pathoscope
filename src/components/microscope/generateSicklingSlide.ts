/**
 * Sickling test slide generator.
 *
 * Generates cells under sodium metabisulphite reducing agent.
 * - Negative: all normal discs (no sickling)
 * - Positive: mix of normal discs + sickled cells (crescent, holly leaf, elongated, oat)
 */

import {
  CellData,
  StainArtifact,
  GeneratedSlide,
  createRng,
} from "./types";

interface SicklingConfig {
  width: number;
  height: number;
  seed: number;
  /** Fraction of cells that are sickled (0 = negative, 0.3-0.7 = positive) */
  sicklingRate: number;
}

const SICKLING_TYPES = ["sickle", "holly-leaf", "elongated", "oat"] as const;

export function generateSicklingSlide(config: SicklingConfig): GeneratedSlide {
  const { width, height, seed, sicklingRate } = config;
  const rng = createRng(seed);
  const cells: CellData[] = [];
  let id = 0;

  // Looser spacing than blood film — wet prep, cells float freely
  const spacing = 12;
  const cols = Math.floor(width / spacing);
  const rows = Math.floor(height / spacing);

  for (let row = 0; row < rows; row++) {
    const hexOff = row % 2 === 1 ? spacing * 0.5 : 0;
    for (let col = 0; col < cols; col++) {
      // Skip ~25% for natural gaps (wet prep is sparse)
      if (rng() < 0.25) continue;

      const x = (col + 0.5) * spacing + hexOff + (rng() - 0.5) * spacing * 0.6;
      const y = (row + 0.5) * spacing + (rng() - 0.5) * spacing * 0.6;

      if (x < 3 || x > width - 3 || y < 3 || y > height - 3) continue;

      const isSickled = rng() < sicklingRate;

      if (isSickled) {
        // Pick a sickle cell variant
        const variant = SICKLING_TYPES[Math.floor(rng() * SICKLING_TYPES.length)];
        const variantLabels: Record<string, { label: string; desc: string }> = {
          sickle: { label: "Sickle Cell (Drepanocyte)", desc: "Classic crescent/sickle shape. Elongated with pointed ends. Formed by polymerisation of deoxygenated HbS." },
          "holly-leaf": { label: "Holly Leaf Cell", desc: "Irregular cell with multiple spiky projections. Represents intermediate sickling with partial HbS polymerisation." },
          elongated: { label: "Elongated Cell", desc: "Stretched oval/boat shape. Early stage of sickling — the cell is deforming but not yet fully crescentic." },
          oat: { label: "Oat/Filament Cell", desc: "Thin, elongated filamentous form. Represents severe/irreversible sickling. Often seen in HbSS patients." },
        };
        const info = variantLabels[variant] ?? variantLabels.sickle;
        cells.push({
          id: id++,
          type: "rbc", // reuse type, rendering handled separately
          x, y,
          rotation: rng() * 360,
          seed: Math.floor(rng() * 1_000_000),
          label: info.label,
          description: info.desc,
          depth: 0,
          zIndex: row * cols + col + rng() * 5,
          // Tag for renderer
          parasiteStage: variant as any, // reuse field for sickling variant
          malariaSpecies: "sickling" as any, // flag for renderer
        });
      } else {
        cells.push({
          id: id++,
          type: "rbc",
          x, y,
          rotation: rng() * 360,
          seed: Math.floor(rng() * 1_000_000),
          label: "Normal Disc",
          description: "Normal biconcave disc with central pallor. No sickling under reducing agent — consistent with HbAA or HbAS carrier with insufficient deoxygenation.",
          depth: 0,
          zIndex: row * cols + col + rng() * 5,
          malariaSpecies: "sickling-normal" as any,
        });
      }
    }
  }

  cells.sort((a, b) => a.zIndex - b.zIndex);

  // Artifacts — bubbles and debris from wet prep
  const artifacts: StainArtifact[] = [];
  for (let i = 0; i < 5 + Math.floor(rng() * 5); i++) {
    artifacts.push({
      x: rng() * width, y: rng() * height,
      r: 1 + rng() * 3,
      opacity: 0.04 + rng() * 0.04,
      type: "bubble",
    });
  }

  return { cells, artifacts };
}
