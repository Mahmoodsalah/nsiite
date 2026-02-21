import { useEffect, useRef, useState, useCallback } from "react";

export function useAnimateOnScroll<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export function AnimateIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
}) {
  const { ref, isVisible } = useAnimateOnScroll();

  const transforms: Record<string, string> = {
    up: "translateY(30px)",
    left: "translateX(-30px)",
    right: "translateX(30px)",
    fade: "translateY(0)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0)" : transforms[direction],
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export function StaggerChildren({
  children,
  className = "",
  staggerDelay = 0.1,
  direction = "up",
}: {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "left" | "right" | "fade";
}) {
  const { ref, isVisible } = useAnimateOnScroll();

  const transforms: Record<string, string> = {
    up: "translateY(30px)",
    left: "translateX(-30px)",
    right: "translateX(30px)",
    fade: "translateY(0)",
  };

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translate(0)" : transforms[direction],
            transition: `opacity 0.6s ease ${i * staggerDelay}s, transform 0.6s ease ${i * staggerDelay}s`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
