import type { StainType } from "@/components/microscope/stainProfiles";
import type { MalariaSpecies, ParasiteStage } from "@/components/microscope/types";

export type QuestionType =
  | "identify-cell"
  | "identify-species"
  | "identify-stage"
  | "estimate-density"
  | "film-comment"
  | "identify-finding"
  | "true-false"
  | "wbc-differential"
  | "film-type";

export type Difficulty = "student" | "mls" | "specialist" | "consultant";

export interface ExamSlideConfig {
  seed: number;
  stainType: StainType;
  parasitemia: number;
  species?: MalariaSpecies;
  stage?: ParasiteStage;
  filmType?: "thin" | "thick";
}

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  slide: ExamSlideConfig;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  discipline: string;
  description: string;
  difficulty: Difficulty;
  timeLimit?: number;
  /** Full question bank — a random subset is drawn each attempt */
  questionBank: ExamQuestion[];
  /** How many questions to draw per attempt */
  questionsPerAttempt: number;
}

export interface ExamScore {
  id: string;
  examId: string;
  userName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpent: number;
  completedAt: string;
  answers: { questionId: string; answer: string; correct: boolean }[];
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; color: string; bg: string; desc: string }> = {
  student: { label: "Student", color: "text-emerald-400", bg: "bg-emerald-900/30", desc: "Basic detection and identification for MLS students" },
  mls: { label: "MLS", color: "text-amber-400", bg: "bg-amber-900/30", desc: "Professional competency \u2014 expected standard for practising MLS" },
  specialist: { label: "Specialist", color: "text-orange-400", bg: "bg-orange-900/30", desc: "Advanced \u2014 subtle parasites, artifacts, and diagnostic traps" },
  consultant: { label: "Consultant", color: "text-red-400", bg: "bg-red-900/30", desc: "WHO ECAMM standard competency assessment" },
};

/* ═══ Question Banks ═══ */

const Q: Record<string, ExamQuestion> = {
  // ── DETECTION (thick film) ──
  det_pos_high: { id: "det1", type: "identify-finding", slide: { seed: 90001, stainType: "giemsa", parasitemia: 0.08, species: "pf", stage: "ring", filmType: "thick" }, prompt: "THICK FILM: Positive or Negative?", options: ["Positive", "Negative"], correctAnswer: "Positive", explanation: "Positive. Multiple parasite chromatin dots visible among lysed cell debris.", points: 10 },
  det_neg_platelets: { id: "det2", type: "identify-finding", slide: { seed: 90002, stainType: "giemsa", parasitemia: 0, filmType: "thick" }, prompt: "THICK FILM: Positive or Negative?", options: ["Positive", "Negative"], correctAnswer: "Negative", explanation: "Negative. The dark structures are platelets and stain debris \u2014 NOT parasites. Platelets lack ring forms and are more refractile. This is the #1 cause of false positives.", points: 15 },
  det_pos_low: { id: "det3", type: "identify-finding", slide: { seed: 90003, stainType: "giemsa", parasitemia: 0.008, species: "pf", stage: "ring", filmType: "thick" }, prompt: "THICK FILM: Positive or Negative?", options: ["Positive", "Negative"], correctAnswer: "Positive", explanation: "Positive at very low density (~0.8%). Rare chromatin dots are present but sparse. Extended scanning required.", points: 15 },
  det_neg_clean: { id: "det4", type: "identify-finding", slide: { seed: 90004, stainType: "giemsa", parasitemia: 0, filmType: "thick" }, prompt: "THICK FILM: Positive or Negative?", options: ["Positive", "Negative"], correctAnswer: "Negative", explanation: "Negative. No parasites identified. Only WBCs, platelets, and lysed cell debris present.", points: 10 },
  det_pos_pv: { id: "det5", type: "identify-finding", slide: { seed: 90005, stainType: "giemsa", parasitemia: 0.04, species: "pv", stage: "ring", filmType: "thick" }, prompt: "THICK FILM: Positive or Negative?", options: ["Positive", "Negative"], correctAnswer: "Positive", explanation: "Positive. P. vivax parasites visible. Species identification requires thin film.", points: 10 },
  det_pos_verylow: { id: "det6", type: "identify-finding", slide: { seed: 90006, stainType: "giemsa", parasitemia: 0.003, species: "pf", stage: "ring", filmType: "thick" }, prompt: "THICK FILM: RDT positive (Pf HRP2). You\u2019ve scanned 80 fields \u2014 nothing seen. Next step?", options: ["Report negative", "Continue to 100+ fields", "Report RDT+, microscopy negative", "Request new sample"], correctAnswer: "Continue to 100+ fields", explanation: "WHO requires minimum 100 thick film fields (ideally 200) before reporting negative. At 80 fields you haven\u2019t met the standard, especially with a positive RDT.", points: 15 },
  det_neg_artifact: { id: "det7", type: "identify-finding", slide: { seed: 90007, stainType: "giemsa", parasitemia: 0, filmType: "thick" }, prompt: "THICK FILM: Positive or Negative?", options: ["Positive", "Negative"], correctAnswer: "Negative", explanation: "Negative. Stain precipitate and platelet clusters can mimic ring forms. Key: true parasites have consistent chromatin dots + cytoplasmic ring. These lack both.", points: 15 },
  det_pos_gam: { id: "det8", type: "identify-finding", slide: { seed: 90008, stainType: "giemsa", parasitemia: 0.04, species: "pf", stage: "gametocyte", filmType: "thick" }, prompt: "THICK FILM: Positive or Negative?", options: ["Positive", "Negative"], correctAnswer: "Positive", explanation: "Positive. Crescent-shaped gametocytes visible even on thick film. Pathognomonic for P. falciparum.", points: 10 },

  // ── FILM TYPE identification ──
  film_thick: { id: "ft1", type: "film-type", slide: { seed: 91001, stainType: "giemsa", parasitemia: 0.04, species: "pf", stage: "ring", filmType: "thick" }, prompt: "What type of blood film is this?", options: ["Thin film", "Thick film", "Buffy coat preparation", "Blood culture"], correctAnswer: "Thick film", explanation: "This is a thick film. Clues: (1) no intact RBCs visible (lysed), (2) WBCs intact as reference cells, (3) parasites appear \u2018free\u2019, (4) mottled background from lysed cell debris. Thick film is used for detection and quantitation.", points: 10 },
  film_thin: { id: "ft2", type: "film-type", slide: { seed: 91002, stainType: "giemsa", parasitemia: 0.04, species: "pf", stage: "ring" }, prompt: "What type of blood film is this?", options: ["Thin film", "Thick film", "Buffy coat preparation", "Touch preparation"], correctAnswer: "Thin film", explanation: "This is a thin film. Clues: (1) intact RBCs with visible central pallor, (2) parasites visible INSIDE host RBCs, (3) monolayer of cells. Thin film is used for species identification and stage recognition.", points: 10 },
  film_thick2: { id: "ft3", type: "film-type", slide: { seed: 91003, stainType: "giemsa", parasitemia: 0, filmType: "thick" }, prompt: "Identify the film type. What is the purpose of this preparation?", options: ["Thin film \u2014 for species ID", "Thick film \u2014 for detection and density", "Peripheral smear \u2014 for WBC differential", "Reticulocyte stain"], correctAnswer: "Thick film \u2014 for detection and density", explanation: "Thick film. Its primary purpose is parasite DETECTION (higher sensitivity \u2014 examines more blood per field) and QUANTITATION (counting parasites against WBCs). Species ID is done on thin film.", points: 10 },

  // ── SPECIES (thin film) ──
  sp_pf_ring: { id: "sp1", type: "identify-species", slide: { seed: 92001, stainType: "giemsa", parasitemia: 0.04, species: "pf", stage: "ring" }, prompt: "THIN FILM: Identify the Plasmodium species.", options: ["P. falciparum", "P. vivax", "P. malariae", "P. ovale", "Negative"], correctAnswer: "P. falciparum", explanation: "P. falciparum: small delicate rings, normal-sized RBCs, no Sch\u00fcffner dots.", points: 15 },
  sp_pv_ring: { id: "sp2", type: "identify-species", slide: { seed: 92002, stainType: "giemsa", parasitemia: 0.03, species: "pv", stage: "ring" }, prompt: "THIN FILM: Identify the Plasmodium species.", options: ["P. falciparum", "P. vivax", "P. malariae", "P. ovale", "Negative"], correctAnswer: "P. vivax", explanation: "P. vivax: ENLARGED RBCs, Sch\u00fcffner dots, thicker ring forms.", points: 15 },
  sp_pf_subtle: { id: "sp3", type: "identify-species", slide: { seed: 92003, stainType: "giemsa", parasitemia: 0.01, species: "pf", stage: "ring" }, prompt: "THIN FILM: Identify the Plasmodium species.", options: ["P. falciparum", "P. vivax", "Cannot determine from so few parasites", "Negative \u2014 these are artifacts"], correctAnswer: "P. falciparum", explanation: "Even with sparse parasites, species CAN be determined: normal RBC size + small rings + no stippling = P. falciparum. \u2018Cannot determine\u2019 is almost never the correct answer when morphological features are present.", points: 15 },
  sp_pv_troph: { id: "sp4", type: "identify-species", slide: { seed: 92004, stainType: "giemsa", parasitemia: 0.03, species: "pv", stage: "trophozoite" }, prompt: "THIN FILM: Identify the Plasmodium species.", options: ["P. falciparum", "P. vivax", "P. malariae", "P. ovale"], correctAnswer: "P. vivax", explanation: "P. vivax trophozoites: amoeboid shape, enlarged RBC, Sch\u00fcffner dots, hemozoin pigment. All stages visible peripherally (unlike P. falciparum).", points: 15 },
  sp_negative: { id: "sp5", type: "identify-species", slide: { seed: 92005, stainType: "giemsa", parasitemia: 0 }, prompt: "THIN FILM: Identify the Plasmodium species, if present.", options: ["P. falciparum", "P. vivax", "P. malariae", "Negative \u2014 no parasites", "Platelets mimicking parasites"], correctAnswer: "Negative \u2014 no parasites", explanation: "This is a NEGATIVE thin film. Any dark structures on RBCs are platelets. Always confirm: parasites have ring cytoplasm + chromatin dots. Platelets are refractile without ring forms.", points: 15 },

  // ── STAGE ──
  stg_ring: { id: "stg1", type: "identify-stage", slide: { seed: 93001, stainType: "giemsa", parasitemia: 0.04, species: "pf", stage: "ring" }, prompt: "Identify the parasite stage present on this thin film.", options: ["Ring form", "Trophozoite", "Schizont", "Gametocyte"], correctAnswer: "Ring form", explanation: "Ring forms (early trophozoites): thin rings of cytoplasm with 1\u20132 chromatin dots. Most common P. falciparum stage in peripheral blood.", points: 10 },
  stg_gamet: { id: "stg2", type: "identify-stage", slide: { seed: 93002, stainType: "giemsa", parasitemia: 0.04, species: "pf", stage: "gametocyte" }, prompt: "Identify the parasite stage present on this thin film.", options: ["Ring form", "Trophozoite", "Schizont", "Gametocyte"], correctAnswer: "Gametocyte", explanation: "Banana/crescent shape = P. falciparum gametocyte (pathognomonic). Sexual stage, transmissible to mosquitoes.", points: 10 },
  stg_schiz: { id: "stg3", type: "identify-stage", slide: { seed: 93003, stainType: "giemsa", parasitemia: 0.03, species: "pf", stage: "schizont" }, prompt: "Identify the parasite stage present on this thin film.", options: ["Ring form", "Trophozoite", "Schizont", "Gametocyte"], correctAnswer: "Schizont", explanation: "Schizonts: multiple merozoites (dots) + central pigment mass. P. falciparum schizonts in peripheral blood = SEVERE MALARIA (WHO criterion). Report immediately.", points: 15 },
  stg_troph: { id: "stg4", type: "identify-stage", slide: { seed: 93004, stainType: "giemsa", parasitemia: 0.03, species: "pf", stage: "trophozoite" }, prompt: "Identify the parasite stage present on this thin film.", options: ["Ring form \u2014 normal finding", "Trophozoite \u2014 SEVERE malaria, parasites not sequestering", "Schizont \u2014 normal maturation", "Gametocyte \u2014 transmission risk"], correctAnswer: "Trophozoite \u2014 SEVERE malaria, parasites not sequestering", explanation: "P. falciparum trophozoites are normally sequestered in deep capillaries. Peripheral presence = WHO severe malaria criterion. Requires urgent parenteral artesunate.", points: 20 },

  // ── QUANTITATION (thick film) ──
  quant_formula: { id: "qt1", type: "estimate-density", slide: { seed: 94001, stainType: "giemsa", parasitemia: 0.04, species: "pf", stage: "ring", filmType: "thick" }, prompt: "You counted 120 parasites per 200 WBCs. Assumed WBC = 8,000/\u00b5L. Calculate density.", options: ["4,800/\u00b5L", "960/\u00b5L", "48,000/\u00b5L", "600/\u00b5L"], correctAnswer: "4,800/\u00b5L", explanation: "Formula: (parasites \u00f7 WBCs counted) \u00d7 assumed WBC count = (120 \u00f7 200) \u00d7 8,000 = 4,800/\u00b5L.", points: 15 },
  quant_actual_wbc: { id: "qt2", type: "estimate-density", slide: { seed: 94002, stainType: "giemsa", parasitemia: 0.08, species: "pf", stage: "ring", filmType: "thick" }, prompt: "480 parasites per 200 WBCs. Patient\u2019s actual WBC = 4,000/\u00b5L (leukopenic). Calculate using ACTUAL count.", options: ["9,600/\u00b5L", "19,200/\u00b5L", "2,400/\u00b5L", "38,400/\u00b5L"], correctAnswer: "9,600/\u00b5L", explanation: "(480 \u00f7 200) \u00d7 4,000 = 9,600/\u00b5L. Using assumed 8,000 would OVERESTIMATE by 2\u00d7. Always use actual WBC when available from FBC.", points: 20 },
  quant_500wbc: { id: "qt3", type: "estimate-density", slide: { seed: 94003, stainType: "giemsa", parasitemia: 0.06, species: "pf", stage: "ring", filmType: "thick" }, prompt: "240 parasites per 500 WBCs. Patient WBC = 6,000/\u00b5L.", options: ["2,880/\u00b5L", "3,840/\u00b5L", "1,200/\u00b5L", "19,200/\u00b5L"], correctAnswer: "2,880/\u00b5L", explanation: "(240 \u00f7 500) \u00d7 6,000 = 2,880/\u00b5L. Note: counting against 500 WBCs is more accurate than 200 WBCs, especially at low densities.", points: 15 },
  quant_classify: { id: "qt4", type: "estimate-density", slide: { seed: 94004, stainType: "giemsa", parasitemia: 0.12, species: "pf", stage: "ring", filmType: "thick" }, prompt: "Calculated density: 85,000 parasites/\u00b5L. How do you classify this and what treatment is needed?", options: ["Moderate \u2014 oral ACT", "High \u2014 oral ACT with close monitoring", "Hyperparasitaemia \u2014 IV artesunate required", "Low \u2014 outpatient ACT"], correctAnswer: "Hyperparasitaemia \u2014 IV artesunate required", explanation: ">100,000/\u00b5L or >5% parasitemia on thin film = WHO hyperparasitaemia = severe malaria. Requires parenteral artesunate (IV or IM), NOT oral ACT. This is a critical value requiring immediate communication.", points: 20 },

  // ── TRICKY TRUE/FALSE ──
  tf_rbc_size: { id: "tf1", type: "true-false", slide: { seed: 95001, stainType: "giemsa", parasitemia: 0.03, species: "pv", stage: "ring" }, prompt: "T/F: The enlarged RBCs with pink stippling suggest P. falciparum.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Enlarged RBCs + Sch\u00fcffner dots = P. VIVAX. P. falciparum RBCs are normal-sized with no stippling.", points: 10 },
  tf_multiple: { id: "tf2", type: "true-false", slide: { seed: 95002, stainType: "giemsa", parasitemia: 0.06, species: "pf", stage: "ring" }, prompt: "T/F: Multiple ring forms per RBC is more typical of P. vivax than P. falciparum.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Multiple infections per RBC = P. FALCIPARUM (infects any RBC age). P. vivax preferentially infects reticulocytes, making multiple infections rare.", points: 10 },
  tf_gamet_retreat: { id: "tf3", type: "true-false", slide: { seed: 95003, stainType: "giemsa", parasitemia: 0.03, species: "pf", stage: "gametocyte" }, prompt: "T/F: Finding only gametocytes on Day 14 follow-up means treatment has failed and ACT must be repeated.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Gametocytes persist 2\u20136 weeks after successful treatment. Not pathogenic. Consider single-dose primaquine (0.25 mg/kg) for transmission blocking if G6PD normal.", points: 15 },
  tf_neg_rdt: { id: "tf4", type: "true-false", slide: { seed: 95004, stainType: "giemsa", parasitemia: 0.005, species: "pf", stage: "ring" }, prompt: "T/F: A negative RDT definitively excludes malaria in a febrile patient.", options: ["True", "False"], correctAnswer: "False", explanation: "False. RDTs can miss: (1) very low parasitemia, (2) prozone effect at very high parasitemia, (3) HRP2/3 gene deletion strains. Microscopy remains the gold standard.", points: 10 },
  tf_schiz_severe: { id: "tf5", type: "true-false", slide: { seed: 95005, stainType: "giemsa", parasitemia: 0.03, species: "pf", stage: "schizont" }, prompt: "T/F: P. falciparum schizonts in peripheral blood is a normal finding in uncomplicated malaria.", options: ["True", "False"], correctAnswer: "False", explanation: "False. P. falciparum schizonts are normally sequestered. Peripheral presence = WHO severe malaria criterion requiring urgent treatment.", points: 15 },
  tf_thick_species: { id: "tf6", type: "true-false", slide: { seed: 95006, stainType: "giemsa", parasitemia: 0.04, species: "pf", stage: "ring", filmType: "thick" }, prompt: "T/F: Species can be reliably identified on thick film alone without examining the thin film.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Thick film is for detection and quantitation. Species identification requires the thin film where host RBC morphology (size, stippling) and parasite details are preserved.", points: 10 },

  // ── FILM COMMENT ──
  comment_pf: { id: "fc1", type: "film-comment", slide: { seed: 96001, stainType: "giemsa", parasitemia: 0.05, species: "pf", stage: "ring" }, prompt: "Write a structured blood film report.", options: ["Thick: Positive. Thin: P. falciparum (ring forms, normal RBCs, no stippling). Parasitemia ~5% / ~12,000/\u00b5L. No schizonts/gametocytes. Recommend: treat per protocol, repeat 24\u201348h.", "Positive for malaria. Treat with ACT.", "P. vivax. Low parasitemia. Give chloroquine + primaquine.", "Species undetermined. Request PCR."], correctAnswer: "Thick: Positive. Thin: P. falciparum (ring forms, normal RBCs, no stippling). Parasitemia ~5% / ~12,000/\u00b5L. No schizonts/gametocytes. Recommend: treat per protocol, repeat 24\u201348h.", explanation: "Complete report: thick result + thin species (with justification) + density (% and /\u00b5L) + stages present/absent + recommendation.", points: 20 },
  comment_critical: { id: "fc2", type: "film-comment", slide: { seed: 96002, stainType: "giemsa", parasitemia: 0.03, species: "pf", stage: "schizont" }, prompt: "Film from a child with GCS 8 and seizures. Write the report.", options: ["CRITICAL VALUE \u2014 PHONE NOW. P. falciparum with SCHIZONTS in peripheral blood. ~3% / ~7,200/\u00b5L. Cerebral malaria (GCS 8). Action: IV artesunate STAT, ICU.", "Malaria positive. Moderate parasitemia. Oral ACT.", "P. falciparum rings. Low density. Outpatient treatment.", "Cannot determine species. Request PCR."], correctAnswer: "CRITICAL VALUE \u2014 PHONE NOW. P. falciparum with SCHIZONTS in peripheral blood. ~3% / ~7,200/\u00b5L. Cerebral malaria (GCS 8). Action: IV artesunate STAT, ICU.", explanation: "Peripheral schizonts + cerebral malaria = CRITICAL VALUE. Must phone immediately, document time and clinician name. IV artesunate, not oral ACT.", points: 25 },

  // ── PLATELET TRAPS ──
  trap_platelet_thin: { id: "tr1", type: "identify-cell", slide: { seed: 97001, stainType: "giemsa", parasitemia: 0.01, species: "pf", stage: "ring" }, prompt: "Dark structure on an RBC. Your colleague calls it a ring form. Agree?", options: ["Yes \u2014 ring form", "No \u2014 platelet on RBC", "No \u2014 Howell-Jolly body", "Uncertain"], correctAnswer: "No \u2014 platelet on RBC", explanation: "Platelet on RBC. No ring cytoplasm, refractile, similar structures free between cells. #1 cause of false positives.", points: 15 },
  trap_eqa: { id: "tr2", type: "identify-cell", slide: { seed: 97002, stainType: "giemsa", parasitemia: 0 }, prompt: "EQA slide labelled \u2018positive\u2019. After 200 fields you find nothing. A colleague found \u2018rings\u2019. Most likely explanation?", options: ["You missed the parasites", "Colleague\u2019s \u2018rings\u2019 are platelets (false positive)", "Slide degraded", "Below detection threshold"], correctAnswer: "Colleague\u2019s \u2018rings\u2019 are platelets (false positive)", explanation: "In EQA, platelet misidentification is the most common false positive. Review together as a teaching moment.", points: 20 },

  // ── WBC ──
  wbc_neut: { id: "wbc1", type: "wbc-differential", slide: { seed: 98001, stainType: "wright-giemsa", parasitemia: 0 }, prompt: "Multi-lobed nucleus, fine purple granules.", options: ["Neutrophil", "Eosinophil", "Basophil", "Lymphocyte", "Monocyte"], correctAnswer: "Neutrophil", explanation: "Neutrophil: 2\u20135 lobes, fine purple granules. Most abundant WBC.", points: 10 },
  wbc_eos: { id: "wbc2", type: "wbc-differential", slide: { seed: 98002, stainType: "wright-giemsa", parasitemia: 0 }, prompt: "Bilobed nucleus, large bright pink-orange granules.", options: ["Neutrophil", "Eosinophil", "Basophil", "Lymphocyte", "Monocyte"], correctAnswer: "Eosinophil", explanation: "Eosinophil: bilobed nucleus + large orange-red granules.", points: 10 },
  wbc_baso: { id: "wbc3", type: "wbc-differential", slide: { seed: 98003, stainType: "wright-giemsa", parasitemia: 0 }, prompt: "Dense dark blue-purple granules obscure the nucleus.", options: ["Neutrophil", "Eosinophil", "Basophil", "Lymphocyte", "Monocyte"], correctAnswer: "Basophil", explanation: "Basophil: large dark metachromatic granules hiding the bilobed nucleus. Rarest WBC.", points: 10 },
  wbc_lymph: { id: "wbc4", type: "wbc-differential", slide: { seed: 98004, stainType: "wright-giemsa", parasitemia: 0 }, prompt: "Large round dark nucleus, scant pale cytoplasm rim.", options: ["Neutrophil", "Eosinophil", "Basophil", "Lymphocyte", "Monocyte"], correctAnswer: "Lymphocyte", explanation: "Lymphocyte: high N:C ratio, dense round nucleus, scant cytoplasm.", points: 10 },
  wbc_mono: { id: "wbc5", type: "wbc-differential", slide: { seed: 98005, stainType: "wright-giemsa", parasitemia: 0 }, prompt: "Largest WBC. Kidney-shaped nucleus, grey-blue cytoplasm.", options: ["Neutrophil", "Eosinophil", "Basophil", "Lymphocyte", "Monocyte"], correctAnswer: "Monocyte", explanation: "Monocyte: largest WBC, kidney/horseshoe nucleus, grey-blue cytoplasm.", points: 10 },
  wbc_trap: { id: "wbc6", type: "true-false", slide: { seed: 98006, stainType: "wright-giemsa", parasitemia: 0 }, prompt: "T/F: Eosinophils have BLUE granules and basophils have ORANGE granules.", options: ["True", "False"], correctAnswer: "False", explanation: "Reversed. Eosinophils = orange-red (eosin). Basophils = blue-purple (basic dyes). Classic exam trap.", points: 10 },
  wbc_hyper: { id: "wbc7", type: "wbc-differential", slide: { seed: 98007, stainType: "wright-giemsa", parasitemia: 0 }, prompt: "A neutrophil with 7 lobes. What does this suggest?", options: ["Normal variant", "Megaloblastic anaemia (B12/folate deficiency)", "Chronic infection", "CML"], correctAnswer: "Megaloblastic anaemia (B12/folate deficiency)", explanation: "Hypersegmentation (\u22656 lobes) = megaloblastic anaemia. Request B12, folate, reticulocyte count.", points: 15 },
};

// Convert bank to array and helper to draw random subset
const allQ = Object.values(Q);

function bankFor(...keys: string[]): ExamQuestion[] {
  return keys.map(k => Q[k]).filter(Boolean);
}

export const exams: Exam[] = [
  {
    id: "student-malaria",
    title: "Malaria Microscopy \u2014 Student",
    discipline: "malaria",
    description: "ECAMM-structured assessment: detection (thick film), species identification (thin film), stage recognition, and basic quantitation. Questions rotate each attempt.",
    difficulty: "student",
    timeLimit: 900,
    questionsPerAttempt: 8,
    questionBank: bankFor(
      "det_pos_high", "det_neg_platelets", "det_neg_clean", "det_pos_pv",
      "film_thick", "film_thin",
      "sp_pf_ring", "sp_pv_ring",
      "stg_ring", "stg_gamet",
      "quant_formula",
      "tf_rbc_size", "tf_multiple",
    ),
  },
  {
    id: "student-wbc",
    title: "WBC Identification \u2014 Student",
    discipline: "hematology",
    description: "Identify the five normal WBC types and recognise common morphological traps.",
    difficulty: "student",
    timeLimit: 600,
    questionsPerAttempt: 6,
    questionBank: bankFor("wbc_neut", "wbc_eos", "wbc_baso", "wbc_lymph", "wbc_mono", "wbc_trap", "wbc_hyper"),
  },
  {
    id: "mls-malaria",
    title: "Malaria Competency \u2014 MLS",
    discipline: "malaria",
    description: "Professional competency: detection with traps, species/stage on tricky slides, WHO quantitation formula, and structured film reporting. Questions rotate.",
    difficulty: "mls",
    timeLimit: 900,
    questionsPerAttempt: 10,
    questionBank: bankFor(
      "det_pos_high", "det_neg_platelets", "det_pos_low", "det_neg_clean", "det_neg_artifact", "det_pos_verylow",
      "film_thick", "film_thin", "film_thick2",
      "sp_pf_ring", "sp_pv_ring", "sp_pf_subtle", "sp_pv_troph", "sp_negative",
      "stg_ring", "stg_gamet", "stg_schiz", "stg_troph",
      "quant_formula", "quant_actual_wbc", "quant_classify",
      "tf_gamet_retreat", "tf_neg_rdt", "tf_thick_species",
      "comment_pf",
      "trap_platelet_thin",
    ),
  },
  {
    id: "specialist-malaria",
    title: "Diagnostic Traps \u2014 Specialist",
    discipline: "malaria",
    description: "Edge cases: very low parasitemia, zero-parasitemia platelet traps, leukopenic quantitation, critical values. Every question is designed to expose diagnostic errors.",
    difficulty: "specialist",
    timeLimit: 720,
    questionsPerAttempt: 10,
    questionBank: bankFor(
      "det_pos_low", "det_neg_platelets", "det_pos_verylow", "det_neg_artifact", "det_pos_gam",
      "sp_pf_subtle", "sp_pv_troph", "sp_negative",
      "stg_schiz", "stg_troph",
      "quant_actual_wbc", "quant_500wbc", "quant_classify",
      "tf_multiple", "tf_gamet_retreat", "tf_neg_rdt", "tf_schiz_severe", "tf_thick_species",
      "comment_critical",
      "trap_platelet_thin", "trap_eqa",
      "film_thick", "film_thick2",
    ),
  },
  {
    id: "consultant-malaria",
    title: "ECAMM Competency \u2014 Consultant",
    discipline: "malaria",
    description: "WHO-standard 15-question panel covering all ECAMM domains. Detection panel (5 slides), species panel, quantitation, critical values, and QA scenarios. Passing: Level 1 (\u226590% detection, \u226580% species, \u226540% quant).",
    difficulty: "consultant",
    timeLimit: 1200,
    questionsPerAttempt: 15,
    questionBank: bankFor(
      "det_pos_high", "det_neg_platelets", "det_pos_low", "det_neg_clean", "det_pos_pv", "det_pos_verylow", "det_neg_artifact", "det_pos_gam",
      "film_thick", "film_thin", "film_thick2",
      "sp_pf_ring", "sp_pv_ring", "sp_pf_subtle", "sp_pv_troph", "sp_negative",
      "stg_ring", "stg_gamet", "stg_schiz", "stg_troph",
      "quant_formula", "quant_actual_wbc", "quant_500wbc", "quant_classify",
      "tf_rbc_size", "tf_multiple", "tf_gamet_retreat", "tf_neg_rdt", "tf_schiz_severe", "tf_thick_species",
      "comment_pf", "comment_critical",
      "trap_platelet_thin", "trap_eqa",
    ),
  },
  {
    id: "mls-haematology",
    title: "Haematology Reporting \u2014 MLS",
    discipline: "hematology",
    description: "WBC differential accuracy and clinical interpretation for professional reporting.",
    difficulty: "mls",
    timeLimit: 600,
    questionsPerAttempt: 6,
    questionBank: bankFor("wbc_neut", "wbc_eos", "wbc_baso", "wbc_lymph", "wbc_mono", "wbc_trap", "wbc_hyper"),
  },
];
