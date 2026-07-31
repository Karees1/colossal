import React, { useEffect, useRef, useState } from 'react';
import { useReveal, prefersReducedMotion } from '../hooks/useReveal';

// Counts up from 0 to `value` once it scrolls into view. Purely cosmetic —
// safe to use on both real numbers (price) and static placeholder numbers
// (rating, review count).
function CountUp({ value, decimals = 0, prefix = '', suffix = '' }) {
  const [ref, inView] = useReveal({ threshold: 0.14 });
  const [display, setDisplay] = useState(0);
  const counted = useRef(false);

  useEffect(() => {
    if (!inView || counted.current) return;
    counted.current = true;

    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const t0 = performance.now();
    const dur = 1100;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

export default CountUp;
