"use client";

import { useEffect, useRef, useState, useMemo, useCallback, type PointerEvent as RE } from "react";
import type { CellData, Camera, MalariaSpecies, ParasiteStage } from "./microscope/types";
import { generateSlide } from "./microscope/generateSlide";
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

const SLIDE_W = 400;
const SLIDE_H = 300;
const MIN_ZOOM = 1.5;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.12;
const INERTIA_DECAY = 0.92;
const INERTIA_MIN = 0.05;

interface LandingDemoProps {
  stainType: StainType;
  parasitemia: number;
  fields: { seed: number; parasitemia?: number }[];
  species?: MalariaSpecies;
  stage?: ParasiteStage;
}

export default function LandingDemo({
  stainType,
  parasitemia,
  fields: fieldConfigs,
  species = "pf",
  stage = "ring",
}: LandingDemoProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<Camera>({ x: SLIDE_W / 2, y: SLIDE_H / 2, zoom: 3 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const dragRef = useRef<{
    active: boolean; startX: number; startY: number;
    camStartX: number; camStartY: number; lastX: number; lastY: number; lastTime: number;
  } | null>(null);
  const rafRef = useRef(0);
  const [zoom, setZoom] = useState(3);

  const stain: StainProfile = STAIN_PROFILES[stainType];
  const stageWeights = useMemo(() => ({ [stage]: 1 } as Partial<Record<ParasiteStage, number>>), [stage]);

  const slide = useMemo(() => {
    const fc = fieldConfigs[0];
    if (!fc) return null;
    return generateSlide({
      width: SLIDE_W, height: SLIDE_H, cellSpacing: 7.6,
      parasitemia: fc.parasitemia ?? parasitemia,
      seed: fc.seed, smearDirection: 12,
      focusCenter: [0.5, 0.5], focusRadius: 350,
      species, stageWeights,
    });
  }, [fieldConfigs, parasitemia, species, stageWeights]);

  const cells = slide?.cells ?? [];
  const artifacts = slide?.artifacts ?? [];

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

  // Inertia
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
        applyCamera();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [applyCamera]);

  useEffect(() => { applyCamera(); }, [applyCamera]);

  // Pointer events
  const onPointerDown = (e: RE<SVGSVGElement>) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const cam = cameraRef.current;
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, camStartX: cam.x, camStartY: cam.y, lastX: e.clientX, lastY: e.clientY, lastTime: performance.now() };
    velRef.current = { vx: 0, vy: 0 };
  };

  const onPointerMove = (e: RE<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag?.active) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cam = cameraRef.current;
    const svgAspect = rect.width / (rect.height || 1);
    const viewW = SLIDE_W / cam.zoom;
    const scaleX = viewW / rect.width;
    const scaleY = (viewW / svgAspect) / rect.height;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    cam.x = drag.camStartX - dx * scaleX;
    cam.y = drag.camStartY - dy * scaleY;
    const now = performance.now();
    const dt = now - drag.lastTime || 1;
    velRef.current = { vx: (e.clientX - drag.lastX) / dt * 16, vy: (e.clientY - drag.lastY) / dt * 16 };
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    drag.lastTime = now;
    applyCamera();
  };

  const onPointerUp = () => { if (dragRef.current) dragRef.current.active = false; };

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const cam = cameraRef.current;
    const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
    cam.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, cam.zoom * factor));
    setZoom(cam.zoom);
    applyCamera();
  }, [applyCamera]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // Render cells
  const sortedCells = useMemo(() => [...cells].sort((a, b) => a.zIndex - b.zIndex), [cells]);

  const renderCell = useCallback((cell: CellData) => {
    const props = {
      x: cell.x, y: cell.y, rotation: cell.rotation,
      seed: cell.seed, depth: cell.depth, stain,
      parasiteStage: cell.parasiteStage,
      malariaSpecies: cell.malariaSpecies,
    };
    switch (cell.type) {
      case "rbc": return <NormalRBC key={cell.id} {...props} />;
      case "parasitized-rbc": return <ParasitizedRBC key={cell.id} {...props} />;
      case "neutrophil": return <Neutrophil key={cell.id} {...props} />;
      case "eosinophil": return <Eosinophil key={cell.id} {...props} />;
      case "basophil": return <Basophil key={cell.id} {...props} />;
      case "lymphocyte": return <Lymphocyte key={cell.id} {...props} />;
      case "monocyte": return <Monocyte key={cell.id} {...props} />;
      case "platelet": return <Platelet key={cell.id} {...props} />;
      default: return null;
    }
  }, [stain]);

  if (!slide) return null;

  return (
    <div ref={containerRef} className="w-full h-full relative select-none" style={{ touchAction: "none" }}>
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        viewBox={`${SLIDE_W / 2 - SLIDE_W / 6} ${SLIDE_H / 2 - SLIDE_H / 6} ${SLIDE_W / 3} ${SLIDE_H / 3}`}
        preserveAspectRatio="xMidYMid slice"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <SlideDefs stain={stain} />
        {/* Background */}
        <rect x={-20} y={-20} width={SLIDE_W + 40} height={SLIDE_H + 40} fill={stain.background} />
        {/* Artifacts */}
        {artifacts.map((a, i) => (
          <circle key={`a${i}`} cx={a.x} cy={a.y} r={a.r} fill={a.type === "precipitate" ? stain.precipitateColour : a.type === "bubble" ? "rgba(255,255,255,0.08)" : "#fffff0"} opacity={a.opacity} />
        ))}
        {/* Cells */}
        {sortedCells.map(renderCell)}
      </svg>

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-gray-900/70 border border-gray-700/30 backdrop-blur-sm pointer-events-none">
        <span className="text-[10px] text-gray-400 font-[family-name:var(--font-geist-mono)] tabular-nums">{zoom.toFixed(1)}x</span>
      </div>

      {/* Touch hint */}
      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-gray-900/70 border border-gray-700/30 backdrop-blur-sm pointer-events-none sm:hidden">
        <span className="text-[10px] text-gray-400">Drag to pan · Pinch to zoom</span>
      </div>
    </div>
  );
}
