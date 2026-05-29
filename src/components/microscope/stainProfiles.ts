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

  // Pink-lavender RBCs — lighter, more pink than purple
  rbcGradients: [
    // Normal staining — soft pink with lavender rim
    ["#f6f0f6", "#e4ccd8", "#d4b0c0", "#c49cac", "#b88ca0"],
    ["#f4eef4", "#e2c8d4", "#d0acbc", "#c298a8", "#b6889c"],
    // Slightly deeper stain
    ["#f2ecf2", "#dec4d0", "#cca8b8", "#be94a4", "#b28498"],
    ["#f0eaf0", "#dcc0cc", "#c8a4b4", "#ba90a0", "#ae8094"],
    // Paler variants — very light
    ["#f8f2f8", "#e8d4dc", "#d8b8c8", "#c8a4b4", "#bc94a8"],
    ["#f6f0f6", "#e6d0da", "#d4b4c4", "#c6a0b0", "#ba90a4"],
    // Thin smear (lightest)
    ["#faf4fa", "#ecdce4", "#dcc4d0", "#ccb0c0", "#c0a0b4"],
    // Thick smear (slightly deeper)
    ["#eee8ee", "#d4bcc8", "#c4a0b0", "#b48c9c", "#a87c90"],
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

  // Giemsa: parasite structures — subtle, not overly contrasty
  parasiteRingStroke: "#3c2880",
  parasiteRingFill: "rgba(50,34,110,0.05)",
  parasiteDiffusion: "rgba(54,34,120,0.04)",
  chromatinPrimary: "#3a1870",
  chromatinSecondary: "#4c2888",

  nucleusFill: "#381268",          // dark uniform purple
  nucleusParachromatin: "#52208c",
  nucleusDenseChromatin: "#1a0834",

  neutrophilCyto: ["#9070b0", "#7c609c"],  // rich lavender
  neutrophilGranule: "#4a2888",

  eosinophilCyto: ["#ccacd4", "#b894c4"],  // pale lavender
  eosinophilGranule: [190, 50, 110],

  lymphocyteCyto: ["#b898c8", "#a480b4"],  // pale purple rim

  monocyteCyto: ["#c0a0c8", "#ac88b8"],  // pale blue-grey

  basophilCyto: ["#c0a0c8", "#ac88b8"],
  basophilGranule: "#201060",

  plateletOuter: "#b8a8c8",
  plateletInner: "#4c2878",

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

  parasiteRingStroke: "#6a3898",
  parasiteRingFill: "rgba(100,50,170,0.04)",
  parasiteDiffusion: "rgba(90,40,140,0.03)",
  chromatinPrimary: "#9a2060",
  chromatinSecondary: "#b02870",

  // Deep violet-purple nuclei — dark and uniform
  nucleusFill: "#3a1470",
  nucleusParachromatin: "#5a2890",
  nucleusDenseChromatin: "#1c0a3c",

  // WBC cytoplasm — rich lavender-purple
  neutrophilCyto: ["#9878b8", "#8468a4"],  // rich lavender
  neutrophilGranule: "#4a2888",             // dark purple granules

  eosinophilCyto: ["#e8d0d8", "#d8b8c8"],  // pale pink
  eosinophilGranule: [220, 60, 100],        // vivid pink-orange granules

  lymphocyteCyto: ["#d4c0e0", "#c0a8cc"],  // pale blue-lavender rim

  monocyteCyto: ["#dccce0", "#c8b4cc"],    // pale blue-grey

  basophilCyto: ["#d8c8d8", "#c4b4c4"],
  basophilGranule: "#281268",

  plateletOuter: "#c0a8c8",
  plateletInner: "#503080",

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
