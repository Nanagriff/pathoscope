/**
 * SVG <defs> — gradients and filters used by all cell renderers.
 * Dynamically coloured by stain profile.
 */

import type { StainProfile } from "../../stainProfiles";

export function SlideDefs({ stain }: { stain: StainProfile }) {
  return (
    <defs>
      {/* ── RBC gradients (8 variants) ── */}
      {stain.rbcGradients.map((h, i) => (
        <radialGradient key={i} id={`rbc-grad-${i}`}>
          <stop offset="0%" stopColor={h[0]} />
          <stop offset="22%" stopColor={h[1]} />
          <stop offset="50%" stopColor={h[2]} />
          <stop offset="80%" stopColor={h[3]} />
          <stop offset="100%" stopColor={h[4]} />
        </radialGradient>
      ))}

      {/* ── Parasitized RBC gradient ── */}
      <radialGradient id="rbc-grad-parasitized">
        {stain.parasitizedRbcGradient.map((c, i) => (
          <stop key={i} offset={`${[0, 25, 55, 82, 100][i]}%`} stopColor={c} />
        ))}
      </radialGradient>

      {/* ── Central pallor variants (off-centre) ── */}
      {[
        { cx: "55%", cy: "45%", fx: "55%", fy: "42%" },
        { cx: "42%", cy: "52%", fx: "40%", fy: "54%" },
        { cx: "50%", cy: "40%", fx: "52%", fy: "38%" },
        { cx: "48%", cy: "55%", fx: "46%", fy: "58%" },
        { cx: "58%", cy: "50%", fx: "60%", fy: "48%" },
        { cx: "44%", cy: "44%", fx: "42%", fy: "42%" },
      ].map((v, i) => (
        <radialGradient
          key={i} id={`pallor-${i}`}
          cx={v.cx} cy={v.cy} fx={v.fx} fy={v.fy} r="50%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor={stain.pallorStops[0]} />
          <stop offset="40%" stopColor={stain.pallorStops[1]} />
          <stop offset="75%" stopColor={stain.pallorStops[2]} />
          <stop offset="100%" stopColor={stain.pallorStops[3]} />
        </radialGradient>
      ))}

      {/* ── WBC cytoplasm gradients ── */}
      <radialGradient id="neutrophil-cyto">
        <stop offset="0%" stopColor={stain.neutrophilCyto[0]} />
        <stop offset="100%" stopColor={stain.neutrophilCyto[1]} />
      </radialGradient>
      <radialGradient id="eosinophil-cyto">
        <stop offset="0%" stopColor={stain.eosinophilCyto[0]} />
        <stop offset="100%" stopColor={stain.eosinophilCyto[1]} />
      </radialGradient>
      <radialGradient id="lymphocyte-cyto">
        <stop offset="0%" stopColor={stain.lymphocyteCyto[0]} />
        <stop offset="100%" stopColor={stain.lymphocyteCyto[1]} />
      </radialGradient>
      <radialGradient id="monocyte-cyto">
        <stop offset="0%" stopColor={stain.monocyteCyto[0]} />
        <stop offset="100%" stopColor={stain.monocyteCyto[1]} />
      </radialGradient>
      <radialGradient id="basophil-cyto">
        <stop offset="0%" stopColor={stain.basophilCyto[0]} />
        <stop offset="100%" stopColor={stain.basophilCyto[1]} />
      </radialGradient>

      {/* ═══ FILTERS ═══ */}

      {/* Cell-level DOF blur */}
      <filter id="dof-slight"><feGaussianBlur stdDeviation="0.3" /></filter>
      <filter id="dof-medium"><feGaussianBlur stdDeviation="0.7" /></filter>
      <filter id="dof-heavy"><feGaussianBlur stdDeviation="1.4" /></filter>

      {/* Background stain texture */}
      <filter id="stain-bg" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed={3} result="noise" />
        <feColorMatrix in="noise" type="matrix"
          values="0 0 0 0 0.99  0 0 0 0 0.96  0 0 0 0 0.95  0 0 0 0.04 0" result="tinted" />
        <feBlend in="SourceGraphic" in2="tinted" mode="multiply" />
      </filter>

      {/* Microscope grain */}
      <filter id="scope-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="2.0" numOctaves="3" seed={13} result="g" />
        <feColorMatrix in="g" type="saturate" values="0" result="bw" />
        <feComponentTransfer in="bw" result="faded">
          <feFuncA type="linear" slope="0.18" intercept="0" />
        </feComponentTransfer>
      </filter>

      {/* Parasite stain diffusion blur */}
      <filter id="parasite-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="0.4" />
      </filter>

      {/* Vignette */}
      <radialGradient id="vignette-grad" cx="48%" cy="46%" r="52%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="55%" stopColor="transparent" />
        <stop offset="85%" stopColor="rgba(0,0,0,0.06)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
      </radialGradient>

      {/* Illumination */}
      <radialGradient id="illumination" cx="47%" cy="44%" r="58%">
        <stop offset="0%" stopColor="rgba(255,250,240,0.04)" />
        <stop offset="100%" stopColor="rgba(200,208,220,0.04)" />
      </radialGradient>

      {/* WBC nucleus texture — coarse chromatin clumping, uniformly dark */}
      <filter id="nucleus-tex" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="4" seed={11} result="nz" />
        <feColorMatrix in="nz" type="saturate" values="0" result="bw" />
        {/* Raise the noise floor so dark areas stay dark — no bright washout */}
        <feComponentTransfer in="bw" result="raised">
          <feFuncR type="linear" slope="0.3" intercept="0.7" />
          <feFuncG type="linear" slope="0.3" intercept="0.7" />
          <feFuncB type="linear" slope="0.3" intercept="0.7" />
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="raised" mode="multiply" result="textured" />
        <feComposite in="textured" in2="SourceGraphic" operator="in" />
      </filter>

      {/* WBC cytoplasm texture */}
      <filter id="cyto-tex" x="-3%" y="-3%" width="106%" height="106%">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed={17} result="cz" />
        <feColorMatrix in="cz" type="saturate" values="0" result="cbw" />
        <feBlend in="SourceGraphic" in2="cbw" mode="soft-light" result="ct" />
        <feComposite in="ct" in2="SourceGraphic" operator="in" />
      </filter>

      {/* Parasite stain texture */}
      <filter id="parasite-tex" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" seed={23} result="pn" />
        <feColorMatrix in="pn" type="saturate" values="0" result="pbw" />
        <feBlend in="SourceGraphic" in2="pbw" mode="multiply" result="pt" />
        <feGaussianBlur in="pt" stdDeviation="0.08" result="pblur" />
        <feComposite in="pblur" in2="SourceGraphic" operator="in" />
      </filter>

      {/* Chromatin texture */}
      <filter id="chromatin-tex" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="2.0" numOctaves="3" seed={29} result="cn" />
        <feColorMatrix in="cn" type="saturate" values="0" result="cbw2" />
        <feBlend in="SourceGraphic" in2="cbw2" mode="multiply" result="ct2" />
        <feGaussianBlur in="ct2" stdDeviation="0.06" result="cblur" />
        <feComposite in="cblur" in2="SourceGraphic" operator="in" />
      </filter>

      {/* WBC softening — subtle, keeps nuclear edges crisp */}
      <filter id="wbc-soft">
        <feGaussianBlur stdDeviation="0.08" />
      </filter>
    </defs>
  );
}
