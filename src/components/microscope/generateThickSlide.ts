/**
 * Thick blood film generator.
 *
 * Key differences from thin film:
 * - NO intact RBCs (lysed/dehemoglobinized)
 * - Mottled background (lysed cell debris)
 * - Free-floating parasites (no host cell)
 * - WBCs remain intact
 * - Platelets scattered as small dark fragments
 * - Higher effective parasite concentration
 */

import {
  CellData,
  CellType,
  SlideConfig,
  StainArtifact,
  GeneratedSlide,
  ParasiteStage,
  createRng,
} from "./types";

import type { MalariaSpecies } from "./types";

const SPECIES_NAMES: Record<string, string> = {
  pf: "P. falciparum", pv: "P. vivax", pm: "P. malariae", po: "P. ovale", pk: "P. knowlesi",
};

function stageLabel(stage: string, species: MalariaSpecies): string {
  return `${SPECIES_NAMES[species] ?? species} ${stage.charAt(0).toUpperCase() + stage.slice(1)}`;
}

const STAGE_DESCS: Record<string, string> = {
  ring: "Small purple dot with faint ring cytoplasm. Most common stage in peripheral blood.",
  trophozoite: "Larger irregular purple structure with hemozoin (malaria pigment). Mature feeding stage.",
  schizont: "Round structure containing multiple merozoites (daughter cells).",
  gametocyte: "Sexual stage transmissible to mosquitoes.",
};

const THICK_DESCRIPTIONS: Record<string, { label: string; description: string }> = {
  "neutrophil": {
    label: "WBC (Neutrophil)",
    description: "White blood cell — remains intact after thick film preparation. Used as reference for counting parasites per WBC.",
  },
  "lymphocyte": {
    label: "WBC (Lymphocyte)",
    description: "White blood cell — remains intact in thick film. Parasites are counted against 200-500 WBCs for density estimation.",
  },
  "platelet": {
    label: "Platelet",
    description: "Small dark fragment. Can be confused with parasites in thick film — distinguish by size and shape.",
  },
};

export function generateThickSlide(config: SlideConfig): GeneratedSlide {
  const {
    width,
    height,
    parasitemia,
    seed,
  } = config;

  const rng = createRng(seed);
  const cells: CellData[] = [];
  let id = 0;

  // Single stage per slide — teaching tool, one concept at a time
  const stage: ParasiteStage = (() => {
    const weights = config.stageWeights;
    if (weights) {
      const entries = Object.entries(weights) as [ParasiteStage, number][];
      // Pick the stage with the highest weight (the dedicated stage for this slide)
      entries.sort((a, b) => b[1] - a[1]);
      return entries[0]?.[0] ?? "ring";
    }
    return "ring";
  })();

  const sp = config.species ?? "pf";
  const parasiteLabel = stageLabel(stage, sp);
  const parasiteDesc = STAGE_DESCS[stage] ?? STAGE_DESCS.ring;

  // ── Free parasites — scattered across the field ──
  const parasiteCount = Math.max(5, Math.floor(parasitemia * 800));

  for (let i = 0; i < parasiteCount; i++) {
    const px = 10 + rng() * (width - 20);
    const py = 10 + rng() * (height - 20);

    cells.push({
      id: id++,
      type: "parasitized-rbc",
      x: px,
      y: py,
      rotation: rng() * 360,
      seed: Math.floor(rng() * 1_000_000),
      label: parasiteLabel,
      description: parasiteDesc,
      depth: 0,
      zIndex: 100 + rng() * 50,
      parasiteStage: stage,
      malariaSpecies: sp,
    });
  }

  // ── WBCs — remain intact, 8-15 per thick film field ──
  const wbcTypes: CellType[] = ["neutrophil", "lymphocyte"];
  const wbcCount = 8 + Math.floor(rng() * 8);

  for (let i = 0; i < wbcCount; i++) {
    const wx = 15 + rng() * (width - 30);
    const wy = 15 + rng() * (height - 30);
    const type = wbcTypes[i % 2];
    const info = THICK_DESCRIPTIONS[type] ?? { label: type, description: "" };

    cells.push({
      id: id++,
      type,
      x: wx,
      y: wy,
      rotation: rng() * 360,
      seed: Math.floor(rng() * 1_000_000),
      label: info.label,
      description: info.description,
      depth: 0,
      zIndex: 200 + rng() * 50,
    });
  }

  // ── Platelets — small dark fragments ──
  const plateletCount = 15 + Math.floor(rng() * 15);
  for (let i = 0; i < plateletCount; i++) {
    const info = THICK_DESCRIPTIONS.platelet;
    cells.push({
      id: id++,
      type: "platelet",
      x: 5 + rng() * (width - 10),
      y: 5 + rng() * (height - 10),
      rotation: rng() * 360,
      seed: Math.floor(rng() * 1_000_000),
      label: info.label,
      description: info.description,
      depth: 0,
      zIndex: 50 + rng() * 30,
    });
  }

  cells.sort((a, b) => a.zIndex - b.zIndex);

  // ── Artifacts — more debris in thick film ──
  const artifacts: StainArtifact[] = [];

  // Lysed cell debris — numerous small faint spots
  for (let i = 0; i < 60; i++) {
    artifacts.push({
      x: rng() * width,
      y: rng() * height,
      r: 0.3 + rng() * 0.8,
      opacity: 0.04 + rng() * 0.06,
      type: "debris",
    });
  }

  // Stain precipitate
  for (let i = 0; i < 20; i++) {
    artifacts.push({
      x: rng() * width,
      y: rng() * height,
      r: 0.1 + rng() * 0.2,
      opacity: 0.15 + rng() * 0.2,
      type: "precipitate",
    });
  }

  return { cells, artifacts };
}
