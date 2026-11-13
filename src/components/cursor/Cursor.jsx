import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../hooks/useReveal';
import './Cursor.css';

function canUseCustomCursor() {
  return !prefersReducedMotion() && window.matchMedia('(pointer: fine)').matches;
}

// Two-layer custom cursor: a dot that follows the pointer instantly, and a
// ring that lags behind with a lerp. Mode (default/link/view) comes from the
// nearest [data-cursor] ancestor, falling back to any native link/button so
// every interactive element gets the "link" treatment without having to
// tag each one by hand. Renders nothing on touch or reduced-motion.
function Cursor() {
  const [enabled] = useState(() => typeof window !== 'undefined' && canUseCustomCursor());
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);
  const primed = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add('custom-cursor-active');

    const handleMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!primed.current) {
        primed.current = true;
        ring.current.x = e.clientX;
        ring.current.y = e.clientY;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        dotRef.current.style.opacity = '1';
      }
      if (ringRef.current) ringRef.current.style.opacity = '1';

      const taggedAncestor = e.target.closest && e.target.closest('[data-cursor]');
      const mode = taggedAncestor
        ? taggedAncestor.getAttribute('data-cursor')
        : (e.target.closest && e.target.closest('a, button')) ? 'link' : 'default';

      if (ringRef.current && ringRef.current.dataset.mode !== mode) {
        ringRef.current.dataset.mode = mode;
      }
    };

    const handleLeaveWindow = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMove);
    document.documentElement.addEventListener('mouseleave', handleLeaveWindow);

    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.16;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.documentElement.removeEventListener('mouseleave', handleLeaveWindow);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-ring" data-mode="default" style={{ opacity: 0 }}>
        <span className="cursor-ring-label">View</span>
      </div>
    </>
  );
}

export default Cursor;
