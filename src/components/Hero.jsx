import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMagnet } from '../hooks/useMagnet';
import './Hero.css';

const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '254700000000';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Hero() {
  const [mounted, setMounted] = useState(prefersReducedMotion());
  const shopMagnet = useMagnet();
  const waMagnet = useMagnet();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <header className={`hero ${mounted ? 'hero-in' : ''}`}>
      <div className="hero-copy">
        <p className="hero-kicker" style={{ '--d': '0ms' }}>
          <span className="hero-kicker-rule" /> Menswear house · Nairobi, Kenya
        </p>
        <h1 className="hero-heading">
          <span className="hero-line hero-line-1" style={{ '--d': '110ms' }}>Tailored</span>
          <span className="hero-line hero-line-2" style={{ '--d': '220ms' }}>Quietly</span>
          <span className="hero-line hero-line-3" style={{ '--d': '330ms' }}>Confident.</span>
        </h1>
        <p className="hero-sub" style={{ '--d': '440ms' }}>
          Shirts, suits and footwear cut for the modern man. Pick your size,
          send your order on WhatsApp, and pay only when it's in your hands.
        </p>
        <div className="hero-cta-row" style={{ '--d': '550ms' }}>
          <Link to="/shop" className="btn btn-primary" ref={shopMagnet}>Shop new in</Link>
          <a
            className="btn btn-outline btn-wa-outline"
            ref={waMagnet}
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello GENTLEMAN, I have a question.')}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="wa-dot" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

export default Hero;
