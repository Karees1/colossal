import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './useReveal';

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

// Magnetic button: on mousemove over the element, nudges it toward the
// pointer by (dx*0.22, dy*0.32) from its centre; resets on leave. No-ops on
// touch/coarse pointers and prefers-reduced-motion, per the motion spec.
export function useMagnet() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || isCoarsePointer()) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.32}px)`;
    };

    const handleLeave = () => {
      el.style.transform = '';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      el.style.transform = '';
    };
  }, []);

  return ref;
}
