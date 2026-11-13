import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import CategoryTiles from '../components/CategoryTiles';
import ProductGridSection from '../components/ProductGridSection';
import HowItWorks from '../components/HowItWorks';
import VisitPreview from '../components/VisitPreview';
import { supabase } from '../lib/supabaseClient';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function Home() {
  useDocumentTitle();
  const [products, setProducts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // is_new/is_signature land in Phase 3's migration — until then, newest first.
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) {
          setProducts(data.slice(0, 8));
          const counts = {};
          data.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
          setCategoryCounts(counts);
        }
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
      <CategoryTiles counts={categoryCounts} />
      {!loading && (
        <ProductGridSection title="New in store" products={products} viewAllHref="/shop" />
      )}
      <HowItWorks />
      <VisitPreview />
    </div>
  );
}

export default Home;
