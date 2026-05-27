"use client";

import { useEffect, useRef, useState, useMemo, useCallback, type PointerEvent as RE } from "react";
import type { CellData, Camera, StainArtifact } from "./microscope/types";
import { generateSicklingSlide } from "./microscope/generateSicklingSlide";
import { NormalDisc, SickleCell, HollyLeafCell, OatCell } from "./microscope/SicklingRenderers";

const SLIDE_W = 400;
const SLIDE_H = 300;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 10;
const ZOOM_STEP = 1.12;
const INERTIA_DECAY = 0.92;
const INERTIA_MIN = 0.05;

interface Props {
  /** 0 = negative (normal), 0.3-0.7 = positive (sickled) */
  sicklingRate: number;
  fields: { seed: number; sicklingRate?: number }[];
}

export default function SicklingViewer({ sicklingRate: defaultRate, fields: fieldConfigs }: Props) {
  const defaultZoom = 2.5;
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<Camera>({ x: SLIDE_W / 2, y: SLIDE_H / 2, zoom: defaultZoom });
  const velRef = useRef({ vx: 0, vy: 0 });
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; camStartX: number; camStartY: number; lastX: number; lastY: number; lastTime: number } | null>(null);
  const rafRef = useRef(0);

  const [currentField, setCurrentField] = useState(0);
  const [zoom, setZoom] = useState(defaultZoom);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeCell, setActiveCell] = useState<CellData | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const generatedFields = useMemo(() =>
    fieldConfigs.map((fc) => generateSicklingSlide({
      width: SLIDE_W, height: SLIDE_H,
      seed: fc.seed,
      sicklingRate: fc.sicklingRate ?? defaultRate,
    })),
    [fieldConfigs, defaultRate],
  );

  const { cells, artifacts } = generatedFields[currentField];

  // Annotations — one of each sickling variant found
  const annotations = useMemo(() => {
    const seen = new Set<string>();
    const anns: CellData[] = [];
    for (const c of cells) {
      const key = String(c.malariaSpecies) + "-" + String(c.parasiteStage ?? "normal");
      if (!seen.has(key) && c.malariaSpecies?.toString().startsWith("sickling")) {
        seen.add(key);
        anns.push(c);
        if (anns.length >= 5) break;
      }
    }
    return anns;
  }, [cells]);

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

  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
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

  const onPointerDown = useCallback((e: RE<SVGSVGElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const cam = cameraRef.current;
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, camStartX: cam.x, camStartY: cam.y, lastX: e.clientX, lastY: e.clientY, lastTime: performance.now() };
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
    if (dt > 0) { velRef.current.vx = ((e.clientX - drag.lastX) / dt) * 16; velRef.current.vy = ((e.clientY - drag.lastY) / dt) * 16; }
    drag.lastX = e.clientX; drag.lastY = e.clientY; drag.lastTime = now;
    applyCamera();
  }, [applyCamera]);

  const onPointerUp = useCallback(() => { if (dragRef.current) dragRef.current.active = false; }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = cameraRef.current;
      const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, cam.zoom * factor));
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
      setZoom(newZoom); applyCamera();
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [applyCamera]);

  const changeField = useCallback((idx: number) => {
    if (idx === currentField) return;
    setTransitioning(true); setActiveCell(null);
    cameraRef.current = { x: SLIDE_W / 2, y: SLIDE_H / 2, zoom: defaultZoom };
    setZoom(defaultZoom);
    setTimeout(() => { setCurrentField(idx); setTransitioning(false); applyCamera(); }, 200);
  }, [currentField, applyCamera, defaultZoom]);

  // Animated pan + zoom to a cell
  const goToCell = useCallback((cell: CellData) => {
    const cam = cameraRef.current;
    const startX = cam.x, startY = cam.y, startZoom = cam.zoom;
    const targetZoom = 6;
    const startTime = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - startTime) / 400);
      const ease = 1 - Math.pow(1 - t, 3);
      cam.x = startX + (cell.x - startX) * ease;
      cam.y = startY + (cell.y - startY) * ease;
      cam.zoom = startZoom + (targetZoom - startZoom) * ease;
      setZoom(cam.zoom);
      applyCamera();
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [applyCamera]);

  const handleAnnotationClick = useCallback((cell: CellData) => {
    setActiveCell((prev) => prev?.id === cell.id ? null : cell);
    goToCell(cell);
  }, [goToCell]);

  const renderCell = useCallback((cell: CellData) => {
    const props = { x: cell.x, y: cell.y, rotation: cell.rotation, seed: cell.seed };
    const sp = String(cell.malariaSpecies);
    if (sp === "sickling-normal") return <NormalDisc key={cell.id} {...props} />;
    if (sp === "sickling") {
      const variant = String(cell.parasiteStage);
      switch (variant) {
        case "sickle": return <SickleCell key={cell.id} {...props} />;
        case "holly-leaf": return <HollyLeafCell key={cell.id} {...props} />;
        case "oat": return <OatCell key={cell.id} {...props} />;
        default: return <SickleCell key={cell.id} {...props} />;
      }
    }
    return <NormalDisc key={cell.id} {...props} />;
  }, []);

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-2 py-2 sm:py-1.5 bg-gray-900 border-b border-gray-700 shrink-0 z-20">
        <button onClick={() => changeField(Math.max(0, currentField - 1))} disabled={currentField === 0 || transitioning}
          className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-sm sm:text-xs font-bold disabled:opacity-30">&larr;</button>
        <div className="flex items-center gap-1 px-1">
          {fieldConfigs.map((_, i) => (
            <button key={i} onClick={() => changeField(i)} disabled={transitioning}
              className={`w-2 h-2 rounded-full transition-all ${i === currentField ? "bg-emerald-500 scale-125" : "bg-gray-600 hover:bg-gray-400"}`} />
          ))}
        </div>
        <button onClick={() => changeField(Math.min(fieldConfigs.length - 1, currentField + 1))} disabled={currentField === fieldConfigs.length - 1 || transitioning}
          className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-sm sm:text-xs font-bold disabled:opacity-30">&rarr;</button>
        <span className="text-[10px] text-gray-400 hidden sm:inline">{currentField + 1}/{fieldConfigs.length}</span>
        <div className="flex-1" />
        <span className="text-[10px] text-gray-300 tabular-nums">{zoom.toFixed(1)}x</span>
        <button onClick={() => setShowAnnotations(!showAnnotations)}
          className={`h-7 px-2 rounded text-[10px] font-medium transition-colors ${showAnnotations ? "bg-emerald-700 text-white" : "bg-gray-800 text-gray-400"}`}>
          Labels
        </button>
      </div>

      {/* Viewport */}
      <div ref={containerRef} className="flex-1 relative min-h-0" style={{ opacity: transitioning ? 0.3 : 1, transition: "opacity 0.2s" }}>
        <svg ref={svgRef} className="absolute inset-0 w-full h-full select-none"
          viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`} preserveAspectRatio="xMidYMid meet"
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
          style={{ touchAction: "none", background: "#d8dce4" }}>

          {/* Background — pale blue-grey wet prep */}
          <rect x={-50} y={-50} width={SLIDE_W + 100} height={SLIDE_H + 100} fill="#d8dce4" />

          {cells.map(renderCell)}

          {/* Bubbles */}
          {artifacts.map((a, i) => (
            <circle key={`a${i}`} cx={a.x} cy={a.y} r={a.r}
              fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.15} opacity={a.opacity}
              style={{ pointerEvents: "none" }} />
          ))}

          {/* Active annotation circle marker */}
          {activeCell && showAnnotations && (
            <g style={{ pointerEvents: "none" }}>
              <circle cx={activeCell.x} cy={activeCell.y} r={5} fill="none" stroke="#22c55e" strokeWidth="0.4" opacity={0.8}>
                <animate attributeName="r" values="4.5;6;4.5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={activeCell.x} cy={activeCell.y} r={5} fill="none" stroke="#22c55e" strokeWidth="0.15" opacity={0.4} />
            </g>
          )}
        </svg>

        {/* Annotation cards */}
        {showAnnotations && annotations.length > 0 && (
          <div className="absolute z-10 bottom-2 left-2 right-2 flex gap-2 overflow-x-auto pb-1 sm:bottom-auto sm:top-2 sm:left-2 sm:right-auto sm:flex-col sm:max-h-[40%]">
            {annotations.map((a) => (
              <button key={a.id} onClick={() => handleAnnotationClick(a)}
                className={`shrink-0 flex items-center gap-2 px-2 py-1.5 rounded-xl border backdrop-blur-sm transition-all ${
                  activeCell?.id === a.id ? "border-emerald-500 bg-gray-900/95 ring-1 ring-emerald-500/50" : "border-gray-700/60 bg-gray-900/80 hover:bg-gray-800/90"
                }`}>
                <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-[#d8dce4]">
                  <svg viewBox="-6 -6 12 12" className="w-full h-full">
                    {String(a.malariaSpecies) === "sickling-normal" ? (
                      <><circle r={4} fill="#a0a890" opacity={0.6} /><circle r={1.3} fill="#d8dce0" opacity={0.7} /></>
                    ) : String(a.parasiteStage) === "sickle" ? (
                      <path d="M-3.5,0 C-2,-2,2,-2,3.5,0 C2,-0.5,-2,-0.5,-3.5,0 Z" fill="#7a8068" opacity={0.6} />
                    ) : String(a.parasiteStage) === "holly-leaf" ? (
                      <path d="M0,-3 L2,-1 L3,1 L1,3 L-1,2 L-3,0 L-2,-2 Z" fill="#6a7058" opacity={0.6} />
                    ) : (
                      <path d="M-4,0 Q0,-0.8,4,0 Q0,0.8,-4,0 Z" fill="#606848" opacity={0.5} />
                    )}
                  </svg>
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
