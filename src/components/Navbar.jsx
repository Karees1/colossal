import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { Menu, X, ChevronDown, Heart, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../store/StoreContext";
import { categories } from "./categories";

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { saved, bagCount, openBag } = useStore();
  const bagBtnRef = useRef(null);
  const prevBagCount = useRef(bagCount);

  useEffect(() => {
    if (bagCount > prevBagCount.current && bagBtnRef.current) {
      const el = bagBtnRef.current;
      el.classList.remove('bump');
      // eslint-disable-next-line no-unused-expressions
      void el.offsetWidth; // restart animation
      el.classList.add('bump');
    }
    prevBagCount.current = bagCount;
  }, [bagCount]);

  const closeSidebar = () => {
    setSidebarOpen(false);
    setExpandedCategory(null);
  };

  return (
    <>
      <div className="announcement-bar">
        <span>Pay on delivery</span>
        <span className="dot">·</span>
        <span>Order on WhatsApp</span>
        <span className="dot">·</span>
        <span>Try on at our Nairobi shop</span>
      </div>

      <nav className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>

        <Link to="/" className="brand">
          <span className="brand-mark">G</span>
          <span className="brand-word">GENTLEMAN</span>
        </Link>

        <div className="nav-icons">
          <Link to="/saved" className="icon-link" aria-label="Saved">
            <Heart size={19} className="icon" />
            {saved.length > 0 && <span className="icon-badge">{saved.length}</span>}
          </Link>

          <button ref={bagBtnRef} className="icon-link bag-btn" onClick={openBag} aria-label="Open bag">
            <ShoppingBag size={19} className="icon" />
            {bagCount > 0 && <span className="icon-badge icon-badge-gold">{bagCount}</span>}
          </button>
        </div>
      </nav>

      <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={closeSidebar} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand" onClick={closeSidebar}>GENTLEMAN</Link>
          <button className="sidebar-close" onClick={closeSidebar} aria-label="Close menu">
            <X size={18} />
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
                <ChevronDown size={14} className={`chevron ${expandedCategory === category ? 'rotated' : ''}`} />
              </button>

              <div className={`sidebar-subcategories ${expandedCategory === category ? 'expanded' : ''}`}>
                {categories[category].map((sub) => (
                  <Link
                    key={sub}
                    to={`/shop/${category.toLowerCase()}/${sub.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                    className="sidebar-sub-link"
                    onClick={closeSidebar}
                  >
                    {sub}
                  </Link>
                ))}
                <Link
                  to={`/shop/${category.toLowerCase()}`}
                  className="sidebar-sub-link view-all"
                  onClick={closeSidebar}
                >
                  View All {category}
                </Link>
              </div>
            </div>
          ))}
          <Link to="/shop" className="sidebar-view-all-shop" onClick={closeSidebar}>
            View all pieces →
          </Link>
        </nav>

        {isAuthenticated && user?.user_type === 'admin' && (
          <div className="sidebar-footer">
            <Link to="/admin" className="sidebar-auth-btn" onClick={closeSidebar}>Admin Panel</Link>
            <button onClick={() => { logout(); closeSidebar(); }} className="sidebar-auth-btn outline">
              <LogOut size={15} /> Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Navbar;
