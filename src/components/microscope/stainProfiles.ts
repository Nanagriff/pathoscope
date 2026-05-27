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

export type StainType = "giemsa" | "wright-giemsa" | "sickling";

export interface StainProfile {
  id: StainType;

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

  // Warm pale pink background — characteristic PBS appearance
  background: "#fef6f2",

  // Warm pink/salmon RBCs with clear white central pallor
  rbcGradients: [
    ["#fef4f0", "#f4ccc0", "#e4a498", "#d08478", "#c47070"],
    ["#fef2ee", "#f2c8bc", "#e2a090", "#cc8070", "#c06c6c"],
    ["#fcf0ea", "#f0c4b8", "#de9c90", "#c87c6c", "#bc6868"],
    ["#faecea", "#eec0b4", "#da988c", "#c47868", "#b86464"],
    ["#fef6f2", "#f6d4ca", "#e8b0a4", "#d89890", "#cc8484"],
    ["#fef4f0", "#f4d0c6", "#e6aca0", "#d4948c", "#c88080"],
    ["#fef8f4", "#f8dcd2", "#eec4b8", "#dca49c", "#d09090"],
    ["#f8e8e2", "#e6bab0", "#d08c84", "#c07068", "#b46060"],
  ],

  parasitizedRbcGradient:
    ["#fef2ee", "#f0d4c8", "#dea89c", "#c88c84", "#c07c7c"],

  // Very clear white central pallor — prominent donut shape
  pallorStops: [
    "rgba(255,252,248,0.90)",
    "rgba(248,228,218,0.45)",
    "rgba(236,200,186,0.15)",
    "rgba(224,184,170,0)",
  ],

  parasiteRingStroke: "#5a2890",
  parasiteRingFill: "rgba(90,40,160,0.06)",
  parasiteDiffusion: "rgba(80,30,130,0.04)",
  chromatinPrimary: "#8a1050",
  chromatinSecondary: "#a01860",

  // Dark purple nuclei — correct
  nucleusFill: "#1a0c48",
  nucleusParachromatin: "#2c1868",
  nucleusDenseChromatin: "#0c0630",

  // WBC cytoplasm — pale pink to pale lavender (NOT deep purple)
  neutrophilCyto: ["#e0cce0", "#ccb4cc"],  // pale pink-lavender
  neutrophilGranule: "#8868a8",             // purple granules

  eosinophilCyto: ["#e8d0d8", "#d8b8c8"],  // pale pink
  eosinophilGranule: [210, 70, 110],        // pink-orange granules

  lymphocyteCyto: ["#d4c0e0", "#c0a8cc"],  // pale blue-lavender rim

  monocyteCyto: ["#dccce0", "#c8b4cc"],    // pale blue-grey

  basophilCyto: ["#d8c8d8", "#c4b4c4"],
  basophilGranule: "#201060",

  plateletOuter: "#d8c8dc",
  plateletInner: "#7858a0",

  membraneStroke: "#c09088",               // warm pink membrane
  precipitateColour: "#3a1860",
};

// ── Sickling test (wet prep with Na2S2O5 reducing agent) ──

export const SICKLING: StainProfile = {
  id: "sickling" as StainType,

  // Pale blue-grey background — wet prep, no stain
  background: "#d8dce4",

  // Olive-green/grey cells under reducing agent
  rbcGradients: [
    ["#c4c8b8", "#b0b4a0", "#98a088", "#889078", "#7c8468"],
    ["#c0c4b4", "#acb09c", "#949c84", "#848c74", "#788064"],
    ["#c8ccbc", "#b4b8a4", "#9ca48c", "#8c947c", "#808870"],
    ["#bcc0b0", "#a8ac98", "#909880", "#808870", "#747c64"],
    ["#ccd0c0", "#b8bca8", "#a0a890", "#909880", "#848c74"],
    ["#c0c4b8", "#acb0a0", "#949c88", "#848c78", "#78806c"],
    ["#d0d4c4", "#bcc0ac", "#a4ac94", "#949c84", "#888c78"],
    ["#b8bcac", "#a4a894", "#8c947c", "#7c846c", "#707860"],
  ],

  parasitizedRbcGradient: ["#c4c8b8", "#b0b4a0", "#98a088", "#889078", "#7c8468"],

  // White/clear central pallor
  pallorStops: [
    "rgba(232,236,240,0.80)",
    "rgba(216,220,228,0.45)",
    "rgba(200,204,212,0.15)",
    "rgba(188,192,200,0)",
  ],

  // Not applicable for sickling but required by interface
  parasiteRingStroke: "#606850",
  parasiteRingFill: "rgba(96,104,80,0.06)",
  parasiteDiffusion: "rgba(96,104,80,0.04)",
  chromatinPrimary: "#505838",
  chromatinSecondary: "#606848",

  nucleusFill: "#404830",
  nucleusParachromatin: "#586040",
  nucleusDenseChromatin: "#303820",

  neutrophilCyto: ["#b8bcb0", "#a0a498"],
  neutrophilGranule: "#808878",

  eosinophilCyto: ["#b8bcb0", "#a0a498"],
  eosinophilGranule: [140, 148, 120],

  lymphocyteCyto: ["#b0b4ac", "#989c94"],

  monocyteCyto: ["#b4b8ac", "#9ca098"],

  basophilCyto: ["#b0b4a8", "#989c90"],
  basophilGranule: "#404830",

  plateletOuter: "#b8bcc0",
  plateletInner: "#808888",

  membraneStroke: "#889080",
  precipitateColour: "#505840",
};

/** Lookup by name */
export const STAIN_PROFILES = {
  giemsa: GIEMSA,
  "wright-giemsa": WRIGHT_GIEMSA,
  sickling: SICKLING,
} as const;
