"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "pathoscope-onboarding-seen";

interface Props {
  isMalaria: boolean;
}

export default function SlideOnboarding({ isMalaria }: Props) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const steps = [
    {
      title: "Drag to pan",
      desc: "Click and drag anywhere on the slide to move around the blood film — just like adjusting a real stage.",
      icon: (
        <svg viewBox="0 0 48 48" className="w-full h-full">
          {/* Hand icon with motion lines */}
          <g stroke="currentColor" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            {/* Hand */}
            <path d="M24 34 L24 20 M24 20 C24 18.5 25.5 17 27 17 C28.5 17 30 18.5 30 20 L30 24 M30 20 C30 18.5 31.5 17 33 17 C34.5 17 36 18.5 36 20 L36 28 C36 33 33 36 28 36 L22 36 C19 36 17 34 16 32 L14 28 C13.5 27 14 25.5 15.5 25 C17 24.5 18 25 18.5 26 L20 29 L20 16 C20 14.5 21.5 13 23 13 C24.5 13 24 14.5 24 16" className="ob-draw" />
            {/* Motion arrows */}
            <path d="M8 24 L4 24 M6 22 L4 24 L6 26" className="ob-motion-left" />
            <path d="M40 24 L44 24 M42 22 L44 24 L42 26" className="ob-motion-right" />
          </g>
        </svg>
      ),
    },
    {
      title: "Scroll to zoom",
      desc: "Use your scroll wheel or pinch gesture to zoom in and out. Get closer to examine cell morphology in detail.",
      icon: (
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <g stroke="currentColor" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            {/* Magnifier */}
            <circle cx={22} cy={22} r={10} className="ob-draw" />
            <line x1={29} y1={29} x2={38} y2={38} strokeWidth={2.5} className="ob-draw" />
            {/* Plus inside */}
            <line x1={22} y1={18} x2={22} y2={26} className="ob-zoom-plus" />
            <line x1={18} y1={22} x2={26} y2={22} className="ob-zoom-plus" />
            {/* Zoom arrows */}
            <path d="M8 10 L8 6 M6 8 L8 6 L10 8" className="ob-motion-left" />
            <path d="M8 38 L8 42 M6 40 L8 42 L10 40" className="ob-motion-right" />
          </g>
        </svg>
      ),
    },
    ...(isMalaria
      ? [
          {
            title: "Switch film types",
            desc: "Toggle between Thick and Thin films using the buttons in the toolbar. Thick films are for detection and density estimation. Thin films are for species and stage identification.",
            icon: (
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <g stroke="currentColor" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  {/* Two rectangles = toggle */}
                  <rect x={4} y={16} width={17} height={16} rx={3} className="ob-draw" />
                  <rect x={27} y={16} width={17} height={16} rx={3} strokeDasharray="2 2" className="ob-draw" />
                  {/* Labels */}
                  <text x={12.5} y={26} textAnchor="middle" fill="currentColor" stroke="none" fontSize={6} fontWeight="bold" className="ob-zoom-plus">THK</text>
                  <text x={35.5} y={26} textAnchor="middle" fill="currentColor" stroke="none" fontSize={6} opacity={0.4} className="ob-zoom-plus">THN</text>
                  {/* Arrow between */}
                  <path d="M22 24 L26 24 M24.5 22 L26 24 L24.5 26" className="ob-motion-right" />
                </g>
              </svg>
            ),
          },
        ]
      : []),
    {
      title: "Tap annotations",
      desc: "Click the annotation cards at the edge of the viewer to highlight and learn about specific cells, parasites, and findings.",
      icon: (
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <g stroke="currentColor" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            {/* Annotation card */}
            <rect x={8} y={12} width={32} height={24} rx={4} className="ob-draw" />
            {/* Circle target */}
            <circle cx={18} cy={24} r={5} className="ob-pulse-ring" />
            <circle cx={18} cy={24} r={1.5} fill="currentColor" stroke="none" />
            {/* Text lines */}
            <line x1={27} y1={20} x2={36} y2={20} className="ob-zoom-plus" />
            <line x1={27} y1={24} x2={34} y2={24} className="ob-zoom-plus" />
            <line x1={27} y1={28} x2={32} y2={28} className="ob-zoom-plus" />
          </g>
        </svg>
      ),
    },
  ];

  const dismiss = () => {
    setExiting(true);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setTimeout(() => setVisible(false), 350);
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const current = steps[step];

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${exiting ? "opacity-0" : "opacity-100"}`}
      style={{ background: "rgba(3,7,18,0.75)", backdropFilter: "blur(4px)" }}
    >
      <div className={`max-w-xs w-full mx-5 transition-all duration-400 ${exiting ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}>
        {/* Icon */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 text-purple-400">
          {current.icon}
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-bold text-white">{current.title}</h3>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">{current.desc}</p>
        </div>

        {/* Progress dots + buttons */}
        <div className="flex flex-col items-center gap-5 mt-8">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-purple-400" : "w-1.5 bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={dismiss}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all duration-300 font-medium"
            >
              Skip
            </button>
            <button
              onClick={next}
              className="flex-1 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/20"
            >
              {step < steps.length - 1 ? "Next" : "Got it"}
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes obDraw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes obMotionLeft {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 0.8; transform: translateX(-3px); }
        }
        @keyframes obMotionRight {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 0.8; transform: translateX(3px); }
        }
        @keyframes obZoomPlus {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes obPulseRing {
          0%, 100% { r: 5; opacity: 0.6; }
          50% { r: 7; opacity: 0.3; }
        }
        .ob-draw {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: obDraw 1.2s ease-out forwards;
        }
        .ob-motion-left {
          animation: obMotionLeft 1.5s ease-in-out infinite;
        }
        .ob-motion-right {
          animation: obMotionRight 1.5s ease-in-out infinite;
        }
        .ob-zoom-plus {
          animation: obZoomPlus 1.5s ease-in-out infinite;
        }
        .ob-pulse-ring {
          animation: obPulseRing 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
