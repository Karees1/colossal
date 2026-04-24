import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';
import { FaHeart, FaShoppingCart, FaStar, FaTruck, FaShieldAlt, FaExchangeAlt } from 'react-icons/fa';
import placeholderImg from "../images/fit17.jpg";
import { cartManager } from '../utils/cartManager';
import { favoritesManager } from '../utils/favoritesManager';
import { showToast } from '../components/Toast';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // 1. Fetch the specific product by ID
        const response = await fetch(`http://localhost:5000/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');

        const found = await response.json();
        setProduct(found);

        // 2. Fetch related products (by category)
        if (found.category) {
          const relatedRes = await fetch(`http://localhost:5000/products?category=${found.category}`);
          const relatedData = await relatedRes.json();
          setRelatedProducts(relatedData.filter(p => p.id !== found.id).slice(0, 6));
        } else {
          setRelatedProducts([]);
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div className="product-loading">Loading product...</div>;
  if (error || !product) {
    return (
      <div className="product-not-found">
        <h1>Product Not Found</h1>
        <p>{error ? error : "Sorry, we couldn't find the product you're looking for."}</p>
        <Link to="/" className="back-to-home">Back to Home</Link>
      </div>
    );
  }

  // Convert price string or number to numeric value
  const getPriceNumber = (price) => {
    if (typeof price === 'number') return price;
    return parseFloat(String(price).replace(/[^0-9.-]+/g, '')) || 0;
  };

  const productPrice = getPriceNumber(product.price);
  const totalPrice = productPrice * quantity;

  const resolveImageUrl = (imgPath) => {
    if (!imgPath) return placeholderImg;
    if (Array.isArray(imgPath)) imgPath = imgPath[0];
    if (typeof imgPath !== 'string') return placeholderImg;
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    // Handle DB filenames by pointing to utilities/images
    return `/utilities/images/${imgPath}`;
  };

  // Robustly get name and images (DB vs Static)
  const productName = product.name || product.title || "Product";
  const dbImage = product.frontimg || product.image_url || product.image || product.frontImg;
  const dbBackImage = product.backimg || product.back_image || product.backImg;

  let images = [];
  if (dbImage) {
    images.push({ url: resolveImageUrl(dbImage), alt: 'Front view' });
  }
  if (dbBackImage) {
    images.push({ url: resolveImageUrl(dbBackImage), alt: 'Back view' });
  }
  if (product.images && product.images.length) {
    product.images.forEach((url, i) => {
      const resolved = resolveImageUrl(url);
      if (!images.some(img => img.url === resolved)) {
        images.push({ url: resolved, alt: `${productName} ${i + 1}` });
      }
    });
  }
  if (images.length === 0) {
    images = [{ url: placeholderImg, alt: 'Product' }];
  }

  // Check if size selection is required
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const hasSizes = sizes.length > 0;
  const hasColors = colors.length > 0;

  const handleAddToCart = () => {
    // Validate selections
    if (hasSizes && !selectedSize) {
      showToast('Please select a size first', 'error');
      return;
    }

    if (hasColors && !selectedColor) {
      showToast('Please select a color first', 'error');
      return;
    }

    // Create cart item
    const cartItem = {
      id: product.id,
      title: productName,
      price: productPrice,
      priceDisplay: product.price,
      frontImg: dbImage ? resolveImageUrl(dbImage) : placeholderImg,
      selectedSize: selectedSize || 'One Size',
      selectedColor: selectedColor || 'Default',
      quantity: quantity
    };

    // Add to cart
    cartManager.addToCart(cartItem);
    window.dispatchEvent(new Event('cartUpdated'));
    showToast(`Added ${quantity}× ${productName} to cart!`);
  };

  const handleAddToFavorites = () => {
    favoritesManager.addToFavorites(product);
    showToast(`Added ${productName} to favorites!`);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  // Determine button text and state
  const getAddToCartButtonText = () => {
    if (hasSizes && !selectedSize) return 'Select Size First';
    if (hasColors && !selectedColor) return 'Select Color First';
    return `Add to Cart — KSh ${totalPrice.toFixed(2)}`;
  };

  const isAddToCartDisabled = (hasSizes && !selectedSize) || (hasColors && !selectedColor);

  return (
    <div className="product-detail-page">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to={`/${product.category}`}>{product.category}</Link>
        <span> / </span>
        <span>{productName}</span>
      </nav>

      <div className="product-detail-container">
        {/* Product Images Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt}
              className="product-main-img"
            />
          </div>
          <div className="image-thumbnails">
            {images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image.url} alt={image.alt} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{productName}</h1>
            <div className="product-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="star" />
                ))}
              </div>
              <span className="rating-text">(42 reviews)</span>
            </div>
            <p className="product-price">KSh {productPrice.toFixed(2)}</p>
          </div>

          <p className="product-description">{product.description}</p>

          {/* Size Selection - Only show if product has sizes */}
          {hasSizes && (
            <div className="selection-section">
              <h3>Size: <span className="selected-option">{selectedSize || 'Not selected'}</span></h3>
              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection - Only show if product has colors */}
          {hasColors && (
            <div className="selection-section">
              <h3>Color: <span className="selected-option">{selectedColor || 'Not selected'}</span></h3>
              <div className="color-options">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`color-option ${selectedColor === color.name ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color.name)}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && <span className="color-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="purchase-section">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className={`add-to-cart-btn ${isAddToCartDisabled ? 'disabled' : ''}`}
                onClick={handleAddToCart}
                disabled={isAddToCartDisabled}
              >
                <FaShoppingCart />
                {getAddToCartButtonText()}
              </button>
              <button className="favorite-btn" onClick={handleAddToFavorites}>
                <FaHeart />
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="badge">
              <FaTruck />
              <span>Free Shipping</span>
            </div>
            <div className="badge">
              <FaShieldAlt />
              <span>2-Year Warranty</span>
            </div>
            <div className="badge">
              <FaExchangeAlt />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="product-tabs">
        <div className="tab-content">
          <h3>Product Details</h3>
          <div className="specifications">
            <div className="spec-item">
              <strong>Material:</strong> {product.material || "Premium Cotton Blend"}
            </div>
            <div className="spec-item">
              <strong>Fit:</strong> {product.specifications?.fit || "Regular Fit"}
            </div>
            <div className="spec-item">
              <strong>Care:</strong> {product.specifications?.care || "Machine wash cold"}
            </div>
            {product.specifications?.features && (
              <div className="spec-item">
                <strong>Features:</strong>
                <ul>
                  {product.specifications.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="similar-products">
        <div className="section-title">
          <h2>You Might Also Like</h2>
          <p>Complete your workout wardrobe</p>
        </div>
        <div className="similar-products-scroll">
          {relatedProducts
            .filter(p => p.id !== product.id)
            .slice(0, 6)
            .map(similarProduct => {
              const sName = similarProduct.name || similarProduct.title;
              const sRawImg = similarProduct.image_url || similarProduct.image || similarProduct.frontImg;
              const sRawBack = similarProduct.back_image || similarProduct.backImg || sRawImg;

              const sImg = resolveImageUrl(sRawImg);
              const hoverImg = resolveImageUrl(sRawBack);

              return (
                <Link
                  key={similarProduct.id}
                  to={`/product/${similarProduct.id}`}
                  className="similar-product-card"
                >
                  <div className="similar-product-image">
                    <img src={sImg} alt={sName} />
                    <img src={hoverImg} alt={sName} className="hover-image" />
                  </div>
                  <div className="similar-product-info">
                    <p className="similar-product-title">{sName}</p>
                    <span className="similar-product-price">KSh {typeof similarProduct.price === 'number' ? similarProduct.price.toFixed(2) : similarProduct.price}</span>
                    <button
                      className="quick-add-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        showToast(`Added ${sName} to cart!`);
                      }}
                    >
                      Quick Add
                    </button>
                  </div>
                </Link>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;