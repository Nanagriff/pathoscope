"use client";

import { useEffect, useRef } from "react";

/**
 * Animated hero background — floating RBCs, parasites, grain, and optical blur.
 * Pure canvas rendering for performance.
 */
export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    // Cells — floating RBCs and parasitized RBCs
    interface Cell {
      x: number; y: number; r: number;
      vx: number; vy: number;
      pallor: number; // central pallor ratio
      opacity: number;
      parasitized: boolean;
      dotAngle: number;
    }

    const cells: Cell[] = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);
    }

    function init() {
      resize();
      cells.length = 0;
      const count = Math.floor((w * h) / 4000); // density based on area
      for (let i = 0; i < count; i++) {
        cells.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 12 + Math.random() * 10,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1 - 0.02, // slight upward drift
          pallor: 0.3 + Math.random() * 0.15,
          opacity: 0.04 + Math.random() * 0.06,
          parasitized: Math.random() < 0.12,
          dotAngle: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h);

      for (const c of cells) {
        // Move
        c.x += c.vx;
        c.y += c.vy;
        c.dotAngle += 0.003;

        // Wrap
        if (c.x < -c.r * 2) c.x = w + c.r;
        if (c.x > w + c.r * 2) c.x = -c.r;
        if (c.y < -c.r * 2) c.y = h + c.r;
        if (c.y > h + c.r * 2) c.y = -c.r;

        // RBC body
        ctx!.globalAlpha = c.opacity;
        const grad = ctx!.createRadialGradient(c.x, c.y, c.r * c.pallor, c.x, c.y, c.r);
        grad.addColorStop(0, "rgba(200,160,200,0.1)");
        grad.addColorStop(0.5, "rgba(180,130,175,0.3)");
        grad.addColorStop(1, "rgba(160,110,155,0.5)");
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx!.fill();

        // Central pallor
        ctx!.globalAlpha = c.opacity * 0.5;
        ctx!.fillStyle = "rgba(230,220,235,0.3)";
        ctx!.beginPath();
        ctx!.arc(c.x, c.y, c.r * c.pallor, 0, Math.PI * 2);
        ctx!.fill();

        // Parasite ring + dot
        if (c.parasitized) {
          const ringR = c.r * 0.35;
          const rx = c.x + Math.cos(c.dotAngle) * c.r * 0.2;
          const ry = c.y + Math.sin(c.dotAngle) * c.r * 0.2;

          ctx!.globalAlpha = c.opacity * 2.5;
          ctx!.strokeStyle = "rgba(60,20,110,0.6)";
          ctx!.lineWidth = 1.2;
          ctx!.beginPath();
          ctx!.arc(rx, ry, ringR, 0, Math.PI * 1.6);
          ctx!.stroke();

          // Chromatin dot
          ctx!.fillStyle = "rgba(50,15,90,0.8)";
          ctx!.beginPath();
          ctx!.arc(rx + Math.cos(c.dotAngle + 0.5) * ringR, ry + Math.sin(c.dotAngle + 0.5) * ringR, 2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Grain overlay — subtle noise
      ctx!.globalAlpha = 0.015;
      const grainSize = 3;
      for (let gx = 0; gx < w; gx += grainSize * 4) {
        for (let gy = 0; gy < h; gy += grainSize * 4) {
          if (Math.random() > 0.7) {
            ctx!.fillStyle = Math.random() > 0.5 ? "#fff" : "#000";
            ctx!.fillRect(gx, gy, grainSize, grainSize);
          }
        }
      }

      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    init();
    raf = requestAnimationFrame(draw);

    const onResize = () => init();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
