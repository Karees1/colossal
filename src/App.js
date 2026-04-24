import './App.css';
import './components/Theme.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';
import AdminUpload from './pages/AdminUpload';
import { ToastContainer } from './components/Toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Category Routes */}
            <Route path="/shirts" element={<ProductGrid category="Shirts" title="Shirts" />} />
            <Route path="/trousers" element={<ProductGrid category="Trousers" title="Trousers" />} />
            <Route path="/outerwear" element={<ProductGrid category="Outerwear" title="Outerwear" />} />
            <Route path="/footwear" element={<ProductGrid category="Footwear" title="Footwear" />} />
            <Route path="/essentials" element={<ProductGrid category="Essentials" title="Essentials" />} />
            <Route path="/accessories" element={<ProductGrid category="Accessories" title="Accessories" />} />

            {/* Admin Route */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminUpload /></ProtectedRoute>} />

            {/* Protected Routes */}
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

            {/* Product Detail */}
            <Route path="/product/:productId" element={<ProductDetail />} />

            {/* Dynamic Subcategory Route */}
            <Route path="/:category/:subcategory" element={<ProductGrid />} />
          </Routes>

          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
