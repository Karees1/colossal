import { useEffect, useRef, useState } from 'react';

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Reveal-on-scroll: observes its own element, flips `inView` true once when
// it enters the viewport (fires once, matches the design's IntersectionObserver
// engine + 2.6s safety fallback in case the observer never fires).
export function useReveal({ threshold = 0.14, rootMargin = '0px 0px -6% 0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setInView(true);
        io.unobserve(el);
      }
    }, { threshold, rootMargin });

    io.observe(el);
    const safety = setTimeout(() => setInView(true), 2600);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [threshold, rootMargin]);

  return [ref, inView];
}
