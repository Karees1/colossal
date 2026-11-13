import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { useReveal } from '../hooks/useReveal';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { fmtKES } from '../lib/format';
import { showToast } from './Toast';
import placeholderImg from '../images/placeholder.svg';
import './ProductCard.css';

function ProductCard({ product, index = 0 }) {
  const { isSaved, toggleSaved, addToBag, openQuickLook } = useStore();
  const [ref, inView] = useReveal();
  const saved = isSaved(product.id);
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const defaultColour = Array.isArray(product.colors) && product.colors[0] ? product.colors[0].name : null;

  const frontSrc = resolveImageUrl(product.frontimg, placeholderImg);
  const backSrc = resolveImageUrl(product.backimg || product.frontimg, placeholderImg);

  const handleQuickAdd = (size) => {
    addToBag(product.id, size, defaultColour, 1);
    showToast(`${product.name} · Size ${size} added`);
  };

  return (
    <article
      ref={ref}
      className={`product-card ${inView ? 'in-view' : ''}`}
      style={{ '--d': `${(index % 4) * 80}ms` }}
    >
      <div className="product-card-image-wrap">
        <Link
          to={`/product/${product.slug || product.id}`}
          className="product-card-link"
          aria-label={product.name}
          data-cursor="view"
        >
          <img src={frontSrc} alt={product.name} className="product-card-img front" loading="lazy" />
          <img src={backSrc} alt="" aria-hidden="true" className="product-card-img back" loading="lazy" />
        </Link>

        {product.is_signature && <span className="product-card-badge gold">Signature</span>}
        {!product.is_signature && product.is_new && <span className="product-card-badge">New</span>}

        <button
          className={`product-card-heart ${saved ? 'is-saved' : ''}`}
          onClick={() => toggleSaved(product.id)}
          aria-label={saved ? 'Remove from saved' : 'Save'}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>

        <button
          className="product-card-quicklook"
          onClick={() => openQuickLook(product.id)}
          aria-label="Quick look"
        >
          <Eye size={16} />
        </button>

        {sizes.length > 0 && (
          <div className="product-card-quickadd">
            <span className="product-card-quickadd-label">Add</span>
            {sizes.map((size) => (
              <button key={size} onClick={() => handleQuickAdd(size)}>{size}</button>
            ))}
          </div>
        )}
      </div>

      <Link to={`/product/${product.slug || product.id}`} className="product-card-info">
        <p className="product-card-name">{product.name}</p>
        <div className="product-card-meta">
          <span className="product-card-material">{product.material || product.sub_category}</span>
          <span className="product-card-price">{fmtKES(product.price)}</span>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
