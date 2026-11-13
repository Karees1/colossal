import React, { useState } from 'react';
import { waLink, buildSizeHelpMessage } from '../lib/whatsapp';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './SizeGuide.css';

const TABS = {
  'Shirts & tops': {
    rows: [
      ['S', '92–97', '76–81'],
      ['M', '97–102', '81–86'],
      ['L', '102–107', '86–91'],
      ['XL', '107–112', '91–97'],
      ['XXL', '112–117', '97–102'],
    ],
    cols: ['Size', 'Chest (cm)', 'Waist (cm)'],
    note: 'Oxford shirts run true; our more casual cuts can run a touch generous.',
  },
  'Trousers & jeans': {
    rows: [
      ['28', '71–74', ''],
      ['30', '76–79', ''],
      ['32', '81–84', ''],
      ['34', '86–89', ''],
      ['36', '91–94', ''],
    ],
    cols: ['Waist size', 'Waist (cm)', ''],
    note: 'Chinos are slim through the leg — size up if you prefer a relaxed fit.',
  },
  'Suits & blazers': {
    rows: [
      ['38', '92–96', ''],
      ['40', '97–101', ''],
      ['42', '102–106', ''],
      ['44', '107–111', ''],
    ],
    cols: ['Size', 'Chest (cm)', ''],
    note: 'The House Suit is half-canvassed — it will mould to you slightly over the first few wears.',
  },
  'Footwear': {
    rows: [
      ['39', '25.0', ''],
      ['40', '25.6', ''],
      ['41', '26.3', ''],
      ['42', '27.0', ''],
    ],
    cols: ['EU size', 'Foot length (cm)', ''],
    note: 'Leather will stretch slightly with wear — if between sizes, size down.',
  },
  'Belts': {
    rows: [
      ['32', '81', ''],
      ['34', '86', ''],
      ['36', '91', ''],
      ['38', '97', ''],
    ],
    cols: ['Size', 'Waist (cm)', ''],
    note: 'Pick the size matching your trouser waist, not your belt loop count.',
  },
};

function SizeGuide() {
  useDocumentTitle('Size Guide');
  const [active, setActive] = useState(Object.keys(TABS)[0]);
  const tab = TABS[active];

  return (
    <div className="sizeguide-page">
      <h1>Size guide</h1>
      <p className="sizeguide-note provisional">
        Measurements below are placeholders — the owner will replace these with real
        measurements before launch.
      </p>

      <div className="sizeguide-tabs">
        {Object.keys(TABS).map((key) => (
          <button
            key={key}
            className={`sizeguide-tab ${active === key ? 'on' : ''}`}
            onClick={() => setActive(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <table className="sizeguide-table">
        <thead>
          <tr>{tab.cols.filter(Boolean).map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {tab.rows.map((row) => (
            <tr key={row[0]}>{row.filter((_, i) => tab.cols[i]).map((cell, i) => <td key={i}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>

      <p className="sizeguide-fitnote">{tab.note}</p>

      <a
        className="btn btn-outline btn-wa-outline sizeguide-cta"
        href={waLink(buildSizeHelpMessage())}
        target="_blank"
        rel="noreferrer"
      >
        <span className="wa-dot" /> Between sizes? Send your measurements on WhatsApp
      </a>
    </div>
  );
}

export default SizeGuide;
