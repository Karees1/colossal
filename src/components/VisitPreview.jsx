import React from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { waLink, buildFittingMessage } from '../lib/whatsapp';
import './VisitPreview.css';

function VisitPreview() {
  const [ref, inView] = useReveal();

  return (
    <section ref={ref} className={`visitpreview ${inView ? 'in' : ''}`}>
      <div className="visitpreview-map" aria-hidden="true">
        <span>Map — coming soon</span>
      </div>
      <div className="visitpreview-copy">
        <p className="visitpreview-kicker">Visit the shop</p>
        <h2>Try it on <em>in person</em></h2>
        <p className="visitpreview-body">
          Prefer to see it before you buy it? Come by our Nairobi shop — try
          on any piece, get fitted, and take it home the same day.
        </p>
        <div className="visitpreview-cta-row">
          <Link to="/visit" className="btn btn-primary">Visit the shop</Link>
          <a
            className="btn btn-outline btn-wa-outline"
            href={waLink(buildFittingMessage())}
            target="_blank"
            rel="noreferrer"
          >
            <span className="wa-dot" /> Book a fitting
          </a>
        </div>
      </div>
    </section>
  );
}

export default VisitPreview;
