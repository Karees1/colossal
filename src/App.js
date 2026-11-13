import './App.css';
import './styles/tokens.css';
import './styles/base.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import BagDrawer from "./components/BagDrawer";
import BottomTabBar from "./components/BottomTabBar";
import Cursor from "./components/cursor/Cursor";

import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './store/StoreContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Saved from './pages/Saved';
import Product from './pages/Product';
import Shop from './pages/Shop';
import HouseSuit from './pages/HouseSuit';
import Visit from './pages/Visit';
import HowToOrder from './pages/HowToOrder';
import SizeGuide from './pages/SizeGuide';
import OrderSent from './pages/OrderSent';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import Footer from './components/Footer';
import AdminUpload from './pages/AdminUpload';
import { ToastContainer } from './components/Toast';

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <div className="App">
            <Cursor />
            <Navbar />
            <Routes>
              {/* Admin auth */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/login" element={<Navigate to="/admin/login" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />

              {/* Home */}
              <Route path="/" element={<Home />} />

              {/* Shop — category/filter pages */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:category" element={<Shop />} />
              <Route path="/shop/:category/:sub" element={<Shop />} />

              {/* Old category URLs, now redirected to /shop/:category */}
              <Route path="/shirts" element={<Navigate to="/shop/shirts" replace />} />
              <Route path="/trousers" element={<Navigate to="/shop/trousers" replace />} />
              <Route path="/outerwear" element={<Navigate to="/shop/outerwear" replace />} />
              <Route path="/footwear" element={<Navigate to="/shop/footwear" replace />} />
              <Route path="/essentials" element={<Navigate to="/shop/essentials" replace />} />
              <Route path="/accessories" element={<Navigate to="/shop/accessories" replace />} />

              {/* Admin Route */}
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminUpload /></ProtectedRoute>} />

              {/* Saved (localStorage-only, no accounts) */}
              <Route path="/saved" element={<Saved />} />
              <Route path="/favorites" element={<Navigate to="/saved" replace />} />

              {/* The House Suit — signature product long-page */}
              <Route path="/the-house-suit" element={<HouseSuit />} />

              {/* Cart/Checkout removed — bag is a drawer, WhatsApp replaces checkout */}
              <Route path="/cart" element={<Navigate to="/" replace />} />
              <Route path="/checkout" element={<Navigate to="/" replace />} />

              {/* Product Detail — /product/:productId now accepts either a
                  slug or a legacy numeric id; Product.jsx resolves both. */}
              <Route path="/product/:productId" element={<Product />} />

              {/* Info pages + order confirmation + 404 */}
              <Route path="/visit" element={<Visit />} />
              <Route path="/how-to-order" element={<HowToOrder />} />
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/order/sent" element={<OrderSent />} />
              <Route path="*" element={<NotFound />} />
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
