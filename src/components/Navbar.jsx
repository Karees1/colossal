import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import {
  FaHeart, FaShoppingCart, FaUser, FaBars,
  FaTimes, FaChevronDown, FaSignOutAlt
} from "react-icons/fa";
import { cartManager } from "../utils/cartManager";
import { useAuth } from "../context/AuthContext";
import { categories } from "./categories";

function Navbar() {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownCloseTimeout = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const update = () => {
      const fav = localStorage.getItem('gentlemanFavorites');
      setFavoritesCount(fav ? JSON.parse(fav).length : 0);
    };
    update();
    window.addEventListener('storage', update);
    window.addEventListener('favoritesUpdated', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('favoritesUpdated', update);
    };
  }, []);

  useEffect(() => {
    const update = () => setCartCount(cartManager.getCartCount());
    update();
    window.addEventListener('storage', update);
    window.addEventListener('cartUpdated', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('cartUpdated', update);
    };
  }, []);

  const closeSidebar = () => {
    setSidebarOpen(false);
    setExpandedCategory(null);
  };

  return (
    <>
      {/* ── Top Bar ── */}
      <nav className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <FaBars />
        </button>

        <Link to="/" className="brand">GENTLEMAN</Link>

        <div className="nav-icons">
          <Link to="/favorites" className="icon-link">
            <FaHeart className="icon" />
            {favoritesCount > 0 && <span className="favorites-badge">{favoritesCount}</span>}
          </Link>

          <Link to="/cart" className="icon-link">
            <FaShoppingCart className="icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <div
            className="icon-link user-dropdown-wrap"
            onMouseEnter={() => {
              clearTimeout(userDropdownCloseTimeout.current);
              setIsUserDropdownOpen(true);
            }}
            onMouseLeave={() => {
              userDropdownCloseTimeout.current = setTimeout(() => setIsUserDropdownOpen(false), 220);
            }}
          >
            <FaUser className="icon" />
            {isUserDropdownOpen && (
              <div className="user-dropdown-menu">
                {isAuthenticated ? (
                  <>
                    <div className="dropdown-header">
                      {user?.username || "Welcome"}
                      {user?.user_type === 'admin' && <span className="admin-badge">Admin</span>}
                    </div>
                    {user?.user_type === 'admin' && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setIsUserDropdownOpen(false); }}
                      className="dropdown-item logout-btn"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>Login</Link>
                    <Link to="/register" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>Sign Up</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Sidebar Overlay ── */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={closeSidebar} />

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand" onClick={closeSidebar}>GENTLEMAN</Link>
          <button className="sidebar-close" onClick={closeSidebar} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          {Object.keys(categories).map((category) => (
            <div key={category} className="sidebar-category">
              <button
                className={`sidebar-category-btn ${expandedCategory === category ? 'active' : ''}`}
                onClick={() => setExpandedCategory(prev => prev === category ? null : category)}
              >
                <span>{category}</span>
                <FaChevronDown className={`chevron ${expandedCategory === category ? 'rotated' : ''}`} />
              </button>

              <div className={`sidebar-subcategories ${expandedCategory === category ? 'expanded' : ''}`}>
                {categories[category].map((sub) => (
                  <Link
                    key={sub}
                    to={`/${category.toLowerCase()}/${sub.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                    className="sidebar-sub-link"
                    onClick={closeSidebar}
                  >
                    {sub}
                  </Link>
                ))}
                <Link
                  to={`/${category.toLowerCase()}`}
                  className="sidebar-sub-link view-all"
                  onClick={closeSidebar}
                >
                  View All {category}
                </Link>
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          {isAuthenticated ? (
            <button onClick={() => { logout(); closeSidebar(); }} className="sidebar-auth-btn">
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <div className="sidebar-auth-links">
              <Link to="/login" className="sidebar-auth-btn" onClick={closeSidebar}>Login</Link>
              <Link to="/register" className="sidebar-auth-btn outline" onClick={closeSidebar}>Sign Up</Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Navbar;
