import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HeroCarousel.css";

const slides = [
  {
    label:    "New Season",
    heading:  "Dress Sharp.\nStand Out.",
    sub:      "Premium shirts, tailored trousers & formal footwear — all in one place.",
    link:     "/shirts",
    cta:      "Shop Shirts",
    accent:   "#C4A44E",
  },
  {
    label:    "Footwear Edit",
    heading:  "Step Into\nConfidence.",
    sub:      "Sneakers, boots & formal shoes crafted for the modern gentleman.",
    link:     "/footwear",
    cta:      "Shop Footwear",
    accent:   "#8AB09A",
  },
  {
    label:    "Outerwear",
    heading:  "Layer Up.\nOwn the Room.",
    sub:      "Jackets, blazers & coats for every occasion.",
    link:     "/outerwear",
    cta:      "Shop Outerwear",
    accent:   "#C4A44E",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => {
    if (idx === current) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 400);
  };

  const s = slides[current];

  return (
    <div className="hero-carousel">
      <div className={`hero-slide ${animating ? "fade-out" : "fade-in"}`}>
        <div className="hero-label">{s.label}</div>
        <h1 className="hero-heading" style={{ "--accent": s.accent }}>
          {s.heading.split("\n").map((line, i) => (
            <span key={i} className={i === 1 ? "accent-line" : ""}>{line}</span>
          ))}
        </h1>
        <p className="hero-sub">{s.sub}</p>
        <Link to={s.link} className="hero-cta" style={{ "--accent": s.accent }}>
          {s.cta}
        </Link>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Side index */}
      <div className="hero-counter">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </div>
  );
}
