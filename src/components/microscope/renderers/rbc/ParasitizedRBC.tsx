/**
 * Parasitized RBC — thin film renderer.
 * Composes a host RBC body + parasite stage renderer (clipped inside).
 */

import { createRng, irregularCellPath } from "../../types";
import { n, dofFilter, type CellProps } from "../shared";
import { RingForm } from "../parasites/RingForm";
import { Trophozoite } from "../parasites/Trophozoite";
import { Schizont } from "../parasites/Schizont";
import { Gametocyte } from "../parasites/Gametocyte";

export function ParasitizedRBC({ x, y, rotation, seed, depth, stain, onClick, selected, parasiteStage = "ring", malariaSpecies = "pf" }: CellProps) {
  const rng = createRng(seed);

  const isVivax = malariaSpecies === "pv" || malariaSpecies === "po";
  const isOvale = malariaSpecies === "po";
  const sizeMultiplier = isVivax ? (isOvale ? 1.25 + rng() * 0.2 : 1.4 + rng() * 0.3) : 1;
  const baseR = n((3.1 + rng() * 0.6) * sizeMultiplier);
  // P. ovale: more elongated (oval shape) + higher wobble for fimbriated edges
  const wobble = isOvale ? 0.18 + rng() * 0.12 : 0.10 + rng() * 0.12;
  const ovalStretch = isOvale ? 0.75 + rng() * 0.1 : 1; // compress Y to make oval
  const outline = irregularCellPath(rng, baseR, isOvale ? 12 : 10, wobble);
  const opacity = n((0.80 + rng() * 0.15) * (1 - depth * 0.12));
  const pallorIdx = Math.floor(rng() * 6);
  const pallorOffX = n((rng() - 0.5) * baseR * 0.2);
  const pallorOffY = n((rng() - 0.5) * baseR * 0.2);

  // Schüffner dots for vivax
  const schuffnerDots: { sx: number; sy: number }[] = [];
  if (isVivax) {
    const dotCount = 25 + Math.floor(rng() * 20);
    for (let i = 0; i < dotCount; i++) {
      const a = rng() * Math.PI * 2;
      const d = rng() * baseR * 0.85;
      schuffnerDots.push({ sx: n(Math.cos(a) * d), sy: n(Math.sin(a) * d) });
    }
  }

  const clipId = `prbc-${seed}`;
  const filter = dofFilter(depth);
  const parasiteSeed = seed + 7777;

  // P. falciparum gametocyte with Laveran's bib — NO host RBC, just the banana + faint membrane arc
  // Use a separate RNG seeded differently so it doesn't correlate with cell shape RNG
  const bibRng = createRng(seed * 3 + 9991);
  // consume a few values to decorrelate
  bibRng(); bibRng();
  const showAsBib = parasiteStage === "gametocyte" && malariaSpecies === "pf" && bibRng() < 0.35;

  if (showAsBib) {
    return (
      <g transform={`translate(${x},${y}) rotate(${rotation})`}
         filter={filter} onClick={onClick}
         style={onClick ? { cursor: "pointer" } : undefined}>
        {selected && <circle r={n(baseR + 1.2)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}
        {/* Gametocyte — rendered freely with bib, NOT inside an RBC */}
        <Gametocyte seed={parasiteSeed} baseR={baseR} stain={stain} isVivax={false} species={malariaSpecies} forceBib={true} />
      </g>
    );
  }

  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})${isOvale ? ` scale(1,${ovalStretch})` : ""}`}
       filter={filter} onClick={onClick}
       style={onClick ? { cursor: "pointer" } : undefined}>
      {selected && <circle r={n(baseR + 1.2)} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.7" />}
      <clipPath id={clipId}><path d={outline} /></clipPath>

      {/* Host RBC body */}
      <path d={outline} fill="url(#rbc-grad-parasitized)" opacity={opacity}
        stroke={stain.membraneStroke} strokeWidth="0.08" strokeOpacity={0.3} />
      <ellipse cx={pallorOffX} cy={pallorOffY}
        rx={n(baseR * 0.38)} ry={n(baseR * 0.34)}
        fill={`url(#pallor-${pallorIdx})`} opacity={0.4} />

      {/* Schüffner dots */}
      {schuffnerDots.map((d, i) => (
        <circle key={`sd${i}`} cx={d.sx} cy={d.sy} r={0.12}
          fill="#c88898" opacity={0.3} />
      ))}

      {/* Parasite stage — clipped inside host RBC */}
      <g clipPath={`url(#${clipId})`}>
        {parasiteStage === "schizont" ? (
          <Schizont seed={parasiteSeed} baseR={baseR} stain={stain} isVivax={isVivax} species={malariaSpecies} />
        ) : parasiteStage === "gametocyte" ? (
          <Gametocyte seed={parasiteSeed} baseR={baseR} stain={stain} isVivax={isVivax} species={malariaSpecies} />
        ) : parasiteStage === "trophozoite" ? (
          <Trophozoite seed={parasiteSeed} baseR={baseR} stain={stain} isVivax={isVivax} species={malariaSpecies} />
        ) : (
          <RingForm seed={parasiteSeed} baseR={baseR} stain={stain} isVivax={isVivax} species={malariaSpecies} />
        )}
      </g>
    </g>
  );
}
