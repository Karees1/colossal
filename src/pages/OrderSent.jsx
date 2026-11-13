import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { waLink, buildGeneralQuestionMessage } from '../lib/whatsapp';
import './OrderSent.css';

function OrderSent() {
  const location = useLocation();
  const ref = location.state?.ref;

  useEffect(() => { document.title = 'Order sent — GENTLEMAN'; }, []);

  return (
    <div className="ordersent-page">
      <div className="ordersent-check" aria-hidden="true">✓</div>
      <h1>Your order is with us on WhatsApp</h1>
      <p className="ordersent-body">
        We'll confirm stock, delivery time and fee within the hour. You pay
        only when it arrives.
      </p>

      {ref ? (
        <p className="ordersent-ref">Order ref: <strong>{ref}</strong></p>
      ) : (
        <p className="ordersent-fallback">
          Didn't open? Message us directly —{' '}
          <a href={waLink(buildGeneralQuestionMessage())} target="_blank" rel="noreferrer">
            chat on WhatsApp
          </a>.
        </p>
      )}

      <div className="ordersent-steps">
        <div><span>01</span>We confirm stock & delivery</div>
        <div><span>02</span>A rider is dispatched</div>
        <div><span>03</span>You pay on arrival</div>
      </div>

      <Link to="/shop" className="btn btn-outline">Continue shopping</Link>
    </div>
  );
}

export default OrderSent;
