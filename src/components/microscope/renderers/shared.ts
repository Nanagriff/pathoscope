/**
 * Shared utilities and types for all SVG renderers.
 */

import type { StainProfile } from "../stainProfiles";
import type { ParasiteStage, MalariaSpecies } from "../types";

/** Round to 4 decimal places — prevents SSR/client hydration mismatch */
export function n(v: number): number {
  return Math.round(v * 10000) / 10000;
}

/** Map depth value to DOF filter URL */
export function dofFilter(depth: number): string | undefined {
  if (depth < 0.55) return undefined;
  if (depth < 0.72) return "url(#dof-slight)";
  if (depth < 0.88) return "url(#dof-medium)";
  return "url(#dof-heavy)";
}

/** Props shared by all cell renderers */
export interface CellProps {
  x: number;
  y: number;
  rotation: number;
  seed: number;
  depth: number;
  stain: StainProfile;
  onClick?: () => void;
  selected?: boolean;
  parasiteStage?: ParasiteStage;
  malariaSpecies?: MalariaSpecies;
}

/** Props for standalone parasite stage renderers (render at origin) */
export interface ParasiteStageProps {
  seed: number;
  baseR: number;
  stain: StainProfile;
  isVivax: boolean;
  species?: MalariaSpecies;
  /** Force Laveran's bib to render (when ParasitizedRBC has already decided this is a bib cell) */
  forceBib?: boolean;
}

/** Props for free-floating parasite renderers (thick film) */
export interface FreeParasiteProps {
  x: number;
  y: number;
  rotation: number;
  seed: number;
  stain: StainProfile;
  species?: MalariaSpecies;
}

/** Props for sickling cell renderers */
export interface SicklingCellProps {
  x: number;
  y: number;
  rotation: number;
  seed: number;
}

/** Build an irregular arc path for parasite ring cytoplasm */
export function parasiteArc(
  rng: () => number,
  cx: number, cy: number, r: number,
  startAngle: number, arcSpan: number,
): string {
  const steps = 8 + Math.floor(rng() * 4);
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startAngle + t * arcSpan;
    const drift = (rng() - 0.5) * 0.4;
    const rVar = r * (1 + drift);
    pts.push([cx + Math.cos(angle) * rVar, cy + Math.sin(angle) * rVar]);
  }
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = (prev[0] + curr[0]) / 2 + (rng() - 0.5) * r * 0.35;
    const cpy = (prev[1] + curr[1]) / 2 + (rng() - 0.5) * r * 0.35;
    d += `Q${cpx.toFixed(2)},${cpy.toFixed(2)},${curr[0].toFixed(2)},${curr[1].toFixed(2)}`;
  }
  return d;
}
