import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { supabase } from '../lib/supabaseClient';
import { waLink, buildSavedListMessage } from '../lib/whatsapp';
import ProductGridSection from '../components/ProductGridSection';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Saved.css';

function Saved() {
  useDocumentTitle('Saved');
  const { saved } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (saved.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .in('id', saved)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [saved]);

  if (!loading && saved.length === 0) {
    return (
      <div className="saved-page saved-empty">
        <h1>Nothing saved yet.</h1>
        <p>Save pieces you like with the heart.</p>
        <Link to="/shop" className="btn btn-primary">Shop new in</Link>
      </div>
    );
  }

  return (
    <div className="saved-page">
      <div className="saved-header">
        <h1>Saved pieces</h1>
        <p className="saved-note">Saved on this device only — no account needed.</p>
      </div>

      {!loading && products.length > 0 && (
        <a
          className="btn btn-outline btn-wa-outline saved-wa-cta"
          href={waLink(buildSavedListMessage(products))}
          target="_blank"
          rel="noreferrer"
        >
          <span className="wa-dot" /> Send my saved list on WhatsApp
        </a>
      )}

      {!loading && <ProductGridSection products={products} />}
    </div>
  );
}

export default Saved;
