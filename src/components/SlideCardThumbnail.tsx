/**
 * Realistic glass microscope slide thumbnail for card previews.
 * Shows a glass rectangle with frosted label end, thin smear, and thick smear drop.
 */

interface Props {
  stage?: string;
  species?: string;
  discipline: string;
  category: string;
  title?: string;
}

export default function SlideCardThumbnail({ stage, species, discipline, title }: Props) {
  const isMalaria = discipline === "malaria";
  // Thin smear colour based on stain
  const thinColor = isMalaria ? "#d8c8d4" : "#e0c4c0";
  const thickColor = isMalaria ? "#3a1020" : "#4a1818";
  // Label text
  const labelText = stage
    ? `${(species === "pv" ? "Pv" : species === "pm" ? "Pm" : species === "po" ? "Po" : "Pf")} ${stage.slice(0, 4)}.`
    : title?.slice(0, 8) ?? "";

  return (
    <div className="w-full h-24 sm:h-28 flex items-center justify-center mb-3 rounded-lg"
      style={{ background: "linear-gradient(135deg, #2a2640 0%, #1a1830 100%)" }}>
      <svg viewBox="0 0 200 68" className="w-[85%] h-auto drop-shadow-lg">
        {/* Glass slide body */}
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0eff4" />
            <stop offset="40%" stopColor="#e8e6ee" />
            <stop offset="100%" stopColor="#dddae4" />
          </linearGradient>
          <linearGradient id="glass-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Slide shadow */}
        <rect x={3} y={5} width={194} height={58} rx={2} fill="#000" opacity={0.15} />

        {/* Glass body */}
        <rect x={1} y={2} width={194} height={58} rx={1.5} fill="url(#glass)"
          stroke="#c8c4d0" strokeWidth={0.5} />

        {/* Glass reflection */}
        <rect x={3} y={3} width={190} height={20} rx={1} fill="url(#glass-edge)" />

        {/* Frosted label end */}
        <rect x={2} y={3} width={42} height={56} rx={1} fill="#e4e0ec" opacity={0.8} />
        <rect x={2} y={3} width={42} height={56} rx={1} fill="none" stroke="#d0ccd8" strokeWidth={0.3} />
        {/* Label text */}
        <text x={23} y={28} textAnchor="middle" fontSize={6} fill="#6058708"
          fontFamily="system-ui" fontWeight="600" opacity={0.6}>
          {labelText.toUpperCase()}
        </text>
        {/* Pencil-written ID line */}
        <line x1={8} y1={38} x2={38} y2={38} stroke="#8880a0" strokeWidth={0.3} opacity={0.4} />
        <line x1={8} y1={43} x2={30} y2={43} stroke="#8880a0" strokeWidth={0.3} opacity={0.3} />

        {/* ── Thin smear — feathered pale smear in the middle ── */}
        <ellipse cx={95} cy={31} rx={42} ry={20}
          fill={thinColor} opacity={0.35} />
        <ellipse cx={90} cy={31} rx={35} ry={16}
          fill={thinColor} opacity={0.25} />
        {/* Feathered edge — thinner toward right */}
        <ellipse cx={110} cy={31} rx={18} ry={12}
          fill={thinColor} opacity={0.15} />

        {/* ── Thick smear — dark circular drop ── */}
        <ellipse cx={160} cy={31} rx={16} ry={16}
          fill={thickColor} opacity={0.85} />
        {/* Slight edge variation */}
        <ellipse cx={160} cy={31} rx={14} ry={14}
          fill={thickColor} opacity={0.4} />
        {/* Highlight on the drop */}
        <ellipse cx={156} cy={26} rx={4} ry={3}
          fill="#ffffff" opacity={0.08} />

        {/* Thin label */}
        <text x={95} y={55} textAnchor="middle" fontSize={4.5} fill="#908898" fontFamily="system-ui" opacity={0.5}>
          Thin
        </text>
        {/* Thick label */}
        <text x={160} y={55} textAnchor="middle" fontSize={4.5} fill="#908898" fontFamily="system-ui" opacity={0.5}>
          Thick
        </text>
      </svg>
    </div>
  );
}
