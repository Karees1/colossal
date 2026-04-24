// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.css";
// import { FaHeart, FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
// import { cartManager } from "../utils/cartManager"; // ADD THIS

// function Navbar() {
//   const [favoritesCount, setFavoritesCount] = useState(0);
//   const [cartCount, setCartCount] = useState(0); // NEW: Cart count state

//   // Update favorites count (keep your existing)
//   useEffect(() => {
//     const updateFavoritesCount = () => {
//       const favorites = localStorage.getItem('colossalGainzFavorites');
//       const count = favorites ? JSON.parse(favorites).length : 0;
//       setFavoritesCount(count);
//     };

//     updateFavoritesCount();
//     window.addEventListener('storage', updateFavoritesCount);
//     window.addEventListener('favoritesUpdated', updateFavoritesCount);

//     return () => {
//       window.removeEventListener('storage', updateFavoritesCount);
//       window.removeEventListener('favoritesUpdated', updateFavoritesCount);
//     };
//   }, []);

//   // NEW: Update cart count
//   useEffect(() => {
//     const updateCartCount = () => {
//       const count = cartManager.getCartCount();
//       setCartCount(count);
//     };

//     // Update on mount
//     updateCartCount();

//     // Listen for cart updates
//     window.addEventListener('storage', updateCartCount);
//     window.addEventListener('cartUpdated', updateCartCount);

//     return () => {
//       window.removeEventListener('storage', updateCartCount);
//       window.removeEventListener('cartUpdated', updateCartCount);
//     };
//   }, []);

//   return (
//     <nav className="navbar">
//       <ul className="nav-links">
//         <li><Link to="/men">Men</Link></li>
//         <li><Link to="/women">Women</Link></li>
//         <li><Link to="/gear">Gear</Link></li>
//       </ul>

//       <Link to="/" className="brand">Colossal Gainz</Link>

//       <div className="nav-icons">
//         <Link to="/favorites" className="icon-link">
//           <FaHeart className="icon"/>
//           {favoritesCount > 0 && (
//             <span className="favorites-badge">{favoritesCount}</span>
//           )}
//         </Link>

//         <Link to="/cart" className="icon-link"> {/* UPDATED: Wrap cart icon */}
//           <FaShoppingCart className="icon"/>
//           {cartCount > 0 && ( // NEW: Cart badge */}
//             <span className="cart-badge">{cartCount}</span>
//           )}
//         </Link>

//         <FaUser className="icon"/>
//         <FaSearch className="icon"/>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaHeart, FaShoppingCart, FaUser, FaSearch, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { cartManager } from "../utils/cartManager";
import { useAuth } from "../context/AuthContext";
import { categories } from "./categories";

function Navbar() {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownCloseTimeout = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();

  // Update favorites count
  useEffect(() => {
    const updateFavoritesCount = () => {
      const favorites = localStorage.getItem('colossalGainzFavorites');
      const count = favorites ? JSON.parse(favorites).length : 0;
      setFavoritesCount(count);
    };

    updateFavoritesCount();
    window.addEventListener('storage', updateFavoritesCount);
    window.addEventListener('favoritesUpdated', updateFavoritesCount);

    return () => {
      window.removeEventListener('storage', updateFavoritesCount);
      window.removeEventListener('favoritesUpdated', updateFavoritesCount);
    };
  }, []);

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const count = cartManager.getCartCount();
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Left Navigation with Dropdowns */}
      <ul className="nav-links">
        {Object.keys(categories).map((category) => (
          <li
            key={category}
            className="nav-item dropdown"
            onMouseEnter={() => setActiveDropdown(category)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link to={`/${category.toLowerCase()}`} className="nav-link">
              {category} <FaChevronDown className="dropdown-arrow" />
            </Link>
            {activeDropdown === category && (
              <div className="dropdown-menu">
                {categories[category].map((subCategory) => (
                  <Link
                    key={subCategory}
                    to={`/${category.toLowerCase()}/${subCategory.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                    className="dropdown-item"
                  >
                    {subCategory}
                  </Link>
                ))}
                <Link to={`/${category.toLowerCase()}`} className="dropdown-item view-all">
                  View All {category}
                </Link>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Center Brand */}
      <Link to="/" className="brand">Gentleman</Link>

      {/* Right Icons */}
      <div className="nav-icons">
        <Link to="/favorites" className="icon-link">
          <FaHeart className="icon" />
          {favoritesCount > 0 && (
            <span className="favorites-badge">{favoritesCount}</span>
          )}
        </Link>

        <Link to="/cart" className="icon-link">
          <FaShoppingCart className="icon" />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        {/* User Auth Dropdown */}
        <div
          className="icon-link user-dropdown"
          onMouseEnter={() => {
            if (userDropdownCloseTimeout.current) {
              clearTimeout(userDropdownCloseTimeout.current);
              userDropdownCloseTimeout.current = null;
            }
            setIsUserDropdownOpen(true);
          }}
          onMouseLeave={() => {
            // Delay hiding so pointer can move into the menu without it disappearing
            userDropdownCloseTimeout.current = setTimeout(() => {
              setIsUserDropdownOpen(false);
              userDropdownCloseTimeout.current = null;
            }, 220);
          }}
        >
          <FaUser className="icon" />
          {isUserDropdownOpen && (
            <div className="user-dropdown-menu">
              {isAuthenticated ? (
                <>
                  <div className="dropdown-header">
                    {user?.username || "Welcome"}
                  </div>
                  <Link to="/admin" className="dropdown-item">Admin Panel</Link>
                  <Link to="/profile" className="dropdown-item">My Profile</Link>
                  <Link to="/orders" className="dropdown-item">My Orders</Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="dropdown-item logout-btn"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item">Login</Link>
                  <Link to="/register" className="dropdown-item">Sign Up</Link>
                  <Link to="/admin" className="dropdown-item">Admin Panel</Link>
                </>
              )}
            </div>
          )}
        </div>

        <button className="icon-link search-icon">
          <FaSearch className="icon" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;