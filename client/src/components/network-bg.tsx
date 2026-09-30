import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface NetworkBgProps {
  className?: string;
}

export default function NetworkBg({ className = "" }: NetworkBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number | null = null;
    let onScreen = true;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      resize();
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const count = Math.min(Math.floor((w * h) / 15000), 60);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
      }));
    };

    // Draws one frame; `move` advances the particles first.
    const render = (move: boolean) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const accent = "177, 143, 106";
      const maxDist = 150;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (move) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent}, 0.3)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${accent}, ${0.12 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const tick = () => {
      render(true);
      animationId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      animationId = null;
    };

    // Only animate while the canvas is on screen and the tab is visible,
    // and never when the user has asked for reduced motion.
    const update = () => {
      const shouldRun = !reducedMotion && onScreen && !document.hidden;
      if (shouldRun && animationId === null) tick();
      else if (!shouldRun) stop();
    };

    const onResize = () => {
      init();
      render(false);
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });

    init();
    render(false);
    update();
    observer.observe(canvas);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", update);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", update);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
