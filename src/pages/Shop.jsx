import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { categories } from '../components/categories';
import ProductGridSection from '../components/ProductGridSection';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Shop.css';

function titleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toKebab(str) {
  return str.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
}

function Shop() {
  const { category, sub } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase.from('products').select('*');
        if (category) query = query.ilike('category', category);
        const { data, error: fetchError } = await query;
        if (fetchError) throw new Error(fetchError.message);

        // Filter by subcategory if provided (kebab-case URL vs DB string)
        let filtered = data || [];
        if (sub) {
          filtered = filtered.filter((p) => p.sub_category && toKebab(p.sub_category) === sub.toLowerCase());
        }
        if (!cancelled) setProducts(filtered);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, [category, sub]);

  const title = sub
    ? sub.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : category
      ? titleCase(category)
      : 'All pieces';

  const matchedCategoryKey = category
    ? Object.keys(categories).find((c) => c.toLowerCase() === category.toLowerCase())
    : null;

  useDocumentTitle(title);

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>{title}</h1>
      </div>

      <div className="shop-chips">
        <Link to="/shop" className={`shop-chip ${!category ? 'on' : ''}`}>All</Link>
        {Object.keys(categories).map((c) => (
          <Link key={c} to={`/shop/${c.toLowerCase()}`} className={`shop-chip ${matchedCategoryKey === c ? 'on' : ''}`}>
            {c}
          </Link>
        ))}
      </div>

      {matchedCategoryKey && (
        <div className="shop-chips shop-chips-sub">
          <Link to={`/shop/${category.toLowerCase()}`} className={`shop-chip ${!sub ? 'on' : ''}`}>All {matchedCategoryKey}</Link>
          {categories[matchedCategoryKey].map((s) => {
            const subKebab = toKebab(s);
            return (
              <Link
                key={s}
                to={`/shop/${category.toLowerCase()}/${subKebab}`}
                className={`shop-chip ${sub === subKebab ? 'on' : ''}`}
              >
                {s}
              </Link>
            );
          })}
        </div>
      )}

      {loading ? (
        <p className="shop-status">Loading products...</p>
      ) : error ? (
        <p className="shop-status shop-status-error">Error: {error}</p>
      ) : products.length === 0 ? (
        <p className="shop-status">Nothing in that combination.</p>
      ) : (
        <ProductGridSection products={products} />
      )}
    </div>
  );
}

export default Shop;
