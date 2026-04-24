import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Checkout.css';
import { cartManager } from '../utils/cartManager';
import { showToast } from '../components/Toast';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    phone: '',
    email: '',

    // Delivery Address
    county: '',
    subCounty: '',
    ward: '',
    estate: '',
    building: '',
    directions: '',

    // Delivery Option
    deliveryOption: 'standard',
  });

  // Kenya counties data
  const kenyaCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
    'Machakos', 'Meru', 'Nyeri', 'Garissa', 'Kakamega', 'Malindi',
    'Kitale', 'Lamu', 'Naivasha', 'Nanyuki', 'Kericho', 'Isiolo',
    'Other'
  ];

  // Load cart data
  useEffect(() => {
    const loadCart = () => {
      const items = cartManager.getCart();
      const total = cartManager.getCartTotal();
      setCartItems(items);
      setCartTotal(total);
    };
    loadCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.county || !formData.estate) {
      showToast('Please fill in all required fields marked with *', 'error');
      setIsSubmitting(false);
      return;
    }

    // Calculate totals
    const deliveryFee = formData.deliveryOption === 'express' ? 200 : 100;
    const finalTotal = cartTotal + deliveryFee;

    // Build items payload expected by backend
    const itemsPayload = cartItems.map(item => ({
      product_id: item.id,
      title: item.title,
      unit_price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : item.price,
      quantity: item.quantity || 1,
      selected_size: item.selectedSize || null,
      selected_color: item.selectedColor || null
    }));

    const orderPayload = {
      userId: null,
      items: itemsPayload,
      shipping: formData,
      billing: formData,
      currency: 'KES'
    };

    try {
      // POST to backend
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || 'Failed to create order');
      }

      const body = await res.json();

      // Clear cart
      cartManager.clearCart();
      window.dispatchEvent(new Event('cartUpdated'));

      showToast(`Order placed! Order ID: ${body.orderId}`);
      navigate('/');
    } catch (error) {
      console.error('Order submission error:', error);
      showToast('There was an issue processing your order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deliveryFee = formData.deliveryOption === 'express' ? 200 : 100;
  const finalTotal = cartTotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before checking out</p>
        <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Checkout Steps */}
        <div className="checkout-steps">
          <div className={`step ${activeStep >= 1 ? 'active' : ''}`}>
            <span>1</span>
            Delivery
          </div>
          <div className={`step ${activeStep >= 2 ? 'active' : ''}`}>
            <span>2</span>
            Review
          </div>
          <div className={`step ${activeStep >= 3 ? 'active' : ''}`}>
            <span>3</span>
            Confirm
          </div>
        </div>

        <div className="checkout-content">
          {/* Delivery Information Form */}
          <form onSubmit={handleSubmitOrder} className="checkout-form">
            <div className="form-section">
              <h3>Delivery Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="07XX XXX XXX"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Delivery Address</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>County *</label>
                  <select
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select County</option>
                    {kenyaCounties.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sub-County/Constituency *</label>
                  <input
                    type="text"
                    name="subCounty"
                    value={formData.subCounty}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Westlands, Embakasi"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ward/Location</label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    placeholder="e.g., Kileleshwa, South B"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Estate/Street *</label>
                  <input
                    type="text"
                    name="estate"
                    value={formData.estate}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Muthaiga, Langata Road"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Building/Apartment</label>
                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    placeholder="e.g., Building Name, Apartment No."
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Option *</label>
                  <select
                    name="deliveryOption"
                    value={formData.deliveryOption}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="standard">Standard Delivery (3-5 days) - KSh 100</option>
                    <option value="express">Express Delivery (1-2 days) - KSh 200</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Additional Directions</label>
                <textarea
                  name="directions"
                  value={formData.directions}
                  onChange={handleInputChange}
                  placeholder="Any additional delivery instructions..."
                  rows="3"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary-section">
              <h3>Order Summary</h3>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.frontImg} alt={item.title} />
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>Size: {item.selectedSize || 'One Size'}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      KSh {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>KSh {cartTotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Delivery:</span>
                  <span>KSh {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="total-row final-total">
                  <span>Total:</span>
                  <span>KSh {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order - Pay on Delivery'}
              </button>

              <p className="security-note">
                🔒 Your order is secure. You'll pay when your items are delivered.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;