import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h3 className="footer-logo">GENTLEMAN</h3>
          <p className="footer-description">
            Premium gym apparel for every body. Built for performance,
            designed for style — right here in Nairobi.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shirts">Shirts</Link></li>
            <li><Link to="/trousers">Trousers</Link></li>
            <li><Link to="/footwear">Footwear</Link></li>
            <li><Link to="/outerwear">Outerwear</Link></li>
            <li><Link to="/essentials">Essentials</Link></li>
            <li><Link to="/accessories">Accessories</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div className="footer-section">
          <h4>My Account</h4>
          <ul className="footer-links">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="contact-info">
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>Nairobi, Kenya</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+254 7XX XXX XXX</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>info@colossalgainz.co.ke</span>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="newsletter">
            <h5>Stay Updated</h5>
            <p>Get the latest on new products and promotions</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {new Date().getFullYear()} GENTLEMAN. All rights reserved.</p>
          <div className="payment-methods">
            <span>Pay on Delivery Available | M-Pesa Accepted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
