import { useCallback, useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const started = useRef(false);
  const rafId = useRef<number | null>(null);
  const targetRef = useRef(target);
  targetRef.current = target;

  const ref = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.round(progress * targetRef.current));
            if (progress < 1) rafId.current = requestAnimationFrame(step);
          };
          rafId.current = requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [node, duration]);

  useEffect(() => {
    if (started.current) {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      setCount(target);
    }
  }, [target]);

  return { count, ref };
}
