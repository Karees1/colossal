import React from 'react';
import { useReveal } from '../hooks/useReveal';
import './HowItWorks.css';

const STEPS = [
  { n: '01', title: 'Choose your size', body: 'Browse by category, pick a piece, tap the size you need — no account required.' },
  { n: '02', title: 'Send it on WhatsApp', body: 'Your bag becomes a message to us with everything we need to confirm your order.' },
  { n: '03', title: 'Pay when it arrives', body: 'We confirm stock and delivery, then you pay the rider — cash or M-Pesa.' },
];

function StepCard({ step, index }) {
  const [ref, inView] = useReveal();
  return (
    <div ref={ref} className={`howitworks-card ${inView ? 'in' : ''}`} style={{ '--d': `${index * 80}ms` }}>
      <span className="howitworks-num">{step.n}</span>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
    </div>
  );
}

function HowItWorks({ heading = 'Ordering is a conversation' }) {
  return (
    <section className="howitworks">
      <h2 className="howitworks-heading">{heading}</h2>
      <div className="howitworks-grid">
        {STEPS.map((step, i) => (
          <StepCard key={step.n} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
