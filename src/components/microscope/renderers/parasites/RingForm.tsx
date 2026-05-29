/**
 * Ring form (early trophozoite) — standalone renderer.
 * Renders at origin. Parent positions via transform.
 *
 * Used in:
 * - ParasitizedRBC (thin film, clipped to host RBC)
 * - FreeRing (thick film, standalone)
 */

import { createRng } from "../../types";
import { n, parasiteArc, type ParasiteStageProps } from "../shared";

export function RingForm({ seed, baseR, stain, isVivax }: ParasiteStageProps) {
  const rng = createRng(seed);

  const ringR = isVivax ? (1.2 + rng() * 0.6) : (0.7 + rng() * 0.5);
  const rAngle = rng() * Math.PI * 2;
  const rDist = baseR * (0.10 + rng() * 0.20);
  const cx = Math.cos(rAngle) * rDist;
  const cy = Math.sin(rAngle) * rDist;

  const dotAngle = rng() * Math.PI * 2;
  const dotR = isVivax ? (0.3 + rng() * 0.15) : (0.2 + rng() * 0.12);
  const dotX = cx + Math.cos(dotAngle) * ringR * (0.7 + rng() * 0.3);
  const dotY = cy + Math.sin(dotAngle) * ringR * (0.7 + rng() * 0.3);

  const arcThickMin = isVivax ? 0.18 : 0.08;
  const arcThickMax = isVivax ? 0.32 : 0.22;
  let arcOpacity = isVivax ? 0.45 : 0.35 + rng() * 0.15;

  // Arc variant
  const variant = rng();
  const arcSpan = variant < 0.55
    ? (3.1 + rng() * 1.6)   // partial
    : (4.4 + rng() * 1.5);  // full signet
  const arcStart = dotAngle + Math.PI * 0.3;
  const arcPath = parasiteArc(rng, cx, cy, ringR, arcStart, arcSpan);
  const arcStrokeW = n(arcThickMin + rng() * (arcThickMax - arcThickMin));

  // Chromatin pre-compute
  const dotRy = n(dotR * (0.7 + rng() * 0.5));
  const dotRot = n(rng() * 360);
  const dotOp = n(0.55 + rng() * 0.15);
  const innerDotCx = n(dotX + (rng() - 0.5) * dotR * 0.4);
  const innerDotCy = n(dotY + (rng() - 0.5) * dotR * 0.4);

  // Second dot (headphone) ~15%
  const hasSecond = rng() > 0.85;
  const dot2Angle = dotAngle + Math.PI * (0.6 + rng() * 0.8);
  const dot2R = dotR * (0.7 + rng() * 0.3);
  const dot2X = cx + Math.cos(dot2Angle) * ringR * (0.7 + rng() * 0.3);
  const dot2Y = cy + Math.sin(dot2Angle) * ringR * (0.7 + rng() * 0.3);
  const dot2Ry = n(dot2R * (0.7 + rng() * 0.5));
  const dot2Rot = n(rng() * 360);
  const dot2Op = n(0.50 + rng() * 0.1);

  return (
    <g>
      {/* Ring arc — layered */}
      <path d={arcPath} fill="none" stroke={stain.parasiteRingStroke}
        strokeWidth={n(arcStrokeW * 1.8)} strokeOpacity={n(arcOpacity * 0.3)} strokeLinecap="round" />
      <path d={arcPath} fill="none" stroke={stain.parasiteRingStroke}
        strokeWidth={arcStrokeW} strokeOpacity={arcOpacity} strokeLinecap="round"
        filter="url(#parasite-tex)" />

      {/* Chromatin dot */}
      <ellipse cx={n(dotX)} cy={n(dotY)} rx={n(dotR * 1.15)} ry={n(dotRy * 1.15)}
        transform={`rotate(${dotRot},${n(dotX)},${n(dotY)})`}
        fill={stain.chromatinPrimary} opacity={n(dotOp * 0.4)} />
      <ellipse cx={n(dotX)} cy={n(dotY)} rx={n(dotR)} ry={dotRy}
        transform={`rotate(${dotRot},${n(dotX)},${n(dotY)})`}
        fill={stain.chromatinPrimary} opacity={dotOp} filter="url(#chromatin-tex)" />
      <circle cx={innerDotCx} cy={innerDotCy} r={n(dotR * 0.3)}
        fill={stain.nucleusDenseChromatin} opacity={0.35} />

      {/* Second dot */}
      {hasSecond && (
        <>
          <ellipse cx={n(dot2X)} cy={n(dot2Y)} rx={n(dot2R * 1.1)} ry={n(dot2Ry * 1.1)}
            transform={`rotate(${dot2Rot},${n(dot2X)},${n(dot2Y)})`}
            fill={stain.chromatinPrimary} opacity={n(dot2Op * 0.35)} />
          <ellipse cx={n(dot2X)} cy={n(dot2Y)} rx={n(dot2R)} ry={dot2Ry}
            transform={`rotate(${dot2Rot},${n(dot2X)},${n(dot2Y)})`}
            fill={stain.chromatinPrimary} opacity={dot2Op} filter="url(#chromatin-tex)" />
        </>
      )}
    </g>
  );
}
