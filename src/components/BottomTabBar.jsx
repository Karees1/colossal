import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, MessageCircle } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import './BottomTabBar.css';

const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '254700000000';

function BottomTabBar() {
  const { bagCount, saved, openBag } = useStore();
  const location = useLocation();

  return (
    <nav className="bottomtabs" aria-label="Primary">
      <Link to="/" className={`bottomtabs-tab ${location.pathname === '/' ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link to="/shop" className={`bottomtabs-tab ${location.pathname.startsWith('/shop') ? 'active' : ''}`}>
        <ShoppingBag size={20} />
        <span>Shop</span>
      </Link>
      <Link to="/saved" className={`bottomtabs-tab ${location.pathname === '/saved' ? 'active' : ''}`}>
        <div className="bottomtabs-icon-wrap">
          <Heart size={20} />
          {saved.length > 0 && <span className="bottomtabs-badge">{saved.length}</span>}
        </div>
        <span>Saved</span>
      </Link>
      <button className="bottomtabs-tab bottomtabs-bag" onClick={openBag}>
        <div className="bottomtabs-icon-wrap">
          <ShoppingBag size={20} />
          {bagCount > 0 && <span className="bottomtabs-badge bottomtabs-badge-gold">{bagCount}</span>}
        </div>
        <span>Bag</span>
      </button>
      <a
        className="bottomtabs-tab bottomtabs-wa"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello GENTLEMAN, I have a question.')}`}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={20} />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
}

export default BottomTabBar;
