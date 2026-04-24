import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cartManager } from "../utils/cartManager";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart items
  useEffect(() => {
    const loadCart = () => {
      const items = cartManager.getCart();
      const total = cartManager.getCartTotal();
      setCartItems(items);
      setCartTotal(total);
    };

    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    window.addEventListener('storage', loadCart);

    return () => {
      window.removeEventListener('cartUpdated', loadCart);
      window.removeEventListener('storage', loadCart);
    };
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    cartManager.updateQuantity(productId, newQuantity);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeFromCart = (productId) => {
    cartManager.removeFromCart(productId);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    cartManager.clearCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p>Add some items to get started!</p>
          <Link to="/" className="shop-now-btn">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart ({cartItems.length} items)</h1>
        <button onClick={clearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.frontImg} alt={item.title} />
            <div className="item-details">
              <h3>{item.title}</h3>
              <p className="item-price">{item.price}</p>
            </div>
            <div className="quantity-controls">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                +
              </button>
            </div>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="total">
          <strong>Total: ${cartTotal.toFixed(2)}</strong>
        </div>
        <button 
  className="checkout-btn"
  onClick={() => window.location.href = '/checkout'}
>
  Proceed to Checkout
</button>
      </div>
    </div>
  );
}

export default Cart;