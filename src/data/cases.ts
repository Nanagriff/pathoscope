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
    "id": "heme-sickle",
    "title": "Sickle Cell Disease — Blood Film",
    "discipline": "hematology",
    "category": "RBC abnormalities",
    "clinicalHistory": "19-year-old male student from Cape Coast, Central Region, known HbSS sickle cell disease (diagnosed at newborn screening), presenting to Cape Coast Teaching Hospital with sudden onset of severe bilateral thigh and lower back pain for 18 hours, not relieved by oral tramadol. Reports mild fever and dark urine. He had a similar crisis 3 months ago triggered by a respiratory infection. Currently on hydroxyurea 15 mg/kg/day and folic acid 5 mg daily. Last transfusion: 4 months ago. Physical examination: distressed, febrile (39.2°C), HR 112, jaundiced sclerae, tender bilateral femora, spleen not palpable (likely auto-infarcted). No signs of acute chest syndrome.",
    "labData": "FBC:\nWBC: 18.4 × 10⁹/L (elevated — baseline for SCD ~12-15)\nNeutrophils: 12.9 × 10⁹/L (70%)\nLymphocytes: 3.7 × 10⁹/L (20%)\nMonocytes: 1.5 × 10⁹/L (8%)\n\nHb: 6.2 g/dL (below patient's steady-state of 7.8)\nMCV: 92 fL (elevated on hydroxyurea)\nReticulocytes: 18% (elevated — active haemolysis)\nPlatelets: 480 × 10⁹/L\n\nHaemolysis markers:\nTotal bilirubin: 4.8 mg/dL (elevated, mostly indirect)\nLDH: 620 U/L (elevated)\nHaptoglobin: <10 mg/dL (undetectable)\n\nHb electrophoresis (previous): HbS 82%, HbF 12%, HbA2 3.5%, HbA 0%\nBlood film: Sickle cells, target cells, polychromasia, Howell-Jolly bodies, nucleated RBCs\n\nBlood group: O Rh(D) positive\nAntibody screen: Negative\nCross-match: 2 units requested",
    "teachingPoints": [
      "Sickle cells (drepanocytes) are elongated, crescent-shaped or holly-leaf-shaped RBCs resulting from polymerisation of deoxygenated HbS — they are the pathognomonic finding on the blood film",
      "Target cells (codocytes) show a central dark area surrounded by a pale ring and dark outer rim — common in haemoglobinopathies, thalassaemia, liver disease, and post-splenectomy states",
      "Polychromasia (bluish-grey larger RBCs on Wright-Giemsa stain) indicates reticulocytes — reflecting compensatory erythropoiesis in response to chronic haemolysis",
      "Howell-Jolly bodies (small dark-purple nuclear remnants in RBCs) indicate functional hyposplenism or asplenia — in SCD, repeated splenic infarction leads to auto-splenectomy usually by age 5",
      "Nucleated red blood cells (NRBCs) may be seen in severe crises, indicating extreme erythropoietic stress — the marrow is releasing immature red cell precursors",
      "Ghana has one of the highest SCD burdens globally: approximately 2% of newborns have HbSS, and ~25-30% of the population carries the HbAS (sickle cell trait). The national newborn screening programme is critical for early diagnosis",
      "Hydroxyurea increases HbF production, which inhibits HbS polymerisation — it reduces crisis frequency, acute chest syndrome, and transfusion requirements. It is now standard of care in Ghana's SCD clinics",
      "Differential diagnosis of acute pain crisis: vaso-occlusive crisis (most common), acute chest syndrome (fever + new infiltrate + respiratory symptoms), osteomyelitis (Salmonella is a characteristic organism in SCD), and splenic sequestration (in younger children before auto-splenectomy)",
      "Transfusion considerations: SCD patients are at high risk of alloimmunisation — extended phenotype matching (Rh C, c, E, e and Kell) is recommended. In Ghana, limited availability of phenotyped blood remains a challenge",
      "Distinguish from HbSC disease: patients with HbSC often have milder anaemia, more prominent target cells, and characteristic HbC crystals on the blood film — Hb electrophoresis is essential for definitive diagnosis"
    ],
    "fields": [
      {
        "dziPath": "/slides/heme-sickle-001/heme-sickle-001.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/heme-sickle-002/heme-sickle-002.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/heme-sickle-003/heme-sickle-003.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/heme-sickle-004/heme-sickle-004.dzi",
        "annotations": []
      },
      {
        "dziPath": "/slides/heme-sickle-005/heme-sickle-005.dzi",
        "annotations": []
      }
    ],
    "svgConfig": {
      "stainType": "wright-giemsa",
      "parasitemia": 0,
      "fields": [
        { "seed": 20601 },
        { "seed": 20602 },
        { "seed": 20603 },
        { "seed": 20604 },
        { "seed": 20605 }
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
    "svgConfig": {
      "stainType": "wright-giemsa",
      "parasitemia": 0,
      "fields": [
        { "seed": 30001 },
        { "seed": 30002 },
        { "seed": 30003 },
        { "seed": 30004 },
        { "seed": 30005 },
        { "seed": 30006 },
        { "seed": 30007 },
        { "seed": 30008 },
        { "seed": 30009 },
        { "seed": 30010 }
      ]
    },
    "source": "SVG-generated Wright-Giemsa thin blood film simulation",
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
      "The banana or crescent shape of P. falciparum gametocytes is PATHOGNOMONIC — no other human Plasmodium species produces crescent-shaped gametocytes; all others (P. vivax, P. malariae, P. ovale) have round gametocytes",
      "Gametocytes are the sexual stage of the parasite — they are the only form infectious to the Anopheles mosquito vector. A single blood meal containing gametocytes can establish transmission",
      "P. falciparum gametocytes take 10-14 days to mature through stages I-V in the bone marrow before being released into peripheral blood — this is why they often appear AFTER treatment has cleared the asexual stages",
      "Gametocytes can persist in the blood for 3-6 weeks after successful ACT treatment of asexual parasites — during this window, the patient is clinically cured but remains a potential reservoir of transmission",
      "The HRP2-based RDT remains positive for up to 4 weeks after parasite clearance because the antigen persists in the bloodstream — a positive RDT after treatment does NOT necessarily indicate treatment failure. Microscopy is needed to distinguish persistent gametocytes from recrudescence",
      "Primaquine (single low dose of 0.25 mg/kg) is recommended by WHO as a gametocytocidal agent to reduce transmission, but it requires G6PD testing first due to risk of haemolytic anaemia — G6PD deficiency prevalence in Ghana is approximately 15-25%",
      "Macrogametocytes (female, larger, more compact pigment, darker blue cytoplasm) and microgametocytes (male, smaller, dispersed pigment, lighter pink cytoplasm) can sometimes be distinguished on well-stained films, though this distinction is not clinically essential",
      "Understanding gametocyte biology is critical for malaria elimination programmes in Ghana — community-level gametocyte carriage maintains transmission even when clinical cases are treated promptly",
      "Artemisinin-based combinations clear early gametocyte stages (I-III) but are less effective against mature stage V gametocytes — this contributes to ongoing transmission in high-burden areas",
      "In community surveillance and research settings, gametocyte density is reported per μL of blood and is used to assess transmission potential — molecular methods (QT-NASBA, RT-PCR) are more sensitive than microscopy for detecting submicroscopic gametocyte carriage"
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
  }
];
