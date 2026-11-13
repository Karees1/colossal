import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProductGridSection from '../components/ProductGridSection';
import { supabase } from '../lib/supabaseClient';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // is_new/is_signature land in Phase 3's migration — until then, newest first.
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <Hero />
      {!loading && (
        <ProductGridSection title="New in store" products={products} viewAllHref="/shop" />
      )}
    </div>
  );
}

export default Home;
