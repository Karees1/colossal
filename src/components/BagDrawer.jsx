import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/StoreContext';
import { useOverlay } from '../hooks/useOverlay';
import { useMagnet } from '../hooks/useMagnet';
import { supabase } from '../lib/supabaseClient';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { fmtKES } from '../lib/format';
import { waLink, buildOrderMessage } from '../lib/whatsapp';
import placeholderImg from '../images/placeholder.svg';
import './BagDrawer.css';

function BagDrawer() {
  const { bag, bagOpen, closeBag, updateBagQty, removeFromBag, clearBag, customer, setCustomer } = useStore();
  const containerRef = useOverlay({ open: bagOpen, onClose: closeBag });
  const sendMagnet = useMagnet();
  const [products, setProducts] = useState({});
  const [step, setStep] = useState('review'); // 'review' | 'details'
  const [name, setName] = useState(customer.name || '');
  const [area, setArea] = useState(customer.area || '');
  const [sendHint, setSendHint] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!bagOpen) setStep('review');
  }, [bagOpen]);

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
      })
      .catch(() => { /* ignore — lines render with placeholder data until retried */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bag]);

  const lines = bag.map((l) => ({ ...l, product: products[l.productId] }));
  const subtotal = lines.reduce((sum, l) => sum + (l.product?.price || 0) * l.qty, 0);

  const handleSend = async () => {
    if (!name.trim() || !area.trim()) {
      setSendHint('Add your name and delivery area so we can confirm.');
      return;
    }
    setSendHint('');
    setSending(true);

    const ref = `GM-${Date.now().toString(36).toUpperCase()}`;
    const trimmedName = name.trim();
    const trimmedArea = area.trim();
    setCustomer({ name: trimmedName, area: trimmedArea });

    const orderPayload = {
      user_id: null,
      items: lines.map((l) => ({
        product_id: l.productId,
        title: l.product?.name || null,
        unit_price: l.product?.price || 0,
        quantity: l.qty,
        selected_size: l.size,
        selected_color: l.colour,
      })),
      shipping: { name: trimmedName, area: trimmedArea },
      billing: { name: trimmedName, area: trimmedArea },
      currency: 'KES',
      channel: 'whatsapp',
      ref,
    };

    try {
      await supabase.from('orders').insert(orderPayload);
    } catch (err) {
      // Never block the WhatsApp handoff on a logging failure — the chat
      // itself is the order of record either way.
      console.error('Order logging failed:', err);
    }

    const message = buildOrderMessage(lines, { name: trimmedName, area: trimmedArea }, ref);
    const url = waLink(message);
    const opened = window.open(url, '_blank');
    if (!opened) window.location.href = url;

    clearBag();
    closeBag();
    setSending(false);
    navigate('/order/sent', { state: { ref } });
  };

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
        ) : step === 'review' ? (
          <>
            <div className="bagdrawer-lines">
              {lines.map((l) => (
                <div key={`${l.productId}__${l.size}__${l.colour}`} className="bagdrawer-line">
                  <img
                    src={resolveImageUrl(l.product?.frontimg, placeholderImg)}
                    alt={l.product?.name || ''}
                    className="bagdrawer-thumb"
                    loading="lazy"
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
              <button className="btn btn-primary bagdrawer-next" onClick={() => setStep('details')}>
                Enter delivery details
              </button>
            </div>
          </>
        ) : (
          <div className="bagdrawer-details">
            <button className="bagdrawer-back" onClick={() => setStep('review')}>← Back to bag</button>

            <div className="bagdrawer-field">
              <label htmlFor="bagdrawer-name">Name</label>
              <input
                id="bagdrawer-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="bagdrawer-field">
              <label htmlFor="bagdrawer-area">Delivery area</label>
              <input
                id="bagdrawer-area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Kilimani, Nairobi"
              />
            </div>

            {sendHint && <p className="bagdrawer-hint">{sendHint}</p>}

            <div className="bagdrawer-footer">
              <div className="bagdrawer-total-row">
                <span className="bagdrawer-total-label">Total · Pay on delivery</span>
                <span className="bagdrawer-total-value">{fmtKES(subtotal)}</span>
              </div>
              <p className="bagdrawer-feefine">Delivery fee confirmed on WhatsApp.</p>
              <button ref={sendMagnet} className="btn btn-whatsapp" onClick={handleSend} disabled={sending}>
                <span className="wa-dot" /> {sending ? 'Opening WhatsApp…' : 'Send order on WhatsApp'}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default BagDrawer;
