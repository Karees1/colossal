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
          <h3 className="footer-logo">Gentleman</h3>
          <p className="footer-description">
            Premium apparel for the distinguished gentleman.
            Elevate your style with timeless elegance and class.
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
            <li><Link to="/men">Men's Collection</Link></li>
            <li><Link to="/women">Women's Collection</Link></li>
            <li><Link to="/gear">Gear & Accessories</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul className="footer-links">
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns & Exchanges</Link></li>
            <li><Link to="/size-guide">Size Guide</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
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
              <span>info@gentleman.com</span>
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
          <p>&copy; 2024 Gentleman. All rights reserved.</p>
          <div className="payment-methods">
            <span>Pay on Delivery Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;