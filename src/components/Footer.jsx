import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '254700000000';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">GENTLEMAN</h3>
          <p className="footer-description">
            Tailored menswear, considered construction — hand-finished
            at our Nairobi atelier and built to last.
          </p>
          <a
            className="footer-whatsapp-btn"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello GENTLEMAN, I have a question.')}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>

        <div className="footer-section">
          <h4>Shop</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">All pieces</Link></li>
            <li><Link to="/shop/shirts">Shirts</Link></li>
            <li><Link to="/shop/trousers">Trousers</Link></li>
            <li><Link to="/shop/footwear">Footwear</Link></li>
            <li><Link to="/shop/outerwear">Outerwear</Link></li>
            <li><Link to="/shop/essentials">Essentials</Link></li>
            <li><Link to="/shop/accessories">Accessories</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Help</h4>
          <ul className="footer-links">
            <li><Link to="/how-to-order">How ordering works</Link></li>
            <li><Link to="/visit">Visit the shop</Link></li>
            <li><Link to="/size-guide">Size guide</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <div className="contact-info">
            <div className="contact-item">
              <MapPin className="contact-icon" size={15} />
              <span>Nairobi, Kenya <em className="provisional">(details coming soon)</em></span>
            </div>
            <div className="contact-item">
              <Phone className="contact-icon" size={15} />
              <span className="provisional">Phone coming soon</span>
            </div>
            <div className="contact-item">
              <Mail className="contact-icon" size={15} />
              <span>info@gentleman.co.ke</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {new Date().getFullYear()} GENTLEMAN. All rights reserved.</p>
          <div className="footer-bottom-right">
            <span>Pay on Delivery — Nairobi-wide</span>
            <Link to="/admin/login" className="footer-admin-link">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
