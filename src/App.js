import './App.css';
import './styles/tokens.css';
import './styles/base.css';
import './components/Theme.css'; /* still needed by not-yet-rebuilt pages; dropped in Phase 6 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import BagDrawer from "./components/BagDrawer";
import BottomTabBar from "./components/BottomTabBar";

import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './store/StoreContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';
import AdminUpload from './pages/AdminUpload';
import { ToastContainer } from './components/Toast';

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              {/* Admin auth */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/login" element={<Navigate to="/admin/login" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />

              {/* Home */}
              <Route path="/" element={<Home />} />

              {/* Category Routes (replaced by /shop in Phase 4) */}
              <Route path="/shirts" element={<ProductGrid category="Shirts" title="Shirts" />} />
              <Route path="/trousers" element={<ProductGrid category="Trousers" title="Trousers" />} />
              <Route path="/outerwear" element={<ProductGrid category="Outerwear" title="Outerwear" />} />
              <Route path="/footwear" element={<ProductGrid category="Footwear" title="Footwear" />} />
              <Route path="/essentials" element={<ProductGrid category="Essentials" title="Essentials" />} />
              <Route path="/accessories" element={<ProductGrid category="Accessories" title="Accessories" />} />

              {/* Admin Route */}
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminUpload /></ProtectedRoute>} />

              {/* Favorites (replaced by /saved in Phase 6) */}
              <Route path="/favorites" element={<Favorites />} />

              {/* Cart/Checkout removed — bag is a drawer, WhatsApp replaces checkout */}
              <Route path="/cart" element={<Navigate to="/" replace />} />
              <Route path="/checkout" element={<Navigate to="/" replace />} />

              {/* Product Detail (moves to /product/:slug in Phase 3) */}
              <Route path="/product/:productId" element={<ProductDetail />} />

              {/* Dynamic Subcategory Route */}
              <Route path="/:category/:subcategory" element={<ProductGrid />} />
            </Routes>

            <Footer />
            <BagDrawer />
            <BottomTabBar />
            <ToastContainer />
          </div>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
