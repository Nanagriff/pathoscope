/**
 * Wright-Giemsa stain background — warm pink with PBS-specific artifacts.
 *
 * Peripheral blood smear artifacts:
 * - Fewer precipitate specks than Giemsa (cleaner preparation)
 * - Occasional stain granularity
 * - Refractile fat/oil spots
 * - Faint smear streaks in the direction of the film
 */

import { createRng } from "../types";
import type { StainProfile } from "../stainProfiles";

interface Props {
  width: number;
  height: number;
  stain: StainProfile;
  seed?: number;
}

export function WrightGiemsaBackground({ width, height, stain, seed = 888 }: Props) {
  const rng = createRng(seed);
  const n = (v: number) => Math.round(v * 1000) / 1000;

  // ── Stain precipitate — less than Giemsa but still present ──
  const precipCount = 100;
  const precip: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < precipCount; i++) {
    precip.push({
      x: n(rng() * width), y: n(rng() * height),
      r: n(0.05 + rng() * 0.15),
      o: n(0.06 + rng() * 0.18),
    });
  }

  // ── Fine dust grain ──
  const dustCount = 120;
  const dust: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < dustCount; i++) {
    dust.push({
      x: n(rng() * width), y: n(rng() * height),
      r: n(0.03 + rng() * 0.06),
      o: n(0.04 + rng() * 0.1),
    });
  }

  // ── Medium debris ──
  const debrisCount = 20;
  const debris: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < debrisCount; i++) {
    debris.push({
      x: n(rng() * width), y: n(rng() * height),
      r: n(0.15 + rng() * 0.35),
      o: n(0.03 + rng() * 0.07),
    });
  }

  // ── Refractile bright spots (oil/fat) ──
  const brights: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < 4; i++) {
    brights.push({
      x: n(rng() * width), y: n(rng() * height),
      r: n(0.6 + rng() * 1.2),
      o: n(0.02 + rng() * 0.03),
    });
  }

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Base fill — warm pink */}
      <rect x={-50} y={-50} width={width + 100} height={height + 100}
        fill={stain.background} filter="url(#stain-bg)" />

      {/* Dust grain */}
      {dust.map((d, i) => (
        <circle key={`du${i}`} cx={d.x} cy={d.y} r={d.r}
          fill={stain.precipitateColour} opacity={d.o} />
      ))}

      {/* Stain precipitate */}
      {precip.map((p, i) => (
        <circle key={`pr${i}`} cx={p.x} cy={p.y} r={p.r}
          fill={stain.precipitateColour} opacity={p.o} />
      ))}

      {/* Medium debris */}
      {debris.map((d, i) => (
        <circle key={`db${i}`} cx={d.x} cy={d.y} r={d.r}
          fill={stain.precipitateColour} opacity={d.o} />
      ))}

      {/* Bright spots */}
      {brights.map((b, i) => (
        <circle key={`br${i}`} cx={b.x} cy={b.y} r={b.r}
          fill="#fffff0" opacity={b.o} />
      ))}

      {/* Microscope grain */}
      <rect x={-50} y={-50} width={width + 100} height={height + 100}
        filter="url(#scope-grain)" opacity={0.08} />

      {/* Illumination */}
      <rect x={-50} y={-50} width={width + 100} height={height + 100}
        fill="url(#illumination)" />

      {/* Vignette */}
      <rect x={-50} y={-50} width={width + 100} height={height + 100}
        fill="url(#vignette-grad)" />
    </g>
  );
}
