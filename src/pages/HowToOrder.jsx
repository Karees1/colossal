import React, { useState } from 'react';
import HowItWorks from '../components/HowItWorks';
import './HowToOrder.css';

const ZONES = [
  { zone: 'Nairobi CBD', fee: 'Owner to supply' },
  { zone: 'Nairobi outskirts', fee: 'Owner to supply' },
  { zone: 'Major towns', fee: 'Owner to supply' },
  { zone: 'Rest of Kenya', fee: 'Owner to supply' },
];

const FAQS = [
  { q: 'Can I collect in store?', a: 'Yes — mention it when we confirm your order on WhatsApp and we\'ll hold it for pickup instead of dispatching a rider.' },
  { q: 'Can I change my order?', a: 'Message us on WhatsApp as soon as possible — we can usually adjust size, colour, or quantity before it\'s dispatched.' },
  { q: 'What if it doesn\'t fit?', a: 'Let us know when it arrives. Our exchange window and process are being finalised — ask on WhatsApp for the current policy.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hto-faq-item">
      <button className="hto-faq-q" onClick={() => setOpen((o) => !o)}>
        {q} <span>{open ? '−' : '+'}</span>
      </button>
      {open && <p className="hto-faq-a">{a}</p>}
    </div>
  );
}

function HowToOrder() {
  return (
    <div className="hto-page">
      <HowItWorks heading="How ordering works" />

      <section className="hto-section">
        <h2>Delivery zones & fees</h2>
        <table className="hto-table">
          <thead>
            <tr><th>Zone</th><th>Fee</th></tr>
          </thead>
          <tbody>
            {ZONES.map((z) => (
              <tr key={z.zone}><td>{z.zone}</td><td className="provisional">{z.fee}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="hto-section">
        <h2>Paying on delivery</h2>
        <p>Pay the rider in cash or by M-Pesa once your order arrives — inspect the piece before you pay.</p>
      </section>

      <section className="hto-section">
        <h2>Exchanges</h2>
        <p className="provisional">Exchange window and process are being finalised — ask on WhatsApp for the current policy.</p>
      </section>

      <section className="hto-section">
        <h2>FAQ</h2>
        <div className="hto-faq">
          {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </section>
    </div>
  );
}

export default HowToOrder;
