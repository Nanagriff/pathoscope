/**
 * Free-floating parasite wrappers for thick film.
 * Each wraps the core stage renderer with position/rotation but no host RBC.
 * Species-aware — passes isVivax to core renderers.
 */

import { type FreeParasiteProps } from "../shared";
import { RingForm } from "./RingForm";
import { Trophozoite } from "./Trophozoite";
import { Schizont } from "./Schizont";
import { Gametocyte } from "./Gametocyte";

const BASE_R = 3.5;

function isVivaxSpecies(sp?: string): boolean {
  return sp === "pv" || sp === "po";
}

export function FreeRing({ x, y, rotation, seed, stain, species }: FreeParasiteProps) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      <RingForm seed={seed} baseR={isVivaxSpecies(species) ? 5 : BASE_R} stain={stain} isVivax={isVivaxSpecies(species)} species={species} />
    </g>
  );
}

export function FreeTrophozoite({ x, y, rotation, seed, stain, species }: FreeParasiteProps) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      <Trophozoite seed={seed} baseR={isVivaxSpecies(species) ? 5 : BASE_R} stain={stain} isVivax={isVivaxSpecies(species)} species={species} />
    </g>
  );
}

export function FreeSchizont({ x, y, rotation, seed, stain, species }: FreeParasiteProps) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      <Schizont seed={seed} baseR={isVivaxSpecies(species) ? 5 : BASE_R} stain={stain} isVivax={isVivaxSpecies(species)} species={species} />
    </g>
  );
}

export function FreeGametocyte({ x, y, rotation, seed, stain, species }: FreeParasiteProps) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}>
      <Gametocyte seed={seed} baseR={isVivaxSpecies(species) ? 5 : BASE_R} stain={stain} isVivax={isVivaxSpecies(species)} species={species} />
    </g>
  );
}
