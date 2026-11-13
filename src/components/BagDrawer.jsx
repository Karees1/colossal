import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { useOverlay } from '../hooks/useOverlay';
import { supabase } from '../lib/supabaseClient';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { fmtKES } from '../lib/format';
import placeholderImg from '../images/placeholder.svg';
import './BagDrawer.css';

function BagDrawer() {
  const { bag, bagOpen, closeBag, updateBagQty, removeFromBag } = useStore();
  const containerRef = useOverlay({ open: bagOpen, onClose: closeBag });
  const [products, setProducts] = useState({});

  useEffect(() => {
    const ids = [...new Set(bag.map((l) => l.productId))];
    const missing = ids.filter((id) => !products[id]);
    if (missing.length === 0) return;
    let cancelled = false;
    supabase
      .from('products')
      .select('id,name,price,frontimg,sizes,colors')
      .in('id', missing)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setProducts((prev) => {
          const next = { ...prev };
          data.forEach((p) => { next[p.id] = p; });
          return next;
        });
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bag]);

  const lines = bag.map((l) => ({ ...l, product: products[l.productId] }));
  const subtotal = lines.reduce((sum, l) => sum + (l.product?.price || 0) * l.qty, 0);

  return (
    <>
      <div
        className={`bagdrawer-overlay ${bagOpen ? 'open' : ''}`}
        onClick={closeBag}
        aria-hidden={!bagOpen}
      />
      <aside
        ref={containerRef}
        className={`bagdrawer ${bagOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
      >
        <div className="bagdrawer-header">
          <h2>Your bag</h2>
          <button className="bagdrawer-close" onClick={closeBag} aria-label="Close bag">×</button>
        </div>

        {lines.length === 0 ? (
          <div className="bagdrawer-empty">
            <h3>Nothing here yet.</h3>
            <p>Tap a size under any piece to add it.</p>
            <Link to="/" className="btn btn-primary" onClick={closeBag}>See new in</Link>
          </div>
        ) : (
          <>
            <div className="bagdrawer-lines">
              {lines.map((l) => (
                <div key={`${l.productId}__${l.size}__${l.colour}`} className="bagdrawer-line">
                  <img
                    src={resolveImageUrl(l.product?.frontimg, placeholderImg)}
                    alt={l.product?.name || ''}
                    className="bagdrawer-thumb"
                  />
                  <div className="bagdrawer-line-info">
                    <p className="bagdrawer-line-name">{l.product?.name || '…'}</p>
                    {(l.size || l.colour) && (
                      <p className="bagdrawer-line-meta">
                        {l.size ? `Size ${l.size}` : ''}{l.size && l.colour ? ' · ' : ''}{l.colour || ''}
                      </p>
                    )}
                    <div className="bagdrawer-qty">
                      <button onClick={() => updateBagQty(l.productId, l.size, l.colour, l.qty - 1)} aria-label="Decrease quantity">−</button>
                      <span>{l.qty}</span>
                      <button onClick={() => updateBagQty(l.productId, l.size, l.colour, l.qty + 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <div className="bagdrawer-line-right">
                    <span className="bagdrawer-line-price">{fmtKES((l.product?.price || 0) * l.qty)}</span>
                    <button
                      className="bagdrawer-remove"
                      onClick={() => removeFromBag(l.productId, l.size, l.colour)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bagdrawer-footer">
              <div className="bagdrawer-total-row">
                <span className="bagdrawer-total-label">Total · Pay on delivery</span>
                <span className="bagdrawer-total-value">{fmtKES(subtotal)}</span>
              </div>
              {/* Delivery-details form + "Order on WhatsApp" added in Phase 3 */}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default BagDrawer;
