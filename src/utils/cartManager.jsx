// Cart management using localStorage
const CART_KEY = 'colossalGainzCart';

export const cartManager = {
  // Get all cart items
  getCart: () => {
    try {
      const cart = localStorage.getItem(CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  },

  // Add to cart or increase quantity
  addToCart: (product) => {
    const cart = cartManager.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity if item exists
      existingItem.quantity += product.quantity || 1;
    } else {
      // Add new item with quantity
      cart.push({ 
        ...product, 
        quantity: product.quantity || 1 
      });
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  },

  // Remove from cart
  removeFromCart: (productId) => {
    const cart = cartManager.getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    return updatedCart;
  },

  // Update quantity
  updateQuantity: (productId, newQuantity) => {
    const cart = cartManager.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      if (newQuantity <= 0) {
        return cartManager.removeFromCart(productId);
      } else {
        item.quantity = newQuantity;
      }
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  },

  // Get cart count (total items)
  getCartCount: () => {
    const cart = cartManager.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  // FIXED: Get cart total price - handle both string and number prices
  getCartTotal: () => {
    const cart = cartManager.getCart();
    return cart.reduce((total, item) => {
      let price;
      
      // Handle both string prices ("$32") and number prices (32)
      if (typeof item.price === 'string') {
        price = parseFloat(item.price.replace('$', ''));
      } else {
        price = item.price; // Already a number
      }
      
      return total + (price * (item.quantity || 1));
    }, 0);
  },

  // Clear entire cart
  clearCart: () => {
    localStorage.setItem(CART_KEY, JSON.stringify([]));
    return [];
  }
};