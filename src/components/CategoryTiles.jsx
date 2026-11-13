import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { categories } from './categories';
import './CategoryTiles.css';

function Tile({ name, count, index }) {
  const [ref, inView] = useReveal();
  return (
    <Link
      ref={ref}
      to={`/shop/${name.toLowerCase()}`}
      className={`category-tile ${inView ? 'in' : ''}`}
      style={{ '--d': `${(index % 6) * 60}ms` }}
      data-cursor="view"
    >
      <div className="category-tile-art">
        <Eye size={18} />
      </div>
      <p className="category-tile-name">{name}</p>
      <p className="category-tile-count">{count} piece{count === 1 ? '' : 's'}</p>
    </Link>
  );
}

function CategoryTiles({ counts = {} }) {
  return (
    <section className="category-tiles-section">
      <div className="pgs-header">
        <h2>Shop by category</h2>
      </div>
      <div className="category-tiles-grid">
        {Object.keys(categories).map((name, i) => (
          <Tile key={name} name={name} count={counts[name] || 0} index={i} />
        ))}
      </div>
    </section>
  );
}

export default CategoryTiles;
