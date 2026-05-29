import type { StainType } from "@/components/microscope/stainProfiles";
import type { MalariaSpecies, ParasiteStage } from "@/components/microscope/types";

export interface Annotation {
  id: string;
  x: number;
  y: number;
  label: string;
  description?: string;
}

export interface SlideField {
  dziPath: string;
  annotations: Annotation[];
}

/** SVG-generated field config */
export interface SVGFieldConfig {
  seed: number;
  parasitemia?: number;
}

/** SVG slide configuration (replaces DZI-based fields) */
export interface SVGConfig {
  stainType: StainType;
  parasitemia: number;
  fields: SVGFieldConfig[];
  /** Malaria species for this slide */
  species?: MalariaSpecies;
  /** Parasite stage shown on this slide (one per slide for teaching) */
  stage?: ParasiteStage;
}

/** Urine sediment config */
export interface UrineConfig {
  seed: number;
  pusCells: number;
  rbcs: number;
  epithelial: number;
  urothelialEpi: number;
  tubularEpi: number;
  calciumOxalate: number;
  triplePhosphate: number;
  uricAcid: number;
  ammoniumBiurate: number;
  amorphousCrystals: number;
  hyalineCasts: number;
  granularCasts: number;
  yeast: number;
  bacteria: number;
  spermatozoa: number;
  clueCells: number;
  mucusThreads: number;
  trichomonas?: number;
  schistosomaHaematobiumEggs?: number;
  microfilaria?: number;
  enterobiusVermicularis?: number;
  fields: { seed: number }[];
}

/** Sickling test slide config */
export interface SicklingConfig {
  sicklingRate: number;
  fields: { seed: number; sicklingRate?: number }[];
}

export interface SlideCase {
  id: string;
  title: string;
  discipline: "hematology" | "malaria" | "urinalysis" | "stool" | "hvs";
  category: string;
  clinicalHistory: string;
  labData?: string;
  teachingPoints: string[];
  /** DZI-based fields (legacy) */
  fields: SlideField[];
  /** SVG-generated slide config (used when present) */
  svgConfig?: SVGConfig;
  /** Urine sediment config */
  urineConfig?: UrineConfig;
  /** Sickling test config */
  sicklingConfig?: SicklingConfig;
  source: string;
  license: string;
}

export const disciplines = [
  { id: "hematology", name: "Hematology", description: "Peripheral blood morphology and film comment", icon: "🔬", color: "#DC2626" },
  { id: "malaria", name: "Malaria Blood Film", description: "Species identification, parasitemia estimation, stage recognition", icon: "🦟", color: "#7C3AED" },
  { id: "urinalysis", name: "Urine R/E", description: "Crystals, casts, cells, organisms", icon: "🧪", color: "#D97706" },
  { id: "stool", name: "Stool R/E", description: "Ova, cysts, parasites, larvae", icon: "🔍", color: "#059669" },
  { id: "hvs", name: "HVS Microscopy", description: "Gram stain, wet mount, clue cells, Trichomonas, yeast", icon: "🧫", color: "#2563EB" },
] as const;

export const cases: SlideCase[] = [
  {
    "id": "heme-neutrophil",
    "title": "Neutrophil (Segmented)",
    "discipline": "hematology",
    "category": "Normal WBC",
    "clinicalHistory": "35-year-old female market trader from Kumasi, Ashanti Region, presenting with 2-day history of productive cough, fever (38.9°C), and right-sided pleuritic chest pain. No significant past medical history. Physical examination: tachycardic (HR 104), crackles at right lung base, no organomegaly. Sputum: mucopurulent. Chest X-ray: right lower lobe consolidation consistent with community-acquired pneumonia.",
    "labData": "FBC:\nWBC: 16.8 × 10⁹/L (elevated)\nNeutrophils: 13.4 × 10⁹/L (80%, elevated)\nBands: 4% (mild left shift)\nLymphocytes: 2.0 × 10⁹/L (12%)\nMonocytes: 0.5 × 10⁹/L (3%)\nEosinophils: 0.17 × 10⁹/L (1%)\nBasophils: 0 × 10⁹/L (0%)\n\nHb: 12.6 g/dL\nPlatelets: 298 × 10⁹/L\nESR: 68 mm/hr (elevated)\nCRP: 142 mg/L (elevated)",
    "teachingPoints": [
      "Segmented nucleus with 3-5 lobes connected by thin chromatin filaments — the hallmark of a mature neutrophil",
      "Fine pink/lilac (azurophilic and specific) granules fill the cytoplasm; these contain myeloperoxidase, lysozyme, and alkaline phosphatase",
      "Hypersegmented neutrophils (>5 lobes or >5% with 5 lobes) suggest megaloblastic anaemia from B12 or folate deficiency — common in malnourished patients",
      "Band forms (unsegmented horseshoe nucleus) indicate a left shift — the bone marrow is releasing immature neutrophils in response to acute bacterial infection",
      "Toxic granulation (coarse dark granules), Döhle bodies (blue cytoplasmic inclusions), and cytoplasmic vacuolation are reactive changes seen in severe infection",
      "Neutrophilia (>7.5 × 10⁹/L) is the most common WBC change in bacterial infections, tissue necrosis, and acute inflammation",
      "Neutropenia (<1.5 × 10⁹/L) is clinically significant and increases infection risk — causes include drugs (chloramphenicol, carbamazepine), viral infections, and severe sepsis",
      "In Ghana, consider drug-induced neutropenia from anti-malarials and antibiotics commonly used in polypharmacy",
      "Neutrophils are the first-line defenders in acute bacterial infection — they arrive within hours via chemotaxis, phagocytose bacteria, and release reactive oxygen species",
      "Distinguish from monocytes (larger, kidney-shaped nucleus, grey-blue cytoplasm) and from eosinophils (bilobed nucleus, coarse orange-red granules)"
    ],
    "fields": [
      {
        "dziPath": "/slides/heme-neutrophil-1/heme-neutrophil-1.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Neutrophil"
          }
        ]
      },
      {
        "dziPath": "/slides/heme-neutrophil-2/heme-neutrophil-2.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Neutrophil"
          }
        ]
      },
      {
        "dziPath": "/slides/heme-neutrophil-3/heme-neutrophil-3.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Neutrophil"
          }
        ]
      }
    ],
    "svgConfig": {
      "stainType": "wright-giemsa",
      "parasitemia": 0,
      "fields": [
        { "seed": 20101 },
        { "seed": 20102 },
        { "seed": 20103 }
      ]
    },
    "source": "SVG-generated Wright-Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "heme-eosinophil",
    "title": "Eosinophil",
    "discipline": "hematology",
    "category": "Normal WBC",
    "clinicalHistory": "14-year-old male schoolboy from Keta, Volta Region, presenting with 3-week history of intermittent abdominal pain, loose stools, and perianal itching worse at night. History of swimming in the Volta River. No prior deworming in over 12 months. Physical examination: mild pallor, diffuse abdominal tenderness, no organomegaly. Stool R/E requested alongside blood film.",
    "labData": "FBC:\nWBC: 11.2 × 10⁹/L (mildly elevated)\nNeutrophils: 4.5 × 10⁹/L (40%)\nLymphocytes: 2.8 × 10⁹/L (25%)\nEosinophils: 3.1 × 10⁹/L (28%, markedly elevated)\nMonocytes: 0.7 × 10⁹/L (6%)\nBasophils: 0.1 × 10⁹/L (1%)\n\nHb: 10.2 g/dL (low — mild anaemia)\nMCV: 74 fL (microcytic)\nPlatelets: 340 × 10⁹/L\n\nStool R/E: Ova of Schistosoma mansoni identified\nIgE: 850 IU/mL (markedly elevated)",
    "teachingPoints": [
      "Bilobed nucleus with a characteristic spectacle or dumbbell shape — the two lobes are connected by a thin chromatin bridge",
      "Large, uniform, refractile orange-red granules densely pack the cytoplasm — these contain major basic protein (MBP), eosinophil peroxidase, and eosinophil cationic protein",
      "Eosinophils are slightly larger than neutrophils (12-17 μm) and the granules are distinctly coarser and more uniform than neutrophil granules",
      "Eosinophilia (>0.5 × 10⁹/L) in Ghana is most commonly caused by helminth parasites: Schistosoma spp., hookworm (Necator americanus), Strongyloides stercoralis, and filarial worms (Wuchereria bancrofti)",
      "The Volta Region is endemic for schistosomiasis — children with freshwater exposure and eosinophilia should be tested for S. mansoni (intestinal) and S. haematobium (urogenital)",
      "Drug-induced eosinophilia can result from commonly used medications in Ghana including cotrimoxazole, phenytoin, and carbamazepine",
      "Allergic conditions (asthma, eczema, allergic rhinitis) cause mild-to-moderate eosinophilia but rarely exceed 1.5 × 10⁹/L without concurrent parasitic infection",
      "Hypereosinophilic syndrome (>1.5 × 10⁹/L persisting >6 months with organ damage) requires exclusion of parasitic, allergic, and neoplastic causes before diagnosis",
      "Charcot-Leyden crystals (breakdown products of eosinophil granules) may be seen in stool or sputum in patients with marked eosinophilia",
      "In the differential, do not confuse eosinophils with neutrophils — the key distinguishing features are the bilobed nucleus (vs. 3-5 lobes) and the orange-red colour of granules (vs. pink/lilac)"
    ],
    "fields": [
      {
        "dziPath": "/slides/heme-eosinophil-1/heme-eosinophil-1.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Eosinophil"
          }
        ]
      },
      {
        "dziPath": "/slides/heme-eosinophil-2/heme-eosinophil-2.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Eosinophil"
          }
        ]
      }
    ],
    "svgConfig": {
      "stainType": "wright-giemsa",
      "parasitemia": 0,
      "fields": [
        { "seed": 20201 },
        { "seed": 20202 }
      ]
    },
    "source": "SVG-generated Wright-Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "heme-basophil",
    "title": "Basophil",
    "discipline": "hematology",
    "category": "Normal WBC",
    "clinicalHistory": "52-year-old male retired civil servant from Accra, referred to Korle Bu Teaching Hospital haematology clinic for evaluation of persistent leucocytosis. He reports 3-month history of fatigue, early satiety, and unintentional weight loss of 8 kg. No fever or night sweats. Physical examination: pallor, massive splenomegaly (spleen palpable 12 cm below left costal margin), no lymphadenopathy. Peripheral blood film requested for review.",
    "labData": "FBC:\nWBC: 148 × 10⁹/L (markedly elevated)\nNeutrophils: 82 × 10⁹/L (55%)\nMyelocytes: 15% (abnormal — immature granulocytes)\nMetamyelocytes: 8%\nBasophils: 8.9 × 10⁹/L (6%, elevated)\nEosinophils: 4.4 × 10⁹/L (3%)\nLymphocytes: 10.4 × 10⁹/L (7%)\nMonocytes: 2.9 × 10⁹/L (2%)\nBlasts: 2%\n\nHb: 9.4 g/dL (low)\nPlatelets: 650 × 10⁹/L (elevated)\nLDH: 1,280 U/L (elevated)\nUric acid: 9.8 mg/dL (elevated)\n\nBCR-ABL1 (Philadelphia chromosome): PENDING",
    "teachingPoints": [
      "Large dark purple-blue metachromatic granules densely fill the cytoplasm, often completely obscuring the underlying bilobed nucleus",
      "Basophils are the rarest normal circulating WBC, comprising <1% of the differential — even a small absolute increase is significant",
      "Basophil granules contain histamine, heparin, and leukotrienes — they play roles in allergic and inflammatory responses, particularly IgE-mediated hypersensitivity",
      "Basophilia (>0.1 × 10⁹/L) is an important clue to myeloproliferative neoplasms, especially chronic myeloid leukaemia (CML) where it may be an early finding",
      "In CML, the peripheral blood film shows a full spectrum of granulocyte maturation (myelocytes, metamyelocytes, bands, segmented) — the so-called 'left shift to maturity'",
      "Distinguish basophils from other cells: mast cells (tissue-based, round nucleus, rarely seen in blood), toxic neutrophils (granules are coarser but pink, not blue-purple), and large granular lymphocytes (azurophilic granules, not metachromatic)",
      "Mild basophilia may also be seen in iron deficiency anaemia, hypothyroidism, chronic inflammatory conditions, and helminth infections",
      "In Ghana, CML often presents late with massive splenomegaly — the basophil percentage in the differential is a helpful diagnostic clue even before molecular testing",
      "An increasing basophil count during CML treatment may herald blast transformation (accelerated or blast phase) — a poor prognostic sign",
      "On Wright-Giemsa stain, basophil granules are water-soluble and may wash out partially during staining, leaving 'ghost' basophils with empty-appearing cytoplasm — this artifact should not be confused with degranulation"
    ],
    "fields": [
      {
        "dziPath": "/slides/heme-basophil-1/heme-basophil-1.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Basophil"
          }
        ]
      },
      {
        "dziPath": "/slides/heme-basophil-2/heme-basophil-2.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Basophil"
          }
        ]
      }
    ],
    "svgConfig": {
      "stainType": "wright-giemsa",
      "parasitemia": 0,
      "fields": [
        { "seed": 20301 },
        { "seed": 20302 }
      ]
    },
    "source": "SVG-generated Wright-Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "heme-lymphocyte",
    "title": "Lymphocyte",
    "discipline": "hematology",
    "category": "Normal WBC",
    "clinicalHistory": "22-year-old female university student at KNUST, Kumasi, presenting with 10-day history of sore throat, fever, fatigue, and bilateral cervical lymphadenopathy. She reports difficulty swallowing and has missed one week of lectures. No rash or joint pains. Physical examination: temperature 38.2°C, pharyngeal erythema with tonsillar exudate, tender bilateral posterior cervical lymphadenopathy, splenomegaly just palpable. Initial monospot test requested alongside FBC.",
    "labData": "FBC:\nWBC: 14.6 × 10⁹/L (elevated)\nNeutrophils: 2.9 × 10⁹/L (20%)\nLymphocytes: 10.2 × 10⁹/L (70%, markedly elevated)\nAtypical lymphocytes: 25% (flagged)\nMonocytes: 1.2 × 10⁹/L (8%)\nEosinophils: 0.3 × 10⁹/L (2%)\n\nHb: 13.1 g/dL\nPlatelets: 168 × 10⁹/L\n\nLiver function:\nALT: 86 U/L (elevated)\nAST: 72 U/L (elevated)\n\nMonospot (heterophile antibody): Positive\nBlood film comment: Reactive/atypical lymphocytes with abundant basophilic cytoplasm — consistent with infectious mononucleosis",
    "teachingPoints": [
      "Small mature lymphocytes have a round, condensed (clumped chromatin) nucleus with a very thin rim of pale blue cytoplasm — the nucleus-to-cytoplasm ratio is high",
      "Normal lymphocytes are 7-10 μm in diameter, roughly the same size as a red blood cell — this is a useful internal size reference on the film",
      "Reactive (atypical) lymphocytes are larger (12-20 μm) with abundant deep blue cytoplasm that may scallop around adjacent RBCs — classic in EBV infectious mononucleosis",
      "T cells and B cells are morphologically indistinguishable on a Wright-Giemsa film — immunophenotyping (flow cytometry) is needed for subtyping",
      "Large granular lymphocytes (LGLs) represent NK cells or cytotoxic T cells — they have more abundant pale cytoplasm with scattered azurophilic (red-purple) granules",
      "Lymphocytosis (>4.0 × 10⁹/L in adults) can be reactive (viral infections, pertussis) or neoplastic (CLL, lymphoma with leukaemic phase)",
      "In Ghana, consider HIV seroconversion illness in the differential for atypical lymphocytosis with pharyngitis and lymphadenopathy — always offer HIV testing",
      "Chronic lymphocytic leukaemia (CLL) presents with mature small lymphocytes and characteristic 'smudge cells' (basket cells) on the blood film — common in older adults",
      "Burkitt lymphoma, endemic in Ghana and other malaria-belt countries, may present with leukaemic phase showing medium-sized lymphoid cells with deeply basophilic vacuolated cytoplasm",
      "Distinguish lymphocytes from monocytes: lymphocytes have a round nucleus with clumped chromatin and scant cytoplasm, while monocytes are larger with a folded/kidney-shaped nucleus and grey-blue cytoplasm with fine granularity"
    ],
    "fields": [
      {
        "dziPath": "/slides/heme-lymphocyte-1/heme-lymphocyte-1.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Lymphocyte"
          }
        ]
      },
      {
        "dziPath": "/slides/heme-lymphocyte-2/heme-lymphocyte-2.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Lymphocyte"
          }
        ]
      }
    ],
    "svgConfig": {
      "stainType": "wright-giemsa",
      "parasitemia": 0,
      "fields": [
        { "seed": 20401 },
        { "seed": 20402 }
      ]
    },
    "source": "SVG-generated Wright-Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "heme-monocyte",
    "title": "Monocyte",
    "discipline": "hematology",
    "category": "Normal WBC",
    "clinicalHistory": "38-year-old male gold miner from Obuasi, Ashanti Region, presenting with 6-week history of chronic cough, low-grade evening fevers, drenching night sweats, and 5 kg weight loss. He reports occasional haemoptysis. Lives in a shared dormitory with 8 other miners. No known HIV status. Physical examination: cachectic, temperature 37.8°C, bilateral cervical lymphadenopathy, scattered crepitations in both lung apices. Sputum for AFB and Gene Xpert requested. Blood film reviewed as part of workup.",
    "labData": "FBC:\nWBC: 9.8 × 10⁹/L\nNeutrophils: 4.9 × 10⁹/L (50%)\nLymphocytes: 2.5 × 10⁹/L (25%)\nMonocytes: 1.8 × 10⁹/L (18%, elevated)\nEosinophils: 0.5 × 10⁹/L (5%)\nBasophils: 0.1 × 10⁹/L (1%)\n\nHb: 11.0 g/dL (low)\nMCV: 88 fL (normocytic)\nPlatelets: 410 × 10⁹/L (mildly elevated)\nESR: 92 mm/hr (markedly elevated)\n\nSputum AFB: 2+ (positive)\nGene Xpert: MTB detected, Rifampicin resistance NOT detected\nHIV rapid test: Reactive (confirmatory pending)\nCD4 count: PENDING",
    "teachingPoints": [
      "Monocytes are the largest normal circulating WBC (15-20 μm) — they are noticeably larger than neutrophils and lymphocytes on the film",
      "The nucleus is kidney-shaped, horseshoe-shaped, or irregularly folded — never truly segmented like a neutrophil. The chromatin has a characteristic lacy, reticular pattern (less condensed than lymphocyte chromatin)",
      "Abundant grey-blue (ground glass) cytoplasm often contains fine azurophilic granules and may show cytoplasmic vacuoles, especially in reactive states",
      "Monocytes are the precursors of tissue macrophages (histiocytes), osteoclasts, and dendritic cells — they migrate into tissues within 1-2 days of release from the marrow",
      "Monocytosis (>1.0 × 10⁹/L) is characteristically seen in chronic granulomatous infections — tuberculosis is the most important cause in Ghana given its high TB burden",
      "Other causes of monocytosis in the Ghanaian context include chronic malaria, infective endocarditis, syphilis, brucellosis, and recovery phase of acute infections",
      "TB-HIV co-infection is common in Ghana — all TB patients should be tested for HIV, and all HIV patients should be screened for TB. Monocytosis with chronic cough warrants investigation for both",
      "In chronic myelomonocytic leukaemia (CMML), persistent monocytosis >1.0 × 10⁹/L lasting >3 months with dysplasia is a diagnostic criterion — consider in older patients without infectious cause",
      "Distinguish from large lymphocytes: monocytes have a folded/indented nucleus with lacy chromatin and grey-blue cytoplasm, while large lymphocytes have a round nucleus with clumped chromatin and clear blue cytoplasm",
      "Activated monocytes in severe infections may show increased vacuolation and phagocytosed material (bacteria, cellular debris) visible within the cytoplasm"
    ],
    "fields": [
      {
        "dziPath": "/slides/heme-monocyte-1/heme-monocyte-1.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Monocyte"
          }
        ]
      },
      {
        "dziPath": "/slides/heme-monocyte-2/heme-monocyte-2.dzi",
        "annotations": [
          {
            "id": "c1",
            "x": 0.5,
            "y": 0.5,
            "label": "Monocyte"
          }
        ]
      }
    ],
    "svgConfig": {
      "stainType": "wright-giemsa",
      "parasitemia": 0,
      "fields": [
        { "seed": 20501 },
        { "seed": 20502 }
      ]
    },
    "source": "SVG-generated Wright-Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-mixed-findings",
    "title": "Urine Sediment — Mixed Findings",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "26-year-old pregnant woman (G2P1, 32 weeks gestation) from Tema, Greater Accra Region, presenting to the antenatal clinic at Tema General Hospital with 3-day history of dysuria, urinary frequency, urgency, and suprapubic discomfort. She reports mild low back pain but denies haematuria, vaginal discharge, or fever. No previous UTI in this pregnancy. First pregnancy was uncomplicated. Physical examination: afebrile (36.8°C), BP 118/72 mmHg, suprapubic tenderness on palpation, no costovertebral angle tenderness. Urine dipstick positive for leucocyte esterase and nitrites. Mid-stream urine (MSU) sent for microscopy, culture, and sensitivity.",
    "labData": "Urine Dipstick:\npH: 6.0\nSpecific gravity: 1.020\nProtein: Trace\nGlucose: Negative\nBlood: 1+\nLeucocyte esterase: 2+\nNitrites: Positive\nKetones: Negative\nBilirubin: Negative\nUrobilinogen: Normal\n\nUrine Microscopy (wet mount, 40x):\nWBCs/Pus cells: 35-50/HPF (markedly elevated, >5 = pyuria)\nRBCs: 8-12/HPF (mildly elevated, >3 = haematuria)\nEpithelial cells: Few squamous (low contamination)\nBacteria: Moderate rod-shaped organisms\nCasts: Occasional WBC casts (NOT seen — rules out pyelonephritis)\nCrystals: None\nYeast: None\nTrichomonas: Not seen\n\nUrine Culture (pending): Awaiting 24-48 hr incubation\nFBC: WBC 11.8 × 10⁹/L, Hb 10.4 g/dL",
    "teachingPoints": [
      "WBCs/Pus cells appear as round cells larger than RBCs (10-15 μm) with visible granular cytoplasm and a multilobed nucleus — >5/HPF defines significant pyuria and strongly suggests urinary tract infection",
      "RBCs appear as small (6-8 μm) biconcave discs; in hypertonic urine they become crenated (spiky edges), and in dilute/alkaline urine they swell and lyse into ghost cells that are easily missed",
      "Dysmorphic RBCs (acanthocytes with irregular blebs) suggest glomerular origin — if >80% dysmorphic, consider glomerulonephritis rather than lower tract bleeding",
      "Squamous epithelial cells are large flat cells with small nuclei — >5/HPF indicates contamination from vulvovaginal or penile skin, and the specimen should ideally be recollected",
      "Transitional (urothelial) epithelial cells are smaller and rounder than squamous cells — they originate from the bladder, ureters, or renal pelvis and may be increased with instrumentation or inflammation",
      "WBC casts (cylindrical moulds containing embedded leucocytes) are pathognomonic for pyelonephritis or interstitial nephritis — their absence in this case supports lower UTI diagnosis",
      "UTI in pregnancy is a critical diagnosis in Ghana: untreated asymptomatic bacteriuria progresses to pyelonephritis in 20-40% of pregnant women, increasing risk of preterm labour and low birth weight",
      "Nitrite-positive urine indicates the presence of Gram-negative bacteria (especially E. coli) that convert dietary nitrates to nitrites — false negatives occur with Gram-positive organisms, low bacterial counts, or dilute urine",
      "Common uropathogens in Ghana: E. coli (most common, 60-70%), Klebsiella spp., Staphylococcus saprophyticus (young women), and Proteus mirabilis — increasing antimicrobial resistance to ampicillin and cotrimoxazole makes culture and sensitivity essential",
      "Always report urine sediment findings per HPF (high power field, 40x objective) and note the specimen quality (contamination level) — this standardisation allows clinicians to track treatment response"
    ],
    "fields": [
      {
        "dziPath": "/slides/urine-001/urine-001.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/urine-002/urine-002.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/urine-003/urine-003.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/urine-004/urine-004.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/urine-005/urine-005.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/urine-006/urine-006.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/urine-007/urine-007.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/urine-008/urine-008.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/urine-009/urine-009.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/urine-010/urine-010.dzi",
        "annotations": []
      }
    ],
    "urineConfig": {
      "seed": 30001,
      "pusCells": 180,
      "rbcs": 50,
      "epithelial": 20, "urothelialEpi": 5, "tubularEpi": 0,
      "calciumOxalate": 8,
      "triplePhosphate": 5, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 3,
      "hyalineCasts": 1,
      "granularCasts": 0,
      "yeast": 15,
      "bacteria": 120, "spermatozoa": 8, "clueCells": 4,
      "mucusThreads": 5,
      "fields": [{ "seed": 30001 }, { "seed": 30002 }, { "seed": 30003 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-contaminated",
    "title": "Urine Sediment \u2014 Heavy Epithelial Contamination",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "19-year-old female student at University of Ghana, Legon. Urine submitted for routine R/E as part of student health screening. Specimen collected without midstream instructions. Microscopy reveals heavy squamous epithelial cell contamination obscuring the field, with few pus cells suggesting possible contamination rather than true infection.",
    "labData": "Urine Dipstick:\npH: 6.5\nSG: 1.015\nProtein: Negative\nGlucose: Negative\nBlood: Negative\nLE: Trace\nNitrites: Negative\n\nMicroscopy (40x HPF):\nSquamous epithelial: >20/HPF (HEAVY \u2014 contaminated specimen)\nWBCs: 3\u20135/HPF (borderline \u2014 unreliable due to contamination)\nRBCs: 0\u20131/HPF\nBacteria: Few (likely vaginal flora)\nCasts: None\nCrystals: None\n\nComment: HEAVILY CONTAMINATED SPECIMEN. Recommend repeat with proper midstream clean-catch technique.",
    "teachingPoints": [
      "Squamous epithelial cells are the LARGEST cells in urine sediment (40\u201360 \u00b5m) \u2014 flat, translucent, with small central dark nucleus and irregular folded edges",
      ">5 squamous epithelial cells per HPF indicates CONTAMINATION from the vulvovaginal area (females) or distal urethra/foreskin (males) \u2014 the specimen is unreliable",
      "In contaminated specimens, WBC and bacteria counts are unreliable because vaginal secretions contain both WBCs and normal flora bacteria",
      "Proper midstream clean-catch technique: (1) cleanse periurethral area with water (not antiseptic), (2) void first portion into toilet, (3) collect midstream into sterile container, (4) void remainder into toilet",
      "For female patients in Ghana, providing clear Twi/Ga/local language instructions for midstream collection significantly reduces contamination rates",
      "Squamous cells appear very translucent under brightfield microscopy \u2014 they can be missed if the condenser is set too high. Reduce light intensity to see them clearly",
      "Distinguish squamous from transitional epithelial cells: squamous are FLAT and LARGE with irregular edges; transitional are smaller, rounder, and originate from the bladder/ureters",
      "A contaminated specimen should be reported as \u2018Heavily contaminated with squamous epithelial cells \u2014 recommend repeat MSU with proper collection technique\u2019",
      "Do NOT report a culture result from a contaminated specimen as it will grow mixed vaginal flora and lead to unnecessary antibiotic treatment",
      "Teaching point for students: ALWAYS check epithelial count FIRST before interpreting WBC and bacteria counts. If epithelials >5/HPF, the rest of the microscopy is unreliable"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 30101,
      "pusCells": 30,
      "rbcs": 8,
      "epithelial": 80, "urothelialEpi": 2, "tubularEpi": 0,
      "calciumOxalate": 0,
      "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 0,
      "granularCasts": 0,
      "yeast": 0,
      "bacteria": 40, "spermatozoa": 0, "clueCells": 0,
      "mucusThreads": 8,
      "fields": [{ "seed": 30101 }, { "seed": 30102 }, { "seed": 30103 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-crystals",
    "title": "Urine Sediment \u2014 Calcium Oxalate Crystals",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "45-year-old male teacher from Sunyani, Bono Region. Presents with acute left flank pain radiating to the groin (renal colic). CT KUB shows a 4mm left ureteric calculus. Urine R/E requested. Microscopy reveals abundant calcium oxalate crystals in acidic urine.",
    "labData": "Urine Dipstick:\npH: 5.5 (acidic)\nSG: 1.025 (concentrated)\nProtein: Trace\nGlucose: Negative\nBlood: 2+ (haematuria from stone)\nLE: Negative\nNitrites: Negative\n\nMicroscopy (40x HPF):\nRBCs: 25\u201340/HPF (marked haematuria)\nWBCs: 2\u20134/HPF\nCalcium oxalate crystals: ABUNDANT \u2014 octahedral \u2018envelope\u2019 shape\nEpithelial: Rare squamous\nBacteria: None\nCasts: None",
    "teachingPoints": [
      "Calcium oxalate crystals are the MOST COMMON crystal in urine sediment \u2014 they appear as colourless octahedral \u2018envelope\u2019 or \u2018letter X\u2019 shapes under brightfield",
      "They are found in ACIDIC urine (pH <6.5) and are associated with oxalate-rich foods (spinach, chocolate, tea, nuts, rhubarb) and ethylene glycol poisoning",
      "Calcium oxalate is the most common component of kidney stones worldwide \u2014 abundant crystals in a patient with renal colic strongly support the diagnosis",
      "Two morphological forms: monohydrate (oval/dumbbell, less common) and dihydrate (octahedral envelope, most common) \u2014 the dihydrate is what we typically see",
      "Crystals are refractile and colourless \u2014 they polarise light (birefringent), appearing bright under polarised microscopy",
      "The envelope shape has a characteristic X pattern inside when viewed face-on \u2014 this is the most reliable identification feature",
      "Distinguish from: uric acid crystals (rhomboid/diamond, yellow-brown), triple phosphate (coffin lid, alkaline urine), and cystine crystals (hexagonal, rare)",
      "Haematuria (RBCs in urine) is expected with kidney stones \u2014 the stone scratches the urothelium as it passes through the ureter",
      "In Ghana, kidney stone prevalence is increasing with urbanisation and dietary changes \u2014 reduced water intake in hot climate is a major risk factor",
      "Report as: \u2018Calcium oxalate crystals: abundant. RBCs: 25\u201340/HPF (haematuria). Clinical correlation: consistent with urolithiasis.\u2019"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 30201,
      "pusCells": 15,
      "rbcs": 120,
      "epithelial": 2, "urothelialEpi": 2, "tubularEpi": 0,
      "calciumOxalate": 40,
      "triplePhosphate": 15, "uricAcid": 25, "ammoniumBiurate": 10, "amorphousCrystals": 5,
      "hyalineCasts": 0,
      "granularCasts": 0,
      "yeast": 0,
      "bacteria": 10, "spermatozoa": 0, "clueCells": 0,
      "mucusThreads": 2,
      "fields": [{ "seed": 30201 }, { "seed": 30202 }, { "seed": 30203 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-casts",
    "title": "Urine Sediment \u2014 Granular Casts",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "58-year-old male diabetic (type 2, 12 years) from Kumasi, Ashanti Region. Presents to Komfo Anokye Teaching Hospital with progressive pedal oedema, foamy urine, and declining kidney function. Urine microscopy reveals granular casts indicating renal tubular damage.",
    "labData": "Urine Dipstick:\npH: 6.0\nSG: 1.010 (dilute \u2014 impaired concentrating ability)\nProtein: 3+ (heavy proteinuria)\nGlucose: 2+\nBlood: 1+\nLE: Trace\nNitrites: Negative\n\nMicroscopy (40x HPF):\nGranular casts: 5\u20138/LPF (coarse and fine)\nHyaline casts: 2\u20133/LPF\nWBCs: 5\u20138/HPF\nRBCs: 3\u20135/HPF\nRenal tubular epithelial cells: Occasional\nOval fat bodies: Few\n\nSerum creatinine: 2.8 mg/dL (elevated)\neGFR: 28 mL/min (CKD stage 4)\nHbA1c: 9.2% (poorly controlled)",
    "teachingPoints": [
      "Granular casts are CYLINDRICAL structures formed in the renal tubules \u2014 they are moulds of the tubular lumen containing degenerated cellular material",
      "Coarse granular casts contain large visible granules (degenerated tubular cells); fine granular casts have smaller, more uniform granules \u2014 fine represents further degradation",
      "The presence of granular casts indicates RENAL TUBULAR PATHOLOGY \u2014 they are clinically significant and must always be reported",
      "Casts are best seen under LOW POWER (10x) first to scan for them, then confirmed under HIGH POWER (40x) \u2014 they can be missed if you only use HPF",
      "Hyaline casts are nearly TRANSPARENT and very easy to miss \u2014 reduce the condenser light and close the diaphragm partially to see them. They indicate non-specific renal stress",
      "Cast progression: hyaline \u2192 granular (coarse \u2192 fine) \u2192 waxy \u2192 broad waxy \u2014 this represents increasing duration in the tubule and worsening tubular stasis",
      "In diabetic nephropathy (this patient), casts + heavy proteinuria + declining eGFR = progressive CKD. The MLS findings guide nephrology management",
      "Report casts per LOW POWER FIELD (LPF, 10x), not per HPF \u2014 this is the standard convention. Report type (hyaline, granular, waxy, cellular) and approximate number",
      "Distinguish casts from mucus threads: casts have PARALLEL sides and rounded ends; mucus threads are wavy, tapered, and refractile",
      "In Ghana, diabetic nephropathy is becoming the leading cause of CKD \u2014 early detection through urine microscopy (casts, proteinuria) enables timely referral to nephrology"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 30301,
      "pusCells": 40,
      "rbcs": 25,
      "epithelial": 1, "urothelialEpi": 1, "tubularEpi": 4,
      "calciumOxalate": 0,
      "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 4,
      "granularCasts": 8,
      "yeast": 0,
      "bacteria": 15, "spermatozoa": 0, "clueCells": 0,
      "mucusThreads": 3,
      "fields": [{ "seed": 30301 }, { "seed": 30302 }, { "seed": 30303 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-acute-uti",
    "title": "Acute Uncomplicated UTI",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "22-year-old female university student from Legon, Greater Accra Region, presenting to the campus health centre with 2-day history of dysuria, urinary frequency, urgency, and suprapubic discomfort. No fever, no flank pain, no vaginal discharge. Sexually active with one partner. No previous UTI. Physical examination: afebrile (36.5°C), mild suprapubic tenderness, no costovertebral angle tenderness.",
    "labData": "Urine Dipstick:\npH: 5.5\nSG: 1.025\nProtein: Trace\nGlucose: Negative\nBlood: 1+\nLeucocyte esterase: 3+\nNitrites: Positive\n\nMicroscopy (40x HPF):\nWBCs: 40-60/HPF (numerous)\nRBCs: 5-8/HPF\nBacteria: Moderate rod-shaped\nEpithelial: Few squamous\nTransitional cells: Occasional\nCasts: None",
    "teachingPoints": [
      "Pyuria (>5 WBCs/HPF) combined with bacteriuria and positive nitrites is the classic triad for acute bacterial UTI",
      "Gram-negative rods (E. coli morphology) are the most common uropathogen, accounting for 60-80% of uncomplicated UTIs",
      "Nitrite-positive urine confirms the presence of nitrate-reducing bacteria — false negatives occur with Gram-positive organisms and short bladder incubation time",
      "Few squamous epithelial cells (<5/HPF) confirms a clean-catch midstream specimen — high counts indicate contamination and require recollection",
      "In Ghana, increasing E. coli resistance to ampicillin (>60%) and cotrimoxazole (>50%) makes culture and sensitivity essential before empirical treatment"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 40001,
      "pusCells": 200, "rbcs": 35, "epithelial": 3, "urothelialEpi": 3, "tubularEpi": 0,
      "calciumOxalate": 0, "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 0, "granularCasts": 0, "yeast": 0,
      "bacteria": 150, "spermatozoa": 0, "clueCells": 0, "mucusThreads": 2,
      "fields": [{ "seed": 40001 }, { "seed": 40002 }, { "seed": 40003 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-candida-uti",
    "title": "Candida UTI",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "55-year-old female diabetic (type 2, poorly controlled HbA1c 10.1%) from Kumasi, Ashanti Region, admitted to KATH with diabetic foot ulcer. Indwelling urethral catheter in situ for 8 days. Received IV ceftriaxone for 5 days. Now reports cloudy urine with mild suprapubic discomfort. No fever.",
    "labData": "Urine Dipstick:\npH: 6.5\nSG: 1.015\nProtein: 1+\nGlucose: 3+ (glycosuria)\nBlood: Trace\nLE: 2+\nNitrites: Negative\n\nMicroscopy (40x HPF):\nWBCs: 15-25/HPF\nBudding yeast: Numerous\nPseudohyphae: Present\nEpithelial: Few squamous\nBacteria: Few",
    "teachingPoints": [
      "Budding yeast cells appear as oval refractile bodies (~4-6 µm) that may be confused with RBCs — the key distinguishing feature is budding (daughter cell attached to parent)",
      "Pseudohyphae are elongated yeast cells joined end-to-end forming chains — their presence indicates active Candida growth, not just colonisation",
      "Candiduria is common in diabetics (glycosuria provides substrate), catheterised patients, and those on broad-spectrum antibiotics",
      "Negative nitrites with positive leucocyte esterase suggests a non-bacterial cause of pyuria — yeast does not reduce nitrates",
      "Distinguish yeast from RBCs: yeast shows budding, is slightly smaller, and does not lyse in acetic acid. Add KOH to enhance yeast visualisation"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 40101,
      "pusCells": 100, "rbcs": 10, "epithelial": 4, "urothelialEpi": 1, "tubularEpi": 0,
      "calciumOxalate": 0, "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 0, "granularCasts": 0,
      "yeast": 80, "bacteria": 20, "spermatozoa": 0, "clueCells": 0, "mucusThreads": 1,
      "fields": [{ "seed": 40101 }, { "seed": 40102 }, { "seed": 40103 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-trichomoniasis",
    "title": "Trichomoniasis",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "30-year-old female market trader from Accra, presenting to a reproductive health clinic with 1-week history of profuse greenish-yellow frothy vaginal discharge, vulval pruritus, and dysuria. Partner reports no symptoms. Physical examination: vulval erythema, strawberry cervix on speculum examination. Wet mount of vaginal discharge requested alongside midstream urine.",
    "labData": "Urine Dipstick:\npH: 6.0\nSG: 1.018\nProtein: Trace\nBlood: Trace\nLE: 2+\nNitrites: Negative\n\nMicroscopy (40x HPF):\nWBCs: 20-30/HPF\nSquamous epithelial cells: 8-12/HPF\nMotile trichomonads: 5-8/HPF\nBacteria: Moderate mixed\nRBCs: 3-5/HPF",
    "teachingPoints": [
      "Trichomonas vaginalis is a pear-shaped flagellated protozoan (10-30 µm) with characteristic jerky, twitching motility — motility is the key to identification on wet mount",
      "Four anterior flagella and an undulating membrane provide the distinctive motility — the organism is larger than WBCs but smaller than epithelial cells",
      "Trichomonads are best identified in FRESH, warm specimens — motility decreases rapidly as the specimen cools, and dead organisms are difficult to distinguish from WBCs",
      "Numerous squamous epithelial cells in this specimen suggest vaginal contamination — however, the presence of trichomonads is always significant regardless of specimen quality",
      "Trichomoniasis is an STI — BOTH partners must be treated simultaneously with metronidazole. In Ghana, syndromic management of vaginal discharge should include screening for trichomoniasis"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 40201,
      "pusCells": 120, "rbcs": 20, "epithelial": 10, "urothelialEpi": 2, "tubularEpi": 0,
      "calciumOxalate": 0, "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 0, "granularCasts": 0,
      "yeast": 0, "bacteria": 80, "spermatozoa": 0, "clueCells": 0, "mucusThreads": 3,
      "trichomonas": 6,
      "fields": [{ "seed": 40201 }, { "seed": 40202 }, { "seed": 40203 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-schistosomiasis",
    "title": "Urinary Schistosomiasis",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "14-year-old male student from Tamale, Northern Region, presenting to the district hospital with painless terminal haematuria (blood at end of urination) for 3 weeks. Swims regularly in irrigation dam near his school. No dysuria, no fever. Physical examination unremarkable. Endemic area for S. haematobium.",
    "labData": "Urine Dipstick:\npH: 6.5\nSG: 1.020\nProtein: 1+\nBlood: 3+ (gross haematuria)\nLE: 1+\nNitrites: Negative\n\nMicroscopy (10x and 40x):\nRBCs: Too numerous to count (TNTC)\nWBCs: 10-15/HPF\nS. haematobium eggs: 4-6 per 10 mL (concentrated)\nTransitional cells: Occasional\nCrystals: None",
    "teachingPoints": [
      "Schistosoma haematobium eggs have a characteristic TERMINAL SPINE — this single feature distinguishes them from S. mansoni (lateral spine) and S. japonicum (no visible spine)",
      "Eggs are oval, 100-150 µm long, golden-brown, with a thick shell. A viable miracidium (larva) may be visible inside — viability indicates active infection",
      "Terminal haematuria (blood at end of micturition) in a child from an endemic area is classical for urinary schistosomiasis — always examine urine for eggs",
      "Concentration techniques (sedimentation or filtration) increase egg detection sensitivity — examine the sediment of 10 mL urine at 10x before 40x",
      "S. haematobium is endemic in northern Ghana, especially around irrigation dams and reservoirs. Mass drug administration with praziquantel is the WHO-recommended control strategy"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 40301,
      "pusCells": 60, "rbcs": 300, "epithelial": 1, "urothelialEpi": 3, "tubularEpi": 0,
      "calciumOxalate": 0, "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 0, "granularCasts": 0,
      "yeast": 0, "bacteria": 10, "spermatozoa": 0, "clueCells": 0, "mucusThreads": 1,
      "schistosomaHaematobiumEggs": 5,
      "fields": [{ "seed": 40301 }, { "seed": 40302 }, { "seed": 40303 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-contaminated-sample",
    "title": "Contaminated Midstream Sample",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "45-year-old female from Koforidua, Eastern Region, presenting for routine antenatal check-up at 20 weeks gestation. No urinary symptoms. Midstream urine collected for routine screening. Patient reports difficulty collecting specimen.",
    "labData": "Urine Dipstick:\npH: 6.5\nSG: 1.015\nProtein: Negative\nGlucose: Negative\nBlood: Negative\nLE: Trace\nNitrites: Negative\n\nMicroscopy (40x HPF):\nSquamous epithelial cells: >20/HPF (numerous)\nBacteria: Mixed morphology, moderate\nMucus threads: Numerous\nWBCs: 2-3/HPF\nRBCs: 0-1/HPF",
    "teachingPoints": [
      "Numerous squamous epithelial cells (>5/HPF) indicate contamination from vulvovaginal skin — this specimen is UNSATISFACTORY and should be recollected",
      "Mixed bacterial flora with epithelial cells suggests contamination rather than true infection — a single organism type in pure culture would suggest true bacteriuria",
      "The MLS should flag this specimen as 'contaminated' and request recollection with proper clean-catch technique instruction",
      "Mucus threads are normal in small amounts but numerous threads often accompany contaminated specimens from the lower genital tract",
      "Proper MSU collection technique: cleanse periurethral area, discard first portion of urine, collect midstream portion in sterile container — demonstrate to patient if needed"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 40401,
      "pusCells": 12, "rbcs": 5, "epithelial": 25, "urothelialEpi": 2, "tubularEpi": 0,
      "calciumOxalate": 0, "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 0, "granularCasts": 0,
      "yeast": 0, "bacteria": 100, "spermatozoa": 0, "clueCells": 0, "mucusThreads": 15,
      "fields": [{ "seed": 40401 }, { "seed": 40402 }, { "seed": 40403 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-pyelonephritis",
    "title": "Pyelonephritis",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "28-year-old female from Cape Coast, Central Region, presenting to the emergency department with 2-day history of high fever (39.8°C), rigors, severe right flank pain radiating to the groin, nausea, and vomiting. 5-day history of dysuria and frequency preceding the fever. Positive costovertebral angle tenderness on the right.",
    "labData": "Urine Dipstick:\npH: 5.5\nSG: 1.028\nProtein: 2+\nBlood: 2+\nLE: 3+\nNitrites: Positive\n\nMicroscopy (40x HPF):\nWBCs: >100/HPF (sheets of pus cells)\nWBC clumps: Present\nGranular casts: 2-3/LPF\nBacteria: Numerous rods\nRBCs: 15-20/HPF\nTransitional cells: Few\n\nFBC: WBC 18.4 × 10⁹/L, CRP 186 mg/L",
    "teachingPoints": [
      "Sheets of WBCs (>100/HPF), WBC clumps, and WBC/granular casts distinguish UPPER UTI (pyelonephritis) from lower UTI",
      "WBC casts are pathognomonic for pyelonephritis — they are cylindrical moulds containing embedded leucocytes formed in the renal tubules",
      "Granular casts in the setting of pyuria indicate renal parenchymal involvement — the infection has ascended from the bladder to the kidneys",
      "Pyelonephritis requires IV antibiotics and close monitoring — unlike simple cystitis, it can lead to sepsis, renal abscess, or chronic kidney damage",
      "WBC clumps (aggregates of 5+ pus cells) suggest intense inflammation — they are more commonly seen in upper tract infection than simple cystitis"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 40501,
      "pusCells": 350, "rbcs": 80, "epithelial": 2, "urothelialEpi": 4, "tubularEpi": 2,
      "calciumOxalate": 0, "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 1, "granularCasts": 4,
      "yeast": 0, "bacteria": 200, "spermatozoa": 0, "clueCells": 0, "mucusThreads": 2,
      "fields": [{ "seed": 40501 }, { "seed": 40502 }, { "seed": 40503 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-catheter-uti",
    "title": "Catheter-Associated UTI",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "68-year-old male from Tamale, Northern Region, admitted to Tamale Teaching Hospital following a stroke 10 days ago. Indwelling urinary catheter placed on admission. Now febrile (38.6°C) with cloudy, foul-smelling urine. Catheter specimen of urine (CSU) sent for analysis.",
    "labData": "Urine Dipstick:\npH: 8.0 (alkaline)\nSG: 1.010\nProtein: 1+\nBlood: 1+\nLE: 3+\nNitrites: Positive\n\nMicroscopy (40x HPF):\nWBCs: 50-80/HPF\nBacteria: Numerous mixed (rods + cocci)\nYeast: Occasional budding forms\nTransitional cells: 3-5/HPF\nTriple phosphate crystals: Few\nMucus: Moderate",
    "teachingPoints": [
      "Catheter-associated UTI (CAUTI) is the most common healthcare-associated infection — polymicrobial infection with mixed bacterial flora is characteristic",
      "Alkaline urine (pH 8.0) with triple phosphate crystals suggests infection by urease-producing organisms (Proteus, Klebsiella) that split urea to ammonia",
      "Mixed organisms (both rods and cocci) are typical of CAUTI — this contrasts with community-acquired UTI which usually involves a single pathogen",
      "Transitional cells may be increased due to catheter-related mechanical irritation of the bladder mucosa — not necessarily indicative of malignancy",
      "Candida in catheterised patients may represent colonisation rather than true infection — clinical correlation (fever, pyuria) is needed to distinguish"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 40601,
      "pusCells": 250, "rbcs": 30, "epithelial": 2, "urothelialEpi": 5, "tubularEpi": 0,
      "calciumOxalate": 0, "triplePhosphate": 4, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 2,
      "hyalineCasts": 0, "granularCasts": 0,
      "yeast": 12, "bacteria": 180, "spermatozoa": 0, "clueCells": 0, "mucusThreads": 6,
      "fields": [{ "seed": 40601 }, { "seed": 40602 }, { "seed": 40603 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-tubular-injury",
    "title": "Renal Tubular Injury with Secondary Infection",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "42-year-old male gold miner from Tarkwa, Western Region, admitted to Effia-Nkwanta Regional Hospital with acute kidney injury following ingestion of herbal remedy containing mercury compounds 5 days ago. Now febrile with decreased urine output. Serum creatinine rising rapidly.",
    "labData": "Urine Dipstick:\npH: 5.5\nSG: 1.008 (dilute — impaired concentrating ability)\nProtein: 3+\nGlucose: 2+ (tubular glycosuria)\nBlood: 2+\nLE: 2+\nNitrites: Positive\n\nMicroscopy (40x HPF):\nRenal tubular epithelial cells: 8-12/HPF\nGranular casts: 5-8/LPF\nWBCs: 30-40/HPF\nRBCs: 15-20/HPF\nBacteria: Moderate rods\nOval fat bodies: Few",
    "teachingPoints": [
      "Renal tubular epithelial (RTE) cells are small round cells with a large nucleus and high N:C ratio — they are the KEY indicator of acute tubular injury",
      "RTE cells with golden-brown pigmented granules indicate tubular necrosis with haemoglobin/myoglobin reabsorption — a critical finding that must be reported urgently",
      "Granular casts containing degenerating RTE cells confirm intrarenal pathology — they form within damaged renal tubules",
      "Tubular glycosuria (glucose in urine despite normal blood glucose) indicates proximal tubular dysfunction — the tubules cannot reabsorb filtered glucose",
      "Herbal remedy nephrotoxicity is a significant cause of AKI in Ghana — heavy metals (mercury, lead) in traditional preparations cause direct tubular damage"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 40701,
      "pusCells": 140, "rbcs": 70, "epithelial": 2, "urothelialEpi": 1, "tubularEpi": 10,
      "calciumOxalate": 0, "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 2, "granularCasts": 7,
      "yeast": 0, "bacteria": 100, "spermatozoa": 0, "clueCells": 0, "mucusThreads": 2,
      "fields": [{ "seed": 40701 }, { "seed": 40702 }, { "seed": 40703 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-asymptomatic-candiduria",
    "title": "Asymptomatic Candiduria",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "72-year-old female diabetic (type 2) from Sunyani, Bono Region, attending routine diabetes clinic follow-up. HbA1c 8.8%. No urinary symptoms. Routine urine screening performed. Patient on metformin and glimepiride.",
    "labData": "Urine Dipstick:\npH: 6.0\nSG: 1.020\nProtein: Trace\nGlucose: 2+\nBlood: Negative\nLE: Trace\nNitrites: Negative\n\nMicroscopy (40x HPF):\nBudding yeast: 10-15/HPF\nWBCs: 2-4/HPF\nRBCs: 0-1/HPF\nEpithelial: Few squamous\nBacteria: Few",
    "teachingPoints": [
      "Candiduria without significant pyuria (<5 WBCs/HPF) suggests COLONISATION rather than true infection — this distinction is clinically critical",
      "Asymptomatic candiduria in diabetics is common due to glycosuria — treatment is generally NOT indicated unless the patient is symptomatic or immunocompromised",
      "The MLS should report the finding objectively: 'Budding yeast cells, 10-15/HPF. WBCs 2-4/HPF' — the clinician decides on the significance",
      "Budding yeast must be carefully distinguished from RBCs and air bubbles — budding forms have a characteristic narrow-necked daughter cell attached",
      "Poorly controlled diabetes (HbA1c >8%) is the strongest risk factor for candiduria — improved glycaemic control often resolves the candiduria without antifungals"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 40801,
      "pusCells": 15, "rbcs": 3, "epithelial": 4, "urothelialEpi": 0, "tubularEpi": 0,
      "calciumOxalate": 0, "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 0, "granularCasts": 0,
      "yeast": 45, "bacteria": 10, "spermatozoa": 0, "clueCells": 0, "mucusThreads": 1,
      "fields": [{ "seed": 40801 }, { "seed": 40802 }, { "seed": 40803 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "urine-trichomoniasis-uti",
    "title": "Trichomoniasis with Secondary UTI",
    "discipline": "urinalysis",
    "category": "Urine R/E",
    "clinicalHistory": "26-year-old female sex worker from Kumasi, Ashanti Region, presenting to an STI clinic with 10-day history of profuse malodorous vaginal discharge, vulval itching, dysuria, and urinary frequency. Reports multiple sexual partners. Physical examination: frothy greenish discharge, vulvovaginal erythema, cervical petechiae ('strawberry cervix').",
    "labData": "Urine Dipstick:\npH: 6.5\nSG: 1.020\nProtein: Trace\nBlood: 1+\nLE: 3+\nNitrites: Positive\n\nMicroscopy (40x HPF):\nWBCs: 30-50/HPF\nMotile trichomonads: 8-12/HPF\nSquamous epithelial cells: 10-15/HPF\nBacteria: Numerous mixed\nRBCs: 5-8/HPF",
    "teachingPoints": [
      "Coexisting trichomoniasis and bacterial UTI is common — Trichomonas disrupts the vaginal flora allowing bacterial ascension into the urinary tract",
      "Numerous squamous epithelial cells with trichomonads and mixed bacteria indicate genital tract contamination — but the trichomonads and pyuria are clinically significant regardless",
      "Trichomoniasis increases susceptibility to other STIs including HIV — comprehensive STI screening should be offered",
      "Treatment requires metronidazole for trichomoniasis PLUS targeted antibiotics for the UTI component — treat both conditions simultaneously",
      "The MLS should report both findings clearly: 'Motile trichomonads identified. Significant pyuria with bacteriuria. Recommend culture and STI screening.'"
    ],
    "fields": [],
    "urineConfig": {
      "seed": 40901,
      "pusCells": 160, "rbcs": 30, "epithelial": 14, "urothelialEpi": 2, "tubularEpi": 0,
      "calciumOxalate": 0, "triplePhosphate": 0, "uricAcid": 0, "ammoniumBiurate": 0, "amorphousCrystals": 0,
      "hyalineCasts": 0, "granularCasts": 0,
      "yeast": 0, "bacteria": 160, "spermatozoa": 0, "clueCells": 0, "mucusThreads": 4,
      "trichomonas": 10,
      "fields": [{ "seed": 40901 }, { "seed": 40902 }, { "seed": 40903 }]
    },
    "source": "SVG-generated urine sediment simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pf-ring",
    "title": "P. falciparum \u2014 Ring Forms",
    "discipline": "malaria",
    "category": "Plasmodium falciparum",
    "clinicalHistory": "28-year-old male farmer from Tamale, Northern Region, presenting with 4-day history of intermittent high-grade fever (39.8°C), rigors, profuse sweating, headache, and myalgia. Recently returned from farming near the Bui Dam site during the rainy season. No malaria chemoprophylaxis. Physical examination: febrile, mildly jaundiced, splenomegaly 3 cm below left costal margin, no hepatomegaly. LLIN use: irregular — reports net is torn. Last antimalarial treatment: artesunate-amodiaquine 6 months ago for a similar episode.",
    "labData": "FBC:\nWBC: 6.2 × 10⁹/L\nNeutrophils: 3.7 × 10⁹/L (60%)\nLymphocytes: 1.9 × 10⁹/L (30%)\nMonocytes: 0.5 × 10⁹/L (8%)\nEosinophils: 0.1 × 10⁹/L (2%)\n\nHb: 10.8 g/dL (mild anaemia)\nPlatelets: 82 × 10⁹/L (low — thrombocytopenia)\n\nMalaria:\nRDT: Positive (Pf HRP2 band)\nSpecies: P. falciparum\nStage: Ring forms (early trophozoites)\nParasitemia: 3.2% (~160,000/μL — moderate)\nMultiple infected RBCs: Present\n\nLiver function:\nTotal bilirubin: 2.8 mg/dL (elevated, mostly indirect)\nALT: 48 U/L (mildly elevated)\n\nRenal function:\nCreatinine: 1.1 mg/dL (normal)\nBlood glucose: 5.8 mmol/L (normal)",
    "teachingPoints": [
      "P. falciparum ring forms are small, delicate rings (1-2 μm) of blue-purple parasite cytoplasm within normal-sized RBCs — they are the earliest and most commonly seen stage in peripheral blood",
      "One or two red-purple chromatin dots mark the parasite nucleus — double chromatin dots ('headphone' appearance) are characteristic of P. falciparum and help distinguish from other species",
      "The host RBC is NOT enlarged and shows no stippling — this is a key distinguishing feature from P. vivax (enlarged RBC with Schüffner dots)",
      "Multiple rings per RBC (double or triple infection) and high parasitemia are hallmarks of P. falciparum and indicate the parasite's ability to infect RBCs of all ages",
      "Appliqué or accolé forms — ring forms adhering to the inner margin of the RBC membrane — are characteristic of P. falciparum",
      "Parasitemia estimation: count parasitised RBCs per 1,000 RBCs on thin film, or parasites per 200 WBCs on thick film. >5% parasitemia or >100,000/μL indicates severe malaria per WHO criteria",
      "Thrombocytopenia (low platelets) is the most common haematological abnormality in malaria — it occurs in >60% of P. falciparum cases and helps distinguish malaria from other febrile illnesses",
      "Ghana is holoendemic for P. falciparum malaria, which accounts for >95% of malaria cases — the Northern Region has among the highest transmission intensity, especially during and after the rainy season (June-October)",
      "Current Ghana treatment guidelines: uncomplicated P. falciparum is treated with artemisinin-based combination therapy (ACT) — either artesunate-amodiaquine or artemether-lumefantrine as first line",
      "Always perform both thick and thin films: thick film is more sensitive for detecting parasites (20-40x more blood examined), while thin film allows species identification, stage determination, and accurate parasitemia estimation"
    ],
    "fields": [],
    "svgConfig": {
      "stainType": "giemsa",
      "parasitemia": 0.06,
      "species": "pf",
      "stage": "ring",
      "fields": [{ "seed": 50101 }, { "seed": 50102 }, { "seed": 50103 }]
    },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pf-trophozoite",
    "title": "P. falciparum \u2014 Trophozoites",
    "discipline": "malaria",
    "category": "Plasmodium falciparum",
    "clinicalHistory": "6-year-old female child from Bolgatanga, Upper East Region, brought to the regional hospital by her mother with 3-day history of high fever, vomiting, refusal to eat, and progressive drowsiness. She has had two episodes of generalised tonic-clonic seizures in the past 12 hours. No prior antimalarial treatment for this episode. Immunisation up to date. Physical examination: temperature 40.1°C, Glasgow Coma Scale 8/15 (E2V2M4), deep acidotic breathing (Kussmaul), severe pallor, hepatosplenomegaly, no neck stiffness. Blantyre Coma Score: 2/5. Provisional diagnosis: severe malaria with cerebral involvement.",
    "labData": "FBC:\nWBC: 12.4 × 10⁹/L (elevated)\nNeutrophils: 8.1 × 10⁹/L (65%)\nLymphocytes: 3.1 × 10⁹/L (25%)\n\nHb: 5.2 g/dL (severe anaemia)\nPlatelets: 48 × 10⁹/L (severely low)\n\nMalaria:\nRDT: Positive (Pf HRP2 strongly positive)\nSpecies: P. falciparum\nStage: Trophozoites visible in peripheral blood (DANGER SIGN)\nParasitemia: 12.8% (~640,000/μL — hyperparasitaemia)\nPigmented neutrophils: Present (>5% — poor prognostic sign)\n\nMetabolic:\nBlood glucose: 2.1 mmol/L (CRITICAL — hypoglycaemia)\nLactate: 8.4 mmol/L (elevated — metabolic acidosis)\npH: 7.18 (severe acidosis)\nBicarbonate: 10 mEq/L (low)\n\nRenal function:\nCreatinine: 1.8 mg/dL (elevated for age)\nBUN: 38 mg/dL (elevated)\n\nTotal bilirubin: 5.6 mg/dL (elevated)\nLDH: 1,450 U/L (markedly elevated)",
    "teachingPoints": [
      "P. falciparum trophozoites are larger than ring forms with more abundant, irregular blue cytoplasm and visible hemozoin (malaria pigment) — dark brown-black granules within the parasite",
      "Trophozoites of P. falciparum are RARELY seen in peripheral blood because mature forms sequester in deep capillaries via PfEMP1-mediated cytoadherence — their presence peripherally indicates overwhelming parasitemia and severe/complicated malaria",
      "The host RBC remains normal size (not enlarged) — this helps distinguish from P. vivax trophozoites, which are found in characteristically enlarged RBCs with Schüffner dots",
      "Pigmented neutrophils and monocytes (containing phagocytosed hemozoin) are a WHO marker of severe malaria — >5% pigmented neutrophils correlates with high mortality",
      "WHO criteria for severe P. falciparum malaria include: cerebral malaria (Blantyre score ≤2), severe anaemia (Hb <5 g/dL), hypoglycaemia (<2.2 mmol/L), metabolic acidosis, renal impairment, hyperparasitaemia (>10%), and respiratory distress",
      "Treatment of severe malaria in Ghana: IV artesunate is first line (2.4 mg/kg at 0, 12, 24 hours, then daily) — this replaced IV quinine as WHO-recommended treatment. Pre-referral rectal artesunate should be given at peripheral facilities",
      "Cerebral malaria in children under 5 is a leading cause of death in Ghana's northern regions — the Blantyre Coma Score (adapted from GCS for pre-verbal children) is used for assessment",
      "Severe malarial anaemia (Hb <5 g/dL) requires urgent blood transfusion — in resource-limited settings, whole blood transfusion is often used when packed RBCs are unavailable",
      "Hypoglycaemia is a critical complication in severe malaria, caused by parasite glucose consumption, impaired hepatic gluconeogenesis, and quinine-stimulated insulin release — always check blood glucose on admission and monitor regularly",
      "Exchange transfusion was previously considered for hyperparasitaemia (>10%) but is no longer routinely recommended by WHO since IV artesunate provides rapid parasite clearance — however, it may still be considered where artesunate is unavailable"
    ],
    "fields": [],
    "svgConfig": {
      "stainType": "giemsa",
      "parasitemia": 0.04,
      "species": "pf",
      "stage": "trophozoite",
      "fields": [{ "seed": 50201 }, { "seed": 50202 }, { "seed": 50203 }]
    },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pf-schizont",
    "title": "P. falciparum \u2014 Schizonts",
    "discipline": "malaria",
    "category": "Plasmodium falciparum",
    "clinicalHistory": "42-year-old female trader from Wa, Upper West Region, transferred from Wa Municipal Hospital to Tamale Teaching Hospital ICU after 5 days of progressive illness. Initial presentation was high fever and headache, treated empirically with oral artemether-lumefantrine at a local chemical shop. She deteriorated with confusion, repeated vomiting, jaundice, and passage of dark ('coca-cola') urine over the past 48 hours. On arrival: unresponsive, temperature 39.6°C, BP 85/50 mmHg, HR 128, RR 34 (deep acidotic breathing), severe pallor, deep jaundice, no urine output for 8 hours. Intubated and ventilated. Blood film shows schizonts in peripheral blood — an ominous finding in P. falciparum.",
    "labData": "FBC:\nWBC: 18.2 × 10⁹/L (elevated)\nNeutrophils: 14.6 × 10⁹/L (80%)\nLymphocytes: 1.8 × 10⁹/L (10%)\n\nHb: 4.1 g/dL (life-threatening anaemia)\nPlatelets: 22 × 10⁹/L (severely low — DIC likely)\n\nMalaria:\nRDT: Positive (Pf HRP2 strongly positive)\nSpecies: P. falciparum\nStage: SCHIZONTS visible in peripheral blood (CRITICAL)\nParasitemia: 18.5% (~925,000/μL — hyperparasitaemia)\n\nCoagulation:\nPT/INR: 2.1 (prolonged)\naPTT: 52 seconds (prolonged)\nFibrinogen: 0.8 g/L (low — DIC)\nD-dimer: >10,000 ng/mL (markedly elevated)\n\nMetabolic:\nBlood glucose: 1.8 mmol/L (CRITICAL hypoglycaemia)\nLactate: 12.6 mmol/L (severe lactic acidosis)\npH: 7.08 (critical acidosis)\nBicarbonate: 6 mEq/L (very low)\n\nRenal function:\nCreatinine: 5.4 mg/dL (acute kidney injury — Stage 3)\nBUN: 82 mg/dL\nPotassium: 6.2 mEq/L (dangerous hyperkalaemia)\n\nLiver function:\nTotal bilirubin: 12.4 mg/dL (markedly elevated)\nALT: 280 U/L\nAST: 420 U/L\n\nUrinalysis: Dark brown, Hb 4+ (haemoglobinuria — blackwater fever)",
    "teachingPoints": [
      "P. falciparum schizonts contain 8-24 merozoites (daughter parasites) arranged within the infected RBC, often with a central dark mass of coalesced hemozoin pigment",
      "Schizonts are VERY RARELY seen in peripheral P. falciparum blood because mature forms normally sequester in deep capillaries — their peripheral presence indicates complete saturation of sequestration sites and is associated with mortality rates >50%",
      "The presence of P. falciparum schizonts on peripheral blood film is itself a WHO criterion for severe malaria and should trigger immediate escalation to IV artesunate and ICU-level care",
      "Compare species: P. falciparum schizonts have 8-24 merozoites randomly arranged; P. vivax has 12-24 merozoites with scattered pigment; P. malariae has 6-12 merozoites arranged in a characteristic 'daisy/rosette' pattern; P. ovale has 4-12 merozoites",
      "Blackwater fever (dark urine from massive intravascular haemolysis) is a dreaded complication of severe P. falciparum malaria — haemoglobinuria can cause acute tubular necrosis and renal failure",
      "DIC (disseminated intravascular coagulation) in severe malaria is evidenced by prolonged PT/aPTT, low fibrinogen, elevated D-dimer, and severe thrombocytopenia — it contributes to multi-organ failure",
      "This case illustrates the danger of suboptimal treatment — oral ACT purchased from chemical shops without proper diagnosis may result in underdosing, poor absorption due to vomiting, or use of substandard/counterfeit medications",
      "Acute kidney injury occurs in 20-40% of adults with severe P. falciparum malaria and often requires renal replacement therapy — in Ghana, limited dialysis access in rural areas contributes to high mortality",
      "Delayed presentation is a major contributor to malaria mortality in Ghana's northern regions — distances to referral hospitals, initial self-medication, and delayed recognition of danger signs all play roles",
      "Multi-organ dysfunction in severe malaria (cerebral + renal + hepatic + haematological) carries >80% mortality even with optimal treatment — this underscores the importance of early diagnosis and prompt ACT administration"
    ],
    "fields": [],
    "svgConfig": {
      "stainType": "giemsa",
      "parasitemia": 0.03,
      "species": "pf",
      "stage": "schizont",
      "fields": [{ "seed": 50301 }, { "seed": 50302 }, { "seed": 50303 }]
    },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pf-gametocyte",
    "title": "P. falciparum \u2014 Gametocytes",
    "discipline": "malaria",
    "category": "Plasmodium falciparum",
    "clinicalHistory": "32-year-old female community health nurse from Navrongo, Upper East Region, seen at a follow-up visit 14 days after completing a 3-day course of artemether-lumefantrine for uncomplicated P. falciparum malaria (initial parasitemia 2.1%). She reports feeling well — no fever, headache, or body aches. Appetite has returned and she has resumed work. Physical examination: afebrile (36.5°C), no pallor, no jaundice, spleen not palpable. Day-14 blood film performed per Ghana malaria treatment monitoring protocol shows clearance of asexual parasites but persistence of gametocytes.",
    "labData": "FBC (Day 14 follow-up):\nWBC: 7.4 × 10⁹/L (normal)\nNeutrophils: 4.1 × 10⁹/L (55%)\nLymphocytes: 2.4 × 10⁹/L (32%)\n\nHb: 11.2 g/dL (improving from 10.1 at diagnosis)\nPlatelets: 268 × 10⁹/L (normalised — was 94 at diagnosis)\n\nMalaria (Day 14 film):\nRDT: Positive (Pf HRP2 — expected, antigen persists up to 4 weeks)\nAsexual parasites: NONE seen (treatment success)\nGametocytes: Present — 48/μL (low density)\nGametocyte stage: Stage V (mature, crescent/banana-shaped)\n\nDay 0 (for comparison):\nParasitemia: 2.1% (~105,000/μL)\nRDT: Positive (Pf HRP2)\nHb: 10.1 g/dL\nPlatelets: 94 × 10⁹/L",
    "teachingPoints": [
      "The banana or crescent shape of P. falciparum gametocytes is PATHOGNOMONIC \u2014 no other human Plasmodium species produces crescent-shaped gametocytes. P. vivax, P. malariae, and P. ovale all have ROUND gametocytes",
      "LAVERAN\u2019S BIB: Some gametocytes show a faint arc of residual RBC membrane draped over the convex side of the crescent \u2014 named after Charles Louis Alphonse Laveran who first described malaria parasites in 1880. The bib is a remnant of the host erythrocyte membrane that the mature gametocyte has distorted and partially escaped from. It appears as a very faint pinkish crescent hugging one side of the parasite",
      "Not all gametocytes show Laveran\u2019s bib \u2014 it is most visible in well-stained preparations where the gametocyte has nearly completely distorted the host RBC. Its presence confirms the parasite was intracellular and helps distinguish a true gametocyte from stain artefacts",
      "Gametocytes are the SEXUAL stage \u2014 they are the only form infectious to the Anopheles mosquito vector. A single blood meal containing gametocytes can establish transmission",
      "P. falciparum gametocytes mature through stages I\u2013V over 10\u201314 days in the bone marrow before release into peripheral blood \u2014 this is why they often appear AFTER treatment has cleared asexual stages",
      "Gametocytes persist 3\u20136 weeks after successful ACT treatment \u2014 during this window the patient is clinically cured but remains a transmission reservoir",
      "The HRP2-based RDT remains positive up to 4 weeks after clearance because the antigen persists in blood \u2014 a positive RDT after treatment does NOT indicate failure. Microscopy distinguishes persistent gametocytes from recrudescence",
      "Macrogametocytes (female: larger, compact pigment, darker blue cytoplasm) vs microgametocytes (male: smaller, dispersed pigment, lighter pink cytoplasm) can sometimes be distinguished on well-stained films",
      "Primaquine (single low dose 0.25 mg/kg) is recommended by WHO as a gametocytocidal agent \u2014 requires G6PD testing first. G6PD deficiency prevalence in Ghana is ~15\u201325%",
      "Understanding gametocyte biology is critical for malaria elimination in Ghana \u2014 community-level gametocyte carriage maintains transmission even when clinical cases are treated promptly",
      "Artemisinin-based combinations clear early stages (I\u2013III) but are less effective against mature stage V gametocytes \u2014 this contributes to ongoing transmission in high-burden areas"
    ],
    "fields": [],
    "svgConfig": {
      "stainType": "giemsa",
      "parasitemia": 0.04,
      "species": "pf",
      "stage": "gametocyte",
      "fields": [{ "seed": 50401 }, { "seed": 50402 }, { "seed": 50403 }]
    },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pv-ring",
    "title": "P. vivax \u2014 Ring Forms",
    "discipline": "malaria",
    "category": "Plasmodium vivax",
    "clinicalHistory": "24-year-old male Ghanaian UN peacekeeper, returned to Accra 3 weeks ago after a 12-month deployment in South Sudan. Presenting to 37 Military Hospital with 5-day history of cyclical fevers occurring every 48 hours (tertian pattern), chills, drenching sweats, and generalised body aches. He took malaria prophylaxis (doxycycline) intermittently during deployment and stopped immediately upon return. He also reports a similar febrile episode 8 months ago while deployed, treated with chloroquine at the UN Level 2 hospital. Physical examination: febrile (38.8°C — examined during a febrile paroxysm), mild pallor, splenomegaly 2 cm below costal margin. No jaundice.",
    "labData": "FBC:\nWBC: 5.8 × 10⁹/L (normal)\nNeutrophils: 3.0 × 10⁹/L (52%)\nLymphocytes: 2.0 × 10⁹/L (34%)\nMonocytes: 0.6 × 10⁹/L (10%)\nEosinophils: 0.2 × 10⁹/L (4%)\n\nHb: 12.4 g/dL (low-normal for male)\nMCV: 86 fL (normocytic)\nPlatelets: 108 × 10⁹/L (mildly low)\n\nMalaria:\nRDT: Positive (Pan-pLDH band positive, Pf HRP2 NEGATIVE — suggests non-falciparum species)\nSpecies: P. vivax (confirmed on thin film)\nStage: Ring forms\nParasitemia: 0.8% (~40,000/μL)\nHost RBC: Enlarged with Schüffner dots\n\nReticulocyte count: 3.2% (mildly elevated)\nTotal bilirubin: 1.6 mg/dL (mildly elevated)\nG6PD assay: PENDING (required before primaquine)",
    "teachingPoints": [
      "The host RBC is ENLARGED (1.5-2x normal size) — this is the single most important differentiating feature from P. falciparum, where the RBC size is normal. Use surrounding uninfected RBCs as a size reference",
      "P. vivax ring forms are larger and thicker than the small, delicate P. falciparum rings — they often have a single prominent chromatin dot rather than the double dots typical of P. falciparum",
      "Schüffner dots (fine pink-red stippling over the entire enlarged RBC surface) are characteristic of P. vivax and P. ovale — they represent caveola-vesicle complexes in the RBC membrane and are best seen on well-stained, thin areas of the film",
      "P. vivax preferentially infects reticulocytes (young RBCs) via the Duffy blood group antigen — this limits parasitemia to typically <2% and explains the generally milder clinical presentation compared to P. falciparum",
      "All stages of P. vivax (rings, trophozoites, schizonts, gametocytes) are seen in peripheral blood — unlike P. falciparum where only rings and gametocytes are typically peripheral",
      "P. vivax is rare in West Africa because most West Africans are Duffy-negative (Fy a-b-), which confers natural resistance — however, recent evidence shows P. vivax CAN infect Duffy-negative individuals at low rates",
      "This case illustrates relapsing malaria: P. vivax forms hypnozoites (dormant liver stages) that can reactivate weeks to months after initial infection — the previous episode 8 months ago was likely the primary infection, and this is a relapse",
      "Radical cure of P. vivax requires primaquine (14-day course) to eliminate hypnozoites and prevent relapse — but G6PD testing is MANDATORY first due to risk of severe haemolytic anaemia in G6PD-deficient patients (15-25% prevalence in Ghana)",
      "The 48-hour (tertian) fever pattern corresponds to the 48-hour erythrocytic cycle of P. vivax — synchronised schizont rupture releases merozoites and pyrogens, causing the periodic febrile paroxysm",
      "Differential diagnosis for cyclical fevers with travel history: P. vivax, P. ovale (also tertian, also relapses), P. malariae (72-hour quartan cycle), and P. falciparum (irregular or daily). Mixed infections can occur in co-endemic areas"
    ],
    "fields": [],
    "svgConfig": {
      "stainType": "giemsa",
      "parasitemia": 0.04,
      "species": "pv",
      "stage": "ring",
      "fields": [{ "seed": 60101 }, { "seed": 60102 }, { "seed": 60103 }]
    },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pv-trophozoite",
    "title": "P. vivax \u2014 Trophozoites",
    "discipline": "malaria",
    "category": "Plasmodium vivax",
    "clinicalHistory": "30-year-old Indian male construction engineer working on a road project in Accra, presenting to Ridge Hospital with 7-day history of high fever, chills, and headache. Symptoms began gradually with malaise and low-grade fever, progressing to regular febrile episodes every 48 hours with profuse sweating. He is originally from Kolkata, India (P. vivax endemic area) and has had malaria twice before in India. He arrived in Ghana 4 months ago. No chemoprophylaxis. Physical examination: temperature 39.2°C (during febrile paroxysm), moderate pallor, palpable spleen 4 cm below costal margin, mild hepatomegaly. Blood film shows active P. vivax infection with multiple parasite stages.",
    "labData": "FBC:\nWBC: 7.6 × 10⁹/L\nNeutrophils: 3.8 × 10⁹/L (50%)\nLymphocytes: 2.7 × 10⁹/L (35%)\nMonocytes: 0.8 × 10⁹/L (11%)\nEosinophils: 0.3 × 10⁹/L (4%)\n\nHb: 10.6 g/dL (mild anaemia)\nMCV: 84 fL (normocytic)\nReticulocytes: 4.8% (elevated)\nPlatelets: 92 × 10⁹/L (low)\n\nMalaria:\nRDT: Positive (Pan-pLDH positive, Pf HRP2 NEGATIVE)\nSpecies: P. vivax (confirmed morphologically)\nStages present: Rings, trophozoites, schizonts, gametocytes (ALL stages)\nParasitemia: 1.4% (~70,000/μL)\nHost RBC: Enlarged, prominent Schüffner dots\nTrophozoite morphology: Amoeboid with irregular cytoplasm\n\nLiver function:\nTotal bilirubin: 2.2 mg/dL (mildly elevated)\nALT: 52 U/L (mildly elevated)\n\nG6PD screen: Normal (fluorescent spot test)\nDirect Coombs test: Negative",
    "teachingPoints": [
      "P. vivax trophozoites have a characteristic AMOEBOID shape — the cytoplasm is irregular, spread out, and often appears as pseudopods extending in multiple directions within the enlarged RBC. This is the most distinctive morphological feature",
      "The host RBC is markedly enlarged (up to 2x normal) with prominent Schüffner dots covering the entire cell surface — the combination of amoeboid trophozoite + enlarged stippled RBC is diagnostic of P. vivax",
      "Fine hemozoin pigment granules are visible as scattered light-brown dots within the trophozoite cytoplasm — the pigment is finer and more dispersed than in P. falciparum",
      "ALL stages of P. vivax (ring, trophozoite, schizont, gametocyte) are routinely visible in peripheral blood — this is because P. vivax does NOT sequester in deep capillaries like P. falciparum. Seeing multiple stages confirms the species",
      "Compare with P. falciparum trophozoites: Pf trophozoites are rarely seen peripherally (sequestration), the RBC is normal-sized, and there are no Schüffner dots — their presence in peripheral blood indicates severe/complicated Pf malaria",
      "P. vivax is historically considered rare in West Africa due to widespread Duffy-negativity in indigenous populations — however, cases are increasingly reported among travellers and expatriates from endemic regions (South/Southeast Asia, Latin America, Horn of Africa)",
      "Chloroquine remains first-line treatment for P. vivax malaria in most guidelines, as widespread chloroquine resistance has not emerged for vivax (unlike falciparum). However, chloroquine-resistant P. vivax has been reported from Indonesia and Papua New Guinea",
      "Radical cure with primaquine (0.25-0.5 mg/kg daily for 14 days) is essential to eliminate hypnozoites and prevent relapse — this patient's two previous malaria episodes in India may represent relapses from dormant hypnozoites",
      "G6PD testing before primaquine is mandatory — the fluorescent spot test is widely available in Ghana. If G6PD-deficient, weekly primaquine (0.75 mg/kg) for 8 weeks under medical supervision is an alternative, and tafenoquine is contraindicated",
      "Splenomegaly in vivax malaria can be significant and is related to splenic clearance of infected RBCs and immune activation — tropical splenomegaly syndrome (hyperreactive malarial splenomegaly) is a chronic complication of repeated P. vivax infections in endemic areas"
    ],
    "fields": [],
    "svgConfig": {
      "stainType": "giemsa",
      "parasitemia": 0.04,
      "species": "pv",
      "stage": "trophozoite",
      "fields": [{ "seed": 60201 }, { "seed": 60202 }, { "seed": 60203 }]
    },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pv-schizont",
    "title": "P. vivax \u2014 Schizonts",
    "discipline": "malaria",
    "category": "Plasmodium vivax",
    "clinicalHistory": "45-year-old Indian businessman based in Kumasi, presenting with cyclical tertian fever (48-hour pattern) for 10 days. Third episode of vivax malaria in 2 years \u2014 previous episodes treated with chloroquine alone without radical cure. Now showing mature schizonts on peripheral film, indicating active schizogony. G6PD status: normal (tested previously).",
    "labData": "FBC:\nWBC: 5.8 \u00d7 10\u2079/L\nHb: 11.2 g/dL (mild anaemia)\nPlatelets: 98 \u00d7 10\u2079/L (low)\n\nMalaria:\nRDT: Positive (pan-pLDH, Pf HRP2 negative)\nSpecies: P. vivax\nStage: Schizonts (mature) + ring forms\nParasitemia: ~2%\n\nG6PD: Normal (quantitative assay)\nReticulocytes: 4.2% (elevated)\nLDH: 380 U/L (mildly elevated)",
    "teachingPoints": [
      "P. vivax schizonts contain 12\u201324 merozoites arranged in a rosette or \u2018daisy\u2019 pattern around a central mass of hemozoin pigment \u2014 this is a key species differentiator",
      "Unlike P. falciparum, P. vivax schizonts ARE normally seen in peripheral blood \u2014 ALL stages (ring, trophozoite, schizont, gametocyte) circulate in vivax infections",
      "The host RBC is ENLARGED (1.5\u20132\u00d7 normal) with Sch\u00fcffner dots \u2014 these features persist at the schizont stage",
      "P. vivax schizonts are LARGER than P. falciparum schizonts because the host cell is enlarged",
      "The central hemozoin pigment in vivax schizonts is coarser and more scattered than in P. falciparum",
      "Differentiate from P. malariae schizonts: P. malariae has only 6\u201312 merozoites in a \u2018daisy head\u2019 pattern in a normal-sized RBC",
      "P. vivax causes cyclical TERTIAN fever (48-hour cycle) corresponding to the 48-hour erythrocytic cycle from ring to schizont rupture",
      "Relapsing vivax: this patient\u2019s recurrent infections are due to HYPNOZOITES (dormant liver stages). Radical cure requires primaquine (14 days) after G6PD testing",
      "In Ghana, P. vivax is rare in indigenous populations due to high Duffy-negative prevalence, but is seen in expatriates and travellers from endemic regions",
      "Lab report should state: species (P. vivax), stages present (schizonts + rings), parasitemia, and note that all stages are seen peripherally (unlike P. falciparum)"
    ],
    "fields": [],
    "svgConfig": {
      "stainType": "giemsa",
      "parasitemia": 0.03,
      "species": "pv",
      "stage": "schizont",
      "fields": [{ "seed": 60301 }, { "seed": 60302 }, { "seed": 60303 }]
    },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pv-gametocyte",
    "title": "P. vivax \u2014 Gametocytes",
    "discipline": "malaria",
    "category": "Plasmodium vivax",
    "clinicalHistory": "30-year-old Sri Lankan engineer working on a road project in Tamale, presenting with 5-day fever. Blood film shows P. vivax with gametocytes \u2014 round forms filling enlarged RBCs. This is his first malaria episode. He reports no chemoprophylaxis use.",
    "labData": "FBC:\nWBC: 6.0 \u00d7 10\u2079/L\nHb: 12.8 g/dL\nPlatelets: 110 \u00d7 10\u2079/L (low)\n\nMalaria:\nRDT: Positive (pan-pLDH)\nSpecies: P. vivax\nStage: Gametocytes (round) + ring forms + trophozoites\nParasitemia: ~2.5%\n\nG6PD: Pending (must test before radical cure)\nReticulocytes: 3.8%",
    "teachingPoints": [
      "P. vivax gametocytes are ROUND or OVAL \u2014 they fill most of the enlarged host RBC. This is completely different from P. falciparum\u2019s banana/crescent-shaped gametocytes",
      "The round shape is a KEY species differentiator: if you see round gametocytes in an enlarged RBC with Sch\u00fcffner dots, it is P. vivax (or P. ovale), NOT P. falciparum",
      "P. vivax gametocytes have a large eccentric chromatin mass and scattered hemozoin pigment throughout the cytoplasm",
      "Gametocytes appear earlier in vivax infection than in falciparum \u2014 they may be present from the first few days of symptoms, meaning transmission can occur before the patient even seeks treatment",
      "The host RBC remains ENLARGED with Sch\u00fcffner dots at the gametocyte stage \u2014 these RBC features persist through all vivax stages",
      "P. vivax gametocytes and trophozoites can look similar \u2014 both are large and fill the cell. Gametocytes tend to be rounder, denser, and have a more compact chromatin mass",
      "Distinguish from P. malariae/ovale gametocytes: P. malariae gametocytes are in normal-sized RBCs (no enlargement), and P. ovale has fimbriated/tufted RBC edges",
      "Finding gametocytes means the patient can transmit malaria to mosquitoes \u2014 this is relevant for public health reporting",
      "Multiple stages visible simultaneously (rings + trophozoites + gametocytes) is characteristic of P. vivax \u2014 in P. falciparum, typically only rings and gametocytes are seen peripherally",
      "Lab report should specify ALL stages identified: \u2018P. vivax: ring forms, trophozoites, and gametocytes seen. Parasitemia ~2.5%.\u2019 Each stage provides diagnostic information"
    ],
    "fields": [],
    "svgConfig": {
      "stainType": "giemsa",
      "parasitemia": 0.03,
      "species": "pv",
      "stage": "gametocyte",
      "fields": [{ "seed": 60401 }, { "seed": 60402 }, { "seed": 60403 }]
    },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pm-ring",
    "title": "P. malariae \u2014 Ring Forms",
    "discipline": "malaria",
    "category": "Plasmodium malariae",
    "clinicalHistory": "55-year-old retired teacher from Bolgatanga, Upper East Region. Presents with low-grade fever recurring every 72 hours (quartan pattern) for 3 weeks. Mild splenomegaly. No recent travel. P. malariae confirmed \u2014 the only human malaria species with a 72-hour erythrocytic cycle.",
    "labData": "FBC:\nWBC: 5.2 \u00d7 10\u2079/L\nHb: 11.8 g/dL\nPlatelets: 140 \u00d7 10\u2079/L\n\nMalaria:\nRDT: Positive (pan-pLDH, Pf HRP2 negative)\nSpecies: P. malariae\nStage: Ring forms\nParasitemia: ~0.5% (characteristically low)\n\nRenal function: Creatinine 1.4 mg/dL (monitor \u2014 P. malariae can cause nephrotic syndrome)",
    "teachingPoints": [
      "P. malariae ring forms resemble P. falciparum rings but tend to be THICKER and more robust \u2014 sometimes described as \u2018sturdy\u2019 rings",
      "Host RBC is NORMAL SIZE (not enlarged) and shows NO Sch\u00fcffner dots \u2014 this distinguishes it from P. vivax/ovale",
      "Parasitemia is characteristically LOW (<1%) even in established infections \u2014 P. malariae preferentially infects OLD RBCs which are less numerous",
      "P. malariae has a 72-hour erythrocytic cycle causing QUARTAN fever (every 3rd day) \u2014 the only human species with this cycle. P. falciparum and P. vivax cause tertian fever (48h)",
      "All stages are seen in peripheral blood (rings, trophozoites, schizonts, gametocytes) \u2014 similar to P. vivax but in normal-sized RBCs",
      "P. malariae can persist as a chronic subclinical infection for DECADES \u2014 cases have been documented 40+ years after leaving endemic areas",
      "IMPORTANT: P. malariae can cause immune-complex NEPHROTIC SYNDROME (especially in children) \u2014 monitor renal function",
      "Differentiate from P. falciparum: P. malariae rings are thicker, parasitemia is lower, and mature stages are seen peripherally (falciparum sequesters)",
      "In Ghana, P. malariae accounts for ~3\u20135% of malaria cases \u2014 often found as mixed infection with P. falciparum",
      "Lab report: state species (P. malariae), note the quartan periodicity if clinical history available, and recommend renal function monitoring"
    ],
    "fields": [],
    "svgConfig": { "stainType": "giemsa", "parasitemia": 0.01, "species": "pm", "stage": "ring", "fields": [{ "seed": 70101 }, { "seed": 70102 }, { "seed": 70103 }] },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pm-trophozoite",
    "title": "P. malariae \u2014 Band Form Trophozoites",
    "discipline": "malaria",
    "category": "Plasmodium malariae",
    "clinicalHistory": "12-year-old boy from Wa, Upper West Region. Referred for investigation of proteinuria and facial oedema. Blood film reveals P. malariae trophozoites with the characteristic BAND FORM \u2014 the parasite stretches across the RBC as a transverse band. This morphology is pathognomonic for P. malariae.",
    "labData": "FBC:\nWBC: 6.1 \u00d7 10\u2079/L\nHb: 10.4 g/dL\nPlatelets: 165 \u00d7 10\u2079/L\n\nMalaria:\nSpecies: P. malariae\nStage: Band form trophozoites\nParasitemia: ~0.3%\n\nRenal:\nUrinalysis: Protein 3+, no casts\nSerum albumin: 2.1 g/dL (low)\nCreatinine: 1.8 mg/dL (elevated)\n24h urine protein: 4.2 g (nephrotic range)",
    "teachingPoints": [
      "The BAND FORM is PATHOGNOMONIC for P. malariae \u2014 the trophozoite stretches across the full diameter of the RBC as a transverse bar or band of cytoplasm",
      "No other Plasmodium species produces this band morphology \u2014 if you see a band form, it is P. malariae",
      "The band form has a central compact chromatin mass and hemozoin pigment distributed along the band",
      "Host RBC remains NORMAL SIZE with no Sch\u00fcffner dots \u2014 distinguishes from P. vivax trophozoites which are amoeboid in enlarged RBCs",
      "P. malariae trophozoites can also appear as compact round forms (not just bands) \u2014 the band is the classic form but not the only morphology",
      "This patient has P. malariae nephropathy \u2014 immune complex deposition causing nephrotic syndrome. This is a recognised complication, especially in children in endemic areas",
      "Parasitemia is very low (0.3%) which is typical \u2014 P. malariae rarely exceeds 1% because it infects only old/senescent RBCs",
      "P. malariae pigment (hemozoin) is coarse and dark brown \u2014 more visible than in P. falciparum ring forms",
      "Differentiate from P. knowlesi: P. knowlesi can also show band forms but causes higher parasitemia and has a 24-hour cycle (quotidian fever)",
      "Lab report: \u2018P. malariae identified \u2014 band form trophozoites in normal-sized RBCs. Low parasitemia (~0.3%). Recommend renal function assessment.\u2019"
    ],
    "fields": [],
    "svgConfig": { "stainType": "giemsa", "parasitemia": 0.008, "species": "pm", "stage": "trophozoite", "fields": [{ "seed": 70201 }, { "seed": 70202 }, { "seed": 70203 }] },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-pm-schizont",
    "title": "P. malariae \u2014 Schizonts (Daisy Head)",
    "discipline": "malaria",
    "category": "Plasmodium malariae",
    "clinicalHistory": "68-year-old retired diplomat, previously lived in West Africa for 20 years. Now living in Accra. Presents with intermittent fever for 2 months. P. malariae schizont identified showing the classic \u2018daisy head\u2019 pattern \u2014 a small number of merozoites arranged symmetrically around central pigment.",
    "labData": "FBC:\nWBC: 4.8 \u00d7 10\u2079/L\nHb: 11.0 g/dL\nPlatelets: 155 \u00d7 10\u2079/L\n\nMalaria:\nSpecies: P. malariae\nStage: Schizonts (daisy head) + ring forms\nParasitemia: ~0.2%",
    "teachingPoints": [
      "P. malariae schizonts contain only 6\u201312 merozoites (fewer than any other species) arranged symmetrically around a central pigment mass \u2014 the \u2018DAISY HEAD\u2019 or \u2018rosette\u2019 pattern",
      "Compare: P. vivax has 12\u201324 merozoites, P. falciparum has 8\u201324 merozoites. The LOW merozoite count is a key differentiator for P. malariae",
      "The host RBC is NORMAL SIZE \u2014 this immediately excludes P. vivax (enlarged RBC) and P. ovale (oval/fimbriated RBC)",
      "The central pigment mass in the schizont is DARK and prominent \u2014 coarser than in other species",
      "P. malariae schizonts ARE seen in peripheral blood (unlike P. falciparum where schizonts indicate severe disease)",
      "This patient\u2019s chronic low-grade infection spanning months is typical \u2014 P. malariae can persist as a chronic infection for decades without causing severe symptoms",
      "The very low parasitemia (0.2%) is characteristic \u2014 may require extended scanning to find parasites",
      "P. malariae is the least common of the four classic human malaria species in Ghana but should always be considered in chronic/relapsing fever",
      "Differentiate the daisy head from P. vivax rosettes: P. malariae has FEWER, more evenly spaced merozoites in a NORMAL-sized RBC",
      "Lab report: document the daisy head pattern as it is morphologically distinctive and confirms P. malariae"
    ],
    "fields": [],
    "svgConfig": { "stainType": "giemsa", "parasitemia": 0.005, "species": "pm", "stage": "schizont", "fields": [{ "seed": 70301 }, { "seed": 70302 }, { "seed": 70303 }] },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "malaria-po-ring",
    "title": "P. ovale \u2014 Ring Forms",
    "discipline": "malaria",
    "category": "Plasmodium ovale",
    "clinicalHistory": "35-year-old Ghanaian NGO worker returned from Liberia 3 months ago. Presents with relapsing tertian fever. Blood film shows ring forms in OVAL-shaped RBCs with FIMBRIATED (tufted/ragged) edges \u2014 pathognomonic for P. ovale. Sch\u00fcffner dots also visible.",
    "labData": "FBC:\nWBC: 5.5 \u00d7 10\u2079/L\nHb: 12.0 g/dL\nPlatelets: 120 \u00d7 10\u2079/L\n\nMalaria:\nRDT: Positive (pan-pLDH)\nSpecies: P. ovale\nStage: Ring forms\nParasitemia: ~1%\n\nG6PD: Normal",
    "teachingPoints": [
      "P. ovale-infected RBCs are OVAL-SHAPED with FIMBRIATED (ragged/tufted) edges \u2014 this is PATHOGNOMONIC. No other species distorts the RBC into an oval shape",
      "The host RBC is slightly ENLARGED (1.25\u00d7 normal) \u2014 less enlargement than P. vivax but clearly bigger than normal",
      "Sch\u00fcffner dots (James\u2019 dots in P. ovale) are present \u2014 fine pink stippling similar to P. vivax",
      "Ring forms resemble P. vivax rings \u2014 larger and thicker than P. falciparum. The RBC shape (oval + fimbriated) is the KEY differentiator from vivax",
      "P. ovale has a tertian cycle (48 hours) like P. vivax and P. falciparum",
      "Like P. vivax, P. ovale has HYPNOZOITES (dormant liver stages) causing relapses months to years later. This patient\u2019s relapse 3 months post-travel is typical",
      "Radical cure requires primaquine (same as P. vivax) \u2014 G6PD testing is mandatory before prescribing",
      "P. ovale is most common in WEST AFRICA \u2014 Ghana, Nigeria, Liberia. It is the species most likely to be misidentified as P. vivax",
      "Parasitemia is typically low (usually <2%) \u2014 P. ovale rarely causes severe disease",
      "Lab report: emphasise the oval RBC shape and fimbriated edges \u2014 these features distinguish P. ovale from all other species"
    ],
    "fields": [],
    "svgConfig": { "stainType": "giemsa", "parasitemia": 0.015, "species": "po", "stage": "ring", "fields": [{ "seed": 70401 }, { "seed": 70402 }, { "seed": 70403 }] },
    "source": "SVG-generated Giemsa thin blood film simulation",
    "license": "Educational use"
  },
  {
    "id": "sickling-negative-hbaa",
    "title": "Sickling Test \u2014 Negative (HbAA)",
    "discipline": "hematology",
    "category": "Sickling Test",
    "clinicalHistory": "Pre-operative sickling screening. 25-year-old male scheduled for elective hernia repair at Korle Bu Teaching Hospital. No personal or family history of sickle cell disease. Haemoglobin electrophoresis pending. Sodium metabisulphite (2%) sickling test performed as rapid screen.",
    "labData": "Sickling Test:\nReducing agent: 2% sodium metabisulphite (Na\u2082S\u2082O\u2085)\nReading time: 30 minutes\nResult: NEGATIVE \u2014 no sickling observed\n\nInterpretation: No HbS detected.\nConsistent with HbAA (normal).\n\nFBC:\nHb: 14.2 g/dL\nMCV: 88 fL\nMCH: 30 pg\nRDW: 12.8%\nHb electrophoresis: HbA 97%, HbA\u2082 2.8%, HbF 0.2%",
    "teachingPoints": [
      "GENETICS: Sickle cell disease is caused by a single nucleotide mutation (GAG\u2192GTG) in the \u03b2-globin gene on chromosome 11p15.5, producing a glutamic acid\u2192valine substitution at position 6 of the \u03b2-globin chain (HbS: \u03b26Glu\u2192Val). This replaces a charged, hydrophilic residue with a hydrophobic valine on the surface of the haemoglobin tetramer \u2014 the molecular root of all sickle cell pathology.",
      "MOLECULAR MECHANISM: When HbS is deoxygenated (T-state), the \u03b26 valine inserts into a complementary hydrophobic pocket (formed by Phe85 and Leu88) on the \u03b21 chain of an adjacent HbS tetramer. This intermolecular contact nucleates the polymerisation of HbS into long, rigid, multi-stranded fibres called tactoids. These fibres mechanically distort the RBC membrane into the sickle shape. HbA lacks the \u03b26 valine and therefore CANNOT participate in this polymerisation \u2014 which is why this test is negative.",
      "WHY Na\u2082S\u2082O\u2085 WORKS: Sodium metabisulphite is a strong reducing agent that scavenges dissolved oxygen from the wet preparation, forcing haemoglobin into the deoxygenated T-state. In this conformation, the \u03b26 valine becomes exposed and accessible for polymer contacts. In vivo, this same deoxygenation occurs naturally in capillary beds, the spleen, and any hypoxic tissue. Because this patient has HbAA, no amount of deoxygenation produces polymerisation \u2014 the critical valine is simply absent.",
      "NEGATIVE RESULT: All RBCs remain as normal biconcave discs with smooth contours and central pallor throughout the observation period (30 minutes and 24 hours). No crescents, holly-leaf, elongated, or oat-shaped forms are seen. The cells may appear slightly olive-green/grey rather than pink because this is an unstained wet preparation viewed under reduced light.",
      "PROCEDURE: (1) Place 1 drop of fresh EDTA-anticoagulated blood on a clean glass slide, (2) add 1 drop of freshly prepared 2% Na\u2082S\u2082O\u2085 solution, (3) mix gently with a wooden applicator stick, (4) cover with a clean coverslip, (5) seal ALL four edges completely with petroleum jelly or clear nail varnish to create an airtight seal preventing re-oxygenation, (6) incubate at room temperature, (7) examine under 40x objective at 30 minutes and again at 24 hours.",
      "QUALITY CONTROL: A known positive control (HbAS or HbSS blood) and a known negative control (HbAA blood) MUST be run with every batch of tests. The Na\u2082S\u2082O\u2085 reagent must be prepared fresh daily because it oxidises rapidly on exposure to air and loses its reducing capacity. A negative result without a demonstrated working positive control is technically INVALID and must be repeated.",
      "FALSE NEGATIVES: A negative sickling test can be falsely reassuring in several scenarios: (1) expired or degraded reagent that has lost reducing potency, (2) inadequate coverslip sealing allowing atmospheric oxygen to enter and prevent deoxygenation, (3) reading too early before sufficient deoxygenation has occurred, (4) recent blood transfusion diluting HbS below the detection threshold, (5) infants under 6 months whose high HbF (\u03b12\u03b32) inhibits HbS polymerisation by not co-polymerising with HbS fibres, (6) very low HbS concentrations in some compound heterozygotes.",
      "LIMITATION \u2014 CANNOT DISTINGUISH TRAIT FROM DISEASE: The sickling test is a qualitative screening test that detects the presence or absence of HbS. It CANNOT differentiate HbAS (sickle cell trait, ~40% HbS) from HbSS (sickle cell disease, ~80-90% HbS), nor can it identify compound heterozygotes like HbSC or HbS\u03b2-thalassaemia. Haemoglobin electrophoresis (cellulose acetate at pH 8.6, citrate agar at pH 6.2) or HPLC is required for definitive genotype diagnosis.",
      "REVERSIBILITY: In patients who DO carry HbS, early sickling is reversible \u2014 re-oxygenation breaks the HbS polymer fibres and cells return to their normal biconcave shape. However, repeated cycles of sickling and unsickling progressively damage the RBC membrane skeleton (spectrin-actin network), producing irreversibly sickled cells (ISCs) that remain deformed even when fully oxygenated. In HbAA individuals, this process never occurs because polymerisation cannot initiate.",
      "GHANA CONTEXT: Ghana has one of the highest sickle cell burdens in West Africa \u2014 approximately 25% of the population carries the HbAS trait and roughly 2% of all newborns are born with SCD (HbSS, HbSC, or HbS\u03b2-thal). Sickling test is a mandatory pre-operative screening test in most Ghanaian hospitals. The National Newborn Screening Programme, launched in 2010 at selected sites, uses isoelectric focusing or HPLC for early detection, but the sickling test remains a widely used point-of-care tool in district hospitals and clinics.",
      "WHAT A NEGATIVE RESULT EXCLUDES AND DOES NOT EXCLUDE: A negative sickling test excludes HbS-containing genotypes (HbAS, HbSS, HbSC, HbS\u03b2-thal) but does NOT exclude other clinically important haemoglobinopathies. HbCC disease, HbC trait, HbD, HbE, \u03b1-thalassaemia, and \u03b2-thalassaemia trait will all give negative sickling tests. Therefore, a negative sickling test should not be interpreted as 'no haemoglobinopathy' \u2014 it means only 'no HbS detected.'",
      "CLINICAL SIGNIFICANCE FOR THIS PATIENT: With confirmed HbAA genotype, this patient can safely undergo surgery under general anaesthesia without sickle cell precautions. There is no risk of perioperative sickling crisis, no need for pre-operative exchange transfusion, and no requirement for specific oxygenation protocols related to SCD. However, standard pre-operative haematological assessment (FBC, coagulation screen) remains necessary."
    ],
    "fields": [],
    "sicklingConfig": {
      "sicklingRate": 0,
      "fields": [{ "seed": 40001 }, { "seed": 40002 }, { "seed": 40003 }]
    },
    "source": "SVG-generated sickling test simulation",
    "license": "Educational use"
  },
  {
    "id": "sickling-crescent",
    "title": "Sickling Test \u2014 Crescent / Drepanocyte",
    "discipline": "hematology",
    "category": "Sickling Test",
    "clinicalHistory": "Pre-marital screening. 22-year-old female, Komfo Anokye Teaching Hospital, Kumasi. Partner is known HbAS. Sickling test positive \u2014 predominantly crescent (sickle) forms observed. Electrophoresis pending.",
    "labData": "Sickling Test:\nReducing agent: 2% Na\u2082S\u2082O\u2085\nReading: 30 minutes\nResult: POSITIVE\nPredominant form: Crescent/sickle (drepanocyte)\nSickling rate: ~40%\n\nWet preparation \u2014 unstained",
    "teachingPoints": [
      "GENETICS: The crescent/drepanocyte is the hallmark morphology of sickle cell and arises from a single nucleotide mutation (GAG\u2192GTG) in the \u03b2-globin gene on chromosome 11p15.5, causing a glutamic acid\u2192valine substitution at position 6 (HbS: \u03b26Glu\u2192Val). This seemingly minor amino acid change \u2014 replacing a charged, hydrophilic surface residue with a hydrophobic one \u2014 is sufficient to cause catastrophic polymerisation under deoxygenation.",
      "MOLECULAR MECHANISM: In the deoxygenated T-state, the \u03b26 valine on one HbS tetramer docks into a hydrophobic acceptor pocket (Phe85/Leu88) on an adjacent HbS \u03b21 chain. This lateral contact propagates into long, rigid, multi-stranded polymer fibres (tactoids) that align parallel to the long axis of the RBC. The mechanical force of these growing fibres pushes against the lipid bilayer and spectrin-actin cytoskeleton, stretching the cell into the classic crescent/sickle shape with pointed ends.",
      "CRESCENT (DREPANOCYTE) MORPHOLOGY: The crescent or drepanocyte is the most commonly recognised and most frequently encountered sickle form. It presents as an elongated, curved cell with two distinctly pointed ends, resembling a crescent moon. The cell body appears uniformly dense due to HbS polymer fibres spanning the full length of the cell. This shape reflects complete or near-complete intracellular polymerisation with fibres oriented along a single axis.",
      "WHY Na\u2082S\u2082O\u2085 WORKS: Sodium metabisulphite is a potent reducing agent that rapidly consumes dissolved O\u2082 in the sealed preparation, shifting haemoglobin into the deoxy-T conformation. This exposes the \u03b26 valine for intermolecular contact and triggers polymerisation. In vivo, the same process occurs in the microcirculation where pO\u2082 drops below 40 mmHg \u2014 particularly in the spleen, renal medulla, and retina. The sealed coverslip prevents atmospheric oxygen from re-entering, sustaining the deoxygenated environment.",
      "PROCEDURE: (1) Place 1 drop of fresh EDTA blood on a clean glass slide, (2) add 1 drop of freshly prepared 2% Na\u2082S\u2082O\u2085, (3) mix gently, (4) apply coverslip, (5) seal ALL edges with petroleum jelly or clear nail varnish to create an airtight chamber, (6) incubate at room temperature, (7) examine under 40x at 30 minutes and again at 24 hours. Cells appear olive-green/grey in this unstained wet preparation, not the pink of Romanowsky-stained films.",
      "REVERSIBILITY: Early crescent formation is reversible \u2014 if oxygen is reintroduced (e.g., a seal breaks), the HbS polymers disassemble and the cell returns to its normal biconcave shape within minutes. However, with each sickling-unsickling cycle, the membrane cytoskeleton sustains cumulative damage: loss of membrane lipid, oxidative cross-linking of spectrin, and calcium influx activating the Gardos channel. After sufficient damage, the cell becomes an irreversibly sickled cell (ISC) that retains the deformed shape permanently regardless of oxygenation.",
      "QUALITY CONTROL: A known positive control (HbAS or HbSS blood) and a known negative control (HbAA blood) must be run with every batch. The Na\u2082S\u2082O\u2085 reagent must be prepared fresh daily \u2014 it auto-oxidises to sodium sulphate on air exposure and rapidly loses reducing capacity. A positive result without a working negative control, or vice versa, renders the batch unreliable.",
      "LIMITATION \u2014 TRAIT vs DISEASE: The sickling test CANNOT distinguish HbAS (trait, ~35-40% HbS) from HbSS (disease, ~80-90% HbS). Both genotypes produce crescents under reducing conditions. Nor can it identify HbSC or HbS\u03b2-thalassaemia compound heterozygotes. Definitive diagnosis requires haemoglobin electrophoresis (cellulose acetate pH 8.6, citrate agar pH 6.2) or HPLC. This distinction is clinically critical because HbAS carriers are generally asymptomatic while HbSS patients have severe, life-threatening disease.",
      "GHANA CONTEXT: Approximately 25% of the Ghanaian population carries HbAS trait, and roughly 2% of newborns are born with sickle cell disease. When both partners are HbAS (as in this pre-marital screening scenario), each pregnancy carries a 25% chance of an HbSS child, 50% chance of HbAS, and 25% chance of HbAA. Pre-marital and pre-conception screening with haemoglobin electrophoresis is now strongly promoted by the Ghana Health Service and the National Newborn Screening Programme.",
      "WHY CRESCENTS PREDOMINATE: The crescent is the most common sickle morphology because it reflects the most energetically favourable polymer alignment \u2014 a single dominant fibre bundle running the length of the cell, bending the membrane symmetrically. Other forms (holly-leaf, elongated, oat) represent different degrees of polymerisation, different numbers of independent fibre domains, or different stages of the time-dependent sickling process.",
      "THIS FINDING REQUIRES URGENT FOLLOW-UP: A positive sickling test showing crescents demands immediate haemoglobin electrophoresis or HPLC to determine the exact genotype. In this pre-marital context, both partners' genotypes must be established before reproductive counselling can proceed. If both are confirmed HbAS, genetic counselling should include discussion of prenatal diagnosis options, the natural history of SCD, and the availability of comprehensive care programmes in Ghana."
    ],
    "fields": [],
    "sicklingConfig": { "sicklingRate": 0.4, "fields": [{ "seed": 40101 }, { "seed": 40102 }, { "seed": 40103 }] },
    "source": "SVG-generated sickling test simulation",
    "license": "Educational use"
  },
  {
    "id": "sickling-holly-leaf",
    "title": "Sickling Test \u2014 Holly Leaf Cells",
    "discipline": "hematology",
    "category": "Sickling Test",
    "clinicalHistory": "Newborn screening follow-up. 8-month-old infant, Princess Marie Louise Children\u2019s Hospital, Accra. Initial screening showed HbFS pattern. Sickling test at 8 months shows holly-leaf variant cells under reducing agent.",
    "labData": "Sickling Test:\nReducing agent: 2% Na\u2082S\u2082O\u2085\nReading: 30 minutes\nResult: POSITIVE\nPredominant form: Holly leaf (irregular spiky)\nSickling rate: ~35%\n\nWet preparation \u2014 unstained\nHb electrophoresis: HbS 78%, HbF 18%, HbA\u2082 3%",
    "teachingPoints": [
      "GENETICS: This infant carries the HbFS pattern, meaning they are homozygous for the sickle mutation (GAG\u2192GTG) in the \u03b2-globin gene on chromosome 11p15.5, producing \u03b26Glu\u2192Val (HbS). The 'F' represents foetal haemoglobin (HbF, \u03b12\u03b32), which is still present at significant levels at 8 months of age. By 6-12 months, HbF gradually declines as the \u03b3-globin genes are silenced and \u03b2-globin expression predominates, allowing HbS to rise and clinical disease to manifest.",
      "MOLECULAR MECHANISM: When deoxygenated, the \u03b26 valine on HbS fits into the hydrophobic pocket (Phe85/Leu88) on the \u03b21 chain of an adjacent HbS tetramer, nucleating polymer fibre formation. However, HbF (\u03b12\u03b32) CANNOT co-polymerise with HbS because the \u03b3-globin chain lacks the complementary hydrophobic acceptor pocket. HbF tetramers act as polymer chain terminators \u2014 when incorporated into a growing fibre, they block further elongation. This is why higher HbF levels produce partial, irregular polymerisation rather than complete, aligned fibre bundles.",
      "HOLLY LEAF MORPHOLOGY: The holly leaf cell has multiple irregular spiky projections radiating outward from the cell body in different directions, resembling a holly leaf. Unlike the crescent (which has a single dominant polymer axis), the holly leaf reflects MULTIPLE short, independently nucleated polymer domains growing in different directions within the same cell. Each domain distorts the membrane locally, producing the characteristic multi-pointed, irregular silhouette.",
      "WHY HOLLY LEAF IN THIS INFANT: At 8 months with HbF 18%, there is enough HbF to partially inhibit polymerisation but not enough to prevent it entirely. The HbF tetramers interspersed among HbS tetramers terminate polymer growth prematurely, preventing the formation of long, aligned fibre bundles. The result is multiple short polymer segments growing in different orientations, producing the irregular holly-leaf distortion rather than a clean crescent. This same morphology is seen in older patients on hydroxyurea therapy, which pharmacologically reactivates HbF production.",
      "WHY Na\u2082S\u2082O\u2085 WORKS: Sodium metabisulphite consumes dissolved oxygen in the sealed preparation, forcing haemoglobin into the deoxy-T state where the \u03b26 valine becomes exposed and available for polymerisation. In vivo, this deoxygenation occurs naturally in capillary beds (pO\u2082 < 40 mmHg), which is why even infants with residual HbF can begin to experience vaso-occlusive events as HbF levels decline during the first year of life.",
      "PROCEDURE: (1) Place 1 drop fresh EDTA blood on a clean slide, (2) add 1 drop freshly prepared 2% Na\u2082S\u2082O\u2085, (3) mix gently, (4) cover with coverslip, (5) seal ALL edges with petroleum jelly or nail varnish to prevent air entry and re-oxygenation, (6) incubate at room temperature, (7) examine under 40x at 30 minutes and again at 24 hours. Cells appear olive-green/grey in this unstained wet preparation.",
      "QUALITY CONTROL: Known positive (HbAS or HbSS) and known negative (HbAA) controls must be run with every batch. Na\u2082S\u2082O\u2085 must be freshly prepared daily as it auto-oxidises to inactive sodium sulphate on air exposure. In infants under 6 months, the sickling test may be FALSE NEGATIVE due to high HbF levels inhibiting detectable polymerisation \u2014 this is why neonatal diagnosis relies on electrophoresis or HPLC, not the sickling test.",
      "LIMITATION \u2014 TRAIT vs DISEASE: The sickling test cannot distinguish HbAS from HbSS, HbSC, or HbS\u03b2-thalassaemia. This infant's HbFS pattern on electrophoresis (HbS 78%, HbF 18%) confirms HbSS disease. By contrast, an HbAS infant at this age would show approximately HbA 55-60%, HbS 30-35%, HbF 5-10%. Electrophoresis or HPLC provides the definitive genotype.",
      "GHANA CONTEXT: Ghana's National Newborn Screening Programme (NNSP), launched at selected sites including Korle Bu, Komfo Anokye, and Tamale Teaching Hospitals, uses isoelectric focusing (IEF) or HPLC on dried blood spots collected at birth. This infant was identified at birth with an HbFS pattern. Approximately 2% of Ghanaian newborns are born with SCD. Early identification before 3 months enables enrolment in comprehensive care programmes, which have reduced under-5 mortality from SCD by over 70% in screened populations.",
      "REVERSIBILITY AND IRREVERSIBILITY: At this early age and HbF level, most holly-leaf sickling is still REVERSIBLE \u2014 re-oxygenation dissociates the short polymer segments and cells return to normal shape. As HbF declines over the coming months, sickling episodes will become more severe with longer polymer fibres, and the cumulative membrane damage from repeated sickling-unsickling cycles will eventually produce irreversibly sickled cells (ISCs) with permanently damaged spectrin-actin cytoskeletons.",
      "CLINICAL MANAGEMENT FOR THIS INFANT: Confirmed HbSS at 8 months requires: (1) daily oral penicillin V prophylaxis (125 mg twice daily, increasing to 250 mg at age 3) to prevent fatal pneumococcal sepsis, (2) completed pneumococcal conjugate vaccine series plus 23-valent polysaccharide booster, (3) folic acid supplementation, (4) parental education on splenic sequestration crisis recognition (sudden pallor, abdominal distension, lethargy), (5) fever management protocol (\u226538.5\u00b0C = immediate hospital assessment), and (6) consideration of hydroxyurea initiation from age 9-12 months per recent WHO and NHLBI guidelines.",
      "HOLLY LEAF CELLS IN THE BROADER SICKLING SPECTRUM: Holly leaf forms often coexist with crescents and elongated forms in the same preparation. The specific morphology a given cell assumes depends on its individual HbS:HbF ratio, the local polymer nucleation kinetics, and the degree of deoxygenation achieved at that point in the incubation. As incubation progresses to 24 hours and deoxygenation becomes more complete, some holly-leaf cells may convert to crescents as polymer domains merge and align."
    ],
    "fields": [],
    "sicklingConfig": { "sicklingRate": 0.35, "fields": [{ "seed": 40201 }, { "seed": 40202 }, { "seed": 40203 }] },
    "source": "SVG-generated sickling test simulation",
    "license": "Educational use"
  },
  {
    "id": "sickling-elongated",
    "title": "Sickling Test \u2014 Elongated / Boat Cells",
    "discipline": "hematology",
    "category": "Sickling Test",
    "clinicalHistory": "Employment medical. 30-year-old male applying for mining job in Tarkwa, Western Region. Employer requires sickling test. Patient reports no symptoms. Sickling test shows elongated/boat-shaped cells.",
    "labData": "Sickling Test:\nReducing agent: 2% Na\u2082S\u2082O\u2085\nReading: 30 minutes\nResult: POSITIVE\nPredominant form: Elongated/boat cells\nSickling rate: ~30%\n\nWet preparation \u2014 unstained\nHb electrophoresis: PENDING",
    "teachingPoints": [
      "GENETICS: Sickle cell disease originates from a single nucleotide mutation (GAG\u2192GTG) in the \u03b2-globin gene on chromosome 11p15.5, resulting in a glutamic acid\u2192valine substitution at position 6 (HbS: \u03b26Glu\u2192Val). This substitution places a hydrophobic valine residue on the surface of the haemoglobin molecule where a charged, hydrophilic glutamate normally sits \u2014 this seemingly small change is the root cause of the entire sickling phenomenon observed in this test.",
      "MOLECULAR MECHANISM: In the deoxygenated T-state, the exposed \u03b26 valine on one HbS tetramer engages a complementary hydrophobic pocket (Phe85/Leu88) on the \u03b21 chain of a neighbouring HbS tetramer. This nucleates polymer formation. The elongated/boat shape represents the EARLIEST stage of this polymerisation process \u2014 a small number of short polymer fibres have begun to form but have not yet grown long enough or aligned sufficiently to produce the full crescent distortion. The cell is being stretched along one axis but retains some of its original width.",
      "ELONGATED/BOAT MORPHOLOGY: The elongated or boat-shaped cell is stretched into a widened oval with blunted (not sharply pointed) ends, resembling a canoe or boat. It is distinctly wider than a crescent and lacks pointed tips. This shape reflects early polymerisation where HbS fibres are beginning to align along the long axis of the cell but polymer density is insufficient to fully compress the cell into a thin crescent. It represents a transient, intermediate state in the time-dependent sickling process.",
      "TIME-DEPENDENT PROGRESSION: Sickling is a kinetic process. The delay time for polymer nucleation depends on HbS concentration, degree of deoxygenation, temperature, pH, and 2,3-DPG levels. At the 30-minute reading, elongated/boat cells predominate because polymerisation is still in its early phase. By 24 hours, further deoxygenation and continued polymer growth typically convert many elongated cells into full crescents as fibres lengthen, align, and compress the cell further. This time-course is why reading at BOTH 30 minutes and 24 hours is essential.",
      "WHY Na\u2082S\u2082O\u2085 WORKS: Sodium metabisulphite is a reducing agent that scavenges dissolved oxygen from the sealed preparation, driving haemoglobin into the deoxy-T conformation. This conformational change exposes the \u03b26 valine for intermolecular contact and initiates polymerisation. The rate of deoxygenation by Na\u2082S\u2082O\u2085 is gradual, which is why early readings often show intermediate forms (elongated/boat) rather than fully formed crescents. In vivo, rapid deoxygenation in capillary beds can produce faster sickling.",
      "PROCEDURE: (1) Place 1 drop fresh EDTA blood on a clean slide, (2) add 1 drop of freshly prepared 2% Na\u2082S\u2082O\u2085 (prepare fresh daily \u2014 the reagent auto-oxidises to inactive sodium sulphate on air exposure and loses reducing capacity within hours), (3) mix gently, (4) apply coverslip, (5) seal ALL four edges with petroleum jelly or clear nail varnish, (6) incubate at room temperature, (7) examine under 40x at 30 minutes and again at 24 hours. Cells appear olive-green/grey in this unstained wet preparation.",
      "QUALITY CONTROL: Known positive (HbAS or HbSS) and known negative (HbAA) controls must accompany every test batch. Fresh reagent preparation is especially critical for detecting early-stage sickling \u2014 degraded Na\u2082S\u2082O\u2085 produces insufficient deoxygenation and may fail to generate even elongated forms, leading to false negatives.",
      "LIMITATION \u2014 TRAIT vs DISEASE: The sickling test cannot differentiate HbAS (trait, generally asymptomatic) from HbSS (disease, severe clinical phenotype), HbSC, or HbS\u03b2-thalassaemia. Both HbAS and HbSS blood will produce elongated cells and crescents under reducing conditions. Haemoglobin electrophoresis or HPLC is mandatory for definitive genotyping. This distinction is especially important in an employment context where HbAS carriers can work without restriction while HbSS individuals may require specific occupational health accommodations.",
      "DISTINGUISHING FROM ARTEFACT: Elongated/boat cells must be differentiated from artefactually stretched or distorted cells caused by excessive spreading pressure during preparation, fibrin strands, or drying artefacts. True sickled elongated cells show consistent morphology across multiple cells in the field, have smooth membranes, and are distributed randomly rather than aligned in the direction of a smear. Artefactual distortion typically shows irregular edges, inconsistent shapes, and directional alignment.",
      "GHANA CONTEXT: Employment-related sickling screening is common in Ghana, particularly for physically demanding occupations such as mining (Tarkwa, Obuasi), military service, and offshore oil and gas work. Approximately 25% of the Ghanaian population carries HbAS trait. A positive sickling test does NOT disqualify from employment \u2014 HbAS carriers can work normally with adequate hydration. However, HbSS individuals may need workplace accommodations including guaranteed access to oral fluids, avoidance of prolonged high-altitude or low-oxygen environments, and temperature-controlled rest areas. The Minerals Commission and Ghana Armed Forces both require pre-employment haemoglobin genotype testing.",
      "REVERSIBILITY: Elongated/boat cells represent early, fully REVERSIBLE sickling. If the seal is broken and oxygen re-enters the preparation, these cells will return to their normal biconcave shape within minutes as the short polymer fibres disassemble. This reversibility underscores why proper sealing technique is critical \u2014 any air leak during incubation will reverse the sickling process and produce a false-negative result. In vivo, HbAS carriers experience transient sickling only under extreme conditions (severe dehydration, high altitude, strenuous exercise), while HbSS patients sickle at physiological oxygen tensions.",
      "THIS PATIENT REQUIRES DEFINITIVE GENOTYPING: The presence of elongated cells confirms HbS is present, but the critical question for employment clearance is whether this patient is HbAS (trait \u2014 medically fit for mining work) or HbSS (disease \u2014 requires occupational health assessment and possible workplace modifications). Urgent haemoglobin electrophoresis or HPLC must be completed before any employment decision is finalised."
    ],
    "fields": [],
    "sicklingConfig": { "sicklingRate": 0.3, "fields": [{ "seed": 40301 }, { "seed": 40302 }, { "seed": 40303 }] },
    "source": "SVG-generated sickling test simulation",
    "license": "Educational use"
  },
  {
    "id": "sickling-oat",
    "title": "Sickling Test \u2014 Oat / Filament Cells (Severe)",
    "discipline": "hematology",
    "category": "Sickling Test",
    "clinicalHistory": "Emergency admission. 16-year-old female, known HbSS, Tamale Teaching Hospital. Vaso-occlusive crisis with acute chest syndrome. Sickling test performed on admission shows oat/filament cells indicating severe irreversible sickling.",
    "labData": "Sickling Test:\nReducing agent: 2% Na\u2082S\u2082O\u2085\nReading: 30 minutes\nResult: STRONGLY POSITIVE\nPredominant form: Oat/filament cells (irreversible)\nSickling rate: ~65%\n\nWet preparation \u2014 unstained\nHb electrophoresis (known): HbS 82%, HbF 10%, HbA 0%\n\nFBC:\nHb: 5.8 g/dL (crisis level)\nReticulocytes: 22%",
    "teachingPoints": [
      "GENETICS: This patient is homozygous for the sickle mutation (GAG\u2192GTG) in the \u03b2-globin gene on chromosome 11p15.5, producing HbS (\u03b26Glu\u2192Val) at 82% of total haemoglobin. The \u03b26 valine \u2014 a hydrophobic residue placed on the surface where a hydrophilic glutamate normally sits \u2014 is responsible for all the polymerisation, membrane damage, and vaso-occlusion that defines this disease. With only 10% HbF and 0% HbA, there is minimal inhibition of polymer formation.",
      "MOLECULAR MECHANISM \u2014 WHY OAT/FILAMENT CELLS FORM: The oat/filament shape represents the most extreme degree of HbS polymerisation. In the deoxygenated T-state, \u03b26 valine docks into the hydrophobic pocket (Phe85/Leu88) on adjacent HbS \u03b21 chains, nucleating polymer fibres. In oat cells, these polymer bundles are maximally dense and tightly aligned along a single axis, compressing the cell into a very thin, rigid filament. The polymer fibres are so densely packed that they completely dominate the cell's internal architecture, leaving virtually no space for free haemoglobin solution.",
      "OAT/FILAMENT MORPHOLOGY: The oat cell is extremely thin, elongated, and filamentous \u2014 narrower than a crescent and often appearing as a thread-like structure with tapered ends. In the unstained wet preparation, oat cells appear as thin olive-green filaments that are distinctly thinner than crescents. The extreme thinness reflects maximum polymer packing \u2014 the more complete the polymerisation, the more rigid and compressed the cell becomes. This is the morphological endpoint of the sickling spectrum: normal disc \u2192 elongated/boat \u2192 crescent \u2192 oat/filament.",
      "IRREVERSIBLY SICKLED CELLS (ISCs): Oat/filament cells are frequently irreversibly sickled cells (ISCs) \u2014 they maintain their deformed shape even when fully re-oxygenated because the RBC membrane has been permanently damaged. The mechanism of irreversibility involves: (1) oxidative cross-linking and aggregation of spectrin in the membrane skeleton, (2) loss of membrane phospholipid asymmetry with phosphatidylserine exposure on the outer leaflet, (3) persistent calcium influx through the Gardos channel (calcium-activated potassium channel) causing cellular dehydration, and (4) loss of membrane surface area through vesiculation. These cumulative insults from repeated sickling-unsickling cycles render the cytoskeleton rigid and non-deformable.",
      "WHY Na\u2082S\u2082O\u2085 WORKS: Sodium metabisulphite scavenges dissolved O\u2082 from the sealed preparation, forcing HbS into the deoxy-T state where the \u03b26 valine becomes exposed for polymerisation. However, in severe HbSS disease like this case, ISCs are already present in the native blood BEFORE the reducing agent is added \u2014 they can be seen on a standard Wright-Giemsa peripheral blood film without any deoxygenation. The Na\u2082S\u2082O\u2085 merely increases the proportion of sickled cells by inducing reversible sickling in those cells that are not yet irreversibly damaged.",
      "PROCEDURE: (1) Place 1 drop fresh EDTA blood on a clean slide, (2) add 1 drop freshly prepared 2% Na\u2082S\u2082O\u2085, (3) mix gently, (4) coverslip, (5) seal ALL edges with petroleum jelly, (6) incubate at room temperature, (7) read under 40x at 30 minutes and 24 hours. With HbSS and 82% HbS, sickling is rapid and extensive \u2014 the 30-minute reading already shows a sickling rate of ~65%, which is much higher than typically seen in HbAS trait at the same time point.",
      "QUALITY CONTROL: Known positive and negative controls must accompany every test. However, in an emergency admission like this, the clinical picture (known HbSS, vaso-occlusive crisis, Hb 5.8 g/dL) is already diagnostic \u2014 the sickling test serves to confirm and document rather than to screen. Na\u2082S\u2082O\u2085 must still be freshly prepared for valid results.",
      "PROGNOSTIC SIGNIFICANCE: A high proportion of oat/filament cells and ISCs on the sickling test or peripheral film correlates with: (1) more frequent vaso-occlusive crises, (2) higher baseline haemolysis (elevated LDH, indirect bilirubin, reticulocytes), (3) progressive organ damage (renal, splenic, hepatic), and (4) overall disease severity. ISC percentage is used as a marker of chronic disease burden and can be tracked to monitor response to disease-modifying therapy such as hydroxyurea.",
      "LIMITATION \u2014 TRAIT vs DISEASE: While the heavy sickling rate in this case strongly suggests HbSS rather than HbAS, the sickling test formally cannot make this distinction. However, the combination of a sickling rate >50% at 30 minutes, visible ISCs, and the clinical context (known HbSS, recurrent crises) makes the genotype clinically obvious. Electrophoresis confirms: HbS 82%, HbF 10%, HbA 0%.",
      "CLINICAL CONTEXT \u2014 ACUTE CHEST SYNDROME: This patient is in the most dangerous acute complication of SCD. Acute chest syndrome (ACS) is defined by a new pulmonary infiltrate on chest X-ray with at least one of: fever, cough, chest pain, tachypnoea, or hypoxia. It is caused by a combination of pulmonary vaso-occlusion by sickled cells, fat embolism from bone marrow infarction, and secondary infection. Management requires: supplemental O\u2082 to maintain SpO\u2082 >95% (reducing further sickling), exchange transfusion to reduce HbS percentage below 30% and raise Hb to 10 g/dL, empiric broad-spectrum antibiotics (including atypical coverage), bronchodilators, incentive spirometry, and adequate analgesia.",
      "GHANA CONTEXT AND MANAGEMENT: SCD affects approximately 2% of Ghanaian newborns (~15,000/year). Hydroxyurea is the cornerstone disease-modifying therapy \u2014 it increases HbF production by reactivating \u03b3-globin gene expression, which inhibits HbS polymerisation (HbF tetramers terminate polymer fibres). Over months, hydroxyurea reduces ISC proportion, decreases crisis frequency by 40-50%, and lowers mortality. The Ghana National SCD Registry tracks clinical outcomes and promotes hydroxyurea uptake. Chronic transfusion programmes (targeting HbS <30%) are available at major teaching hospitals (Korle Bu, KATH, TTH) for patients with recurrent ACS, stroke, or severe phenotype.",
      "REVERSIBILITY SPECTRUM: Unlike crescents and elongated cells, which are generally reversible with re-oxygenation, true oat/filament ISCs are PERMANENTLY deformed. Their membranes cannot return to normal because the spectrin cytoskeleton is irreversibly cross-linked and the cell has lost critical membrane components. These cells are removed from circulation by the spleen (and liver in autosplenectomised patients) and have a markedly shortened lifespan of 6-12 days (vs. normal 120 days). The chronic haemolysis of ISCs contributes to the baseline anaemia, jaundice, and cholelithiasis seen in SCD."
    ],
    "fields": [],
    "sicklingConfig": { "sicklingRate": 0.65, "fields": [{ "seed": 40401 }, { "seed": 40402 }, { "seed": 40403 }] },
    "source": "SVG-generated sickling test simulation",
    "license": "Educational use"
  },
  {
    "id": "sickling-mixed",
    "title": "Sickling Test \u2014 Mixed Variants",
    "discipline": "hematology",
    "category": "Sickling Test",
    "clinicalHistory": "Antenatal booking. 28-year-old pregnant woman (12 weeks), Ridge Hospital, Accra. Routine sickling test shows mixed sickle cell variants \u2014 crescents, holly-leaf, and elongated forms all visible.",
    "labData": "Sickling Test:\nReducing agent: 2% Na\u2082S\u2082O\u2085\nReading: 30 minutes\nResult: POSITIVE\nForms: Mixed \u2014 crescents, holly-leaf, elongated\nSickling rate: ~45%\n\nWet preparation \u2014 unstained\nHb electrophoresis: URGENT \u2014 requested\n\nAntenatal FBC:\nHb: 10.2 g/dL\nMCV: 78 fL",
    "teachingPoints": [
      "GENETICS: The sickle mutation is a single nucleotide change (GAG\u2192GTG) in the \u03b2-globin gene on chromosome 11p15.5, resulting in a glutamic acid\u2192valine substitution at position 6 (HbS: \u03b26Glu\u2192Val). This places a hydrophobic valine on the molecular surface where a charged, hydrophilic glutamate normally resides. Inheritance is autosomal recessive: HbAS carriers (one mutant allele) are generally asymptomatic, while HbSS homozygotes (two mutant alleles) have severe disease. This patient's genotype is pending \u2014 the mixed morphology alone cannot determine it.",
      "MOLECULAR MECHANISM: When HbS is deoxygenated (T-state), the \u03b26 valine on one HbS tetramer inserts into a hydrophobic acceptor pocket (Phe85/Leu88) on the \u03b21 chain of an adjacent tetramer. This nucleates the formation of long, rigid, multi-stranded polymer fibres (tactoids) that distort the RBC membrane. The DEGREE and PATTERN of polymerisation within each individual cell determines its specific morphology \u2014 which is why multiple sickle forms coexist in the same preparation.",
      "WHY MULTIPLE FORMS COEXIST: Not all RBCs in a blood sample have identical HbS concentration, identical MCHC, or identical HbF content. Cells with higher HbS concentration and lower HbF polymerise more rapidly and completely, forming crescents or oat cells. Cells with relatively more HbF (which terminates polymer fibres by failing to co-polymerise) produce holly-leaf forms with multiple short, irregularly oriented polymer domains. Cells just beginning to polymerise show elongated/boat shapes. Additionally, 2,3-DPG concentration, intracellular pH, and hydration state vary between individual RBCs, all of which influence the nucleation delay time and extent of polymer growth.",
      "WHY Na\u2082S\u2082O\u2085 WORKS: Sodium metabisulphite is a reducing agent that scavenges dissolved oxygen from the sealed preparation, progressively shifting haemoglobin from the oxy-R state to the deoxy-T state. The T-state exposes the \u03b26 valine for intermolecular contact. Because deoxygenation progresses gradually across the preparation, cells at different locations and with different HbS concentrations reach the polymerisation threshold at different times, contributing to the morphological heterogeneity. In vivo, this same variability occurs as blood traverses microvascular beds with varying pO\u2082 levels.",
      "PROCEDURE: (1) Place 1 drop fresh EDTA blood on a clean slide, (2) add 1 drop freshly prepared 2% Na\u2082S\u2082O\u2085, (3) mix gently, (4) apply coverslip, (5) seal ALL four edges with petroleum jelly or nail varnish, (6) incubate at room temperature, (7) examine under 40x at 30 minutes and again at 24 hours. Cells appear olive-green/grey in this unstained wet preparation. Mixed forms at 30 minutes actually CONFIRM the test is functioning correctly \u2014 a preparation showing only a single morphology would be unusual and might suggest artefact.",
      "QUALITY CONTROL: Known positive (HbAS or HbSS) and known negative (HbAA) controls must accompany every batch. Na\u2082S\u2082O\u2085 must be freshly prepared daily. A negative result without a working positive control is invalid. For antenatal screening, the clinical consequences of a false negative (missing SCD in a pregnant woman) are severe, making QC compliance essential.",
      "LIMITATION \u2014 TRAIT vs DISEASE: The sickling test cannot distinguish HbAS (trait, ~35-40% HbS) from HbSS (disease, ~80-90% HbS), HbSC (compound heterozygote), or HbS\u03b2-thalassaemia. All of these genotypes will produce positive sickling tests with mixed morphologies. Haemoglobin electrophoresis or HPLC is mandatory for definitive genotyping. In the antenatal setting, this distinction is URGENT because it determines whether the pregnancy is managed as high-risk (HbSS/HbSC) or routine with genetic counselling (HbAS).",
      "REVERSIBILITY: At the 30-minute reading, most sickled cells in a mixed preparation are still REVERSIBLE \u2014 breaking the seal and allowing re-oxygenation will cause the polymer fibres to disassemble and cells to return to normal biconcave shape. At the 24-hour reading, more complete deoxygenation produces a shift in the morphological spectrum toward crescents and oat forms. Repeated in vivo sickling-unsickling cycles gradually damage the membrane cytoskeleton (spectrin cross-linking, lipid loss, calcium influx), eventually producing irreversibly sickled cells (ISCs).",
      "GHANA CONTEXT \u2014 ANTENATAL SCREENING: Sickling test is part of Ghana's routine antenatal care package alongside haemoglobin estimation, blood group and Rh typing, and screening for HIV, hepatitis B, and syphilis. With approximately 25% of the population carrying HbAS and ~2% of newborns born with SCD, antenatal screening identifies at-risk pregnancies and enables genetic counselling. The partner's sickling status and electrophoresis result must also be obtained. If both partners are HbAS, each pregnancy carries a 25% probability of HbSS, 50% HbAS, and 25% HbAA offspring (Mendelian autosomal recessive inheritance).",
      "CLINICAL IMPLICATIONS BY GENOTYPE: If this patient is HbSS: the pregnancy is high-risk requiring joint obstetric-haematology management with monthly clinic visits, serial haemoglobin monitoring (target Hb >7 g/dL), thromboprophylaxis, vigilance for vaso-occlusive crises, pre-eclampsia, and placental insufficiency, with delivery planned at a facility with blood bank and neonatal ICU. If HbAS: the pregnancy itself is not high-risk, but partner genotyping and genetic counselling are essential for informed reproductive decision-making.",
      "TIME-DEPENDENT MORPHOLOGICAL SHIFT: At 30 minutes, the preparation typically shows a mixture weighted toward elongated/boat forms and holly-leaf cells, with some crescents. By 24 hours, as deoxygenation becomes more complete, the spectrum shifts toward predominantly crescents with some oat/filament forms. The elongated and holly-leaf forms diminish as polymer fibres grow longer, merge, and align. Tracking this temporal shift confirms that the preparation is functioning correctly and deoxygenation is progressive.",
      "THE SPECTRUM OF POLYMERISATION: The coexistence of multiple sickle forms is a visual demonstration of HbS polymerisation as a continuous, probabilistic process rather than a binary event. Each cell sits somewhere on the spectrum from fully normal (no polymerisation) to fully sickled (maximum polymerisation), determined by its individual biochemical environment. Understanding this spectrum is essential for MLS students: sickling is not 'all-or-nothing' but rather a graded response that explains the clinical variability seen even among patients with the same genotype."
    ],
    "fields": [],
    "sicklingConfig": { "sicklingRate": 0.45, "fields": [{ "seed": 40501 }, { "seed": 40502 }, { "seed": 40503 }] },
    "source": "SVG-generated sickling test simulation",
    "license": "Educational use"
  }
];
