/**
 * Giemsa stain background — with DENSE realistic artifacts.
 *
 * Real thick Giemsa films have:
 * - Pink-lavender background (NOT cream/white)
 * - THOUSANDS of tiny purple specks covering every part of the field
 * - Debris CLUSTERS — not just individual circles
 * - Ghost cell outlines everywhere (lysed RBC remnants)
 * - Stain mottling — uneven patches of lighter/darker background
 * - Occasional crescent ghost outlines
 */

import { createRng } from "../types";
import type { StainProfile } from "../stainProfiles";

interface Props {
  width: number;
  height: number;
  stain: StainProfile;
  seed?: number;
  thickFilm?: boolean;
}

export function GiemsaBackground({ width, height, stain, seed = 777, thickFilm = false }: Props) {
  const rng = createRng(seed);
  const r = (v: number) => Math.round(v * 1000) / 1000;

  // ── THICK FILM: pink-lavender, not cream ──
  const bgFill = thickFilm ? "#ede4ee" : stain.background;

  // ── Stain mottling patches (uneven background colour) ──
  const mottleCount = thickFilm ? 30 : 8;
  const mottles: { x: number; y: number; rx: number; ry: number; o: number; dark: boolean }[] = [];
  for (let i = 0; i < mottleCount; i++) {
    mottles.push({
      x: r(rng() * width), y: r(rng() * height),
      rx: r(5 + rng() * 15), ry: r(4 + rng() * 12),
      o: r(0.02 + rng() * 0.04),
      dark: rng() > 0.5,
    });
  }

  // ── Ghost cell outlines ──
  const ghostCount = thickFilm ? 180 : 15;
  const ghosts: { x: number; y: number; rad: number; o: number }[] = [];
  for (let i = 0; i < ghostCount; i++) {
    ghosts.push({
      x: r(rng() * width), y: r(rng() * height),
      rad: r(1.8 + rng() * 2.0),
      o: r(thickFilm ? 0.025 + rng() * 0.04 : 0.01 + rng() * 0.015),
    });
  }

  // ── Tiny specks (the most numerous — creates the grain texture) ──
  const speckCount = thickFilm ? 1200 : 200;
  const specks: { x: number; y: number; rad: number; o: number }[] = [];
  for (let i = 0; i < speckCount; i++) {
    specks.push({
      x: r(rng() * width), y: r(rng() * height),
      rad: r(0.03 + rng() * 0.12),
      o: r(0.06 + rng() * 0.22),
    });
  }

  // ── Medium precipitate particles ──
  const medCount = thickFilm ? 300 : 60;
  const meds: { x: number; y: number; rad: number; o: number }[] = [];
  for (let i = 0; i < medCount; i++) {
    meds.push({
      x: r(rng() * width), y: r(rng() * height),
      rad: r(0.12 + rng() * 0.35),
      o: r(0.08 + rng() * 0.2),
    });
  }

  // ── Debris clusters — groups of 3-8 close-together particles ──
  const clusterCount = thickFilm ? 50 : 10;
  const clusters: { x: number; y: number; rad: number; o: number }[] = [];
  for (let i = 0; i < clusterCount; i++) {
    const cx = rng() * width;
    const cy = rng() * height;
    const count = 3 + Math.floor(rng() * 6);
    for (let j = 0; j < count; j++) {
      clusters.push({
        x: r(cx + (rng() - 0.5) * 3),
        y: r(cy + (rng() - 0.5) * 3),
        rad: r(0.1 + rng() * 0.3),
        o: r(0.08 + rng() * 0.18),
      });
    }
  }

  // ── Larger stain blobs ──
  const blobCount = thickFilm ? 40 : 6;
  const blobs: { x: number; y: number; rad: number; o: number }[] = [];
  for (let i = 0; i < blobCount; i++) {
    blobs.push({
      x: r(rng() * width), y: r(rng() * height),
      rad: r(0.4 + rng() * 1.0),
      o: r(0.04 + rng() * 0.08),
    });
  }

  // ── Refractile bright spots ──
  const brightCount = thickFilm ? 10 : 3;
  const brights: { x: number; y: number; rad: number; o: number }[] = [];
  for (let i = 0; i < brightCount; i++) {
    brights.push({
      x: r(rng() * width), y: r(rng() * height),
      rad: r(0.6 + rng() * 1.5),
      o: r(0.025 + rng() * 0.035),
    });
  }

  const pc = stain.precipitateColour;

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Base fill */}
      <rect x={-50} y={-50} width={width + 100} height={height + 100}
        fill={bgFill} filter="url(#stain-bg)" />

      {/* Stain mottling — uneven background patches */}
      {mottles.map((m, i) => (
        <ellipse key={`mo${i}`} cx={m.x} cy={m.y} rx={m.rx} ry={m.ry}
          fill={m.dark ? pc : "#fffff0"} opacity={m.o} />
      ))}

      {/* Ghost cell outlines */}
      {ghosts.map((g, i) => (
        <circle key={`gh${i}`} cx={g.x} cy={g.y} r={g.rad}
          fill="none" stroke={pc} strokeWidth={0.08} opacity={g.o} />
      ))}

      {/* Tiny specks — dense grain */}
      {specks.map((s, i) => (
        <circle key={`sp${i}`} cx={s.x} cy={s.y} r={s.rad}
          fill={pc} opacity={s.o} />
      ))}

      {/* Medium precipitate */}
      {meds.map((m, i) => (
        <circle key={`md${i}`} cx={m.x} cy={m.y} r={m.rad}
          fill={pc} opacity={m.o} />
      ))}

      {/* Debris clusters */}
      {clusters.map((c, i) => (
        <circle key={`cl${i}`} cx={c.x} cy={c.y} r={c.rad}
          fill={pc} opacity={c.o} />
      ))}

      {/* Larger stain blobs */}
      {blobs.map((b, i) => (
        <circle key={`bl${i}`} cx={b.x} cy={b.y} r={b.rad}
          fill={pc} opacity={b.o} />
      ))}

      {/* Bright spots */}
      {brights.map((b, i) => (
        <circle key={`br${i}`} cx={b.x} cy={b.y} r={b.rad}
          fill="#fffff4" opacity={b.o} />
      ))}

      {/* Microscope grain */}
      <rect x={-50} y={-50} width={width + 100} height={height + 100}
        filter="url(#scope-grain)" opacity={0.10} />

      {/* Illumination */}
      <rect x={-50} y={-50} width={width + 100} height={height + 100}
        fill="url(#illumination)" />

      {/* Vignette */}
      <rect x={-50} y={-50} width={width + 100} height={height + 100}
        fill="url(#vignette-grad)" />
    </g>
  );
}
