// import logo from './logo.svg';
// import './App.css';
// import Navbar from "./components/Navbar"
// import NewArrivals from './components/NewArrivals';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import HeroCarousel from './components/HeroCarousel';


// function App() {
//   return (
//     <div >
//       <Navbar />
//       <HeroCarousel />
//       <NewArrivals />
//     </div>
//   );
// }

// export default App;
import './App.css';
import './components/Theme.css'; /* Ensure this path is correct */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar"
// import NewArrivals from './components/NewArrivals';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import HeroCarousel from './components/HeroCarousel';

// Import context and components
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Home from './pages/Home';
// import Men from './pages/Men'; // You can uncomment these later if you add specific layout wrappers
// import Women from './pages/Women';
// import Gear from './pages/Gear';
import Favorites from './pages/Favorites';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';
import AdminUpload from './pages/AdminUpload';

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

            {/* Route for Home page - shows all home components */}
            <Route path="/" element={<Home />} />

            {/* Routes for other pages */}
            <Route path="/men" element={<ProductGrid category="Men" title="Men's Collection" />} />
            <Route path="/women" element={<ProductGrid category="Women" title="Women's Collection" />} />
            <Route path="/kids" element={<ProductGrid category="Kids" title="Kids' Collection" />} />
            <Route path="/gear" element={<ProductGrid category="Gear" title="Gear & Accessories" />} />

            {/* Admin Route */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminUpload /></ProtectedRoute>} />

            {/* Protected Routes */}
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

            <Route path="/product/:productId" element={<ProductDetail />} />

            {/* Dynamic Subcategory Route */}
            <Route path="/:category/:subcategory" element={<ProductGrid />} />

          </Routes>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;