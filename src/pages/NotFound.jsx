import React from 'react';
import { Link } from 'react-router-dom';
import { waLink, buildGeneralQuestionMessage } from '../lib/whatsapp';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './NotFound.css';

function NotFound() {
  useDocumentTitle('Page Not Found');
  return (
    <div className="notfound-page">
      <h1>This page has <em>wandered off</em></h1>
      <div className="notfound-cta-row">
        <Link to="/shop" className="btn btn-primary">Back to shop</Link>
        <a
          className="btn btn-outline btn-wa-outline"
          href={waLink(buildGeneralQuestionMessage())}
          target="_blank"
          rel="noreferrer"
        >
          <span className="wa-dot" /> Ask us on WhatsApp
        </a>
      </div>
    </div>
  );
}

export default NotFound;
