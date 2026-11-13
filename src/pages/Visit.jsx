import React from 'react';
import { waLink, buildFittingMessage } from '../lib/whatsapp';
import './Visit.css';

const FITTING_OPTIONS = [
  { title: 'Suit fitting', sub: '45 min' },
  { title: 'Shirt & trouser fitting', sub: '20 min' },
  { title: 'Alterations drop-off', sub: '' },
];

function Visit() {
  return (
    <div className="visit-page">
      <header className="visit-hero">
        <h1>Our <em>Nairobi</em> shop</h1>
      </header>

      <section className="visit-info">
        <dl className="visit-info-list">
          <dt>Address</dt><dd className="provisional">Details coming soon</dd>
          <dt>Landmark</dt><dd className="provisional">Details coming soon</dd>
          <dt>Hours</dt><dd className="provisional">Details coming soon</dd>
          <dt>Parking</dt><dd className="provisional">Details coming soon</dd>
          <dt>WhatsApp</dt>
          <dd>
            <a href={waLink('Hello GENTLEMAN, I have a question.')} target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
          </dd>
        </dl>
        <div className="visit-map" aria-hidden="true"><span>Map — coming soon</span></div>
      </section>

      <section className="visit-fitting">
        <h2>Book a fitting</h2>
        <div className="visit-fitting-grid">
          {FITTING_OPTIONS.map((opt) => (
            <a
              key={opt.title}
              className="visit-fitting-card"
              href={waLink(buildFittingMessage())}
              target="_blank"
              rel="noreferrer"
            >
              <h3>{opt.title}</h3>
              {opt.sub && <span>{opt.sub}</span>}
            </a>
          ))}
        </div>
      </section>

      <section className="visit-gallery">
        <div className="visit-gallery-item"><span>Exterior — coming soon</span></div>
        <div className="visit-gallery-item"><span>Interior — coming soon</span></div>
        <div className="visit-gallery-item"><span>Fitting room — coming soon</span></div>
      </section>
    </div>
  );
}

export default Visit;
