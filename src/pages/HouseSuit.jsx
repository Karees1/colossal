import React, { useEffect, useState } from 'react';
import { useStore } from '../store/StoreContext';
import { supabase } from '../lib/supabaseClient';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { fmtKES } from '../lib/format';
import { showToast } from '../components/Toast';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import placeholderImg from '../images/placeholder.svg';
import './HouseSuit.css';

const CHAPTERS = [
  {
    eyebrow: 'Cloth',
    heading: 'Super 120s wool',
    body: 'Woven from Super 120s wool for a fibre fine enough to drape cleanly, with the weight to hold its shape through a long day — not the thin, shiny suiting that reads cheap under office light.',
  },
  {
    eyebrow: 'Cut',
    heading: 'Half-canvassed, hand-finished',
    body: 'A half-canvas construction lets the jacket move with you and soften with wear, rather than sitting rigid like a fused, mass-produced shell. Every piece is finished by hand at our Nairobi atelier.',
  },
  {
    eyebrow: 'Finish',
    heading: 'Built to outlast the trend',
    body: 'Considered construction throughout — the kind of suit you have altered and re-worn for a decade, not replaced after one season.',
  },
];

function HouseSuit() {
  useDocumentTitle('The House Suit');
  const { addToBag } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('products')
      .select('*')
      .ilike('name', '%house suit%')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleAdd = () => {
    if (!product) return;
    if (!selectedSize && product.sizes?.length) {
      showToast('Please select a size first', 'error');
      return;
    }
    addToBag(product.id, selectedSize, null, 1);
    showToast(`${product.name} added to bag`);
  };

  const heroImg = resolveImageUrl(product?.frontimg, placeholderImg);

  return (
    <div className="housesuit-page">
      <header className="housesuit-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="housesuit-hero-overlay">
          <p className="housesuit-kicker">The Signature</p>
          <h1>The House Suit</h1>
        </div>
      </header>

      {CHAPTERS.map((ch, i) => (
        <section key={ch.eyebrow} className={`housesuit-chapter ${i % 2 === 1 ? 'reverse' : ''}`}>
          <div className="housesuit-chapter-art" />
          <div className="housesuit-chapter-copy">
            <p className="housesuit-kicker">{ch.eyebrow}</p>
            <h2>{ch.heading}</h2>
            <p>{ch.body}</p>
          </div>
        </section>
      ))}

      <section className="housesuit-details">
        <h2>Details</h2>
        <dl>
          <dt>Construction</dt><dd>Half-canvas, hand-finished</dd>
          <dt>Fabric</dt><dd>Super 120s wool</dd>
          <dt>Origin</dt><dd>Cut &amp; sewn in Nairobi</dd>
        </dl>
      </section>

      {!loading && product && (
        <section className="housesuit-buy">
          <span className="housesuit-price">{fmtKES(product.price)}</span>
          {product.sizes?.length > 0 && (
            <div className="housesuit-sizes">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`housesuit-size ${selectedSize === s ? 'on' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="housesuit-buy-actions">
            <button className="btn btn-primary" onClick={handleAdd}>Add to bag</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default HouseSuit;
