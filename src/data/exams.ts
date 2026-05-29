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
  /** Slide mode — determines which viewer to use */
  mode?: "blood" | "urine" | "sickling";
  /** Urine sediment config for urine-mode exams */
  urineConfig?: import("@/data/cases").UrineConfig;
  /** Sickling rate for sickling-mode exams */
  sicklingRate?: number;
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
  /** Department grouping for exam listing */
  department: "haematology" | "microbiology";
  /** Subcategory within department */
  subcategory: "haematoparasitology" | "morphology" | "wet-prep" | "stained-prep" | "culture";
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
  stg_troph: { id: "stg4", type: "identify-stage", slide: { seed: 93004, stainType: "giemsa", parasitemia: 0.03, species: "pf", stage: "trophozoite" }, prompt: "Identify the parasite stage present on this thin film.", options: ["Ring form", "Trophozoite", "Schizont", "Gametocyte"], correctAnswer: "Trophozoite", explanation: "P. falciparum trophozoites are normally sequestered in deep capillaries. Finding them in peripheral blood is a WHO criterion for severe malaria and should be reported as a critical value.", points: 20 },

  // ── QUANTITATION (thick film) ──
  quant_formula: { id: "qt1", type: "estimate-density", slide: { seed: 94001, stainType: "giemsa", parasitemia: 0.04, species: "pf", stage: "ring", filmType: "thick" }, prompt: "CALCULATION: On this thick film you counted 120 parasites against 200 WBCs. Using assumed WBC count of 8,000/\u00b5L, what is the parasite density?", options: ["4,800/\u00b5L", "960/\u00b5L", "48,000/\u00b5L", "600/\u00b5L"], correctAnswer: "4,800/\u00b5L", explanation: "WHO formula: (parasites counted \u00f7 WBCs counted) \u00d7 assumed WBC = (120 \u00f7 200) \u00d7 8,000 = 4,800/\u00b5L.", points: 15 },
  quant_actual_wbc: { id: "qt2", type: "estimate-density", slide: { seed: 94002, stainType: "giemsa", parasitemia: 0.08, species: "pf", stage: "ring", filmType: "thick" }, prompt: "CALCULATION: You counted 480 parasites against 200 WBCs. The FBC shows WBC = 4,000/\u00b5L. Using the ACTUAL WBC count, what is the density?", options: ["9,600/\u00b5L", "19,200/\u00b5L", "2,400/\u00b5L", "38,400/\u00b5L"], correctAnswer: "9,600/\u00b5L", explanation: "(480 \u00f7 200) \u00d7 4,000 = 9,600/\u00b5L. When the actual WBC count is available from FBC, use it instead of the assumed 8,000/\u00b5L for more accurate quantitation.", points: 20 },
  quant_500wbc: { id: "qt3", type: "estimate-density", slide: { seed: 94003, stainType: "giemsa", parasitemia: 0.06, species: "pf", stage: "ring", filmType: "thick" }, prompt: "CALCULATION: You counted 240 parasites against 500 WBCs. FBC: WBC = 6,000/\u00b5L. Calculate the density.", options: ["2,880/\u00b5L", "3,840/\u00b5L", "1,200/\u00b5L", "19,200/\u00b5L"], correctAnswer: "2,880/\u00b5L", explanation: "(240 \u00f7 500) \u00d7 6,000 = 2,880/\u00b5L. Counting against 500 WBCs is more accurate than 200, especially at low densities.", points: 15 },
  quant_classify: { id: "qt4", type: "estimate-density", slide: { seed: 94004, stainType: "giemsa", parasitemia: 0.12, species: "pf", stage: "ring", filmType: "thick" }, prompt: "CALCULATION: Your parasite density result is 85,000/\u00b5L. How should this be classified in your report?", options: ["Low density (\u226410,000/\u00b5L)", "Moderate density (10,000\u201350,000/\u00b5L)", "High density (50,000\u2013100,000/\u00b5L)", "Hyperparasitaemia (>100,000/\u00b5L) \u2014 critical value, notify clinician"], correctAnswer: "Hyperparasitaemia (>100,000/\u00b5L) \u2014 critical value, notify clinician", explanation: ">100,000/\u00b5L = hyperparasitaemia = WHO critical value. The MLS must report this as a critical value and verbally notify the clinician. Classification and density go in the lab report.", points: 20 },

  // ── TRICKY TRUE/FALSE ──
  tf_rbc_size: { id: "tf1", type: "true-false", slide: { seed: 95001, stainType: "giemsa", parasitemia: 0.03, species: "pv", stage: "ring" }, prompt: "T/F: The enlarged RBCs with pink stippling suggest P. falciparum.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Enlarged RBCs + Sch\u00fcffner dots = P. VIVAX. P. falciparum RBCs are normal-sized with no stippling.", points: 10 },
  tf_multiple: { id: "tf2", type: "true-false", slide: { seed: 95002, stainType: "giemsa", parasitemia: 0.06, species: "pf", stage: "ring" }, prompt: "T/F: Multiple ring forms per RBC is more typical of P. vivax than P. falciparum.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Multiple infections per RBC = P. FALCIPARUM (infects any RBC age). P. vivax preferentially infects reticulocytes, making multiple infections rare.", points: 10 },
  tf_gamet_retreat: { id: "tf3", type: "true-false", slide: { seed: 95003, stainType: "giemsa", parasitemia: 0.03, species: "pf", stage: "gametocyte" }, prompt: "T/F: Finding only gametocytes (no asexual stages) on a Day 14 follow-up film indicates treatment failure.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Gametocytes can persist 2\u20136 weeks after successful clearance of asexual stages. Their presence alone does NOT indicate treatment failure. The lab should report: \u2018Gametocytes only \u2014 no asexual parasites identified.\u2019", points: 15 },
  tf_neg_rdt: { id: "tf4", type: "true-false", slide: { seed: 95004, stainType: "giemsa", parasitemia: 0.005, species: "pf", stage: "ring" }, prompt: "T/F: A negative RDT definitively excludes malaria in a febrile patient.", options: ["True", "False"], correctAnswer: "False", explanation: "False. RDTs can miss: (1) very low parasitemia, (2) prozone effect at very high parasitemia, (3) HRP2/3 gene deletion strains. Microscopy remains the gold standard.", points: 10 },
  tf_schiz_severe: { id: "tf5", type: "true-false", slide: { seed: 95005, stainType: "giemsa", parasitemia: 0.03, species: "pf", stage: "schizont" }, prompt: "T/F: P. falciparum schizonts in peripheral blood is a normal finding in uncomplicated malaria.", options: ["True", "False"], correctAnswer: "False", explanation: "False. P. falciparum schizonts are normally sequestered in deep capillaries. Their presence in peripheral blood is a WHO critical value that must be reported urgently to the clinician.", points: 15 },
  tf_thick_species: { id: "tf6", type: "true-false", slide: { seed: 95006, stainType: "giemsa", parasitemia: 0.04, species: "pf", stage: "ring", filmType: "thick" }, prompt: "T/F: Species can be reliably identified on thick film alone without examining the thin film.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Thick film is for detection and quantitation. Species identification requires the thin film where host RBC morphology (size, stippling) and parasite details are preserved.", points: 10 },

  // ── FILM COMMENT ──
  comment_pf: { id: "fc1", type: "film-comment", slide: { seed: 96001, stainType: "giemsa", parasitemia: 0.05, species: "pf", stage: "ring" }, prompt: "Select the correct structured laboratory report for this film.", options: ["Thick: Positive. Thin: P. falciparum (ring forms, normal RBCs). Parasitemia ~5%. No schizonts or gametocytes identified.", "Thick: Positive. Thin: P. vivax (enlarged RBCs, Sch\u00fcffner dots). Parasitemia ~5%. Trophozoites and schizonts seen.", "Thick: Positive. Thin: Species undetermined. Parasitemia ~5%. Recommend PCR for species confirmation.", "Thick: Negative after 100 fields. Thin: No parasites identified. Recommend repeat film in 12\u201324 hours."], correctAnswer: "Thick: Positive. Thin: P. falciparum (ring forms, normal RBCs). Parasitemia ~5%. No schizonts or gametocytes identified.", explanation: "Correct report: (1) thick film result, (2) thin film species with morphological justification (ring forms, normal RBCs = P. falciparum), (3) parasitemia, (4) stages present and absent. MLS reports laboratory findings \u2014 treatment decisions are for the clinician.", points: 20 },
  comment_critical: { id: "fc2", type: "film-comment", slide: { seed: 96002, stainType: "giemsa", parasitemia: 0.03, species: "pf", stage: "schizont" }, prompt: "Report this film. The patient is a child with altered consciousness.", options: ["CRITICAL VALUE. P. falciparum with SCHIZONTS in peripheral blood. Parasitemia ~3% (~7,200/\u00b5L). Verbal notification to clinician required.", "P. falciparum ring forms identified. Parasitemia ~3% (~7,200/\u00b5L). Routine report \u2014 no urgent action needed.", "P. vivax trophozoites and schizonts. Parasitemia ~3%. Enlarged RBCs with Sch\u00fcffner dots confirmed.", "Thick film positive. Thin film species cannot be determined. Parasitemia ~3%. Recommend PCR confirmation."], correctAnswer: "CRITICAL VALUE. P. falciparum with SCHIZONTS in peripheral blood. Parasitemia ~3% (~7,200/\u00b5L). Verbal notification to clinician required.", explanation: "P. falciparum schizonts in peripheral blood = WHO critical value. The MLS must: (1) report as critical value, (2) verbally notify the clinician immediately, (3) document time of notification and clinician name. Treatment decisions are the clinician\u2019s responsibility, not the MLS\u2019s.", points: 25 },

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

// ── Urine slide helper ──
function urineSlide(seed: number, overrides: Partial<import("@/data/cases").UrineConfig> = {}): ExamSlideConfig {
  const base: import("@/data/cases").UrineConfig = {
    seed, pusCells: 0, rbcs: 0, epithelial: 0, urothelialEpi: 0, tubularEpi: 0,
    calciumOxalate: 0, triplePhosphate: 0, uricAcid: 0, ammoniumBiurate: 0, amorphousCrystals: 0,
    hyalineCasts: 0, granularCasts: 0, yeast: 0, bacteria: 0, spermatozoa: 0, clueCells: 0, mucusThreads: 0,
    fields: [{ seed }], ...overrides,
  };
  return { seed, stainType: "giemsa", parasitemia: 0, mode: "urine", urineConfig: base };
}

// ── URINE SEDIMENT questions ──
const U: Record<string, ExamQuestion> = {
  ur_wbc_high: { id: "ur1", type: "identify-finding", slide: urineSlide(80001, { pusCells: 200, rbcs: 15, bacteria: 80, epithelial: 2 }), prompt: "Examine this urine sediment. Identify the predominant cellular finding.", options: ["WBCs (pus cells)", "RBCs", "Yeast cells", "Renal tubular epithelial cells"], correctAnswer: "WBCs (pus cells)", explanation: "Pus cells (WBCs/neutrophils). >5/HPF = pyuria, strongly suggests UTI. These are larger than RBCs with visible granular cytoplasm and faintly lobulated nucleus.", points: 10 },
  ur_rbc_vs_yeast: { id: "ur2", type: "identify-cell", slide: urineSlide(80002, { yeast: 40, rbcs: 20, pusCells: 15 }), prompt: "Examine this sediment. Small round refractile cells are present. Some show budding. Identify them.", options: ["RBCs", "Yeast (Candida)", "WBCs", "Bacteria"], correctAnswer: "Yeast (Candida)", explanation: "Yeast cells. Key: BUDDING — a daughter cell attached by a narrow neck. RBCs are similar size but do not bud. Add KOH to confirm.", points: 15 },
  ur_epi_contam: { id: "ur3", type: "identify-finding", slide: urineSlide(80003, { epithelial: 25, bacteria: 100, mucusThreads: 8, pusCells: 8 }), prompt: "Examine this sediment. Large flat cells are numerous with mixed bacteria. What is the significance?", options: ["Normal finding", "Specimen contamination — recollect", "Renal tubular damage", "Bladder carcinoma"], correctAnswer: "Specimen contamination — recollect", explanation: "Numerous squamous epithelial cells (>5/HPF) = contamination from vulvovaginal/perineal skin. Mixed bacteria are from skin flora. Report as unsatisfactory and request clean-catch recollection.", points: 15 },
  ur_cast_type: { id: "ur4", type: "identify-cell", slide: urineSlide(80004, { granularCasts: 6, hyalineCasts: 2, pusCells: 30, rbcs: 10, tubularEpi: 3 }), prompt: "Examine this sediment at 10x. Identify the cylindrical structures with granular content.", options: ["Mucus thread", "Granular cast", "Hyaline cast", "Fibre artifact"], correctAnswer: "Granular cast", explanation: "Granular cast — cylindrical mould with granular content. Indicates RENAL TUBULAR PATHOLOGY. Key distinction from mucus: casts have parallel sides and rounded ends.", points: 15 },
  ur_crystal_caox: { id: "ur5", type: "identify-cell", slide: urineSlide(80005, { calciumOxalate: 15, pusCells: 5, rbcs: 3 }), prompt: "Examine this sediment. Identify the colourless geometric structures.", options: ["Calcium oxalate", "Triple phosphate", "Uric acid", "Cystine"], correctAnswer: "Calcium oxalate", explanation: "Calcium oxalate (dihydrate) — octahedral 'envelope' shape. Most common crystal. Found in acidic urine. Abundant crystals = stone risk.", points: 10 },
  ur_crystal_triphos: { id: "ur6", type: "identify-cell", slide: urineSlide(80006, { triplePhosphate: 10, pusCells: 20, bacteria: 60 }), prompt: "Examine this sediment. Identify the large 3D prismatic crystals.", options: ["Triple phosphate (struvite)", "Calcium oxalate", "Uric acid", "Amorphous phosphates"], correctAnswer: "Triple phosphate (struvite)", explanation: "Triple phosphate (struvite, MgNH4PO4). 'Coffin lid' shape. Found in ALKALINE urine. Associated with UTI by urease-producing organisms (Proteus, Klebsiella).", points: 10 },
  ur_trich: { id: "ur7", type: "identify-cell", slide: urineSlide(80007, { trichomonas: 5, pusCells: 80, epithelial: 8, bacteria: 60 }), prompt: "Examine this wet prep. Identify the pear-shaped motile organisms.", options: ["Trichomonas vaginalis", "WBC", "Yeast cell", "Renal tubular cell"], correctAnswer: "Trichomonas vaginalis", explanation: "Trichomonas vaginalis — flagellated protozoan. Key: MOTILITY (jerky twitching). Pear-shaped, 10-30 µm, eccentric nucleus, undulating membrane. STI — treat both partners.", points: 15 },
  ur_schisto: { id: "ur8", type: "identify-cell", slide: urineSlide(80008, { schistosomaHaematobiumEggs: 4, rbcs: 200, pusCells: 40 }), prompt: "Examine this urine from a boy with haematuria. Identify the large oval structure with a pointed end.", options: ["Schistosoma haematobium egg", "Schistosoma mansoni egg", "Enterobius egg", "Air bubble"], correctAnswer: "Schistosoma haematobium egg", explanation: "S. haematobium egg — TERMINAL spine (key). S. mansoni has a LATERAL spine. Found in urine = bladder schistosomiasis. In Ghana, endemic in northern regions near dams.", points: 20 },
  ur_pyuria_sig: { id: "ur9", type: "true-false", slide: urineSlide(80009, { pusCells: 100, bacteria: 10 }), prompt: "T/F: Pyuria (>5 WBCs/HPF) always indicates bacterial UTI.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Pyuria indicates INFLAMMATION, not necessarily bacterial infection. Sterile pyuria occurs with: TB, kidney stones, interstitial nephritis, partially treated UTI, and Trichomonas infection.", points: 10 },
  ur_nitrite: { id: "ur10", type: "true-false", slide: urineSlide(80010, { pusCells: 150, bacteria: 120, rbcs: 10 }), prompt: "T/F: A negative nitrite result on dipstick rules out UTI.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Nitrites are produced by Gram-negative bacteria only. Gram-positive organisms (Enterococcus, Staphylococcus) do NOT reduce nitrates. Also false negatives with short bladder incubation, dilute urine, and vitamin C.", points: 10 },
  ur_rte: { id: "ur11", type: "identify-cell", slide: urineSlide(80011, { tubularEpi: 8, granularCasts: 5, pusCells: 50, rbcs: 30 }), prompt: "Examine this sediment. Identify the small round cells with large nuclei near the casts.", options: ["Renal tubular epithelial cells", "WBCs", "Transitional cells", "Macrophages"], correctAnswer: "Renal tubular epithelial cells", explanation: "Renal tubular epithelial (RTE) cells with pigmented granules. KEY indicator of acute tubular injury/necrosis. Must be reported urgently — indicates renal parenchymal damage.", points: 20 },
  ur_uroEpi: { id: "ur12", type: "identify-cell", slide: urineSlide(80012, { urothelialEpi: 6, pusCells: 20, epithelial: 3 }), prompt: "Examine this sediment. Identify the medium-sized cells with prominent nuclei — larger than WBCs but smaller than squamous epithelial cells.", options: ["Transitional (urothelial) cell — bladder/ureter", "Squamous epithelial — skin contamination", "Renal tubular cell — kidney", "Macrophage"], correctAnswer: "Transitional (urothelial) cell — bladder/ureter", explanation: "Urothelial (transitional) epithelial cell. Medium size (30-40 µm), variable shape (round/oval/pear/caudate), prominent nucleus. From bladder, ureters, or renal pelvis.", points: 10 },
};

// ── SICKLING questions ──
function sicklingSlide(seed: number, rate: number): ExamSlideConfig {
  return { seed, stainType: "sickling" as StainType, parasitemia: 0, mode: "sickling", sicklingRate: rate };
}

const S: Record<string, ExamQuestion> = {
  sk_pos_crescent: { id: "sk1", type: "identify-finding", slide: sicklingSlide(81001, 0.4), prompt: "Examine this sodium metabisulphite wet prep. What is the result?", options: ["Sickling test POSITIVE", "Sickling test NEGATIVE", "Inconclusive — repeat", "Target cells only"], correctAnswer: "Sickling test POSITIVE", explanation: "POSITIVE. Crescent-shaped cells (classic sickle form) confirm the presence of HbS. The reducing agent (Na2S2O5) deoxygenates haemoglobin, causing HbS to polymerise and distort RBCs.", points: 10 },
  sk_neg: { id: "sk2", type: "identify-finding", slide: sicklingSlide(81002, 0), prompt: "Examine this sodium metabisulphite wet prep after 30 minutes incubation. Result?", options: ["Sickling test NEGATIVE", "Sickling test POSITIVE", "Insufficient time — wait longer", "HbC disease"], correctAnswer: "Sickling test NEGATIVE", explanation: "NEGATIVE (HbAA). No sickling after adequate incubation (20-30 min). All RBCs maintain normal biconcave disc morphology. No HbS present.", points: 10 },
  sk_trait_vs_disease: { id: "sk3", type: "true-false", slide: sicklingSlide(81003, 0.25), prompt: "T/F: The sickling test distinguishes between sickle cell TRAIT (HbAS) and sickle cell DISEASE (HbSS).", options: ["True", "False"], correctAnswer: "False", explanation: "False. The sickling test only detects the PRESENCE of HbS — both HbAS (trait) and HbSS (disease) give POSITIVE results. Hb electrophoresis is needed to distinguish them.", points: 15 },
  sk_morphology: { id: "sk4", type: "identify-cell", slide: sicklingSlide(81004, 0.5), prompt: "Examine this positive sickling test. Which cell shape is MOST characteristic?", options: ["Crescent/sickle shape", "Holly-leaf shape", "Target cell", "Spherocyte"], correctAnswer: "Crescent/sickle shape", explanation: "The crescent/sickle shape is the classic morphology. Holly-leaf and oat-shaped cells may also appear. Target cells are seen on peripheral blood film but are NOT specific to the sickling test.", points: 10 },
  sk_timing: { id: "sk5", type: "identify-finding", slide: sicklingSlide(81005, 0), prompt: "This sickling test was read at 5 minutes. No sickling seen. What should you do?", options: ["Report as negative", "Incubate for 20-30 minutes and re-examine", "Add more reducing agent", "Repeat with fresh sample"], correctAnswer: "Incubate for 20-30 minutes and re-examine", explanation: "Too early. Sickling may take 20-30 minutes to develop, especially in HbAS (trait) where HbS concentration is lower. Always incubate for the full recommended time before reporting negative.", points: 15 },
  sk_control: { id: "sk6", type: "true-false", slide: sicklingSlide(81006, 0.35), prompt: "T/F: A positive control should be run with every batch of sickling tests.", options: ["True", "False"], correctAnswer: "True", explanation: "True. A known HbAS or HbSS sample must be run as a positive control to verify that the reducing agent is working. Without a control, false negatives cannot be detected.", points: 10 },
  sk_holly: { id: "sk7", type: "identify-cell", slide: sicklingSlide(81007, 0.45), prompt: "Examine this positive sickling test. Identify the irregularly shaped cells with multiple pointed projections.", options: ["Holly-leaf form", "Crescent form", "Oat-shaped form", "Crenated cell"], correctAnswer: "Holly-leaf form", explanation: "Holly-leaf form — irregular with multiple pointed projections. This is a variant sickling morphology alongside crescents (classic) and oat shapes (elongated). All indicate positive HbS.", points: 10 },
  sk_newborn: { id: "sk8", type: "true-false", slide: sicklingSlide(81008, 0), prompt: "T/F: The sickling test is reliable for screening newborns for sickle cell disease.", options: ["True", "False"], correctAnswer: "False", explanation: "False. Newborns have predominantly HbF (fetal haemoglobin) which does not sickle. The sickling test may give false negatives in neonates. Hb electrophoresis or IEF at 3-6 months is the standard newborn screen.", points: 15 },
};

// Convert bank to array and helper to draw random subset
const allQ = Object.values(Q);

function bankFor(...keys: string[]): ExamQuestion[] {
  return keys.map(k => Q[k]).filter(Boolean);
}
function urineBank(...keys: string[]): ExamQuestion[] {
  return keys.map(k => U[k]).filter(Boolean);
}
function sicklingBank(...keys: string[]): ExamQuestion[] {
  return keys.map(k => S[k]).filter(Boolean);
}

export const exams: Exam[] = [
  {
    id: "student-malaria",
    title: "Malaria Microscopy \u2014 Student",
    discipline: "malaria",
    department: "haematology",
    subcategory: "haematoparasitology",
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
    department: "haematology",
    subcategory: "morphology",
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
    department: "haematology",
    subcategory: "haematoparasitology",
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
    department: "haematology",
    subcategory: "haematoparasitology",
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
    department: "haematology",
    subcategory: "haematoparasitology",
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
    department: "haematology",
    subcategory: "morphology",
    description: "WBC differential accuracy and clinical interpretation for professional reporting.",
    difficulty: "mls",
    timeLimit: 600,
    questionsPerAttempt: 6,
    questionBank: bankFor("wbc_neut", "wbc_eos", "wbc_baso", "wbc_lymph", "wbc_mono", "wbc_trap", "wbc_hyper"),
  },
  // ── URINE SEDIMENT EXAMS ──
  {
    id: "student-urine",
    title: "Urine Sediment \u2014 Student",
    discipline: "urinalysis",
    department: "microbiology",
    subcategory: "wet-prep",
    description: "Identify common urine sediment elements: WBCs, RBCs, epithelial cells, crystals, casts, and organisms. Understand significance of findings.",
    difficulty: "student",
    timeLimit: 600,
    questionsPerAttempt: 6,
    questionBank: urineBank(
      "ur_wbc_high", "ur_rbc_vs_yeast", "ur_epi_contam",
      "ur_crystal_caox", "ur_crystal_triphos",
      "ur_pyuria_sig", "ur_nitrite",
      "ur_uroEpi",
    ),
  },
  {
    id: "mls-urine",
    title: "Urine Microscopy \u2014 MLS",
    discipline: "urinalysis",
    department: "microbiology",
    subcategory: "wet-prep",
    description: "Professional competency: identify all sediment elements, recognise organisms (Trichomonas, Schistosoma, Candida), interpret casts, and assess specimen quality.",
    difficulty: "mls",
    timeLimit: 900,
    questionsPerAttempt: 10,
    questionBank: urineBank(
      "ur_wbc_high", "ur_rbc_vs_yeast", "ur_epi_contam", "ur_cast_type",
      "ur_crystal_caox", "ur_crystal_triphos",
      "ur_trich", "ur_schisto", "ur_rte",
      "ur_pyuria_sig", "ur_nitrite", "ur_uroEpi",
    ),
  },
  {
    id: "specialist-urine",
    title: "Urine Diagnostics \u2014 Specialist",
    discipline: "urinalysis",
    department: "microbiology",
    subcategory: "wet-prep",
    description: "Advanced: parasitic eggs, Trichomonas identification, renal tubular injury markers, sterile pyuria differentials, cast interpretation, and specimen adequacy assessment.",
    difficulty: "specialist",
    timeLimit: 720,
    questionsPerAttempt: 10,
    questionBank: urineBank(
      "ur_wbc_high", "ur_rbc_vs_yeast", "ur_epi_contam", "ur_cast_type",
      "ur_crystal_caox", "ur_crystal_triphos",
      "ur_trich", "ur_schisto", "ur_rte",
      "ur_pyuria_sig", "ur_nitrite", "ur_uroEpi",
    ),
  },
  // ── SICKLING EXAMS ──
  {
    id: "student-sickling",
    title: "Sickling Test \u2014 Student",
    discipline: "hematology",
    department: "haematology",
    subcategory: "wet-prep",
    description: "Identify positive and negative sickling tests. Recognise sickle cell morphology (crescent, holly-leaf, oat shapes). Understand test limitations.",
    difficulty: "student",
    timeLimit: 600,
    questionsPerAttempt: 5,
    questionBank: sicklingBank(
      "sk_pos_crescent", "sk_neg", "sk_morphology",
      "sk_timing", "sk_trait_vs_disease",
    ),
  },
  {
    id: "mls-sickling",
    title: "Sickling & Haemoglobinopathy \u2014 MLS",
    discipline: "hematology",
    department: "haematology",
    subcategory: "wet-prep",
    description: "Professional competency: interpret sickling tests, identify all morphological variants, understand QC requirements, and know limitations (newborn screening, trait vs disease).",
    difficulty: "mls",
    timeLimit: 600,
    questionsPerAttempt: 7,
    questionBank: sicklingBank(
      "sk_pos_crescent", "sk_neg", "sk_trait_vs_disease", "sk_morphology",
      "sk_timing", "sk_control", "sk_holly", "sk_newborn",
    ),
  },
];
