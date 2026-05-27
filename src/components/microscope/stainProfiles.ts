/**
 * Stain-specific colour profiles for microscopy simulation.
 *
 * GIEMSA (malaria thin films):
 *  - RBCs: pale grayish-pink to light salmon, subdued compared to Wright
 *  - Background: near-white with faint blue-gray cast
 *  - Parasite cytoplasm: BLUE (azure dyes bind parasite RNA)
 *  - Parasite chromatin: RED to MAGENTA (eosin binds DNA)
 *  - WBC nuclei: dark blue-purple
 *
 * WRIGHT-GIEMSA (haematology differentials):
 *  - RBCs: brighter pink/salmon (more eosin uptake)
 *  - Background: near-white with warm pink cast
 *  - WBC nuclei: dark purple (more balanced purple than Giemsa)
 *  - Cytoplasm colours more vivid
 */

export interface StainProfile {
  id: "giemsa" | "wright-giemsa";

  /** Background fill for the slide area */
  background: string;

  /** RBC body gradients — 8 variants, each 5 stops (centre→edge) */
  rbcGradients: [string, string, string, string, string][];

  /** Parasitized RBC body gradient (slightly paler than normal) */
  parasitizedRbcGradient: [string, string, string, string, string];

  /** Central pallor overlay stops */
  pallorStops: [string, string, string, string]; // [inner, mid, outer-mid, outer]

  /** Parasite ring stroke colour */
  parasiteRingStroke: string;
  /** Parasite ring fill (very faint interior) */
  parasiteRingFill: string;
  /** Parasite stain-diffusion halo colour */
  parasiteDiffusion: string;
  /** Chromatin dot fill (primary) */
  chromatinPrimary: string;
  /** Chromatin dot fill (secondary, for overlapping cluster detail) */
  chromatinSecondary: string;

  /** WBC nucleus base fill */
  nucleusFill: string;
  /** WBC nucleus lighter mottled overlay */
  nucleusParachromatin: string;
  /** WBC nucleus dense chromatin clumps */
  nucleusDenseChromatin: string;

  /** Neutrophil cytoplasm gradient [centre, edge] */
  neutrophilCyto: [string, string];
  /** Neutrophil granule colour */
  neutrophilGranule: string;

  /** Eosinophil cytoplasm gradient [centre, edge] */
  eosinophilCyto: [string, string];
  /** Eosinophil granule colour range [base, variation] */
  eosinophilGranule: [number, number, number]; // r, g, b base (variation added per-cell)

  /** Lymphocyte cytoplasm gradient [centre, edge] */
  lymphocyteCyto: [string, string];

  /** Monocyte cytoplasm gradient [centre, edge] */
  monocyteCyto: [string, string];

  /** Basophil cytoplasm gradient [centre, edge] */
  basophilCyto: [string, string];
  /** Basophil granule colour */
  basophilGranule: string;

  /** Platelet colours */
  plateletOuter: string;
  plateletInner: string;

  /** Cell membrane stroke */
  membraneStroke: string;

  /** Stain precipitate artifact colour */
  precipitateColour: string;
}

// ── Giemsa stain (malaria films) ──

export const GIEMSA: StainProfile = {
  id: "giemsa",

  // Light lavender/blue-tinged background — characteristic Giemsa cast
  background: "#eee8f2",

  // Purple-pink/lavender RBCs — blue-purple cast, NOT warm salmon
  rbcGradients: [
    // Normal staining — lavender-pink with purple rim
    ["#f0eaf4", "#d8c4d8", "#c4a4bc", "#b08ca8", "#a880a0"],
    ["#eee8f2", "#d6c0d4", "#c2a0b8", "#ae88a4", "#a67c9c"],
    // Slightly deeper stain
    ["#ece6f0", "#d2bcd0", "#be9cb4", "#aa84a0", "#a27898"],
    ["#eae4ee", "#d0b8cc", "#bc98b0", "#a8809c", "#a07494"],
    // Paler variants
    ["#f2ecf6", "#dcc8dc", "#c8a8c0", "#b490ac", "#ac84a4"],
    ["#f0eaf4", "#dac6da", "#c6a6be", "#b28ea8", "#aa82a0"],
    // Thin smear (lighter)
    ["#f4eef8", "#e0d0e0", "#d0b4c8", "#bc9cb4", "#b490ac"],
    // Thick smear (deeper purple)
    ["#e6e0ec", "#c8b0c8", "#b490a8", "#a07898", "#987090"],
  ],

  parasitizedRbcGradient:
    ["#f0eaf4", "#dcc8d8", "#c8a8bc", "#b490a8", "#ac84a0"],

  // Very pronounced central pallor — nearly white centre, characteristic donut
  pallorStops: [
    "rgba(248,244,252,0.92)",
    "rgba(232,220,240,0.50)",
    "rgba(210,192,220,0.15)",
    "rgba(196,176,208,0)",
  ],

  // Giemsa: both ring cytoplasm and chromatin appear dark blue-purple
  parasiteRingStroke: "#2c1870",
  parasiteRingFill: "rgba(40,24,100,0.08)",
  parasiteDiffusion: "rgba(44,24,112,0.06)",
  chromatinPrimary: "#2a1060",
  chromatinSecondary: "#3c1880",

  nucleusFill: "#0e0630",          // very dark purple
  nucleusParachromatin: "#1c0c50",
  nucleusDenseChromatin: "#060318",

  neutrophilCyto: ["#a070c0", "#8850a8"],  // deep purple
  neutrophilGranule: "#6838a0",

  eosinophilCyto: ["#a878c0", "#9058a8"],  // deep purple
  eosinophilGranule: [190, 50, 110],

  lymphocyteCyto: ["#9868b8", "#8050a4"],  // deep purple rim

  monocyteCyto: ["#a070b8", "#8858a4"],  // deep purple

  basophilCyto: ["#a078b8", "#8860a8"],
  basophilGranule: "#140840",

  plateletOuter: "#d0c8dc",
  plateletInner: "#705898",

  membraneStroke: "#a08898",
  precipitateColour: "#241458",
};

// ── Wright-Giemsa stain (haematology differentials) ──

export const WRIGHT_GIEMSA: StainProfile = {
  id: "wright-giemsa",

  background: "#fdf8f6",

  // Brighter pink/salmon RBCs
  rbcGradients: [
    ["#fef4f0", "#f6d0c6", "#e8a8a0", "#d88880", "#cc7878"],
    ["#fef2ee", "#f4ccc2", "#e6a498", "#d48478", "#c87474"],
    ["#fcf0ec", "#f0c8be", "#e0a098", "#d08078", "#c47070"],
    ["#faecea", "#eec4ba", "#dc9c94", "#cc7c74", "#c06c6c"],
    ["#fef8f4", "#f8dcd4", "#ecb8b0", "#dc9c94", "#d08888"],
    ["#fef6f2", "#f6d8d0", "#eab4ac", "#d89890", "#cc8484"],
    ["#fefaf6", "#fae4dc", "#f0c8c0", "#e0a8a0", "#d49494"],
    ["#f8eae4", "#e8beb4", "#d49088", "#c47470", "#b86464"],
  ],

  parasitizedRbcGradient:
    ["#fef2ee", "#f2d8ce", "#e0b0a4", "#cc9088", "#c48080"],

  pallorStops: [
    "rgba(254,248,244,0.85)",
    "rgba(244,216,206,0.42)",
    "rgba(228,184,168,0.14)",
    "rgba(216,168,152,0)",
  ],

  // Wright-Giemsa: parasite ring is more purple (mixed dyes), chromatin red-purple
  parasiteRingStroke: "#5a2890",
  parasiteRingFill: "rgba(90,40,160,0.06)",
  parasiteDiffusion: "rgba(80,30,130,0.04)",
  chromatinPrimary: "#8a1050",
  chromatinSecondary: "#a01860",

  nucleusFill: "#100838",          // very dark purple
  nucleusParachromatin: "#200e58",
  nucleusDenseChromatin: "#080420",

  neutrophilCyto: ["#a878c4", "#9058ac"],  // deep purple
  neutrophilGranule: "#7040a8",

  eosinophilCyto: ["#b080c4", "#9860ac"],  // deep purple
  eosinophilGranule: [200, 55, 115],

  lymphocyteCyto: ["#a070bc", "#8858a8"],  // deep purple rim

  monocyteCyto: ["#a878bc", "#9060a8"],  // deep purple

  basophilCyto: ["#a878b8", "#9060a8"],
  basophilGranule: "#180a48",

  plateletOuter: "#d8d0e4",
  plateletInner: "#8068a8",

  membraneStroke: "#b88880",
  precipitateColour: "#3a1860",
};

/** Lookup by name */
export const STAIN_PROFILES = {
  giemsa: GIEMSA,
  "wright-giemsa": WRIGHT_GIEMSA,
} as const;

export type StainType = keyof typeof STAIN_PROFILES;
