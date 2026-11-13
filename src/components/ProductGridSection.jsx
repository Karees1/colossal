import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductGridSection.css';

function ProductGridSection({ title, products, viewAllHref }) {
  return (
    <section className="pgs-section">
      <div className="pgs-header">
        <h2>{title}</h2>
        {viewAllHref && <Link to={viewAllHref} className="pgs-viewall">View all pieces →</Link>}
      </div>

      {products.length === 0 ? (
        <p className="pgs-empty">Nothing here yet.</p>
      ) : (
        <div className="pgs-grid">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGridSection;
