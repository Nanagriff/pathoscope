"use client";

import { useEffect, useRef, useState, useMemo, useCallback, type PointerEvent as RE } from "react";
import type { Camera } from "./microscope/types";
import type { UrineConfig } from "@/data/cases";
import { createRng } from "./microscope/types";
import { PusCell, UrineRBC, SquamousEpithelial, UrothelialCell, TubularEpithelial, CalciumOxalate, TriplePhosphate, UricAcidCrystal, AmmoniumBiurate, AmorphousCrystals, HyalineCast, GranularCast, YeastCell, Bacteria, Spermatozoa, ClueCell, MucusThread } from "./microscope/renderers/urine";

const SLIDE_W = 400;
const SLIDE_H = 300;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 10;
const ZOOM_STEP = 1.12;
const INERTIA_DECAY = 0.92;
const INERTIA_MIN = 0.05;

type UrineElement = {
  id: number;
  type: string;
  x: number;
  y: number;
  seed: number;
  vx: number; // drift velocity
  vy: number;
  label: string;
  description: string;
};

interface Props {
  config: UrineConfig;
  fields: { seed: number }[];
}

const ELEMENT_INFO: Record<string, { label: string; desc: string }> = {
  pus: { label: "Pus Cell (WBC)", desc: "Polymorphonuclear leukocyte. >5/HPF = pyuria, suggests UTI. Granular cytoplasm, ~10-15μm." },
  rbc: { label: "Red Blood Cell", desc: "~7μm. May appear as ghost cells in dilute/alkaline urine. >3/HPF = haematuria. Dysmorphic RBCs suggest glomerular origin." },
  epi: { label: "Epithelial Cell", desc: "Large flat cell with granular texture and small dark nucleus. If squamous (>5/HPF) = contaminated specimen. Check type: squamous, urothelial, or renal tubular." },
  uroEpi: { label: "Urothelial (Transitional)", desc: "Medium (30-40μm), round/oval/pear-shaped, sometimes caudate (tailed). From bladder, ureters, renal pelvis." },
  tubEpi: { label: "Renal Tubular Epithelial", desc: "Small (WBC-sized). KEY: golden-brown pigmented granules. Indicates renal tubular damage — clinically significant." },
  caOx: { label: "Calcium Oxalate Crystal", desc: "Octahedral 'envelope' shape. Most common crystal. Found in acidic urine. Abundant = stone risk." },
  tripPhos: { label: "Triple Phosphate Crystal", desc: "'Coffin lid' shape (struvite). Found in alkaline urine. Associated with UTI by urease-producing organisms." },
  uricAcid: { label: "Uric Acid Crystal", desc: "Yellow-brown rhomboid/diamond/barrel shape. Found in acidic urine. Associated with gout, tumour lysis, high purine diet." },
  amBiurate: { label: "Ammonium Biurate Crystal", desc: "'Thorny apple' — dark brown sphere with radiating spicules. Found in alkaline/old urine. Not clinically significant alone." },
  amorphous: { label: "Amorphous Crystals", desc: "Granular mass with no defined shape. Amorphous urates (brown, acidic) or phosphates (grey, alkaline). Common, usually not significant." },
  sperm: { label: "Spermatozoa", desc: "Oval head with long thin tail. May be motile in fresh specimen. Not routinely reported unless specifically requested." },
  clueCell: { label: "Clue Cell", desc: "Epithelial cell covered with adherent bacteria giving fuzzy/stippled edge. Pathognomonic for bacterial vaginosis (Gardnerella)." },
  hyaCast: { label: "Hyaline Cast", desc: "Transparent cylinder. Very faint — easy to miss. Normal in small numbers. Increased after exercise, dehydration, or diuretics." },
  granCast: { label: "Granular Cast", desc: "Cylindrical with granular content. Indicates renal tubular pathology. Coarse→fine→waxy represents cast aging in the tubule." },
  yeast: { label: "Yeast (Candida)", desc: "Oval, refractile, may show budding. Common in diabetics, immunocompromised, or female specimens. Distinguish from RBCs by budding." },
  bacteria: { label: "Bacteria", desc: "Tiny rods or cocci. Significant if >1+ in uncentrifuged specimen from clean catch. Motile rods suggest Gram-negative infection." },
  mucus: { label: "Mucus Thread", desc: "Thin wavy transparent strands. Normal finding in small amounts. Increased in lower urinary tract irritation." },
};

function generateUrineField(config: UrineConfig, fieldSeed: number): UrineElement[] {
  const rng = createRng(fieldSeed);
  const elements: UrineElement[] = [];
  let id = 0;

  const place = (type: string, count: number) => {
    const info = ELEMENT_INFO[type];
    for (let i = 0; i < count; i++) {
      elements.push({
        id: id++,
        type,
        x: 10 + rng() * (SLIDE_W - 20),
        y: 10 + rng() * (SLIDE_H - 20),
        seed: Math.floor(rng() * 1_000_000),
        vx: (rng() - 0.5) * 0.02, // slow drift
        vy: (rng() - 0.5) * 0.015,
        label: info.label,
        description: info.desc,
      });
    }
  };

  place("pus", config.pusCells);
  place("rbc", config.rbcs);
  place("epi", config.epithelial ?? 0);
  place("uroEpi", config.urothelialEpi ?? 0);
  place("tubEpi", config.tubularEpi ?? 0);
  place("caOx", config.calciumOxalate ?? 0);
  place("tripPhos", config.triplePhosphate ?? 0);
  place("uricAcid", config.uricAcid ?? 0);
  place("amBiurate", config.ammoniumBiurate ?? 0);
  place("amorphous", config.amorphousCrystals ?? 0);
  place("hyaCast", config.hyalineCasts);
  place("granCast", config.granularCasts);
  place("yeast", config.yeast);
  place("bacteria", config.bacteria ?? 0);
  place("sperm", config.spermatozoa ?? 0);
  place("clueCell", config.clueCells ?? 0);
  place("mucus", config.mucusThreads ?? 0);

  return elements;
}

/** Background noise — amorphous deposits, fine debris, granular sediment */
function UrineBackground({ seed, width, height }: { seed: number; width: number; height: number }) {
  const rng = createRng(seed + 55555);
  const n = (v: number) => Math.round(v * 1000) / 1000;

  // Fine granular particles — hundreds of tiny specks
  const fineCount = 500;
  const fine: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < fineCount; i++) {
    fine.push({ x: n(rng() * width), y: n(rng() * height), r: n(0.08 + rng() * 0.15), o: n(0.06 + rng() * 0.12) });
  }

  // Medium amorphous deposits
  const medCount = 150;
  const med: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < medCount; i++) {
    med.push({ x: n(rng() * width), y: n(rng() * height), r: n(0.15 + rng() * 0.35), o: n(0.04 + rng() * 0.08) });
  }

  // Amorphous clumps — clusters of debris
  const clumpCount = 30;
  const clumps: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < clumpCount; i++) {
    const cx = rng() * width;
    const cy = rng() * height;
    for (let j = 0; j < 4 + Math.floor(rng() * 5); j++) {
      clumps.push({ x: n(cx + (rng() - 0.5) * 4), y: n(cy + (rng() - 0.5) * 4), r: n(0.2 + rng() * 0.4), o: n(0.05 + rng() * 0.08) });
    }
  }

  // Faint background mottling
  const mottles: { x: number; y: number; rx: number; ry: number; o: number }[] = [];
  for (let i = 0; i < 15; i++) {
    mottles.push({ x: n(rng() * width), y: n(rng() * height), rx: n(8 + rng() * 15), ry: n(6 + rng() * 12), o: n(0.015 + rng() * 0.02) });
  }

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Mottling */}
      {mottles.map((m, i) => (
        <ellipse key={`um${i}`} cx={m.x} cy={m.y} rx={m.rx} ry={m.ry} fill="#c8c0a8" opacity={m.o} />
      ))}
      {/* Fine specks */}
      {fine.map((f, i) => (
        <circle key={`uf${i}`} cx={f.x} cy={f.y} r={f.r} fill="#a0987c" opacity={f.o} />
      ))}
      {/* Medium deposits */}
      {med.map((m, i) => (
        <circle key={`ud${i}`} cx={m.x} cy={m.y} r={m.r} fill="#b0a888" opacity={m.o} />
      ))}
      {/* Clumps */}
      {clumps.map((c, i) => (
        <circle key={`uc${i}`} cx={c.x} cy={c.y} r={c.r} fill="#988c70" opacity={c.o} />
      ))}
    </g>
  );
}

export default function UrineViewer({ config, fields }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<Camera>({ x: SLIDE_W / 2, y: SLIDE_H / 2, zoom: 2.5 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; camStartX: number; camStartY: number; lastX: number; lastY: number; lastTime: number } | null>(null);
  const rafRef = useRef(0);
  const elementsRef = useRef<UrineElement[]>([]);

  const [currentField, setCurrentField] = useState(0);
  const [zoom, setZoom] = useState(2.5);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeCell, setActiveCell] = useState<UrineElement | null>(null);
  const [, forceUpdate] = useState(0);

  // Generate elements for current field
  const fieldSeed = fields[currentField]?.seed ?? config.seed;
  useMemo(() => {
    elementsRef.current = generateUrineField(config, fieldSeed);
  }, [config, fieldSeed]);

  // Camera
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

  // Animation loop — drift elements + inertia
  useEffect(() => {
    let running = true;
    let frame = 0;
    const tick = () => {
      if (!running) return;
      frame++;

      // Drift elements slowly
      if (frame % 3 === 0) { // update positions every 3 frames
        for (const el of elementsRef.current) {
          el.x += el.vx;
          el.y += el.vy;
          // Wrap around
          if (el.x < -5) el.x = SLIDE_W + 5;
          if (el.x > SLIDE_W + 5) el.x = -5;
          if (el.y < -5) el.y = SLIDE_H + 5;
          if (el.y > SLIDE_H + 5) el.y = -5;
        }
        // Trigger re-render every ~10 frames
        if (frame % 10 === 0) forceUpdate((v) => v + 1);
      }

      // Camera inertia
      const vel = velRef.current;
      const drag = dragRef.current;
      if (!drag?.active && (Math.abs(vel.vx) > INERTIA_MIN || Math.abs(vel.vy) > INERTIA_MIN)) {
        const cam = cameraRef.current;
        cam.x -= vel.vx / cam.zoom; cam.y -= vel.vy / cam.zoom;
        vel.vx *= INERTIA_DECAY; vel.vy *= INERTIA_DECAY;
        if (Math.abs(vel.vx) < INERTIA_MIN) vel.vx = 0;
        if (Math.abs(vel.vy) < INERTIA_MIN) vel.vy = 0;
        applyCamera();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [applyCamera]);

  useEffect(() => { applyCamera(); const r = () => applyCamera(); window.addEventListener("resize", r); return () => window.removeEventListener("resize", r); }, [applyCamera]);

  // Pointer pan
  const onPointerDown = useCallback((e: RE<SVGSVGElement>) => { if (e.button !== 0) return; e.currentTarget.setPointerCapture(e.pointerId); const cam = cameraRef.current; dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, camStartX: cam.x, camStartY: cam.y, lastX: e.clientX, lastY: e.clientY, lastTime: performance.now() }; velRef.current = { vx: 0, vy: 0 }; }, []);
  const onPointerMove = useCallback((e: RE<SVGSVGElement>) => { const drag = dragRef.current; if (!drag?.active) return; const cam = cameraRef.current; const svg = svgRef.current; if (!svg) return; const rect = svg.getBoundingClientRect(); const scale = (SLIDE_W / cam.zoom) / rect.width; cam.x = drag.camStartX - (e.clientX - drag.startX) * scale; cam.y = drag.camStartY - (e.clientY - drag.startY) * scale; const now = performance.now(); const dt = now - drag.lastTime; if (dt > 0) { velRef.current.vx = ((e.clientX - drag.lastX) / dt) * 16; velRef.current.vy = ((e.clientY - drag.lastY) / dt) * 16; } drag.lastX = e.clientX; drag.lastY = e.clientY; drag.lastTime = now; applyCamera(); }, [applyCamera]);
  const onPointerUp = useCallback(() => { if (dragRef.current) dragRef.current.active = false; }, []);

  // Wheel zoom
  useEffect(() => { const svg = svgRef.current; if (!svg) return; const onWheel = (e: WheelEvent) => { e.preventDefault(); const cam = cameraRef.current; const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP; const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, cam.zoom * factor)); const rect = svg.getBoundingClientRect(); const px = (e.clientX - rect.left) / rect.width; const py = (e.clientY - rect.top) / rect.height; const viewW = SLIDE_W / cam.zoom; const viewH = viewW / (rect.width / rect.height); const worldX = cam.x - viewW / 2 + px * viewW; const worldY = cam.y - viewH / 2 + py * viewH; const newViewW = SLIDE_W / newZoom; const newViewH = newViewW / (rect.width / rect.height); cam.x = worldX + (0.5 - px) * newViewW; cam.y = worldY + (0.5 - py) * newViewH; cam.zoom = newZoom; setZoom(newZoom); applyCamera(); }; svg.addEventListener("wheel", onWheel, { passive: false }); return () => svg.removeEventListener("wheel", onWheel); }, [applyCamera]);

  // Pinch zoom
  const touchRef = useRef<{ startDist: number; startZoom: number; startMidX: number; startMidY: number; camStartX: number; camStartY: number } | null>(null);
  useEffect(() => { const svg = svgRef.current; if (!svg) return; const getDist = (t1: Touch, t2: Touch) => Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY); const getMid = (t1: Touch, t2: Touch) => ({ x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 }); const onTS = (e: TouchEvent) => { if (e.touches.length === 2) { e.preventDefault(); const cam = cameraRef.current; touchRef.current = { startDist: getDist(e.touches[0], e.touches[1]), startZoom: cam.zoom, startMidX: getMid(e.touches[0], e.touches[1]).x, startMidY: getMid(e.touches[0], e.touches[1]).y, camStartX: cam.x, camStartY: cam.y }; if (dragRef.current) dragRef.current.active = false; } }; const onTM = (e: TouchEvent) => { if (e.touches.length === 2 && touchRef.current) { e.preventDefault(); const cam = cameraRef.current; const rect = svg.getBoundingClientRect(); const d = getDist(e.touches[0], e.touches[1]); const mid = getMid(e.touches[0], e.touches[1]); const scale = d / touchRef.current.startDist; const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, touchRef.current.startZoom * scale)); const panScale = (SLIDE_W / cam.zoom) / rect.width; cam.x = touchRef.current.camStartX - (mid.x - touchRef.current.startMidX) * panScale; cam.y = touchRef.current.camStartY - (mid.y - touchRef.current.startMidY) * panScale; cam.zoom = newZoom; setZoom(newZoom); applyCamera(); } }; const onTE = () => { touchRef.current = null; }; svg.addEventListener("touchstart", onTS, { passive: false }); svg.addEventListener("touchmove", onTM, { passive: false }); svg.addEventListener("touchend", onTE); return () => { svg.removeEventListener("touchstart", onTS); svg.removeEventListener("touchmove", onTM); svg.removeEventListener("touchend", onTE); }; }, [applyCamera]);

  // Annotations — one of each type
  const annotations = useMemo(() => {
    const seen = new Set<string>();
    const anns: UrineElement[] = [];
    for (const el of elementsRef.current) {
      if (!seen.has(el.type)) {
        seen.add(el.type);
        anns.push(el);
      }
    }
    return anns;
  }, [fieldSeed, elementsRef.current.length]);

  const goToCell = useCallback((el: UrineElement) => {
    const cam = cameraRef.current;
    const startX = cam.x, startY = cam.y, startZoom = cam.zoom;
    const targetZoom = 5;
    const startTime = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - startTime) / 400);
      const ease = 1 - Math.pow(1 - t, 3);
      cam.x = startX + (el.x - startX) * ease;
      cam.y = startY + (el.y - startY) * ease;
      cam.zoom = startZoom + (targetZoom - startZoom) * ease;
      setZoom(cam.zoom); applyCamera();
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [applyCamera]);

  const renderElement = useCallback((el: UrineElement) => {
    switch (el.type) {
      case "pus": return <PusCell key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "rbc": return <UrineRBC key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "epi": return <SquamousEpithelial key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "uroEpi": return <UrothelialCell key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "tubEpi": return <TubularEpithelial key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "caOx": return <CalciumOxalate key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "tripPhos": return <TriplePhosphate key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "uricAcid": return <UricAcidCrystal key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "amBiurate": return <AmmoniumBiurate key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "amorphous": return <AmorphousCrystals key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "sperm": return <Spermatozoa key={el.id} x={el.x} y={el.y} seed={el.seed} animated />;
      case "clueCell": return <ClueCell key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "hyaCast": return <HyalineCast key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "granCast": return <GranularCast key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "yeast": return <YeastCell key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      case "bacteria": return <Bacteria key={el.id} x={el.x} y={el.y} seed={el.seed} animated />;
      case "mucus": return <MucusThread key={el.id} x={el.x} y={el.y} seed={el.seed} />;
      default: return null;
    }
  }, []);

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-2 py-2 sm:py-1.5 bg-gray-900 border-b border-gray-700 shrink-0 z-20">
        <div className="flex items-center gap-1 px-1">
          {fields.map((_, i) => (
            <button key={i} onClick={() => setCurrentField(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentField ? "bg-amber-500 scale-125" : "bg-gray-600 hover:bg-gray-400"}`} />
          ))}
        </div>
        <span className="text-[10px] text-gray-400 hidden sm:inline">{currentField + 1}/{fields.length}</span>
        <div className="flex-1" />
        <span className="text-[10px] text-gray-300 tabular-nums">{zoom.toFixed(1)}x</span>
        <button onClick={() => setShowAnnotations(!showAnnotations)}
          className={`h-7 px-2 rounded text-[10px] font-medium transition-colors ${showAnnotations ? "bg-amber-700 text-white" : "bg-gray-800 text-gray-400"}`}>
          Labels
        </button>
      </div>

      {/* Viewport */}
      <div ref={containerRef} className="flex-1 relative min-h-0">
        <svg ref={svgRef} className="absolute inset-0 w-full h-full select-none"
          viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`} preserveAspectRatio="xMidYMid meet"
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
          style={{ touchAction: "none", background: "#f0ece4" }}>

          {/* Pale yellowish background — unstained urine */}
          <rect x={-50} y={-50} width={SLIDE_W + 100} height={SLIDE_H + 100} fill="#f0ece4" />

          {/* Background noise — amorphous deposits, fine granular sediment */}
          <UrineBackground seed={fieldSeed} width={SLIDE_W} height={SLIDE_H} />

          {/* All sediment elements */}
          {elementsRef.current.map(renderElement)}

          {/* Active annotation circle — size adapts to element */}
          {activeCell && showAnnotations && (() => {
            const small = ["sperm", "bacteria", "rbc", "yeast", "tubEpi"].includes(activeCell.type);
            const large = ["epi", "clueCell", "hyaCast", "granCast"].includes(activeCell.type);
            const r = small ? 2.5 : large ? 8 : 5;
            return (
              <g style={{ pointerEvents: "none" }}>
                <circle cx={activeCell.x} cy={activeCell.y} r={r} fill="none" stroke="#f59e0b" strokeWidth={small ? 0.2 : 0.4} opacity={0.8}>
                  <animate attributeName="r" values={`${r * 0.9};${r * 1.2};${r * 0.9}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            );
          })()}
        </svg>

        {/* Annotation cards */}
        {showAnnotations && annotations.length > 0 && (
          <div className="absolute z-10 bottom-2 left-2 right-2 flex gap-2 overflow-x-auto pb-1 sm:bottom-auto sm:top-2 sm:left-2 sm:right-auto sm:flex-col sm:max-h-[50%] sm:overflow-y-auto">
            {annotations.map((a) => (
              <button key={a.id} onClick={() => { setActiveCell(activeCell?.id === a.id ? null : a); goToCell(a); }}
                className={`shrink-0 flex items-center gap-2 px-2 py-1.5 rounded-xl border backdrop-blur-sm transition-all ${
                  activeCell?.id === a.id ? "border-amber-500 bg-gray-900/95 ring-1 ring-amber-500/50" : "border-gray-700/60 bg-gray-900/80 hover:bg-gray-800/90"
                }`}>
                <div className="shrink-0 w-7 h-7 rounded-full bg-[#f0ece4] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400/30" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[10px] font-semibold text-gray-200 whitespace-nowrap">{a.label}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeCell?.description && (
          <div className="absolute z-20 bottom-0 left-0 right-0 sm:bottom-auto sm:top-2 sm:right-2 sm:left-auto sm:max-w-xs bg-gray-900/95 border-t sm:border border-gray-700 sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-xs sm:text-sm text-gray-200">{activeCell.label}</h4>
              <button onClick={() => setActiveCell(null)} className="text-gray-500 hover:text-gray-300 text-base leading-none shrink-0">&times;</button>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed">{activeCell.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
