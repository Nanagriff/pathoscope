"use client";

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  type PointerEvent as RE,
} from "react";
import type { CellData, Camera, StainArtifact, FilmType, MalariaSpecies } from "./microscope/types";
import { generateSlide } from "./microscope/generateSlide";
import { generateThickSlide } from "./microscope/generateThickSlide";
import { STAIN_PROFILES, type StainType, type StainProfile } from "./microscope/stainProfiles";
import {
  SlideDefs,
  NormalRBC,
  ParasitizedRBC,
  Neutrophil,
  Eosinophil,
  Basophil,
  Lymphocyte,
  Monocyte,
  Platelet,
} from "./microscope/CellRenderers";
import {
  FreeRing,
  FreeTrophozoite,
  FreeSchizont,
  FreeGametocyte,
} from "./microscope/ParasiteRenderers";

// ── Constants ──

const SLIDE_W = 400;
const SLIDE_H = 300;
const MIN_ZOOM = 0.8;
const MAX_ZOOM_DEFAULT = 14;
const MAX_ZOOM_EXAM = 1.8;
const ZOOM_STEP = 1.12;
const INERTIA_DECAY = 0.92;
const INERTIA_MIN = 0.05;

// ── Public interfaces ──

export interface SVGFieldConfig {
  /** Deterministic seed for this field's cell generation */
  seed: number;
  /** Parasitemia for this field (fraction 0–1). Falls back to case-level default. */
  parasitemia?: number;
}

/** Annotation auto-generated from parasitized / notable cells */
export interface CellAnnotation {
  id: string;
  x: number;
  y: number;
  label: string;
  description?: string;
}

export interface SVGSlideViewerProps {
  stainType: StainType;
  /** Default parasitemia applied to fields without explicit override */
  parasitemia: number;
  fields: SVGFieldConfig[];
  autoFocus?: boolean;
  /** Malaria species. Default "pf" */
  species?: MalariaSpecies;
  /** Parasite stage for this slide. Default "ring" */
  stage?: import("./microscope/types").ParasiteStage;
  /** Whether to show thick/thin toggle. Default false */
  showFilmToggle?: boolean;
  /** Exam mode — hides all annotations and annotation controls */
  examMode?: boolean;
  /** Force initial film type (for exam questions) */
  initialFilmType?: import("./microscope/types").FilmType;
}

// ── Annotation builders ──

const WBC_INFO: Record<string, { label: string; desc: string }> = {
  neutrophil: { label: "Neutrophil", desc: "Segmented nucleus with 2\u20135 lobes connected by thin chromatin bridges. Purple cytoplasmic granules." },
  eosinophil: { label: "Eosinophil", desc: "Bilobed nucleus with large pink-magenta refractile granules. Elevated in parasitic infections." },
  basophil: { label: "Basophil", desc: "Dense dark blue-purple metachromatic granules that obscure the bilobed nucleus. Rarest WBC." },
  lymphocyte: { label: "Lymphocyte", desc: "Large round dense purple nucleus with scant pale purple cytoplasm rim." },
  monocyte: { label: "Monocyte", desc: "Kidney/horseshoe-shaped nucleus with blue-gray cytoplasm and fine granules." },
};

const STAGE_LABELS: Record<string, { label: string; desc: string }> = {
  ring: { label: "Ring Form", desc: "Delicate ring of parasite cytoplasm with 1\u20132 chromatin dots. Early trophozoite \u2014 most common stage on thin film." },
  trophozoite: { label: "Trophozoite", desc: "Mature feeding stage. Amoeboid cytoplasm with hemozoin (malaria pigment). Size and shape vary by species." },
  schizont: { label: "Schizont", desc: "Mature stage containing merozoites (daughter cells). Rarely seen in P. falciparum peripheral blood \u2014 indicates severe infection." },
  gametocyte: { label: "Gametocyte", desc: "Sexual stage transmissible to mosquitoes. P. falciparum gametocytes have a distinctive banana/crescent shape." },
};

const SPECIES_NAMES: Record<string, string> = {
  pf: "P. falciparum", pv: "P. vivax", pm: "P. malariae", po: "P. ovale", pk: "P. knowlesi",
};

function buildThinAnnotations(cells: CellData[]): CellAnnotation[] {
  const annotations: CellAnnotation[] = [];
  let idx = 1;
  const seen = new Set<string>();

  // One representative parasitized RBC — use actual stage name
  const firstParasite = cells.find((c) => c.type === "parasitized-rbc");
  if (firstParasite) {
    const stage = firstParasite.parasiteStage ?? "ring";
    const sp = firstParasite.malariaSpecies ?? "pf";
    const stageInfo = STAGE_LABELS[stage] ?? STAGE_LABELS.ring;
    annotations.push({
      id: `c${idx++}`, x: firstParasite.x, y: firstParasite.y,
      label: `${stageInfo.label} (${SPECIES_NAMES[sp]})`,
      description: stageInfo.desc,
    });
    seen.add("parasitized-rbc");
  }

  // Max 2 WBC types
  let wbcCount = 0;
  for (const cell of cells) {
    if (wbcCount >= 2) break;
    if (WBC_INFO[cell.type] && !seen.has(cell.type)) {
      const info = WBC_INFO[cell.type];
      annotations.push({ id: `c${idx++}`, x: cell.x, y: cell.y, label: info.label, description: info.desc });
      seen.add(cell.type);
      wbcCount++;
    }
  }

  // Platelet on RBC
  const platelets = cells.filter((c) => c.type === "platelet");
  const rbcs = cells.filter((c) => c.type === "rbc");
  for (const plt of platelets) {
    if (rbcs.some((rbc) => (rbc.x - plt.x) ** 2 + (rbc.y - plt.y) ** 2 < 12)) {
      annotations.push({
        id: `c${idx++}`, x: plt.x, y: plt.y,
        label: "Platelet on RBC",
        description: "Platelet overlying an erythrocyte \u2014 can mimic a malaria parasite. Distinguish by size and lack of ring form.",
      });
      break;
    }
  }

  return annotations;
}

function buildThickAnnotations(cells: CellData[]): CellAnnotation[] {
  const annotations: CellAnnotation[] = [];
  let idx = 1;
  const seen = new Set<string>();

  // One of each parasite stage present
  for (const cell of cells) {
    if (cell.type === "parasitized-rbc" && cell.parasiteStage && !seen.has(cell.parasiteStage)) {
      annotations.push({
        id: `c${idx++}`, x: cell.x, y: cell.y,
        label: cell.label,
        description: cell.description,
      });
      seen.add(cell.parasiteStage);
    }
  }

  // One WBC (reference for counting)
  const wbc = cells.find((c) => c.type === "neutrophil" || c.type === "lymphocyte");
  if (wbc) {
    annotations.push({
      id: `c${idx++}`, x: wbc.x, y: wbc.y,
      label: "WBC (reference)",
      description: "White blood cells remain intact in thick film. Parasites are counted per 200\u2013500 WBCs to estimate density.",
    });
  }

  // Platelet — important to distinguish from parasites in thick film
  const plt = cells.find((c) => c.type === "platelet");
  if (plt) {
    annotations.push({
      id: `c${idx++}`, x: plt.x, y: plt.y,
      label: "Platelet",
      description: "Small dark fragment \u2014 easily confused with malaria parasites in thick film. Platelets lack ring forms and chromatin dots. Smaller and more refractile than parasites.",
    });
  }

  return annotations;
}

// ── Thumbnail illustrations for annotation cards ──

function cellThumbnail(label: string, stain: StainProfile): React.ReactNode {
  if (label.includes("Ring")) {
    // RBC with ring form inside
    return (<>
      <circle r={5.5} fill={stain.rbcGradients[0][2]} opacity={0.6} />
      <circle r={2} fill={stain.rbcGradients[0][0]} opacity={0.5} />
      <circle cx={0.5} cy={-0.3} r={1.5} fill="none" stroke={stain.parasiteRingStroke} strokeWidth={0.5} opacity={0.7} />
      <circle cx={1.5} cy={-1} r={0.5} fill={stain.chromatinPrimary} opacity={0.85} />
    </>);
  }
  if (label.includes("Troph")) {
    return (<>
      <circle r={5.5} fill={stain.rbcGradients[0][2]} opacity={0.6} />
      <circle r={2.2} fill={stain.nucleusParachromatin} opacity={0.4} />
      <circle cx={0.3} cy={-0.2} r={0.7} fill={stain.chromatinPrimary} opacity={0.7} />
      <circle cx={-0.5} cy={0.5} r={0.2} fill="#1a0c04" opacity={0.5} />
    </>);
  }
  if (label.includes("Schiz")) {
    return (<>
      <circle r={5.5} fill={stain.rbcGradients[0][2]} opacity={0.6} />
      {[-1,-0.3,0.4,1.1].map((x,i) => [-0.8,0,0.8].map((y,j) => (
        <circle key={`${i}${j}`} cx={x+Math.random()*0.3} cy={y+Math.random()*0.3} r={0.35} fill={stain.nucleusFill} opacity={0.75} />
      )))}
      <circle r={0.3} fill="#1a0c04" opacity={0.5} />
    </>);
  }
  if (label.includes("Gamet")) {
    return (<>
      <circle r={5.5} fill={stain.rbcGradients[0][2]} opacity={0.5} />
      <path d="M-3.5,0 C-2,-2.5,2,-2.5,3.5,0 C2,1,−2,1,-3.5,0 Z" fill={stain.nucleusFill} opacity={0.65} />
      <circle cx={0} cy={-0.5} r={0.4} fill={stain.chromatinPrimary} opacity={0.6} />
    </>);
  }
  if (label.includes("Neutrophil") || label.includes("WBC")) {
    return (<>
      <circle r={6} fill={stain.neutrophilCyto[0]} opacity={0.5} />
      <ellipse cx={-1.2} cy={0} rx={1.5} ry={1.2} fill={stain.nucleusFill} opacity={0.85} />
      <ellipse cx={1} cy={-0.5} rx={1.3} ry={1.1} fill={stain.nucleusFill} opacity={0.85} />
      <line x1={-0.3} y1={0} x2={0.3} y2={-0.3} stroke={stain.nucleusFill} strokeWidth={0.4} opacity={0.7} />
    </>);
  }
  if (label.includes("Lymphocyte")) {
    return (<>
      <circle r={5} fill={stain.lymphocyteCyto[0]} opacity={0.4} />
      <circle r={3.8} fill={stain.nucleusFill} opacity={0.85} />
    </>);
  }
  if (label.includes("Monocyte")) {
    return (<>
      <circle r={6} fill={stain.monocyteCyto[0]} opacity={0.4} />
      <path d="M-2.5,0 Q-2.5,-2,0,-2 Q2.5,-2,2.5,0 Q2.5,1.5,0,0.5 Q-2.5,1.5,-2.5,0 Z"
        fill={stain.nucleusFill} opacity={0.8} />
    </>);
  }
  if (label.includes("Eosinophil")) {
    return (<>
      <circle r={5.5} fill={stain.eosinophilCyto[0]} opacity={0.4} />
      {[0,1,2,3,4,5,6,7].map(i => (
        <circle key={i} cx={Math.cos(i*0.8)*3} cy={Math.sin(i*0.8)*3} r={0.6}
          fill={`rgb(${stain.eosinophilGranule[0]},${stain.eosinophilGranule[1]},${stain.eosinophilGranule[2]})`} opacity={0.5} />
      ))}
      <ellipse cx={-1} cy={0} rx={1.2} ry={1.4} fill={stain.nucleusFill} opacity={0.8} />
      <ellipse cx={1} cy={0} rx={1.2} ry={1.4} fill={stain.nucleusFill} opacity={0.8} />
    </>);
  }
  if (label.includes("Platelet")) {
    return (<>
      <circle r={5.5} fill={stain.rbcGradients[0][2]} opacity={0.4} />
      <ellipse rx={1.2} ry={0.9} fill={stain.plateletOuter} opacity={0.7} />
      <ellipse rx={0.5} ry={0.4} fill={stain.plateletInner} opacity={0.6} />
    </>);
  }
  // Default
  return <circle r={4} fill={stain.nucleusFill} opacity={0.5} />;
}

// ── Component ──

export default function SVGSlideViewer({
  stainType,
  parasitemia: defaultParasitemia,
  fields: fieldConfigs,
  autoFocus = false,
  species = "pf",
  stage = "ring",
  showFilmToggle = true,
  examMode = false,
  initialFilmType,
}: SVGSlideViewerProps) {
  const maxZoom = examMode ? MAX_ZOOM_EXAM : MAX_ZOOM_DEFAULT;
  const defaultZoom = examMode ? 1.2 : 3.5;

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<Camera>({ x: SLIDE_W / 2, y: SLIDE_H / 2, zoom: defaultZoom });
  const velRef = useRef({ vx: 0, vy: 0 });
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    camStartX: number;
    camStartY: number;
    lastX: number;
    lastY: number;
    lastTime: number;
  } | null>(null);
  const rafRef = useRef(0);

  const [currentField, setCurrentField] = useState(0);
  const [filmType, setFilmType] = useState<FilmType>(initialFilmType ?? "thin");
  const [zoom, setZoom] = useState(defaultZoom);
  const [showAnnotations, setShowAnnotations] = useState(!examMode);
  const [activeAnnotation, setActiveAnnotation] = useState<CellAnnotation | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const stain: StainProfile = STAIN_PROFILES[stainType];

  // Single stage per slide — 100% weight on the dedicated stage
  const stageWeights = useMemo(() => ({ [stage]: 1 } as Partial<Record<import("./microscope/types").ParasiteStage, number>>), [stage]);

  // ── Generate thin and thick slides for all fields ──
  const thinFields = useMemo(() => {
    return fieldConfigs.map((fc) => {
      const cfg = {
        width: SLIDE_W, height: SLIDE_H, cellSpacing: 7.6,
        parasitemia: fc.parasitemia ?? defaultParasitemia,
        seed: fc.seed, smearDirection: 12,
        focusCenter: [0.50, 0.50] as [number, number], focusRadius: 350,
        species, stageWeights,
      };
      const slide = generateSlide(cfg);
      return { ...slide, annotations: buildThinAnnotations(slide.cells) };
    });
  }, [fieldConfigs, defaultParasitemia, species, stageWeights]);

  const thickFields = useMemo(() => {
    return fieldConfigs.map((fc) => {
      const cfg = {
        width: SLIDE_W, height: SLIDE_H, cellSpacing: 7.6,
        parasitemia: fc.parasitemia ?? defaultParasitemia,
        seed: fc.seed + 99999,
        species, stageWeights,
      };
      const slide = generateThickSlide(cfg);
      return { ...slide, annotations: buildThickAnnotations(slide.cells) };
    });
  }, [fieldConfigs, defaultParasitemia, species, stageWeights]);

  const generatedFields = filmType === "thin" ? thinFields : thickFields;
  const currentSlide = generatedFields[currentField];
  const { cells, artifacts, annotations } = currentSlide;

  // ── Camera ──
  const applyCamera = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const { x, y, zoom: z } = cameraRef.current;
    const rect = svg.getBoundingClientRect();
    const svgAspect = rect.width / (rect.height || 1);
    const viewW = SLIDE_W / z;
    const viewH = viewW / svgAspect;
    svg.setAttribute("viewBox", `${x - viewW / 2} ${y - viewH / 2} ${viewW} ${viewH}`);
  }, []);

  // Inertia loop
  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      const vel = velRef.current;
      const drag = dragRef.current;
      if (!drag?.active && (Math.abs(vel.vx) > INERTIA_MIN || Math.abs(vel.vy) > INERTIA_MIN)) {
        const cam = cameraRef.current;
        cam.x -= vel.vx / cam.zoom;
        cam.y -= vel.vy / cam.zoom;
        vel.vx *= INERTIA_DECAY;
        vel.vy *= INERTIA_DECAY;
        if (Math.abs(vel.vx) < INERTIA_MIN) vel.vx = 0;
        if (Math.abs(vel.vy) < INERTIA_MIN) vel.vy = 0;
        applyCamera();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [applyCamera]);

  useEffect(() => {
    applyCamera();
    const onResize = () => applyCamera();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyCamera]);

  // ── Pointer pan ──
  const onPointerDown = useCallback((e: RE<SVGSVGElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const cam = cameraRef.current;
    dragRef.current = {
      active: true, startX: e.clientX, startY: e.clientY,
      camStartX: cam.x, camStartY: cam.y,
      lastX: e.clientX, lastY: e.clientY, lastTime: performance.now(),
    };
    velRef.current = { vx: 0, vy: 0 };
  }, []);

  const onPointerMove = useCallback((e: RE<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag?.active) return;
    const cam = cameraRef.current;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = (SLIDE_W / cam.zoom) / rect.width;
    cam.x = drag.camStartX - (e.clientX - drag.startX) * scale;
    cam.y = drag.camStartY - (e.clientY - drag.startY) * scale;
    const now = performance.now();
    const dt = now - drag.lastTime;
    if (dt > 0) {
      velRef.current.vx = ((e.clientX - drag.lastX) / dt) * 16;
      velRef.current.vy = ((e.clientY - drag.lastY) / dt) * 16;
    }
    drag.lastX = e.clientX; drag.lastY = e.clientY; drag.lastTime = now;
    applyCamera();
  }, [applyCamera]);

  const onPointerUp = useCallback(() => {
    if (dragRef.current) dragRef.current.active = false;
  }, []);

  // ── Wheel zoom ──
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = cameraRef.current;
      const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      const newZoom = Math.min(maxZoom, Math.max(MIN_ZOOM, cam.zoom * factor));
      const rect = svg.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const viewW = SLIDE_W / cam.zoom;
      const viewH = viewW / (rect.width / rect.height);
      const worldX = cam.x - viewW / 2 + px * viewW;
      const worldY = cam.y - viewH / 2 + py * viewH;
      const newViewW = SLIDE_W / newZoom;
      const newViewH = newViewW / (rect.width / rect.height);
      cam.x = worldX + (0.5 - px) * newViewW;
      cam.y = worldY + (0.5 - py) * newViewH;
      cam.zoom = newZoom;
      setZoom(newZoom);
      applyCamera();
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [applyCamera]);

  // ── Animated zoom ──
  const zoomTo = useCallback((targetZoom: number) => {
    const cam = cameraRef.current;
    const startZoom = cam.zoom;
    const startTime = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - startTime) / 300);
      cam.zoom = startZoom + (targetZoom - startZoom) * (1 - Math.pow(1 - t, 3));
      setZoom(cam.zoom);
      applyCamera();
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [applyCamera]);

  // ── Animated pan + zoom to annotation ──
  const goToAnnotation = useCallback((a: CellAnnotation) => {
    const cam = cameraRef.current;
    const startX = cam.x, startY = cam.y, startZoom = cam.zoom;
    const targetZoom = 8;
    const startTime = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - startTime) / 400);
      const ease = 1 - Math.pow(1 - t, 3);
      cam.x = startX + (a.x - startX) * ease;
      cam.y = startY + (a.y - startY) * ease;
      cam.zoom = startZoom + (targetZoom - startZoom) * ease;
      setZoom(cam.zoom);
      applyCamera();
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [applyCamera]);

  // ── Field navigation ──
  const changeField = useCallback((index: number) => {
    if (index === currentField) return;
    setTransitioning(true);
    setActiveAnnotation(null);
    // Reset camera
    cameraRef.current = { x: SLIDE_W / 2, y: SLIDE_H / 2, zoom: defaultZoom };
    setZoom(3.5);
    setTimeout(() => {
      setCurrentField(index);
      setTransitioning(false);
      applyCamera();
    }, 200);
  }, [currentField, applyCamera]);

  const handlePrevField = () => changeField(Math.max(0, currentField - 1));
  const handleNextField = () => changeField(Math.min(fieldConfigs.length - 1, currentField + 1));

  const handleZoomIn = () => zoomTo(Math.min(maxZoom, cameraRef.current.zoom * 1.5));
  const handleZoomOut = () => zoomTo(Math.max(MIN_ZOOM, cameraRef.current.zoom / 1.5));
  const handleHome = () => {
    cameraRef.current = { x: SLIDE_W / 2, y: SLIDE_H / 2, zoom: defaultZoom };
    setZoom(3.5);
    setActiveAnnotation(null);
    applyCamera();
  };

  const handleFullscreen = () => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) { el.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  const handleAnnotationClick = (a: CellAnnotation) => {
    setActiveAnnotation(a);
    goToAnnotation(a);
  };

  // ── Auto-focus on mount ──
  useEffect(() => {
    if (autoFocus && annotations.length > 0) {
      const a = annotations[0];
      setActiveAnnotation(a);
      setTimeout(() => goToAnnotation(a), 600);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevField();
      if (e.key === "ArrowRight") handleNextField();
      if (e.key === "Escape") setActiveAnnotation(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // ── Cell renderer ──
  const renderCell = useCallback((cell: CellData) => {
    const props = {
      x: cell.x, y: cell.y, rotation: cell.rotation,
      seed: cell.seed, depth: cell.depth, stain,
      parasiteStage: cell.parasiteStage,
      malariaSpecies: cell.malariaSpecies,
    };

    // In thick film, parasites render as free structures (no host RBC)
    if (filmType === "thick" && cell.type === "parasitized-rbc") {
      const pProps = { x: cell.x, y: cell.y, rotation: cell.rotation, seed: cell.seed, stain };
      switch (cell.parasiteStage) {
        case "trophozoite": return <FreeTrophozoite key={cell.id} {...pProps} />;
        case "schizont": return <FreeSchizont key={cell.id} {...pProps} />;
        case "gametocyte": return <FreeGametocyte key={cell.id} {...pProps} />;
        default: return <FreeRing key={cell.id} {...pProps} />;
      }
    }

    switch (cell.type) {
      case "rbc": return <NormalRBC key={cell.id} {...props} />;
      case "parasitized-rbc": return <ParasitizedRBC key={cell.id} {...props} />;
      case "neutrophil": return <Neutrophil key={cell.id} {...props} />;
      case "eosinophil": return <Eosinophil key={cell.id} {...props} />;
      case "basophil": return <Basophil key={cell.id} {...props} />;
      case "lymphocyte": return <Lymphocyte key={cell.id} {...props} />;
      case "monocyte": return <Monocyte key={cell.id} {...props} />;
      case "platelet": return <Platelet key={cell.id} {...props} />;
    }
  }, [stain, filmType]);

  const renderArtifact = useCallback((a: StainArtifact, i: number) => {
    const s = { pointerEvents: "none" as const };
    switch (a.type) {
      case "precipitate":
        return <circle key={`a${i}`} cx={a.x} cy={a.y} r={a.r} fill={stain.precipitateColour} opacity={a.opacity} style={s} />;
      case "debris":
        return <circle key={`a${i}`} cx={a.x} cy={a.y} r={a.r} fill="#fffff0" opacity={a.opacity} filter="url(#dof-medium)" style={s} />;
      case "bubble":
        return <circle key={`a${i}`} cx={a.x} cy={a.y} r={a.r} fill="none" stroke="#fff" strokeWidth="0.15" opacity={a.opacity} style={s} />;
    }
  }, [stain]);

  // ── Annotation marker — circle in SVG, label as HTML overlay ──
  const annotationMarker = useMemo(() => {
    if (!activeAnnotation || !showAnnotations) return null;
    const { x, y } = activeAnnotation;
    return (
      <g style={{ pointerEvents: "none" }}>
        <circle cx={x} cy={y} r={4.5} fill="none" stroke="#22c55e" strokeWidth="0.4" opacity={0.8}>
          <animate attributeName="r" values="4;5.5;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={x} cy={y} r={4.5} fill="none" stroke="#22c55e" strokeWidth="0.15" opacity={0.4} />
      </g>
    );
  }, [activeAnnotation, showAnnotations]);

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-1.5 px-2 py-2 sm:py-1.5 bg-gray-900 border-b border-gray-700 shrink-0 z-20">
        {/* Field nav */}
        <button onClick={handlePrevField} disabled={currentField === 0 || transitioning}
          className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-sm sm:text-xs font-bold transition-colors disabled:opacity-30">&larr;</button>
        <div className="flex items-center gap-1 px-1">
          {fieldConfigs.map((_, i) => (
            <button key={i} onClick={() => changeField(i)} disabled={transitioning}
              className={`w-2 h-2 rounded-full transition-all ${i === currentField ? "bg-blue-500 scale-125" : "bg-gray-600 hover:bg-gray-400"}`} />
          ))}
        </div>
        <button onClick={handleNextField} disabled={currentField === fieldConfigs.length - 1 || transitioning}
          className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-sm sm:text-xs font-bold transition-colors disabled:opacity-30">&rarr;</button>
        <span className="text-[10px] text-gray-400 hidden sm:inline">{currentField + 1}/{fieldConfigs.length}</span>

        <div className="w-px h-5 bg-gray-700 mx-0.5" />

        {/* Zoom */}
        <button onClick={handleZoomIn} className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-sm sm:text-xs font-bold">+</button>
        <button onClick={handleZoomOut} className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-sm sm:text-xs font-bold">&minus;</button>
        <button onClick={handleHome} className="px-2 h-7 rounded bg-gray-800 hover:bg-gray-700 text-[10px] font-medium hidden sm:flex items-center">Home</button>
        <span className="text-[10px] text-gray-300 tabular-nums">{zoom.toFixed(1)}x</span>

        <div className="flex-1" />

        {/* Thick/Thin toggle */}
        {showFilmToggle && (
          <div className="flex items-center bg-gray-800 rounded overflow-hidden">
            <button onClick={() => { setFilmType("thin"); setActiveAnnotation(null); }}
              className={`h-7 px-2 text-[10px] font-medium transition-colors ${
                filmType === "thin" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-gray-200"
              }`}>Thin</button>
            <button onClick={() => { setFilmType("thick"); setActiveAnnotation(null); }}
              className={`h-7 px-2 text-[10px] font-medium transition-colors ${
                filmType === "thick" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-gray-200"
              }`}>Thick</button>
          </div>
        )}

        {/* Annotations toggle — hidden in exam mode */}
        {!examMode && (
          <button onClick={() => setShowAnnotations(!showAnnotations)}
            className={`h-7 px-2 rounded text-[10px] font-medium transition-colors ${
              showAnnotations ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}>
            <span className="hidden sm:inline">Annotations</span>
            <span className="sm:hidden">Ann.</span>
          </button>
        )}
        <button onClick={handleFullscreen}
          className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-xs">
          {isFullscreen ? "\u2716" : "\u26F6"}
        </button>
      </div>

      {/* ── Viewer ── */}
      <div ref={containerRef} className="flex-1 relative min-h-0" style={{ opacity: transitioning ? 0.3 : 1, transition: "opacity 0.2s" }}>
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full select-none"
          viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`}
          preserveAspectRatio="xMidYMid meet"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ touchAction: "none", background: filmType === "thick" ? "#e8e4d8" : stain.background }}
        >
          <SlideDefs stain={stain} />
          {/* Background — mottled cream for thick, stained for thin */}
          <rect x={-50} y={-50} width={SLIDE_W + 100} height={SLIDE_H + 100}
            fill={filmType === "thick" ? "#e8e4d8" : stain.background}
            filter="url(#stain-bg)" />
          {cells.map(renderCell)}
          {artifacts.map(renderArtifact)}
          <rect x={-50} y={-50} width={SLIDE_W + 100} height={SLIDE_H + 100}
            filter="url(#scope-grain)" opacity={0.10} style={{ pointerEvents: "none" }} />
          <rect x={-50} y={-50} width={SLIDE_W + 100} height={SLIDE_H + 100}
            fill="url(#illumination)" style={{ pointerEvents: "none" }} />
          <rect x={-50} y={-50} width={SLIDE_W + 100} height={SLIDE_H + 100}
            fill="url(#vignette-grad)" style={{ pointerEvents: "none" }} />
          {annotationMarker}
        </svg>

        {/* ── Annotation cards — illustrated reference cards ── */}
        {showAnnotations && annotations.length > 0 && (
          <div className="absolute z-10
            bottom-2 left-2 right-2 flex gap-2 overflow-x-auto pb-1
            sm:bottom-auto sm:top-2 sm:left-2 sm:right-auto sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:max-h-[50%]">
            {annotations.map((a) => {
              const isActive = activeAnnotation?.id === a.id;
              const isParasite = a.label.includes("Ring") || a.label.includes("Troph") || a.label.includes("Schiz") || a.label.includes("Gamet");
              const isPlatelet = a.label.includes("Platelet");
              const isWbc = !isParasite && !isPlatelet && a.label !== "WBC (reference)";
              // Thumbnail SVG — tiny illustration of cell type
              const thumb = cellThumbnail(a.label, stain);
              const borderColor = isActive
                ? (isParasite ? "border-red-500" : isPlatelet ? "border-amber-500" : "border-sky-500")
                : "border-gray-700/60";
              return (
                <button key={a.id} onClick={() => handleAnnotationClick(a)}
                  className={`shrink-0 flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all border backdrop-blur-sm ${
                    isActive
                      ? `${borderColor} bg-gray-900/95 ring-1 ${isParasite ? "ring-red-500/50" : isPlatelet ? "ring-amber-500/50" : "ring-sky-500/50"}`
                      : `${borderColor} bg-gray-900/80 hover:bg-gray-800/90`
                  }`}>
                  {/* Thumbnail */}
                  <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden" style={{ background: stain.background }}>
                    <svg viewBox="-8 -8 16 16" className="w-full h-full">{thumb}</svg>
                  </div>
                  {/* Label */}
                  <div className="text-left min-w-0">
                    <div className="text-[10px] sm:text-xs font-semibold text-gray-200 whitespace-nowrap truncate">{a.label}</div>
                    {isWbc && <div className="text-[8px] sm:text-[10px] text-gray-500">WBC</div>}
                    {isParasite && <div className="text-[8px] sm:text-[10px] text-red-400/70">Parasite</div>}
                    {isPlatelet && <div className="text-[8px] sm:text-[10px] text-amber-400/70">Fragment</div>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {showAnnotations && annotations.length === 0 && (
          <div className="absolute top-2 left-2 z-10">
            <div className="px-2.5 py-1.5 rounded-lg text-xs bg-gray-900/90 text-gray-500 border border-gray-700">
              No notable findings in this field
            </div>
          </div>
        )}

        {/* ── Active annotation description — bottom sheet on mobile, top-right card on desktop ── */}
        {activeAnnotation?.description && (
          <div className="absolute z-20
            bottom-0 left-0 right-0 sm:bottom-auto sm:top-2 sm:right-2 sm:left-auto sm:max-w-xs
            bg-gray-900/95 border-t sm:border border-gray-700 sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-xs sm:text-sm text-gray-200">{activeAnnotation.label}</h4>
              <button onClick={() => setActiveAnnotation(null)} className="text-gray-500 hover:text-gray-300 text-base leading-none shrink-0">
                &times;
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed">{activeAnnotation.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
